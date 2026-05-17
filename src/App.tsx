import './App.css'

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1 className="title">2048</h1>
        <div className="score-container">
          <span className="score-label">Score</span>
          <div className="score-value">0</div>
        </div>
      </div>
      
      <div className="game-container">
        <div className="grid-container">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="grid-cell" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
