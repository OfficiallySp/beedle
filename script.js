const bees = [
    "Basic", "Bomber", "Brave", "Bumble", "Cool",
    "Hasty", "Looker", "Rad", "Rascal", "Stubborn",
    "Bubble", "Bucko", "Commander", "Demo", "Exhausted",
    "Fire", "Frosty", "Honey", "Rage", "Riley", "Shocked",
    "Baby", "Carpenter", "Demon", "Diamond", "Lion", "Music",
    "Ninja", "Shy", "Buoyant", "Fuzzy", "Precise", "Spicy",
    "Tadpole", "Vector", "Bear", "Cobalt", "Crimson", "Digital",
    "Festive", "Gummy", "Photon", "Puppy", "Tabby", "Vicious", "Windy"
];

// Function to get the daily bee
function getDailyBee() {
    const start = new Date(2024, 0, 1); // Start date (e.g., January 1, 2024)
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return bees[diff % bees.length].toLowerCase();
}

let answer = getDailyBee();
let attempts = 6;
const maxAttempts = attempts;

// Load sound effects
const correctSound = new Audio('sound/correct.mp3');
const incorrectSound = new Audio('sound/incorrect.mp3');
const flipSound = new Audio('sound/flip.mp3'); // Sound for letter flip
const letterCorrectSound = new Audio('sound/letter_correct.mp3'); // Sound for correct letters
const letterPresentSound = new Audio('sound/letter_present.mp3'); // Sound for letters in the word

document.getElementById('guess-input').addEventListener('input', () => {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    const submitButton = document.getElementById('guess-button');
    submitButton.disabled = !(guess.length > 0 && bees.map(b => b.toLowerCase()).includes(guess));
});

document.getElementById('guess-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && !document.getElementById('guess-button').disabled) {
        submitGuess();
    }
});

document.getElementById('guess-button').addEventListener('click', submitGuess);
document.getElementById('reset-button').addEventListener('click', resetData);

function submitGuess() {
    if (attempts <= 0 || document.getElementById('guess-button').disabled) {
        return; // Ignore input if the game is over or the button is disabled
    }

    const guess = document.getElementById('guess-input').value.toLowerCase();
    if (!bees.map(b => b.toLowerCase()).includes(guess)) {
        alert("Invalid bee name. Please enter a valid bee.");
        return;
    }

    checkGuess(guess);
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').focus();
}

function checkGuess(guess) {
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';
    const guessArray = guess.split('');
    const answerArray = answer.split('');

    guessArray.forEach((letter, index) => {
        const guessBox = document.createElement('div');
        guessBox.className = 'guess-box';
        guessBox.innerText = letter;
        guessRow.appendChild(guessBox);

        setTimeout(() => {
            // Play flip sound for each letter
            flipSound.cloneNode(true).play();

            if (answerArray[index] === letter) {
                guessBox.classList.add('correct');
                letterCorrectSound.cloneNode(true).play(); // Correct letter sound
            } else if (answerArray.includes(letter)) {
                guessBox.classList.add('present');
                letterPresentSound.cloneNode(true).play(); // Present letter sound
            } else {
                guessBox.classList.add('absent');
            }
        }, index * 300); // Speed of animations
    });

    document.getElementById('guess-grid').appendChild(guessRow);
    attempts--;
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${attempts}`;

    setTimeout(() => {
        if (guess === answer) {
            setTimeout(() => {
                correctSound.play();
                alert('Congratulations! You guessed the bee!');
            }, 100);
            updateStats(true, maxAttempts - attempts + 1);
            endGame();
            showBeeImage();
        } else if (attempts === 0) {
            setTimeout(() => {
                incorrectSound.play();
                alert(`Game Over! The bee was ${answer}`);
            }, 100);
            updateStats(false, maxAttempts);
            endGame();
            showBeeImage();
        }
    }, guessArray.length * 500 + 150);
}

function endGame() {
    document.getElementById('guess-button').disabled = true;
    document.getElementById('guess-input').disabled = true;
}

function showBeeImage() {
    const beeImage = document.getElementById('bee-image');
    beeImage.style.display = 'block';
    beeImage.src = `bee/${answer.replace(/ /g, '_')}.png`;
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

// Update countdown every second
setInterval(updateCountdown, 1000);

// Initialize countdown
updateCountdown();

// Stats and streak management
let stats = JSON.parse(localStorage.getItem('stats')) || {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0]
};

function updateStats(isWin, attempts) {
    stats.gamesPlayed++;
    if (isWin) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.guessDistribution[attempts - 1]++;
    } else {
        stats.currentStreak = 0;
    }
    localStorage.setItem('stats', JSON.stringify(stats));
    displayStats();
}

function displayStats() {
    const statsModal = document.createElement('div');
    statsModal.className = 'stats-modal';
    statsModal.innerHTML = `
        <h2>STATISTICS</h2>
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-number">${stats.gamesPlayed}</div>
                <div class="stat-label">Played</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0}</div>
                <div class="stat-label">Win %</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.currentStreak}</div>
                <div class="stat-label">Current Streak</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.maxStreak}</div>
                <div class="stat-label">Max Streak</div>
            </div>
        </div>
        <h3>GUESS DISTRIBUTION</h3>
        <div class="guess-distribution">
            ${stats.guessDistribution.map((count, index) => `
                <div class="guess-bar">
                    <div class="guess-label">${index + 1}</div>
                    <div class="guess-count" style="width: ${(count / Math.max(...stats.guessDistribution)) * 100}%">${count}</div>
                </div>
            `).join('')}
        </div>
        <button id="close-stats">Close</button>
    `;
    document.body.appendChild(statsModal);
    document.getElementById('close-stats').addEventListener('click', () => statsModal.remove());
}

// Add a button to show stats
const statsButton = document.createElement('button');
statsButton.id = 'show-stats';
statsButton.textContent = 'Statistics';
statsButton.addEventListener('click', displayStats);
document.querySelector('.game-container').appendChild(statsButton);

function updateLeaderboard(attemptsData) {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '<h4>Leaderboard</h4>';

    // Sort by attempts and then by date
    attemptsData.sort((a, b) => a.attempts - b.attempts || new Date(a.date) - new Date(b.date));

    attemptsData.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.innerText = `${index + 1}. Date: ${entry.date} - Attempts: ${entry.attempts}`;
        leaderboard.appendChild(entryDiv);
    });
}

function resetData() {
    localStorage.removeItem('dailyStreak');
    localStorage.removeItem('attemptsData');
    document.getElementById('streak').innerText = 'Daily Streak: 0';
    document.getElementById('leaderboard').innerHTML = '<h4>Leaderboard</h4>';
}

// Initialize streak and leaderboard
document.getElementById('streak').innerText = `Daily Streak: ${localStorage.getItem('dailyStreak') || 0}`;
updateLeaderboard(JSON.parse(localStorage.getItem('attemptsData')) || []);
