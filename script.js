const bees = [
    { name: "Basic", description: "This is the most basic bee, it's pretty simple but very reliable." },
    { name: "Bomber", description: "This bee loves to drop bombs, causing a lot of damage." },
    { name: "Brave", description: "A very brave bee, never afraid to take on any challenge." },
    { name: "Bumble", description: "A cute and fuzzy bee, always bumbling around." },
    { name: "Cool", description: "This bee is just too cool for school." },
    // Add all the bee names and descriptions here
];

// Function to get the daily bee
function getDailyBee() {
    const start = new Date(2024, 0, 1); // Start date (e.g., January 1, 2024)
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return bees[diff % bees.length];
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
    submitButton.disabled = !(guess.length > 0 && bees.map(b => b.name.toLowerCase()).includes(guess));
});

document.getElementById('guess-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && !document.getElementById('guess-button').disabled) {
        submitGuess();
    }
});

document.getElementById('guess-button').addEventListener('click', submitGuess);
document.getElementById('restart-button').addEventListener('click', restartGame);

function submitGuess() {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    checkGuess(guess);
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').focus();
}

function checkGuess(guess) {
    const guessRow = document.createElement('div');
    guessRow.className = 'guess-row';
    const guessArray = guess.split('');
    const answerArray = answer.name.toLowerCase().split('');

    guessArray.forEach((letter, index) => {
        const guessBox = document.createElement('div');
        guessBox.className = 'guess-box';
        guessBox.innerText = letter;
        guessRow.appendChild(guessBox);

        setTimeout(() => {
            // Play flip sound for each letter
            flipSound.play();

            if (answerArray[index] === letter) {
                guessBox.classList.add('correct');
                letterCorrectSound.play(); // Correct letter sound
            } else if (answerArray.includes(letter)) {
                guessBox.classList.add('present');
                letterPresentSound.play(); // Present letter sound
            } else {
                guessBox.classList.add('absent');
            }

        }, index * 500); // Delay each letter by 500ms
    });

    document.getElementById('guess-grid').appendChild(guessRow);
    attempts--;
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${attempts}`;

    setTimeout(() => {
        if (guess === answer.name.toLowerCase()) {
            setTimeout(() => alert('Congratulations! You guessed the bee!'), 100);
            endGame();
            showBeeImage();
            showBeeDescription();
        } else if (attempts === 0) {
            setTimeout(() => alert(`Game Over! The bee was ${answer.name}`), 100);
            endGame();
            showBeeImage();
            showBeeDescription();
        } else if (attempts === Math.floor(maxAttempts / 2)) {
            document.getElementById('hint').innerText = 'Hint: Think of the most common bees!';
        }
    }, guessArray.length * 500);
}

function endGame() {
    document.getElementById('guess-button').disabled = true;
    document.getElementById('restart-button').style.display = 'block';
}

function restartGame() {
    answer = getDailyBee();
    attempts = maxAttempts;
    document.getElementById('guess-grid').innerHTML = '';
    document.getElementById('remaining-attempts').innerText = `Attempts left: ${attempts}`;
    document.getElementById('hint').innerText = '';
    document.getElementById('guess-button').disabled = true;
    document.getElementById('restart-button').style.display = 'none';
    document.getElementById('bee-image').style.display = 'none';
    document.getElementById('bee-description').style.display = 'none';
}

function showBeeImage() {
    const beeImage = document.getElementById('bee-image');
    beeImage.style.display = 'block';
    // Change the image source based on the answer
    beeImage.src = `bee/${answer.name.replace(/ /g, '_')}.png`;
}

function showBeeDescription() {
    const beeDescription = document.getElementById('bee-description');
    beeDescription.style.display = 'block';
    beeDescription.innerText = answer.description;
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
