// ES6 module syntax
import { bees, sounds } from './gameData.js';

// State management
const gameState = {
    answer: '',
    attempts: 6,
    maxAttempts: 6,
    streak: 0,
    attemptsData: [],
	hintUsed: false,
};

// Function to get the daily bee
function getDailyBee() {
    const start = new Date(2024, 0, 1);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return bees[diff % bees.length].toLowerCase();
}

// Initialize game
function initGame() {
    gameState.answer = getDailyBee();
    gameState.attempts = gameState.maxAttempts;
    loadGameData();
    updateUI();
    createVisualKeyboard();
}

// Load game data from local storage
function loadGameData() {
    gameState.streak = parseInt(localStorage.getItem('dailyStreak')) || 0;
    gameState.attemptsData = JSON.parse(localStorage.getItem('attemptsData')) || [];
}

// Update UI elements
function updateUI() {
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${gameState.attempts}`;
    document.getElementById('streak').innerText = `Daily Streak: ${gameState.streak}`;
    updateLeaderboard();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event listeners
document.getElementById('guess-input').addEventListener('input', debounce(validateInput, 300));
document.getElementById('guess-input').addEventListener('keyup', handleEnterKey);
document.getElementById('guess-button').addEventListener('click', submitGuess);
document.getElementById('reset-button').addEventListener('click', resetData);

// Input validation
function validateInput() {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    const submitButton = document.getElementById('guess-button');
    submitButton.disabled = !(guess.length > 0 && bees.map(b => b.toLowerCase()).includes(guess));
}

// Handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter' && !document.getElementById('guess-button').disabled) {
        submitGuess();
    }
}

// Submit guess
function submitGuess() {
    if (gameState.attempts <= 0 || document.getElementById('guess-button').disabled) return;

    const guess = document.getElementById('guess-input').value.toLowerCase();
    if (!bees.map(b => b.toLowerCase()).includes(guess)) {
        alert("Invalid bee name. Please enter a valid bee.");
        return;
    }

    checkGuess(guess);
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').focus();
}

// Check guess
function checkGuess(guess) {
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';
    const guessArray = guess.split('');
    const answerArray = gameState.answer.split('');

    guessArray.forEach((letter, index) => {
        const guessBox = document.createElement('div');
        guessBox.className = 'guess-box';
        guessBox.innerText = letter;
        guessRow.appendChild(guessBox);

        requestAnimationFrame(() => {
            setTimeout(() => {
                sounds.flip.cloneNode(true).play();
                if (answerArray[index] === letter) {
                    guessBox.classList.add('correct');
                    sounds.letterCorrect.cloneNode(true).play();
                } else if (answerArray.includes(letter)) {
                    guessBox.classList.add('present');
                    sounds.letterPresent.cloneNode(true).play();
                } else {
                    guessBox.classList.add('absent');
                }
                updateVisualKeyboard(letter, answerArray[index] === letter, answerArray.includes(letter));
            }, index * 350);
        });
    });

    document.getElementById('guess-grid').appendChild(guessRow);
    gameState.attempts--;
    updateUI();

    setTimeout(() => {
        if (guess === gameState.answer) {
            endGame(true);
        } else if (gameState.attempts === 0) {
            endGame(false);
        }
    }, guessArray.length * 350);
}

// End game
function endGame(isWin) {
    setTimeout(() => {
        if (isWin) {
            alert('Congratulations! You guessed the bee!');
            sounds.correct.play();
        } else {
            alert(`Game Over! The bee was ${gameState.answer}`);
            sounds.incorrect.play();
        }
    }, 100);
    updateStreak(isWin);
    document.getElementById('guess-button').disabled = true;
    document.getElementById('guess-input').disabled = true;
    showBeeImage();
}

// Show bee image
function showBeeImage() {
    const beeImage = document.getElementById('bee-image');
    beeImage.style.display = 'block';
    beeImage.src = `bee/${gameState.answer.replace(/ /g, '_')}.png`;
    beeImage.alt = `Image of ${gameState.answer} bee`;
}

// Update streak
function updateStreak(isWin) {
    gameState.streak = isWin ? gameState.streak + 1 : 0;
    gameState.attemptsData.push({ date: new Date().toDateString(), attempts: gameState.maxAttempts - gameState.attempts });
    localStorage.setItem('dailyStreak', gameState.streak);
    localStorage.setItem('attemptsData', JSON.stringify(gameState.attemptsData));
    updateUI();
}

// Update leaderboard
function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '<h4>Leaderboard</h4>';
    gameState.attemptsData
        .sort((a, b) => a.attempts - b.attempts || new Date(a.date) - new Date(b.date))
        .slice(0, 5)
        .forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.innerText = `${index + 1}. Date: ${entry.date} - Attempts: ${entry.attempts}`;
            leaderboard.appendChild(entryDiv);
        });
}

// Reset data
function resetData() {
    localStorage.removeItem('dailyStreak');
    localStorage.removeItem('attemptsData');
    gameState.streak = 0;
    gameState.attemptsData = [];
    updateUI();
}

// Countdown Timer
function updateCountdown() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeRemaining = nextMidnight - now;

    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById('timer').innerText = `${hours}h ${minutes}m ${seconds}s`;
}

// Create visual keyboard
function createVisualKeyboard() {
    const keyboard = document.getElementById('visual-keyboard');
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(letter => {
            const key = document.createElement('button');
            key.className = 'keyboard-key';
            key.innerText = letter;
            key.addEventListener('click', () => {
                const input = document.getElementById('guess-input');
                input.value += letter;
                validateInput();
            });
            rowDiv.appendChild(key);
        });
        keyboard.appendChild(rowDiv);
    });
}

// Update visual keyboard
function updateVisualKeyboard(letter, isCorrect, isPresent) {
    const keys = document.querySelectorAll('.keyboard-key');
    keys.forEach(key => {
        if (key.innerText === letter) {
            if (isCorrect) {
                key.classList.add('correct');
            } else if (isPresent) {
                key.classList.add('present');
            } else {
                key.classList.add('absent');
            }
        }
    });
}

// Add this to the gameState object
hintUsed: false,

// Add this function
function getHint() {
    if (!gameState.hintUsed) {
        const hintIndex = Math.floor(Math.random() * gameState.answer.length);
        alert(`Hint: The ${ordinal(hintIndex + 1)} letter is "${gameState.answer[hintIndex]}"`);
        gameState.hintUsed = true;
        gameState.attempts--;
        updateUI();
    } else {
        alert("You've already used your hint for this game!");
    }
}

// Helper function for ordinal numbers
function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Add a hint button in the HTML
// <button id="hint-button" aria-label="Get a hint">Hint</button>

// Add this to your event listeners
document.getElementById('hint-button').addEventListener('click', getHint);

function shareResult() {
    const guessCount = gameState.maxAttempts - gameState.attempts;
    const emoji = guessCount <= gameState.maxAttempts ? '🐝' : '😢';
    const shareText = `Beedle ${emoji} ${guessCount}/${gameState.maxAttempts}\n\nCan you guess the bee? Play at [your-game-url]`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Beedle Result',
            text: shareText
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Result copied to clipboard!');
    }
}

// Add a share button in the HTML
// <button id="share-button" aria-label="Share your result">Share</button>

// Add this to your event listeners
document.getElementById('share-button').addEventListener('click', shareResult);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Initialize countdown and game
setInterval(updateCountdown, 1000);
updateCountdown();
initGame();