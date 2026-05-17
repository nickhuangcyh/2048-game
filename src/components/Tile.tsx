import React from 'react';
import type { Tile as TileType } from '../types';
import './Tile.css';

interface TileProps {
  tile: TileType;
}

const Tile: React.FC<TileProps> = ({ tile }) => {
  const { value, position, mergedFrom } = tile;
  const [row, col] = position;

  // Class names for different tile values to handle styling
  const tileValueClass = `tile-${value}`;
  const mergedClass = mergedFrom ? 'tile-merged' : '';
  
  const style: React.CSSProperties = {
    // Each tile is 100px + 15px gap
    transform: `translate(${col * 115}px, ${row * 115}px)`,
  };

  return (
    <div className={`tile ${tileValueClass} ${mergedClass}`} style={style}>
      <div className="tile-inner">{value}</div>
    </div>
  );
};

export default Tile;
