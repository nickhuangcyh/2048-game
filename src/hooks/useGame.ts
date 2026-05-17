import { useReducer, useCallback, useEffect } from 'react';
import { initGame, moveTiles } from '../logic/gameLogic';
import type { GameState, Direction } from '../types';

export type Action =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CONTINUE' }
  | { type: 'CHANGE_SIZE'; size: number };

const BEST_SCORE_KEY = '2048-best-score';
const GAME_STATE_KEY = '2048-game-state';

const getInitialBestScore = () => {
  const saved = localStorage.getItem(BEST_SCORE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

const getSavedGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load game state from localStorage', e);
    return null;
  }
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'MOVE': {
      if (state.status !== 'playing') return state;
      const { newState, hasMoved } = moveTiles(state, action.direction);
      if (!hasMoved) return state;

      if (newState.bestScore > state.bestScore) {
        localStorage.setItem(BEST_SCORE_KEY, newState.bestScore.toString());
      }

      return newState;
    }
    case 'RESTART': {
      const bestScore = getInitialBestScore();
      return { ...initGame(state.size), bestScore };
    }
    case 'CONTINUE': {
      return { ...state, status: 'playing' };
    }
    case 'CHANGE_SIZE': {
      const bestScore = getInitialBestScore();
      return { ...initGame(action.size), bestScore };
    }
    default:
      return state;
  }
};

export const useGame = (initialSize: number) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    const savedState = getSavedGameState();
    if (savedState) {
      // Ensure best score is up to date even in saved state
      const bestScore = getInitialBestScore();
      return { ...savedState, bestScore: Math.max(savedState.bestScore, bestScore) };
    }
    const bestScore = getInitialBestScore();
    return { ...initGame(initialSize), bestScore };
  });

  useEffect(() => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  }, [state]);

  const move = useCallback((direction: Direction) => {
    dispatch({ type: 'MOVE', direction });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const continueGame = useCallback(() => {
    dispatch({ type: 'CONTINUE' });
  }, []);

  const changeSize = useCallback((size: number) => {
    dispatch({ type: 'CHANGE_SIZE', size });
  }, []);

  return { state, move, restart, continueGame, changeSize };
};

