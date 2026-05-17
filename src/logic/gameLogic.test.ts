// src/logic/gameLogic.test.ts
import { describe, it, expect } from 'vitest';
import { initGame, createTile, getRandomEmptyPosition } from './gameLogic';

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
});
