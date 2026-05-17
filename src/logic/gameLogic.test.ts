// src/logic/gameLogic.test.ts
import { describe, it, expect } from 'vitest';
import { initGame, createTile, getRandomEmptyPosition, moveRow, rotateGrid, moveTiles, isGameOver } from './gameLogic';
import { Direction } from '../types';

describe('gameLogic', () => {
  describe('createTile', () => {
    it('should create a tile with a unique id', () => {
      const tile1 = createTile([0, 0], 2);
      const tile2 = createTile([0, 1], 2);
      expect(tile1.id).not.toBe(tile2.id);
      expect(tile1.value).toBe(2);
      expect(tile1.position).toEqual([0, 0]);
    });

    it('should create a tile with a default value of 2 or 4', () => {
      const tile = createTile([0, 0]);
      expect([2, 4]).toContain(tile.value);
    });
  });

  describe('getRandomEmptyPosition', () => {
    it('should return an empty position', () => {
      const tiles = [createTile([0, 0])];
      const size = 2;
      const pos = getRandomEmptyPosition(tiles, size);
      expect(pos).not.toEqual([0, 0]);
      expect(pos![0]).toBeLessThan(size);
      expect(pos![1]).toBeLessThan(size);
    });

    it('should return null when the board is full', () => {
      const size = 1;
      const tiles = [createTile([0, 0])];
      const pos = getRandomEmptyPosition(tiles, size);
      expect(pos).toBeNull();
    });
  });

  describe('initGame', () => {
    it('initGame should start with 2 tiles', () => {
      const state = initGame(4);
      expect(state.tiles.length).toBe(2);
      expect(state.size).toBe(4);
      expect(state.status).toBe('playing');
    });
  });

  describe('moveRow', () => {
    // Helper to create a row of tiles from numbers
    const createRow = (values: (number | null)[]): (any | null)[] => {
      return values.map((val, index) => val === null ? null : { id: index + 100, value: val, position: [0, index] });
    };

    // Helper to extract values from a row of tiles
    const getValues = (row: (any | null)[]): (number | null)[] => {
      return row.map(tile => tile ? tile.value : null);
    };

    it('should slide tiles to the left', () => {
      const row = createRow([null, 2, null, 2]);
      const { newRow } = moveRow(row);
      expect(getValues(newRow)).toEqual([4, null, null, null]);
    });

    it('should merge identical neighbors', () => {
      const row = createRow([2, 2, 4, 4]);
      const { newRow, scoreIncrease } = moveRow(row);
      expect(getValues(newRow)).toEqual([4, 8, null, null]);
      expect(scoreIncrease).toBe(12);
    });

    it('should not merge a tile twice in one move', () => {
      const row = createRow([2, 2, 4, null]);
      // First merge 2+2=4, then we have [4, 4, null, null]. 
      // It should NOT merge these 4s into 8 in the same move.
      const { newRow } = moveRow(row);
      expect(getValues(newRow)).toEqual([4, 4, null, null]);
    });

    it('should handle triple identical tiles', () => {
      const row = createRow([2, 2, 2, null]);
      // Should merge the leftmost pair: [4, 2, null, null]
      const { newRow } = moveRow(row);
      expect(getValues(newRow)).toEqual([4, 2, null, null]);
    });

    it('should handle complex row [4, 4, 2, 2]', () => {
      const row = createRow([4, 4, 2, 2]);
      const { newRow, scoreIncrease } = moveRow(row);
      expect(getValues(newRow)).toEqual([8, 4, null, null]);
      expect(scoreIncrease).toBe(12);
    });
  });

  describe('rotateGrid', () => {
    const createGrid = (values: (number | null)[][]) => {
      return values.map((row, r) => row.map((val, c) => val === null ? null : { id: r * 4 + c + 1, value: val, position: [r, c] }));
    };

    const getGridValues = (grid: (any | null)[][]) => {
      return grid.map(row => row.map(tile => tile ? tile.value : null));
    };

    it('should rotate grid 90 degrees clockwise', () => {
      const grid = createGrid([
        [1, 2],
        [3, 4]
      ]);
      // After 90 CW:
      // [3, 1]
      // [4, 2]
      const rotated = rotateGrid(grid, 1);
      expect(getGridValues(rotated)).toEqual([
        [3, 1],
        [4, 2]
      ]);
    });

    it('should return original grid after 4 rotations', () => {
      const grid = createGrid([
        [1, 2],
        [3, 4]
      ]);
      const rotated = rotateGrid(grid, 4);
      expect(getGridValues(rotated)).toEqual([
        [1, 2],
        [3, 4]
      ]);
    });
  });

  describe('isGameOver', () => {
    it('should return false if there are empty spaces', () => {
      const tiles = [createTile([0, 0], 2)];
      expect(isGameOver(tiles, 2)).toBe(false);
    });

    it('should return false if there are mergeable adjacent tiles horizontally', () => {
      // 2 2
      // 4 8
      const tiles = [
        createTile([0, 0], 2), createTile([0, 1], 2),
        createTile([1, 0], 4), createTile([1, 1], 8),
      ];
      expect(isGameOver(tiles, 2)).toBe(false);
    });

    it('should return false if there are mergeable adjacent tiles vertically', () => {
      // 2 4
      // 2 8
      const tiles = [
        createTile([0, 0], 2), createTile([0, 1], 4),
        createTile([1, 0], 2), createTile([1, 1], 8),
      ];
      expect(isGameOver(tiles, 2)).toBe(false);
    });

    it('should return true if no empty spaces and no mergeable tiles', () => {
      // 2 4
      // 8 2
      const tiles = [
        createTile([0, 0], 2), createTile([0, 1], 4),
        createTile([1, 0], 8), createTile([1, 1], 2),
      ];
      expect(isGameOver(tiles, 2)).toBe(true);
    });
  });

  describe('moveTiles', () => {
    it('should move tiles UP', () => {
      const state = {
        tiles: [
          createTile([1, 0], 2),
          createTile([3, 0], 2),
        ],
        score: 0,
        bestScore: 0,
        size: 4,
        status: 'playing' as const,
      };
      const { newState, hasMoved } = moveTiles(state, 'UP');
      expect(hasMoved).toBe(true);
      // 1 merged tile + 1 random new tile
      expect(newState.tiles.length).toBe(2);
      const mergedTile = newState.tiles.find(t => t.value === 4);
      expect(mergedTile).toBeDefined();
      expect(mergedTile!.position).toEqual([0, 0]);
    });

    it('should move tiles RIGHT', () => {
      const state = {
        tiles: [
          createTile([0, 0], 2),
          createTile([0, 1], 2),
        ],
        score: 0,
        bestScore: 0,
        size: 4,
        status: 'playing' as const,
      };
      const { newState, hasMoved } = moveTiles(state, 'RIGHT');
      expect(hasMoved).toBe(true);
      expect(newState.tiles.length).toBe(2);
      const mergedTile = newState.tiles.find(t => t.value === 4);
      expect(mergedTile).toBeDefined();
      expect(mergedTile!.position).toEqual([0, 3]);
    });

    it('should update score when tiles merge', () => {
      const state = {
        tiles: [
          createTile([0, 0], 2),
          createTile([0, 1], 2),
        ],
        score: 0,
        bestScore: 10,
        size: 4,
        status: 'playing' as const,
      };
      const { newState } = moveTiles(state, 'LEFT');
      expect(newState.score).toBe(4);
      expect(newState.bestScore).toBe(10);
    });

    it('should update bestScore when score exceeds it', () => {
      const state = {
        tiles: [
          createTile([0, 0], 8),
          createTile([0, 1], 8),
        ],
        score: 0,
        bestScore: 10,
        size: 4,
        status: 'playing' as const,
      };
      const { newState } = moveTiles(state, 'LEFT');
      expect(newState.score).toBe(16);
      expect(newState.bestScore).toBe(16);
    });

    it('should set status to won when 2048 is reached', () => {
      const state = {
        tiles: [
          createTile([0, 0], 1024),
          createTile([0, 1], 1024),
        ],
        score: 0,
        bestScore: 0,
        size: 4,
        status: 'playing' as const,
      };
      const { newState } = moveTiles(state, 'LEFT');
      expect(newState.status).toBe('won');
    });

    it('should set status to over when no more moves are possible', () => {
      const tiles: any[] = [];
      // Create a 2x2 board that is full and no merges possible
      // 2 4
      // 8 16
      tiles.push(createTile([0, 0], 2));
      tiles.push(createTile([0, 1], 4));
      tiles.push(createTile([1, 0], 8));
      tiles.push(createTile([1, 1], 16));

      const state = {
        tiles,
        score: 0,
        bestScore: 0,
        size: 2,
        status: 'playing' as const,
      };
      
      const { newState } = moveTiles(state, 'LEFT');
      expect(newState.status).toBe('over');
    });
  });
});
