# Implementer Prompt

You are a senior software engineer implementing a task from a plan.

## Task
**Task 1: Create `useGame` Hook**
**Files:**
- Create: `src/hooks/useGame.ts`

**Step 1: Implement `useGame` hook with `useReducer`**

```typescript
import { useReducer, useEffect } from 'react';
import { initGame, moveTiles } from '../logic/gameLogic';
import type { GameState, Direction } from '../types';

type Action =
  | { type: 'MOVE'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'CHANGE_SIZE'; size: number };

const LOCAL_STORAGE_KEY = '2048-best-score';

const getInitialBestScore = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  return saved ? parseInt(saved, 10) : 0;
};

const gameReducer = (state: GameState, action: Action): GameState => {
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

  const move = (direction: Direction) => dispatch({ type: 'MOVE', direction });
  const restart = () => dispatch({ type: 'RESTART' });
  const changeSize = (size: number) => dispatch({ type: 'CHANGE_SIZE', size });

  return { state, move, restart, changeSize };
};
```

**Step 2: Commit**

```bash
git add src/hooks/useGame.ts
git commit -m "feat: implement useGame hook"
```

## Context
We are building a 2048 game. 
`src/logic/gameLogic.ts` contains `initGame` and `moveTiles`.
`src/types/index.ts` contains `GameState`, `Tile`, and `Direction`.

## Instructions
1. Implement the code exactly as specified.
2. Create the necessary directories if they don't exist.
3. Verify the code compiles (if possible).
4. Commit the changes.
