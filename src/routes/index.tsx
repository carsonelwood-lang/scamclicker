<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScamClicker - Admin Ready</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            text-align: center; 
            background: linear-gradient(135deg, #0f0f23, #2a1a3d, #ff6b35); 
            color: white; 
            min-height: 100vh; 
            overflow-x: hidden;
        }
        #gameArea { max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { font-size: 3em; margin-bottom: 20px; text-shadow: 0 0 20px #ff6b35; }
        #bigButton { 
            width: 280px; height: 280px; 
            font-size: 28px; font-weight: bold;
            background: linear-gradient(45deg, #ff6b35, #f7931e); 
            border: none; border-radius: 50%; 
            cursor: pointer; margin: 30px auto; 
            box-shadow: 0 20px 40px rgba(255,107,53,0.4);
            transition: all 0.2s;
        }
        #bigButton:hover { transform: scale(1.05); box-shadow: 0 25px 50px rgba(255,107,53,0.6); }
        #bigButton:active { transform: scale(0.95); }
        #stats { 
            background: rgba(0,0,0,0.7); 
            padding: 25px; border-radius: 20px; 
            margin: 25px auto; max-width: 400px;
            backdrop-filter: blur(10px);
        }
        #stats div { font-size: 1.4em; margin: 10px 0; }
        #adminPanel { 
            position: fixed; bottom: 30px; right: 30px; 
            background: linear-gradient(145deg, #1a1a2e, #16213e, #ff6b35); 
            color: white; padding: 25px; border-radius: 20px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.8); z-index: 10000;
            min-width: 280px; display: none;
            border: 2px solid #ff6b35;
            animation: slideIn 0.5s ease-out 2s forwards;
        }
        @keyframes slideIn { to { transform: translateY(0); opacity: 1; } }
        #adminPanel input, #adminPanel button { 
            width: 100%; padding: 12px; margin: 8px 0; 
            border: none; border-radius: 10px; font-size: 14px;
        }
        #adminPanel button { 
            background: linear-gradient(45deg, #4CAF50, #45a049); 
            color: white; cursor: pointer; font-weight: bold;
            transition: all 0.3s;
        }
        #adminPanel button:hover { transform: translateY(-2px); }
        #updatePanel { max-height: 0; overflow: hidden; transition: max-height 0.6s ease; margin-top: 10px; }
        .danger { background: linear-gradient(45deg, #ff4444, #cc0000) !important; }
        p { margin-top: 30px; font-size: 1.2em; opacity: 0.9; }
    </style>
</head>
<body>
    <div id="gameArea">
        <h1>🤑 SCAMCLICKER</h1>
        <div id="stats">
            <div>💰 Score: $<span id="score">0</span></div>
            <div>🖱️  Clicks: <span id="clicks">0</span></div>
            <div>👤 Player: <span id="username">New Scammer</span></div>
        </div>
        <button id="bigButton" onclick="scamClick()">CLICK FOR $$$$ 💸</button>
        <p>Get rich quick! Everyone's doing it... 😈</p>
    </div>

    <!-- 🔥 ULTIMATE ADMIN PANEL -->
    <div id="adminPanel">
        <h3>🔧 ADMIN CONTROL PANEL</h3>
        <div id="adminLogin">
            <input type="password" id="adminPass" placeholder="🔑 Admin Password" maxlength="20">
            <br>
            <button onclick="loginAdmin()">🚀 ENTER ADMIN MODE</button>
        </div>
        
        <div id="adminControls" style="display: none;">
            <button onclick="toggleControls()">📜 OPEN FULL CONTROLS</button>
            
            <div id="updatePanel">
                <h4>🎮 COMPLETE GAME CONTROL</h4>
                <input type="number" id="setScore" placeholder="💰 Set exact score">
                <input type="number" id="setClicks" placeholder="🖱️ Set exact clicks">
                <input type="text" id="setUsername" placeholder="👤 Set player name">
                <button onclick="updateEverything()">⚡ UPDATE ALL DATA</button>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="addCash(10000)">+$10K</button>
                    <button onclick="addCash(100000)">+$100K</button>
                    <button onclick="addCash(1000000)">+$1M</button>
                    <button onclick="addCash(1000000000)" class="danger">+$1B</button>
                </div>
                <button onclick="resetGame()" class="danger" style="margin-top: 10px;">💥 TOTAL RESET</button>
            </div>
            
            <button onclick="logoutAdmin()" style="background: #666; margin-top: 15px;">🚪 Logout</button>
        </div>
    </div>

    <script>
        // 🎮 MAIN GAME
        let score = 0;
        let clicks = 0;
        let username = "New Scammer";

        function scamClick() {
            score += Math.floor(Math.random() * 5) + 1;
            clicks++;
            updateUI();
            const btn = document.getElementById('bigButton');
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);
        }

        function updateUI() {
            document.getElementById('score').textContent = score.toLocaleString();
            document.getElementById('clicks').textContent = clicks.toLocaleString();
            document.getElementById('username').textContent = username;
        }

        // 🔥 ADMIN SYSTEM (ULTRA POWERFUL)
        const ADMIN_PASSWORD = "scam2024"; // CHANGE IMMEDIATELY!
        let adminActive = false;
        let controlsOpen = false;

        function loginAdmin() {
            const pass = document.getElementById('adminPass').value;
            if (pass === ADMIN_PASSWORD) {
                adminActive = true;
                document.getElementById('adminLogin').style.display = 'none';
                document.getElementById('adminControls').style.display = 'block';
                alert('✅ GOD MODE ACTIVATED! 👑');
            } else {
                alert('❌ Access Denied!');
                document.getElementById('adminPass').value = '';
            }
        }

        function toggleControls() {
            controlsOpen = !controlsOpen;
            const panel = document.getElementById('updatePanel');
            panel.style.maxHeight = controlsOpen ? '600px' : '0';
        }

        function updateEverything() {
            if (!adminActive) return;
            score = parseFloat(document.getElementById('setScore').value) || score;
            clicks = parseFloat(document.getElementById('setClicks').value) || clicks;
            username = document.getElementById('setUsername').value || username;
            updateUI();
            alert('✅ ALL DATA UPDATED INSTANTLY!');
        }

        function addCash(amount) {
            if (!adminActive) return;
            score += amount;
            updateUI();
            alert(`✅ +$${amount.toLocaleString()} ADDED! 💰`);
        }

        function resetGame() {
            if (!adminActive || !confirm('💥 RESET ENTIRE GAME?')) return;
            score = 0; clicks = 0; username = 'New Scammer';
            updateUI();
            alert('✅ GAME FULLY RESET!');
        }

        function logoutAdmin() {
            adminActive = false; controlsOpen = false;
            document.getElementById('adminLogin').style.display = 'block';
            document.getElementById('adminControls').style.display = 'none';
            document.getElementById('adminPass').value = '';
            document.getElementById('updatePanel').style.maxHeight = '0';
        }

        // Auto-show panel after page loads
        window.onload = () => {
            updateUI();
            setTimeout(() => document.getElementById('adminPanel').style.display = 'block', 1500);
        };
    </script>
</body>
</html>
