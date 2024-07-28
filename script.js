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

function getDailyBee() {
    const start = new Date(2024, 0, 1);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return bees[diff % bees.length].toLowerCase();
}

let answer = getDailyBee();
let attempts = 6;
const maxAttempts = attempts;

const correctSound = new Audio('sound/correct.mp3');
const incorrectSound = new Audio('sound/incorrect.mp3');
const flipSound = new Audio('sound/flip.mp3'); 
const letterCorrectSound = new Audio('sound/letter_correct.mp3'); 
const letterPresentSound = new Audio('sound/letter_present.mp3'); 

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
document.getElementById('reset-button').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
        localStorage.removeItem("dailyStreak");
        localStorage.removeItem("attemptsData");
        localStorage.removeItem("stats");
        localStorage.removeItem("achievements");
        location.reload();
    }
});

function submitGuess() {
    if (attempts <= 0 || document.getElementById('guess-button').disabled) {
        return;
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

// Check the submitted guess against the answer
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
            if (soundEnabled) playSound('flip');

            if (answerArray[index] === letter) {
                guessBox.classList.add('correct');
                if (soundEnabled) playSound('letter_correct');
            } else if (answerArray.includes(letter)) {
                guessBox.classList.add('present');
                if (soundEnabled) playSound('letter_present');
            } else {
                guessBox.classList.add('absent');
            }
        }, index * 300);
    });

    document.getElementById('guess-grid').appendChild(guessRow);
    attempts--;
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${attempts}`;

    setTimeout(() => {
        if (guess === answer) {
            if (soundEnabled) playSound('correct');
            alert('Congratulations! You guessed the bee!');
            updateStats(true, maxAttempts - attempts);
            endGame(true);
            showBeeImage();
        } else if (attempts === 0) {
            if (soundEnabled) playSound('incorrect');
            alert(`Game Over! The bee was ${answer}`);
            updateStats(false, maxAttempts);
            endGame(false);
            showBeeImage();
        }
    }, guessArray.length * 300 + 150);
}

function endGame(isWin) {
    document.getElementById('guess-button').disabled = true;
    document.getElementById('guess-input').disabled = true;
    checkAchievements(isWin, maxAttempts - attempts + 1);
}

function showBeeImage() {
    const beeImage = document.getElementById('bee-image');
    beeImage.style.display = 'block';
    beeImage.src = `bee/${answer.replace(/ /g, '_')}.png`;
}

function updateCountdown() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeRemaining = nextMidnight - now;

    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById('timer').innerText = `${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);

updateCountdown();

// Initialize or load stats from localStorage
let stats = JSON.parse(localStorage.getItem('stats')) || {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0]
};

// Update stats after each game
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

function updateLeaderboard(attemptsData) {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '<h4>Leaderboard</h4>';

    attemptsData.sort((a, b) => a.attempts - b.attempts || new Date(a.date) - new Date(b.date));

    attemptsData.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.innerText = `${index + 1}. Date: ${entry.date} - Attempts: ${entry.attempts}`;
        leaderboard.appendChild(entryDiv);
    });
}

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", themeToggle.checked);
});

const soundToggle = document.getElementById("sound-toggle");
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
soundToggle.checked = soundEnabled;
soundToggle.addEventListener("change", () => {
    soundEnabled = soundToggle.checked;
    localStorage.setItem("soundEnabled", soundEnabled);
});

if (localStorage.getItem("darkMode") === "true") {
    themeToggle.checked = true;
    document.body.classList.add("dark-mode");
}

function playSound(soundName) {
    if (soundEnabled) {
        const sound = new Audio(`sound/${soundName}.mp3`);
        sound.play().catch(error => console.error('Error playing sound:', error));
    }
}

let achievements = JSON.parse(localStorage.getItem('achievements')) || {
    firstWin: { name: "First Win", description: "Win your first game", unlocked: false },
    threeInARow: { name: "Hat Trick", description: "Win three games in a row", unlocked: false },
    perfectGame: { name: "Perfect Game", description: "Win in just one attempt", unlocked: false }
};

document.getElementById("achievements-button").addEventListener("click", () => {
    let achievementsContent = "<h2>Achievements</h2><ul>";
    for (let key in achievements) {
        achievementsContent += `<li>${achievements[key].name}: ${achievements[key].description} - ${achievements[key].unlocked ? "Unlocked" : "Locked"}</li>`;
    }
    achievementsContent += "</ul>";
    showModal(achievementsContent);
});

function checkAchievements(isWin, attempts) {
    if (!achievements.firstWin.unlocked && isWin) {
        achievements.firstWin.unlocked = true;
        showModal("Achievement Unlocked: First Win!");
    }
    if (!achievements.perfectGame.unlocked && isWin && attempts === 1) {
        achievements.perfectGame.unlocked = true;
        showModal("Achievement Unlocked: Perfect Game!");
    }
    localStorage.setItem('achievements', JSON.stringify(achievements));
}

function showModal(content) {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    modalText.innerHTML = content;
    modal.style.display = "block";

    const closeBtn = modal.querySelector(".close");
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function endGame(isWin) {
    document.getElementById('guess-button').disabled = true;
    document.getElementById('guess-input').disabled = true;
    checkAchievements(isWin, maxAttempts - attempts + 1);
}

document.getElementById("tutorial-button").addEventListener("click", () => {
    showModal(tutorialContent);
});

const tutorialContent = `
    <h2>How to Play Beedle</h2>
    <ol>
        <li>You have 6 attempts to guess the correct bee from Bee Swarm Simulator.</li>
        <li>After each guess, the color of the tiles will change to show how close your guess was:</li>
        <ul>
            <li>Green: Correct letter in the correct position</li>
            <li>Yellow: Correct letter but in the wrong position</li>
            <li>Gray: Letter is not in the word</li>
        </ul>
        <li>Keep guessing until you find the correct bee or run out of attempts!</li>
    </ol>
`;

document.getElementById("show-stats-button").addEventListener("click", displayStats);

// Display game statistics
function displayStats() {
    const statsContent = `
        <h2>Statistics</h2>
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-number">${stats.gamesPlayed}</div>
                <div>Played</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0}%</div>
                <div>Win %</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.currentStreak}</div>
                <div>Current Streak</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.maxStreak}</div>
                <div>Max Streak</div>
            </div>
        </div>
        <h3>Guess Distribution</h3>
        <div class="guess-distribution">
            ${stats.guessDistribution.map((count, index) => `
                <div class="guess-bar">
                    <div class="guess-label">${index + 1}</div>
                    <div class="guess-count" style="width: ${(count / Math.max(...stats.guessDistribution)) * 100}%">${count}</div>
                </div>
            `).join('')}
        </div>
    `;
    showModal(statsContent);
}