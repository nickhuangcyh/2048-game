import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import { initGame } from './logic/gameLogic'
import type { GameState } from './types'
import './App.css'

function App() {
  const [size, setSize] = useState(4);
  const [gameState, setGameState] = useState<GameState>(() => initGame(size));

  useEffect(() => {
    setGameState(initGame(size));
  }, [size]);

  const resetGame = () => {
    setGameState(initGame(size));
  };

  return (
    <div className="app">
      <div className="header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          <span className="score-label">Score</span>
          <div className="score-value">{gameState.score}</div>
        </div>
      </div>

      <div className="controls">
        <button onClick={() => setSize(3)}>3x3</button>
        <button onClick={() => setSize(4)}>4x4</button>
        <button onClick={() => setSize(5)}>5x5</button>
        <button onClick={resetGame}>New Game</button>
      </div>
      
      <GameBoard tiles={gameState.tiles} size={size} />
    </div>
  )
}

export default App
