import { Tile, GameState } from '../types';

let nextTileId = 1;

export const createTile = (position: [number, number], value?: number): Tile => {
  const tileValue = value || (Math.random() < 0.9 ? 2 : 4);
  return {
    id: nextTileId++,
    value: tileValue,
    position,
  };
};

export const getRandomEmptyPosition = (tiles: Tile[], size: number): [number, number] | null => {
  const occupiedPositions = new Set(tiles.map(tile => `${tile.position[0]},${tile.position[1]}`));
  const emptyPositions: [number, number][] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!occupiedPositions.has(`${r},${c}`)) {
        emptyPositions.push([r, c]);
      }
    }
  }

  if (emptyPositions.length === 0) return null;
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
};

export const initGame = (size: number): GameState => {
  // We don't reset nextTileId here because id should be unique across the session 
  // unless we want to reload.
  const tiles: Tile[] = [];

  const pos1 = getRandomEmptyPosition(tiles, size);
  if (pos1) tiles.push(createTile(pos1));
  
  const pos2 = getRandomEmptyPosition(tiles, size);
  if (pos2) tiles.push(createTile(pos2));

  return {
    tiles,
    score: 0,
    bestScore: 0,
    size,
    status: 'playing',
  };
};
