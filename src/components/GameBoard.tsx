import React from 'react';
import type { Tile as TileType } from '../types';
import Tile from './Tile';
import './GameBoard.css';

interface GameBoardProps {
  tiles: TileType[];
  size: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, size }) => {
  // Render background cells
  const renderBackgroundCells = () => {
    const cells = [];
    for (let i = 0; i < size * size; i++) {
      cells.push(<div key={i} className="grid-cell"></div>);
    }
    return cells;
  };

  return (
    <div className="game-container" style={{ '--grid-size': size } as React.CSSProperties}>
      <div className="grid-container">
        {renderBackgroundCells()}
      </div>
      <div className="tile-container">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} size={size} />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
