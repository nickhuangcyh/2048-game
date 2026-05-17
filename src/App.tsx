import GameBoard from './components/GameBoard'
import { useGame } from './hooks/useGame'
import { useMoveListeners } from './hooks/useMoveListeners'
import './App.css'

function App() {
  const { state, move, restart, continueGame, changeSize } = useGame(4);

  useMoveListeners(move);

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">2048</h1>
          <div className="scores-wrapper">
            <div className="score-container">
              <span className="score-label">Score</span>
              <div className="score-value">{state.score}</div>
            </div>
            <div className="score-container">
              <span className="score-label">Best</span>
              <div className="score-value">{state.bestScore}</div>
            </div>
          </div>
        </div>

        <div className="game-intro">
          <p className="game-description">
            Join the numbers and get to the <strong>2048 tile!</strong>
          </p>
          <button className="restart-button" onClick={restart}>New Game</button>
        </div>

        <div className="controls">
          <div className="size-buttons">
            <button 
              className={state.size === 3 ? 'active' : ''} 
              onClick={() => changeSize(3)}
            >3x3</button>
            <button 
              className={state.size === 4 ? 'active' : ''} 
              onClick={() => changeSize(4)}
            >4x4</button>
            <button 
              className={state.size === 5 ? 'active' : ''} 
              onClick={() => changeSize(5)}
            >5x5</button>
          </div>
        </div>

        <div className="board-container">
          <GameBoard tiles={state.tiles} size={state.size} />
          {state.status === 'won' && (
            <div className="game-message game-won">
              <p>You win!</p>
              <div className="lower">
                <button className="keep-playing-button" onClick={continueGame}>Keep going</button>
                <button className="retry-button" onClick={restart}>Try again</button>
              </div>
            </div>
          )}
          {state.status === 'over' && (
            <div className="game-message game-over">
              <p>Game over!</p>
              <div className="lower">
                <button className="retry-button" onClick={restart}>Try again</button>
              </div>
            </div>
          )}
        </div>

        <div className="game-explanation">
          <p>
            <strong className="important">HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>
          </p>
          <hr />
          <p>
            Created by <a href="https://github.com/nickhuangcyh" target="_blank" rel="noreferrer">Nick Huang</a>. Based on 2048 by Gabriele Cirulli.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
