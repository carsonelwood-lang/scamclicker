import React, { useState } from 'react'
import './App.css'

function App() {
  // 🎮 GAME STATE
  const [score, setScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [username, setUsername] = useState('Scammer')
  
  // 🔥 ADMIN STATE
  const [adminActive, setAdminActive] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showUpdatePanel, setShowUpdatePanel] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const ADMIN_PASSWORD = 'scam2024'

  // Update panel inputs
  const [updateScore, setUpdateScore] = useState('')
  const [updateClicks, setUpdateClicks] = useState('')
  const [updateUsername, setUpdateUsername] = useState('')

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

  const handleUpdateGame = () => {
    if (updateScore) setScore(parseInt(updateScore))
    if (updateClicks) setClicks(parseInt(updateClicks))
    if (updateUsername) setUsername(updateUsername)
    
    setUpdateScore('')
    setUpdateClicks('')
    setUpdateUsername('')
    alert('✅ Game updated!')
    setShowUpdatePanel(false)
  }

  return (
    <div style={{ 
      textAlign: 'center', 
      background: 'linear-gradient(135deg, #0f0f23, #ff6b35)', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px 20px 150px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{fontSize: '3em', textShadow: '0 0 30px #ff6b35'}}>
        🤑 SCAMCLICKER v2.0
      </h1>
      
      <div style={{
        background: 'rgba(0,0,0,0.7)', padding: '30px', 
        borderRadius: '20px', maxWidth: '500px', margin: '0 auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{fontSize: '1.5em', margin: '15px 0'}}>
          💰 Score: ${score.toLocaleString()}
        </div>
        <div style={{fontSize: '1.5em', margin: '15px 0'}}>
          🖱️ Clicks: {clicks.toLocaleString()}
        </div>
        <div style={{fontSize: '1.5em', margin: '15px 0'}}>
          👤 {username}
        </div>
        
        <button 
          onClick={gameClick}
          style={{
            width: '250px', height: '250px', fontSize: '24px',
            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
            border: 'none', borderRadius: '50%', cursor: 'pointer',
            margin: '20px', boxShadow: '0 20px 40px rgba(255,107,53,0.4)',
            color: 'white', fontWeight: 'bold', transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => (e.currentTarget).style.transform = 'scale(0.95)'}
          onMouseUp={(e) => (e.currentTarget).style.transform = 'scale(1)'}
          onMouseLeave={(e) => (e.currentTarget).style.transform = 'scale(1)'}
        >
          CLICK FOR $$$ 💸
        </button>
      </div>

      {/* 🔥 ADMIN PANEL */}
      <div style={{
        position: 'fixed', bottom: '150px', right: '30px',
        background: 'linear-gradient(145deg, #1a1a2e, #ff6b35)',
        color: 'white', padding: '25px', borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)', zIndex: 9999,
        minWidth: '280px', border: '3px solid #ff6b35'
      }}>
        {!adminActive ? (
          <>
            <h3 style={{margin: '0 0 20px 0', textAlign: 'center'}}>🔧 ADMIN</h3>
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="🔑 Password"
              style={{
                width: '100%', padding: '12px', marginBottom: '15px',
                borderRadius: '10px', border: 'none', fontSize: '16px', boxSizing: 'border-box'
              }}
            />
            <button
              onClick={adminLogin}
              style={{
                width: '100%', padding: '15px', background: '#4CAF50',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxSizing: 'border-box'
              }}
            >
              🚀 ACTIVATE GOD MODE
            </button>
          </>
        ) : (
          <>
            <h3 style={{margin: '0 0 15px 0'}}>👑 GOD MODE ACTIVE</h3>
            <button
              onClick={() => setShowControls(!showControls)}
              style={{
                width: '100%', padding: '12px', background: '#ff4444',
                color: 'white', border: 'none', borderRadius: '10px', marginBottom: '10px',
                cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box'
              }}
            >
              📜 {showControls ? 'HIDE' : 'SHOW'} CONTROLS
            </button>
            
            {showControls && (
              <>
                <button onClick={updateGameData} style={{
                  width: '100%', padding: '12px', background: '#4CAF50', color: 'white', 
                  border: 'none', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer',
                  fontWeight: 'bold', boxSizing: 'border-box'
                }}>
                  ⚡ SET MAX VALUES
                </button>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px'}}>
                  <button onClick={() => addMoney(10000)} style={{
                    padding: '10px', background: 'gold', color: 'black', border: 'none',
                    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box'
                  }}>$10K</button>
                  <button onClick={() => addMoney(1000000)} style={{
                    padding: '10px', background: 'gold', color: 'black', border: 'none',
                    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box'
                  }}>$1M</button>
                  <button onClick={() => addMoney(1000000000)} style={{
                    padding: '10px', background: '#ff4444', color: 'white', border: 'none',
                    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box'
                  }}>$1B</button>
                  <button onClick={() => window.location.reload()} style={{
                    padding: '10px', background: '#666', color: 'white', border: 'none',
                    borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxSizing: 'border-box'
                  }}>🔄 Reset</button>
                </div>
              </>
            )}
            
            <button
              onClick={() => {setAdminActive(false); setAdminPass(''); setShowControls(false)}}
              style={{
                width: '100%', padding: '12px', background: '#666',
                color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                fontWeight: 'bold', boxSizing: 'border-box'
              }}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>

      {/* UPDATE BUTTON - Only visible to admins */}
      {adminActive && (
        <button
          onClick={() => setShowUpdatePanel(!showUpdatePanel)}
          style={{
            position: 'fixed', bottom: '30px', right: '30px',
            padding: '15px 20px', background: '#00bfff',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            zIndex: 9998, boxShadow: '0 10px 30px rgba(0,191,255,0.5)',
            boxSizing: 'border-box'
          }}
        >
          ⚙️ {showUpdatePanel ? 'CLOSE UPDATE' : 'OPEN UPDATE'}
        </button>
      )}

      {/* UPDATE PANEL - Full customization */}
      {adminActive && showUpdatePanel && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(145deg, #1a1a2e, #ff6b35)',
          color: 'white', padding: '30px', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)', zIndex: 9997,
          minWidth: '350px', maxWidth: '90vw', border: '3px solid #00bfff'
        }}>
          <h3 style={{margin: '0 0 20px 0', textAlign: 'center'}}>🎮 CUSTOMIZE GAME</h3>
          
          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Set Score:</label>
            <input
              type="number"
              value={updateScore}
              onChange={(e) => setUpdateScore(e.target.value)}
              placeholder="Enter new score"
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Set Clicks:</label>
            <input
              type="number"
              value={updateClicks}
              onChange={(e) => setUpdateClicks(e.target.value)}
              placeholder="Enter new clicks"
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Set Username:</label>
            <input
              type="text"
              value={updateUsername}
              onChange={(e) => setUpdateUsername(e.target.value)}
              placeholder="Enter new username"
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleUpdateGame}
            style={{
              width: '100%', padding: '12px', background: '#4CAF50',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            ✅ UPDATE GAME
          </button>
        </div>
      )}
    </div>
  )
}

export default App
