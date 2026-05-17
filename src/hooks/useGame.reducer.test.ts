import { describe, it, expect, vi, beforeEach } from 'vitest';
import { gameReducer } from './useGame';
import type { GameState } from '../types';

describe('gameReducer', () => {
  const initialState: GameState = {
    tiles: [],
    score: 0,
    bestScore: 100,
    size: 4,
    status: 'playing',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should handle CONTINUE action', () => {
    const wonState: GameState = { ...initialState, status: 'won' };
    const newState = gameReducer(wonState, { type: 'CONTINUE' });
    expect(newState.status).toBe('playing');
  });

  it('should handle RESTART action', () => {
    const newState = gameReducer(initialState, { type: 'RESTART' });
    expect(newState.score).toBe(0);
    expect(newState.status).toBe('playing');
    expect(newState.tiles.length).toBe(2);
  });

  it('should handle CHANGE_SIZE action', () => {
    const newState = gameReducer(initialState, { type: 'CHANGE_SIZE', size: 3 });
    expect(newState.size).toBe(3);
    expect(newState.tiles.length).toBe(2);
  });
});
