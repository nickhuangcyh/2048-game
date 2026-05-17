# 2048 遊戲實施計劃

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用 React + TypeScript + Vite 建立一個支援多種棋盤大小、具備平滑 CSS 動畫與最高分持久化的經典 2048 遊戲。

**Architecture:** 採用 React 的 `useReducer` 管理核心遊戲邏輯，將棋盤狀態抽象為 Tile 對象數組以實現動畫追蹤。UI 分為控制層、棋盤層與數字塊組件，並透過自定義 Hook 處理輸入監聽。

**Tech Stack:** React 18, TypeScript, Vite, Vanilla CSS

---

### Task 1: 專案初始化與建構環境

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.css`

- [ ] **Step 1: 初始化 Vite React 專案**
Run: `npm create vite@latest . -- --template react-ts` (若目錄非空則手動建立設定檔)

- [ ] **Step 2: 安裝必要依賴**
Run: `npm install`

- [ ] **Step 3: 設定基本的專案結構與 CSS 重置**
在 `src/App.css` 中加入基本的顏色定義與佈局。

- [ ] **Step 4: 確認專案可正常啟動**
Run: `npm run dev` 並檢查瀏覽器。

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: project initialization with Vite, React, and TypeScript"
```

---

### Task 2: 定義核心類型與遊戲邏輯 (Game Engine)

**Files:**
- Create: `src/types/index.ts`, `src/logic/gameLogic.ts`
- Test: `src/logic/gameLogic.test.ts`

- [ ] **Step 1: 定義 Tile 與 GameState 類型**
```typescript
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
```

- [ ] **Step 2: 實作棋盤初始化與隨機生成數字塊邏輯**
在 `src/logic/gameLogic.ts` 實作 `createTile`, `getRandomEmptyPosition`, `initGame`。

- [ ] **Step 3: 撰寫遊戲初始化測試**
```typescript
// src/logic/gameLogic.test.ts
import { initGame } from './gameLogic';
test('initGame should start with 2 tiles', () => {
  const state = initGame(4);
  expect(state.tiles.length).toBe(2);
});
```

- [ ] **Step 4: Commit**
```bash
git add src/types/index.ts src/logic/gameLogic.ts src/logic/gameLogic.test.ts
git commit -m "feat: define core types and initial game logic"
```

---

### Task 3: 實作移動與合併邏輯

**Files:**
- Modify: `src/logic/gameLogic.ts`
- Test: `src/logic/gameLogic.test.ts`

- [ ] **Step 1: 實作各個方向的移動演算法**
核心邏輯：旋轉棋盤使所有移動都變成「向左移動」，處理合併，再旋轉回來。

- [ ] **Step 2: 實作合併與分數計算**
確保 Tile 的 ID 在移動中保持不變，合併時產生的新 Tile 記錄來源 ID。

- [ ] **Step 3: 撰寫合併邏輯測試**
測試 `[2, 2, 0, 0]` 向左移動應變為 `[4, 0, 0, 0]`。

- [ ] **Step 4: Commit**
```bash
git add src/logic/gameLogic.ts src/logic/gameLogic.test.ts
git commit -m "feat: implement move and merge logic"
```

---

### Task 4: 建立 GameBoard 與 Tile 組件 (UI 層)

**Files:**
- Create: `src/components/GameBoard.tsx`, `src/components/Tile.tsx`, `src/components/Tile.css`, `src/components/GameBoard.css`

- [ ] **Step 1: 實作 Tile 組件**
使用 CSS `transform: translate()` 根據 `position` 屬性定位數字塊。

- [ ] **Step 2: 實實 GameBoard 組件**
渲染背景格子以及 `tiles` 數組中的動態數字塊。

- [ ] **Step 3: 加入 CSS Transition 動畫**
在 `Tile.css` 中設定 `transition: transform 100ms ease-in-out`。

- [ ] **Step 4: Commit**
```bash
git add src/components/
git commit -m "feat: create GameBoard and Tile components with CSS animations"
```

---

### Task 5: 輸入監聽與狀態整合 (Hooks)

**Files:**
- Create: `src/hooks/useGame.ts`, `src/hooks/useMoveListeners.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: 實作 `useGame` Hook**
封裝 `useReducer` 處理所有遊戲動作（MOVE, RESTART, CHANGE_SIZE）。

- [ ] **Step 2: 實作 `useMoveListeners` Hook**
監聽鍵盤箭頭、WASD 以及手機觸控滑動事件。

- [ ] **Step 3: 在 `App.tsx` 中整合所有組件**

- [ ] **Step 4: Commit**
```bash
git add src/hooks/ src/App.tsx
git commit -m "feat: integrate game state with input listeners"
```

---

### Task 6: 分數持久化與 UI 優化

**Files:**
- Modify: `src/hooks/useGame.ts`, `src/App.tsx`, `src/App.css`

- [ ] **Step 1: 實作 `bestScore` 持久化至 localStorage**

- [ ] **Step 2: 加入遊戲結束/勝利的 Overlays**

- [ ] **Step 3: 最終樣式微調與響應式優化**

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add score persistence and UI overlays"
```
