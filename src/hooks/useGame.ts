import { useReducer, useCallback } from 'react';
import { initGame, moveTiles } from '../logic/gameLogic';
import type { GameState, Direction } from '../types';

export type Action =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CONTINUE' }
  | { type: 'CHANGE_SIZE'; size: number };

const LOCAL_STORAGE_KEY = '2048-best-score';

const getInitialBestScore = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

export const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'MOVE': {
      if (state.status !== 'playing') return state;
      const { newState, hasMoved } = moveTiles(state, action.direction);
      if (!hasMoved) return state;
      
      if (newState.bestScore > state.bestScore) {
        localStorage.setItem(LOCAL_STORAGE_KEY, newState.bestScore.toString());
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
    const bestScore = getInitialBestScore();
    return { ...initGame(initialSize), bestScore };
  });

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
