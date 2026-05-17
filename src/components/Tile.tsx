import React from 'react';
import type { Tile as TileType } from '../types';
import './Tile.css';

interface TileProps {
  tile: TileType;
  size: number;
}

const Tile: React.FC<TileProps> = ({ tile, size }) => {
  const { value, position, mergedFrom } = tile;
  const [row, col] = position;

  // Class names for different tile values to handle styling
  const tileValueClass = value <= 2048 ? `tile-${value}` : 'tile-super';
  const mergedClass = mergedFrom ? 'tile-merged' : '';
  
  const style: React.CSSProperties = {
    '--tile-size': `${100 / size}%`,
    transform: `translate(calc(var(--tile-size) * ${col}), calc(var(--tile-size) * ${row}))`,
  } as React.CSSProperties & { [key: string]: string };

  return (
    <div className={`tile ${tileValueClass} ${mergedClass}`} style={style}>
      <div className="tile-inner">{value}</div>
    </div>
  );
};

export default Tile;
