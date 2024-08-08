const bees = [
  "Basic",
  "Bomber",
  "Brave",
  "Bumble",
  "Cool",
  "Hasty",
  "Looker",
  "Rad",
  "Rascal",
  "Stubborn",
  "Bubble",
  "Bucko",
  "Commander",
  "Demo",
  "Exhausted",
  "Fire",
  "Frosty",
  "Honey",
  "Rage",
  "Riley",
  "Shocked",
  "Baby",
  "Carpenter",
  "Demon",
  "Diamond",
  "Lion",
  "Music",
  "Ninja",
  "Shy",
  "Buoyant",
  "Fuzzy",
  "Precise",
  "Spicy",
  "Tadpole",
  "Vector",
  "Bear",
  "Cobalt",
  "Crimson",
  "Digital",
  "Festive",
  "Gummy",
  "Photon",
  "Puppy",
  "Tabby",
  "Vicious",
  "Windy",
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

document.getElementById("guess-input").addEventListener("input", () => {
  const guess = document.getElementById("guess-input").value.toLowerCase();
  const submitButton = document.getElementById("guess-button");
  submitButton.disabled = !(
    guess.length > 0 && bees.map((b) => b.toLowerCase()).includes(guess)
  );
});

document.getElementById("guess-input").addEventListener("keyup", (event) => {
  if (
    event.key === "Enter" &&
    !document.getElementById("guess-button").disabled
  ) {
    submitGuess();
  }
});

document.getElementById("guess-button").addEventListener("click", submitGuess);
document.getElementById("reset-button").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset all data? This action cannot bee undone."
    )
  ) {
    localStorage.removeItem("dailyStreak");
    localStorage.removeItem("attemptsData");
    localStorage.removeItem("stats");
    localStorage.removeItem("achievements");
    location.reload();
  }
});

function submitGuess() {
  if (attempts <= 0 || document.getElementById("guess-button").disabled) {
    return;
  }

  const guess = document.getElementById("guess-input").value.toLowerCase();
  if (!bees.map((b) => b.toLowerCase()).includes(guess)) {
    alert("Invalid bee name. Please enter a valid bee or buzz off!");
    return;
  }

  attempts--; // Move this line here, before calling checkGuess
  checkGuess(guess);
  document.getElementById("guess-input").value = "";
  document.getElementById("guess-input").focus();
}

// Check the submitted guess against the answer
function checkGuess(guess) {
  const guessRow = document.createElement("div");
  guessRow.className = "guess-row";
  const guessArray = guess.split("");
  const answerArray = answer.split("");

  guessArray.forEach((letter, index) => {
    const guessBox = document.createElement("div");
    guessBox.className = "guess-box";
    guessBox.innerText = letter;
    guessRow.appendChild(guessBox);

    setTimeout(() => {
      playSound("flip");

      if (answerArray[index] === letter) {
        guessBox.classList.add("correct");
        playSound("letter_correct");
      } else if (answerArray.includes(letter)) {
        guessBox.classList.add("present");
        playSound("letter_present");
      } else {
        guessBox.classList.add("absent");
      }
    }, index * 300);
  });

  document.getElementById("guess-grid").appendChild(guessRow);
  document.getElementById(
    "remaining-attempts"
  ).innerText = `Attempts left: ${attempts}`;

  setTimeout(() => {
    if (guess === answer) {
      console.log("Correct guess!");
      if (soundEnabled) playSound("correct");
      alert("Un-bee-lievable! You guessed the bee!");
      const attemptsUsed = maxAttempts - attempts;
      console.log(`Attempts used: ${attemptsUsed}`);
      updateStats(true, attemptsUsed);
      checkPerfectGame(attemptsUsed);
      checkAchievements(true, attemptsUsed);
      endGame(true);
      showBeeImage();
    } else if (attempts === 0) {
      if (soundEnabled) playSound("incorrect");
      alert(`Game Over! The bee was ${answer}. Better luck nectar time!`);
      consecutiveWins = 0; // Reset consecutive wins on loss
      localStorage.setItem("consecutiveWins", consecutiveWins);
      updateStats(false, maxAttempts);
      checkAchievements(false, maxAttempts);
      endGame(false);
      showBeeImage();
    }
  }, guessArray.length * 300 + 150);
}

function checkPerfectGame(attemptsUsed) {
  console.log(`Checking perfect game. Attempts used: ${attemptsUsed}`);
  console.log(`Perfect game unlocked: ${achievements.perfectGame.unlocked}`);
  if (attemptsUsed === 1 && !achievements.perfectGame.unlocked) {
    console.log("Unlocking perfect game achievement!");
    achievements.perfectGame.unlocked = true;
    showModal("Achievement Unlocked: Perfect Game!");
    saveAchievements();
  } else {
    console.log(`Not a perfect game. Attempts used: ${attemptsUsed}`);
  }
  logAchievements();
}

function endGame(isWin) {
  document.getElementById("guess-button").disabled = true;
  document.getElementById("guess-input").disabled = true;
  checkAchievements(isWin, maxAttempts - attempts + 1);
}

function showBeeImage() {
  const beeImage = document.getElementById("bee-image");
  beeImage.style.display = "block";
  beeImage.src = `bee/${answer.replace(/ /g, "_")}.png`;
}

function updateCountdown() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const timeRemaining = nextMidnight - now;

  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  document.getElementById(
    "timer"
  ).innerText = `${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);

updateCountdown();

// Initialize or load stats from localStorage
let stats = JSON.parse(localStorage.getItem("stats")) || {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
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
  localStorage.setItem("stats", JSON.stringify(stats));
  displayStats();
}

const soundToggle = document.getElementById("sound-toggle");
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
soundToggle.checked = soundEnabled;
soundToggle.addEventListener("change", () => {
  soundEnabled = soundToggle.checked;
  localStorage.setItem("soundEnabled", soundEnabled);
});

function playSound(soundName) {
  if (soundEnabled) {
    const sound = new Audio(`sound/${soundName}.mp3`);
    sound.play().catch((error) => console.error("Error playing sound:", error));
  }
}

let achievements = JSON.parse(localStorage.getItem("achievements")) || {
  firstWin: {
    name: "First Win",
    description: "Win your first game",
    unlocked: false,
    icon: "badge/firstWin.png",
  },
  threeInARow: {
    name: "Hat Trick",
    description: "Win three games in a row",
    unlocked: false,
    icon: "badge/threeInARow.png",
  },
  perfectGame: {
    name: "Perfect Game",
    description: "Win in just one attempt",
    unlocked: false,
    icon: "badge/perfectGame.png",
  },
  fiveWins: {
    name: "High Five",
    description: "Win 5 games in total",
    unlocked: false,
    icon: "badge/fiveWins.png",
  },
  tenWins: {
    name: "Bee-lliant!",
    description: "Win 10 games in total",
    unlocked: false,
    icon: "badge/tenWins.png",
  },
  lastSecond: {
    name: "Close Call",
    description: "Win on the last attempt",
    unlocked: false,
    icon: "badge/lastSecond.png",
  },
  quickWin: {
    name: "Speed Demon",
    description: "Win within 30 seconds",
    unlocked: false,
    icon: "badge/quickWin.png",
  },
  persistentPlayer: {
    name: "Persistent",
    description: "Play for 5 days in a row",
    unlocked: false,
    icon: "badge/persistentPlayer.png",
  },
  superStar: {
    name: "SuperStar",
    description: "Unlock all achievements",
    unlocked: false,
    icon: "badge/superStar.png",
  },
};

// Function to save achievements
function saveAchievements() {
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

document.getElementById("achievements-button").addEventListener("click", () => {
  let achievementsContent =
    "<h2>Hive Achievements</h2><div class='achievements-grid'>";
  for (let key in achievements) {
    const achievement = achievements[key];
    achievementsContent += `
            <div class="achievement-item ${
              achievement.unlocked ? "unlocked" : "locked"
            }">
                <div class="achievement-icon">
                    <img src="${achievement.icon}" alt="${
      achievement.name
    } icon">
                </div>
                <div class="achievement-info">
                    <h3>${achievement.name}</h3>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;
  }
  achievementsContent += "</div>";
  showModal(achievementsContent);
});

// Add this variable at the top of your script, with other global variables
let consecutiveWins = parseInt(localStorage.getItem("consecutiveWins")) || 0;

// Modify the checkAchievements function
function checkAchievements(isWin, attemptsUsed) {
  if (isWin) {
    consecutiveWins++;
    stats.gamesWon++;

    if (!achievements.firstWin.unlocked) {
      unlockAchievement("firstWin");
    }

    if (!achievements.threeInARow.unlocked && consecutiveWins === 3) {
      unlockAchievement("threeInARow");
    }

    if (!achievements.fiveWins.unlocked && stats.gamesWon === 5) {
      unlockAchievement("fiveWins");
    }

    if (!achievements.tenWins.unlocked && stats.gamesWon === 10) {
      unlockAchievement("tenWins");
    }

    if (!achievements.lastSecond.unlocked && attemptsUsed === maxAttempts) {
      unlockAchievement("lastSecond");
    }

    if (!achievements.perfectGame.unlocked && attemptsUsed === 1) {
      unlockAchievement("perfectGame");
    }

    const gameTime = (new Date() - gameStartTime) / 1000;
    if (!achievements.quickWin.unlocked && gameTime <= 30) {
      unlockAchievement("quickWin");
    }
  } else {
    consecutiveWins = 0;
  }

  checkPersistentPlayer();

  localStorage.setItem("consecutiveWins", consecutiveWins);
  localStorage.setItem("stats", JSON.stringify(stats));
}

function unlockAchievement(achievementKey) {
  achievements[achievementKey].unlocked = true;
  showModal(`Achievement Unlocked: ${achievements[achievementKey].name}!`);
  saveAchievements();
}

function checkPersistentPlayer() {
  const lastPlayedDates =
    JSON.parse(localStorage.getItem("lastPlayedDates")) || [];
  const currentDay = new Date().toDateString();

  if (!lastPlayedDates.includes(currentDay)) {
    lastPlayedDates.push(currentDay);
    if (lastPlayedDates.length > 5) {
      lastPlayedDates.shift();
    }
    localStorage.setItem("lastPlayedDates", JSON.stringify(lastPlayedDates));

    if (
      lastPlayedDates.length === 5 &&
      !achievements.persistentPlayer.unlocked
    ) {
      unlockAchievement("persistentPlayer");
    }
  }
}

let gameStartTime;

function startGame() {
  gameStartTime = new Date();
}

// Function to load achievements at the start of the game
function loadAchievements() {
  const savedAchievements = JSON.parse(localStorage.getItem("achievements"));
  if (savedAchievements) {
    for (let key in savedAchievements) {
      if (achievements.hasOwnProperty(key)) {
        achievements[key].unlocked = savedAchievements[key].unlocked;
      }
    }
  }
}

// Call this function when the game starts
window.onload = function () {
  loadAchievements();
  startGame();
};

function showModal(content) {
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  modalText.innerHTML = content;
  modal.style.display = "block";

  const closeBtn = modal.querySelector(".close");
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
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
            <li>Green: Correct letter in the correct position (Sweet as honey!)</li>
            <li>Yellow: Correct letter but in the wrong position (Almost there, busy bee!)</li>
            <li>Gray: Letter is not in the word (Buzz off, wrong letter!)</li>
        </ul>
        <li>Keep guessing until you find the correct bee or run out of attempts!</li>
    </ol>
    <p>Remember, bee positive and have fun!</p>
`;

document
  .getElementById("show-stats-button")
  .addEventListener("click", displayStats);

// Display game statistics
function displayStats() {
  const statsContent = `
        <h2>Hive Statistics</h2>
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-number">${stats.gamesPlayed}</div>
                <div>Games Pollinated</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${
                  Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0
                }%</div>
                <div>Honey Success Rate</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.currentStreak}</div>
                <div>Current Swarm</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${stats.maxStreak}</div>
                <div>Longest Honey Streak</div>
            </div>
        </div>
        <h3>Guess Distribution (Honey Levels)</h3>
        <div class="guess-distribution">
            ${stats.guessDistribution
              .map(
                (count, index) => `
                <div class="guess-bar">
                    <div class="guess-label">${index + 1}</div>
                    <div class="guess-count" style="width: ${
                      (count / Math.max(...stats.guessDistribution)) * 100
                    }%">${count}</div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  showModal(statsContent);
}

function resetAllData() {
  localStorage.removeItem("consecutiveWins");
  localStorage.removeItem("achievements");
  localStorage.removeItem("stats");
  localStorage.removeItem("lastPlayedDates");
  location.reload();
}

// Add a button or some way to call this function for testing purposes
document.getElementById("reset-button").addEventListener("click", () => {
  if (
    confirm(
      "Are you sure you want to reset all data? This action cannot bee undone."
    )
  ) {
    resetAllData();
  }
});
