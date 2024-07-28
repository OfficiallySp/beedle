const stickers = [
    "Brown Cub Skin", "Robo Cub Skin", "Stick Cub Skin", "Star Cub Skin", "Noob Cub Skin",
    "Bee Cub Skin", "Gingerbread Cub Skin", "Snow Cub Skin", "Peppermint Robo Cub Skin", "Doodle Cub Skin"
    // Add more stickers as needed
];

let currentSticker;
let attempts;
const maxAttempts = 5;

function initGame() {
    currentSticker = getRandomSticker();
    attempts = maxAttempts;
    updateAttemptsDisplay();
    document.getElementById('sticker-image').src = `stickers/${currentSticker.replace(/ /g, '_')}.png`;
    document.getElementById('result').textContent = '';
    document.getElementById('guess-button').disabled = false;
    document.getElementById('guess-input').value = '';
    document.getElementById('next-sticker').style.display = 'none';
    document.getElementById('sticker-image').style.filter = 'blur(10px)';
}

function getRandomSticker() {
    return stickers[Math.floor(Math.random() * stickers.length)];
}

function updateAttemptsDisplay() {
    document.getElementById('remaining-attempts').textContent = `Attempts left: ${attempts}`;
}

function checkGuess() {
    const guess = document.getElementById('guess-input').value.trim().toLowerCase();
    const correct = currentSticker.toLowerCase();

    if (guess === correct) {
        document.getElementById('result').textContent = 'Correct! You guessed the sticker!';
        document.getElementById('sticker-image').style.filter = 'blur(0)';
        document.getElementById('guess-button').disabled = true;
        document.getElementById('next-sticker').style.display = 'inline-block';
    } else {
        attempts--;
        updateAttemptsDisplay();
        if (attempts > 0) {
            document.getElementById('result').textContent = 'Incorrect. Try again!';
            document.getElementById('sticker-image').style.filter = `blur(${10 - (maxAttempts - attempts) * 2}px)`;
        } else {
            document.getElementById('result').textContent = `Game over! The sticker was ${currentSticker}.`;
            document.getElementById('sticker-image').style.filter = 'blur(0)';
            document.getElementById('guess-button').disabled = true;
            document.getElementById('next-sticker').style.display = 'inline-block';
        }
    }
}

document.getElementById('guess-button').addEventListener('click', checkGuess);
document.getElementById('next-sticker').addEventListener('click', initGame);
document.getElementById('guess-input').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

initGame();