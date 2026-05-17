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

export const moveRow = (row: (Tile | null)[]): { newRow: (Tile | null)[]; scoreIncrease: number } => {
  const filteredRow = row.filter((tile): tile is Tile => tile !== null);
  const newRow: (Tile | null)[] = [];
  let scoreIncrease = 0;

  for (let i = 0; i < filteredRow.length; i++) {
    if (i + 1 < filteredRow.length && filteredRow[i].value === filteredRow[i + 1].value) {
      const mergedValue = filteredRow[i].value * 2;
      scoreIncrease += mergedValue;
      
      newRow.push({
        ...filteredRow[i],
        value: mergedValue,
        mergedFrom: [filteredRow[i], filteredRow[i + 1]],
      });
      i++; // Skip the next tile as it's merged
    } else {
      newRow.push({
        ...filteredRow[i],
        mergedFrom: undefined, // Clear any previous mergedFrom
      });
    }
  }

  while (newRow.length < row.length) {
    newRow.push(null);
  }

  return { newRow, scoreIncrease };
};

export const rotateGrid = <T>(grid: T[][], rotations: number): T[][] => {
  const size = grid.length;
  let newGrid = grid.map(row => [...row]);
  
  const actualRotations = ((rotations % 4) + 4) % 4;
  
  for (let r = 0; r < actualRotations; r++) {
    const rotated: T[][] = Array.from({ length: size }, () => Array(size).fill(null));
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        rotated[col][size - 1 - row] = newGrid[row][col];
      }
    }
    newGrid = rotated;
  }
  
  return newGrid;
};

export const isGameOver = (tiles: Tile[], size: number): boolean => {
  if (tiles.length < size * size) return false;

  // Create a grid for easier adjacency checking
  const grid: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  tiles.forEach(tile => {
    grid[tile.position[0]][tile.position[1]] = tile.value;
  });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const current = grid[r][c];
      if (current === null) return false;

      // Check right
      if (c + 1 < size && grid[r][c + 1] === current) return false;
      // Check down
      if (r + 1 < size && grid[r + 1][c] === current) return false;
    }
  }

  return true;
};

export const moveTiles = (
  state: GameState,
  direction: Direction
): { newState: GameState; hasMoved: boolean } => {
  const { tiles, size, score, bestScore } = state;

  // 1. Convert flat tiles to 2D grid
  const grid: (Tile | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  tiles.forEach((tile) => {
    grid[tile.position[0]][tile.position[1]] = tile;
  });

  // 2. Rotate grid to normalize to "Move Left"
  // LEFT: 0, DOWN: 1, RIGHT: 2, UP: 3
  const rotationsMap: Record<Direction, number> = {
    LEFT: 0,
    DOWN: 1,
    RIGHT: 2,
    UP: 3,
  };
  const rotations = rotationsMap[direction];
  const normalizedGrid = rotateGrid(grid, rotations);

  // 3. Move each row
  let totalScoreIncrease = 0;
  const movedGrid = normalizedGrid.map((row) => {
    const { newRow, scoreIncrease } = moveRow(row);
    totalScoreIncrease += scoreIncrease;
    return newRow;
  });

  // 4. Rotate back
  const finalGrid = rotateGrid(movedGrid, (4 - rotations) % 4);

  // 5. Convert back to flat tiles and update positions
  const newTiles: Tile[] = [];
  let hasMoved = false;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const tile = finalGrid[r][c];
      if (tile) {
        if (tile.position[0] !== r || tile.position[1] !== c) {
          hasMoved = true;
        }
        newTiles.push({
          ...tile,
          position: [r, c],
        });
      }
    }
  }

  // If number of tiles changed, it definitely moved (merged)
  if (newTiles.length !== tiles.length) {
    hasMoved = true;
  }

  let nextScore = score + totalScoreIncrease;
  let nextBestScore = Math.max(bestScore, nextScore);
  let nextStatus = state.status;

  if (hasMoved) {
    const emptyPos = getRandomEmptyPosition(newTiles, size);
    if (emptyPos) {
      newTiles.push(createTile(emptyPos));
    }
  }

  // Check win/loss
  if (newTiles.some((t) => t.value >= 2048)) {
    nextStatus = 'won';
  } else if (isGameOver(newTiles, size)) {
    nextStatus = 'over';
  }

  return {
    newState: {
      ...state,
      tiles: newTiles,
      score: nextScore,
      bestScore: nextBestScore,
      status: nextStatus,
    },
    hasMoved,
  };
};
