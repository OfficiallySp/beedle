// Bee Match - Memory Game
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const gameBoard = document.getElementById("game-board");
  const newGameButton = document.getElementById("new-game-button");
  const pairsCount = document.getElementById("pairs-count");
  const totalPairs = document.getElementById("total-pairs");
  const timeCount = document.getElementById("time-count");
  const difficultyButtons = document.querySelectorAll(".difficulty-button");
  const soundToggle = document.getElementById("sound-toggle");
  const statsButton = document.getElementById("show-stats-button");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close");
  const themeToggle = document.getElementById("theme-toggle");
  const navbarToggle = document.getElementById("navbar-toggle");
  const navbar = document.querySelector(".navbar");

  // Handle theme toggle
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", themeToggle.checked);
  });

  // Handle navbar toggle
  navbarToggle.addEventListener("click", () => {
    navbar.classList.toggle("expanded");
  });

  // Handle active navigation
  const navLinks = document.querySelectorAll("#navbar-menu a");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Game state
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let totalPairsInGame = 8; // Default easy difficulty
  let gameActive = false;
  let timer = 0;
  let timerInterval;
  let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

  // Available memory images
  const memoryImages = [
    "Mythic_Egg", "Gold_Egg", "Cloud_Vial", "Red_Extract", "Blue_Extract",
    "Star_Treat", "Star_Egg", "Tropical_Drink", "Star_Jelly", "Coconut",
    "Stinger", "Glue", "Diamond_Egg", "Night_Bell", "Glitter",
    "Enzymes", "Oil", "Magic_Bean", "Field_Dice", "Micro-Converter",
    "Jelly_Beans", "Honeysuckle", "Ticket", "Moon_Charm", "Gumdrops",
    "Royal_Jelly", "Pineapple", "Strawberry", "Blueberry", "Sunflower_Seed", "Treat"
  ];

  // Sounds
  const sounds = {
    flip: new Audio("sound/flip.mp3"),
    match: new Audio("sound/letter_correct.mp3"),
    noMatch: new Audio("sound/letter_present.mp3"),
    victory: new Audio("sound/correct.mp3")
  };

  // Initialize and load game stats
  let gameStats = {
    gamesPlayed: 0,
    bestTime: {
      easy: Infinity,
      medium: Infinity,
      hard: Infinity,
      extreme: Infinity
    }
  };

  // Load game stats from localStorage
  function loadGameStats() {
    const savedStats = localStorage.getItem("beeMatchStats");
    if (savedStats) {
      gameStats = JSON.parse(savedStats);
      // Add extreme difficulty if it doesn't exist in saved stats
      if (gameStats.bestTime && !gameStats.bestTime.extreme) {
        gameStats.bestTime.extreme = Infinity;
      }
    }
  }

  // Save game stats to localStorage
  function saveGameStats() {
    localStorage.setItem("beeMatchStats", JSON.stringify(gameStats));
  }

  // Initialize the game
  function init() {
    loadGameStats();
    soundToggle.checked = soundEnabled;

    // Set up event listeners
    newGameButton.addEventListener("click", startNewGame);
    soundToggle.addEventListener("change", toggleSound);
    statsButton.addEventListener("click", showStats);
    closeModal.addEventListener("click", closeModalDialog);

    // Set up difficulty buttons
    difficultyButtons.forEach(button => {
      button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        totalPairsInGame = parseInt(button.dataset.pairs);
        totalPairs.textContent = totalPairsInGame;
        startNewGame();
      });
    });

    // Start a new game
    startNewGame();
  }

  // Start a new game
  function startNewGame() {
    // Reset game state
    clearInterval(timerInterval);
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;
    timer = 0;
    timeCount.textContent = "0";
    pairsCount.textContent = "0";
    gameActive = true;

    // Create game cards
    createGameCards();

    // Start timer
    timerInterval = setInterval(() => {
      timer++;
      timeCount.textContent = timer;
    }, 1000);
  }

  // Create game cards
  function createGameCards() {
    // Shuffle and select memory items for the current game
    const shuffledMemory = [...memoryImages].sort(() => 0.5 - Math.random());
    const selectedMemory = shuffledMemory.slice(0, totalPairsInGame);

    // Create pairs of cards (duplicate each memory item)
    cards = [...selectedMemory, ...selectedMemory]
      .sort(() => 0.5 - Math.random())
      .map((item, index) => ({
        id: index,
        name: item,
        image: `memory/${item}.png`,
        isFlipped: false,
        isMatched: false
      }));

    // Set difficulty attribute for responsive styling
    const difficulty = getDifficulty();
    gameBoard.setAttribute('data-difficulty', difficulty);

    // Adjust grid columns based on difficulty
    if (totalPairsInGame <= 8) {
      gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else if (totalPairsInGame <= 12) {
      gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
    } else if (totalPairsInGame <= 18) {
      gameBoard.style.gridTemplateColumns = "repeat(6, 1fr)";
    } else {
      gameBoard.style.gridTemplateColumns = "repeat(8, 1fr)";
    }

    // Render the cards
    renderCards();
  }

  // Render the cards on the game board
  function renderCards() {
    gameBoard.innerHTML = "";

    cards.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      if (card.isFlipped) cardElement.classList.add("flipped");
      if (card.isMatched) cardElement.classList.add("matched");

      // Card back (showing when unflipped)
      const cardBack = document.createElement("div");
      cardBack.className = "card-face card-back";
      // Card front (showing when flipped)
      const cardFront = document.createElement("div");
      cardFront.className = "card-face card-front";

      const cardImage = document.createElement("img");
      cardImage.className = "card-image";
      cardImage.src = card.image;
      cardImage.alt = card.name;

      cardFront.appendChild(cardImage);
      cardElement.appendChild(cardBack);
      cardElement.appendChild(cardFront);

      // Add click event listener
      cardElement.addEventListener("click", () => flipCard(card));

      gameBoard.appendChild(cardElement);
    });
  }

  // Flip a card
  function flipCard(card) {
    // Return if game not active, card already flipped or matched, or two cards already flipped
    if (!gameActive || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    // Play flip sound
    playSound(sounds.flip);

    // Update card state
    card.isFlipped = true;
    flippedCards.push(card);

    // Render cards to reflect changes
    renderCards();

    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
      checkForMatch();
    }
  }

  // Check if the two flipped cards match
  function checkForMatch() {
    setTimeout(() => {
      const [card1, card2] = flippedCards;

      if (card1.name === card2.name) {
        // Cards match
        card1.isMatched = true;
        card2.isMatched = true;
        matchedPairs++;
        pairsCount.textContent = matchedPairs;
        playSound(sounds.match);

        // Check for game completion
        if (matchedPairs === totalPairsInGame) {
          gameComplete();
        }
      } else {
        // Cards don't match - flip them back
        card1.isFlipped = false;
        card2.isFlipped = false;
        playSound(sounds.noMatch);
      }

      flippedCards = [];
      renderCards();
    }, 800); // Delay to show both cards briefly
  }

  // Game completion
  function gameComplete() {
    clearInterval(timerInterval);
    gameActive = false;
    playSound(sounds.victory);

    // Update game stats
    const difficulty = getDifficulty();
    gameStats.gamesPlayed++;

    if (timer < gameStats.bestTime[difficulty] || gameStats.bestTime[difficulty] === Infinity) {
      gameStats.bestTime[difficulty] = timer;
    }

    saveGameStats();

    // Show game complete message
    const gameCompleteMessage = document.createElement("div");
    gameCompleteMessage.className = "game-complete";
    gameCompleteMessage.textContent = `Game Complete in ${timer} seconds!`;
    gameBoard.appendChild(gameCompleteMessage);
  }

  // Get current difficulty level as string
  function getDifficulty() {
    if (totalPairsInGame <= 8) return "easy";
    if (totalPairsInGame <= 12) return "medium";
    if (totalPairsInGame <= 18) return "hard";
    return "extreme";
  }

  // Toggle sound
  function toggleSound() {
    soundEnabled = soundToggle.checked;
    localStorage.setItem("soundEnabled", soundEnabled);
  }

  // Play sound if enabled
  function playSound(sound) {
    if (soundEnabled && sound) {
      sound.play().catch(() => {
        // Silent error handling for browsers that block autoplay
      });
    }
  }

  // Show game stats
  function showStats() {
    let statsHtml = `
      <h2>Memory Match Stats</h2>
      <p>Games Played: ${gameStats.gamesPlayed}</p>
      <h3>Best Times:</h3>
      <ul>
        <li>Easy: ${gameStats.bestTime.easy === Infinity ? "None" : gameStats.bestTime.easy + " seconds"}</li>
        <li>Medium: ${gameStats.bestTime.medium === Infinity ? "None" : gameStats.bestTime.medium + " seconds"}</li>
        <li>Hard: ${gameStats.bestTime.hard === Infinity ? "None" : gameStats.bestTime.hard + " seconds"}</li>
        <li>Extreme: ${gameStats.bestTime.extreme === Infinity ? "None" : gameStats.bestTime.extreme + " seconds"}</li>
      </ul>
    `;

    modalText.innerHTML = statsHtml;
    modal.style.display = "block";
  }

  // Close the modal dialog
  function closeModalDialog() {
    modal.style.display = "none";
  }

  // Initialize game when DOM is loaded
  init();
});
