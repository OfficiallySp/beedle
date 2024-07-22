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

        }, index * 350); // Speed of animations
    });

    document.getElementById('guess-grid').appendChild(guessRow);
    attempts--;
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${attempts}`;

    setTimeout(() => {
        if (guess === answer) {
            setTimeout(() => {
                alert('Congratulations! You guessed the bee!');
                correctSound.play(); // Play correct sound
            }, 100);
            updateStreak(true);
            endGame();
            showBeeImage();
        } else if (attempts === 0) {
            setTimeout(() => {
                alert(`Game Over! The bee was ${answer}`);
                incorrectSound.play(); // Play incorrect sound
            }, 100);
            updateStreak(false);
            endGame();
            showBeeImage();
        }
    }, guessArray.length * 150);
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

// Daily streak and leaderboard
function updateStreak(isWin) {
    let streak = parseInt(localStorage.getItem('dailyStreak')) || 0;
    let attemptsData = JSON.parse(localStorage.getItem('attemptsData')) || [];

    if (isWin) {
        streak++;
    } else {
        streak = 0;
    }

    attemptsData.push({ date: new Date().toDateString(), attempts: maxAttempts - attempts });
    localStorage.setItem('dailyStreak', streak);
    localStorage.setItem('attemptsData', JSON.stringify(attemptsData));

    document.getElementById('streak').innerText = `Daily Streak: ${streak}`;

    updateLeaderboard(attemptsData);
}

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
