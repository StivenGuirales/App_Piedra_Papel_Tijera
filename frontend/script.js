const API_URL = 'http://localhost:8080/api';


const validUsers = {
    'Stiven': '123',
    'Guirales': '456'
};


let currentUser = null;
let stats = { wins: 0, losses: 0, ties: 0 };

// LOGIN 
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    
    if (!username || !password) {
        errorElement.textContent = 'Por favor completa todos los campos';
        return;
    }

    
    if (validUsers[username] && validUsers[username] === password) {
        currentUser = username;
        errorElement.textContent = '';
        loadUserStats();
        showGameScreen();
    } else {
        errorElement.textContent = 'Usuario o contraseña incorrectos';
    }
}

function logout() {
    currentUser = null;
    stats = { wins: 0, losses: 0, ties: 0 };
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showLoginScreen();
}

//  NAVEGACIÓN
function showLoginScreen() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('gameScreen').classList.remove('active');
}

function showGameScreen() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    document.getElementById('currentUser').textContent = currentUser;
    resetGame();
}

// JUEGO 
function play(playerChoice) {
    const choices = ['piedra', 'papel', 'tijera'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    // elecciones
    displayChoice('playerChoice', playerChoice);
    displayChoice('computerChoice', computerChoice);

    // Determinar ganador
    const result = determineWinner(playerChoice, computerChoice);
    
    // Mostrar resultado
    displayResult(result);

    // Actualizar estadísticas
    updateStats(result);

    // Deshabilitar botones y mostrar botón de reinicio
    disableGameButtons(true);
    document.getElementById('resetBtn').style.display = 'block';
}

function displayChoice(elementId, choice) {
    const icons = {
        'piedra': '🪨',
        'papel': '📄',
        'tijera': '✂️'
    };
    document.getElementById(elementId).textContent = icons[choice];
}

function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    
    if (
        (player === 'piedra' && computer === 'tijera') ||
        (player === 'papel' && computer === 'piedra') ||
        (player === 'tijera' && computer === 'papel')
    ) {
        return 'win';
    }
    
    return 'lose';
}

function displayResult(result) {
    const resultElement = document.getElementById('resultMessage');
    const messages = {
        'win': '🎉 ¡Ganaste!',
        'lose': '😢 Perdiste',
        'tie': '🤝 ¡Empate!'
    };
    
    resultElement.textContent = messages[result];
    resultElement.className = 'result-message ' + result;
}

function updateStats(result) {
    if (result === 'win') stats.wins++;
    else if (result === 'lose') stats.losses++;
    else stats.ties++;

    // Actualizar UI
    updateStatsDisplay();

    // Guardar en el backend
    saveStatsToBackend();
}

function updateStatsDisplay() {
    document.getElementById('wins').textContent = stats.wins;
    document.getElementById('losses').textContent = stats.losses;
    document.getElementById('ties').textContent = stats.ties;
}

function resetGame() {
    document.getElementById('playerChoice').textContent = '❓';
    document.getElementById('computerChoice').textContent = '❓';
    document.getElementById('resultMessage').textContent = '';
    document.getElementById('resultMessage').className = 'result-message';
    document.getElementById('resetBtn').style.display = 'none';
    disableGameButtons(false);
}

function disableGameButtons(disabled) {
    const buttons = document.querySelectorAll('.btn-game');
    buttons.forEach(button => button.disabled = disabled);
}

// PANELES
function toggleInstructions() {
    const panel = document.getElementById('instructionsPanel');
    panel.classList.toggle('hidden');
}

function toggleStats() {
    const panel = document.getElementById('statsPanel');
    panel.classList.toggle('hidden');
}

// API Backend
async function loadUserStats() {
    try {
        const response = await fetch(`${API_URL}/stats/${currentUser}`);
        if (response.ok) {
            const data = await response.json();
            stats = data;
            updateStatsDisplay();
        } else {
            
            stats = { wins: 0, losses: 0, ties: 0 };
            updateStatsDisplay();
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        
        stats = { wins: 0, losses: 0, ties: 0 };
        updateStatsDisplay();
    }
}

async function saveStatsToBackend() {
    try {
        await fetch(`${API_URL}/stats/${currentUser}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stats)
        });
    } catch (error) {
        console.error('Error guardando estadísticas:', error);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    });
});