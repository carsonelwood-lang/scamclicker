import React, { useState } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [username, setUsername] = useState('Scammer')
  const [adminActive, setAdminActive] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const ADMIN_PASSWORD = 'scam2024'

  const gameClick = () => {
    setScore(score + Math.floor(Math.random() * 10) + 1)
    setClicks(clicks + 1)
  }

  const adminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAdminActive(true)
      alert('✅ ADMIN GOD MODE ON! 👑')
    } else {
      alert('❌ Wrong!')
      setAdminPass('')
    }
  }

  const updateGameData = () => {
    setScore(999999999)
    setClicks(999999)
    setUsername('ADMIN')
    alert('✅ GAME HACKED!')
  }

  const addMoney = (amount: number) => {
    setScore(score + amount)
    alert(`✅ +$${amount.toLocaleString()}!`)
  }

  return (
    <div className="game-container">
      <h1 className="title">🤑 SCAMCLICKER v2.0</h1>

      <div className="game-card">
        <div className="stat">💰 Score: ${score.toLocaleString()}</div>
        <div className="stat">🖱️ Clicks: {clicks.toLocaleString()}</div>
        <div className="stat">👤 {username}</div>

        <button className="click-button" onClick={gameClick}>
          CLICK FOR $$$ 💸
        </button>
      </div>

      <div className="admin-panel">
        {!adminActive ? (
          <>
            <h3>🔧 ADMIN</h3>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="🔑 Password"
              className="admin-input"
            />
            <button className="admin-login-btn" onClick={adminLogin}>
              🚀 ACTIVATE GOD MODE
            </button>
          </>
        ) : (
          <>
            <h3>👑 GOD MODE ACTIVE</h3>
            <button
              className="toggle-controls-btn"
              onClick={() => setShowControls(!showControls)}
            >
              📜 {showControls ? 'HIDE' : 'SHOW'} CONTROLS
            </button>

            {showControls && (
              <>
                <button className="max-values-btn" onClick={updateGameData}>
                  ⚡ SET MAX VALUES
                </button>
                <div className="money-grid">
                  <button
                    className="money-btn"
                    onClick={() => addMoney(10000)}
                  >
                    $10K
                  </button>
                  <button
                    className="money-btn"
                    onClick={() => addMoney(1000000)}
                  >
                    $1M
                  </button>
                  <button
                    className="money-btn money-btn-large"
                    onClick={() => addMoney(1000000000)}
                  >
                    $1B
                  </button>
                  <button
                    className="money-btn money-btn-reset"
                    onClick={() => window.location.reload()}
                  >
                    🔄 Reset
                  </button>
                </div>
              </>
            )}

            <button
              className="logout-btn"
              onClick={() => {
                setAdminActive(false)
                setAdminPass('')
              }}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
