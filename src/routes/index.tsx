import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';

function App() {
  // 🎮 GAME STATE
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [username, setUsername] = useState('Scammer');
  
  // 🔥 ADMIN STATE
  const [adminActive, setAdminActive] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const ADMIN_PASSWORD = 'scam2024'; // CHANGE THIS!

  // 💾 Load game state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('scamclicker-save');
    if (saved) {
      const { score: savedScore, clicks: savedClicks, username: savedUsername } = JSON.parse(saved);
      setScore(savedScore);
      setClicks(savedClicks);
      setUsername(savedUsername);
    }
  }, []);

  // 💾 Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('scamclicker-save', JSON.stringify({ score, clicks, username }));
  }, [score, clicks, username]);

  const gameClick = () => {
    setScore(score + Math.floor(Math.random() * 10) + 1);
    setClicks(clicks + 1);
  };

  const adminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setAdminActive(true);
      alert('✅ ADMIN GOD MODE ON! 👑');
    } else {
      alert('❌ Wrong!');
      setAdminPass('');
    }
  };

  const updateGameData = () => {
    setScore(999999999);
    setClicks(999999);
    setUsername('ADMIN');
    alert('✅ GAME HACKED!');
  };

  const addMoney = (amount: number) => {
    setScore(score + amount);
    alert(`✅ +$${amount.toLocaleString()}!`);
  };

  const handleReset = () => {
    localStorage.removeItem('scamclicker-save');
    window.location.reload();
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  const moneyButtonStyle = {
    padding: '10px',
    background: 'gold',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px'
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      background: 'linear-gradient(135deg, #0f0f23, #ff6b35)', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px',
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
            color: 'white', fontWeight: 'bold'
          }}
          onMouseDown={(e) => (e.currentTarget).style.transform = 'scale(0.95)'}
          onMouseUp={(e) => (e.currentTarget).style.transform = 'scale(1)'}
        >
          CLICK FOR $$$ 💸
        </button>
      </div>

      {/* 🔥 ADMIN PANEL */}
      <div style={{
        position: 'fixed', bottom: '30px', right: '30px',
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
              onKeyPress={(e) => e.key === 'Enter' && adminLogin()}
              placeholder="🔑 Password"
              style={{
                width: '100%', padding: '12px', marginBottom: '15px',
                borderRadius: '10px', border: 'none', fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={adminLogin}
              style={{
                width: '100%', padding: '15px', background: '#4CAF50',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
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
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📜 {showControls ? 'HIDE' : 'SHOW'} CONTROLS
            </button>
            
            {showControls && (
              <>
                <button 
                  onClick={updateGameData} 
                  style={{...buttonStyle, background: '#4CAF50'}}
                >
                  ⚡ SET MAX VALUES
                </button>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px'}}>
                  <button 
                    onClick={() => addMoney(10000)} 
                    style={moneyButtonStyle}
                  >
                    $10K
                  </button>
                  <button 
                    onClick={() => addMoney(1000000)} 
                    style={moneyButtonStyle}
                  >
                    $1M
                  </button>
                  <button 
                    onClick={() => addMoney(1000000000)} 
                    style={{...moneyButtonStyle, background: '#ff4444', color: 'white'}}
                  >
                    $1B
                  </button>
                  <button 
                    onClick={handleReset} 
                    style={{...moneyButtonStyle, background: '#666', color: 'white'}}
                  >
                    🔄 Reset
                  </button>
                </div>
              </>
            )}
            
            <button
              onClick={() => {setAdminActive(false); setAdminPass('');}}
              style={{
                width: '100%', padding: '12px', background: '#666',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚪 Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: App,
});
