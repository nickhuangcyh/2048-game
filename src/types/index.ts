// src/types/index.ts
export interface Tile {
  id: number;
  value: number;
  position: [number, number]; // [row, col]
  mergedFrom?: [Tile, Tile];
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  size: number;
  status: 'playing' | 'won' | 'over';
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
