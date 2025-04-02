document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const gameModesSection = document.getElementById("game-modes");
  const gameContentSection = document.getElementById("game-content");
  const gameResultsSection = document.getElementById("game-results");
  const modeOptions = document.querySelectorAll(".mode-option");
  const startGameBtn = document.getElementById("start-game");
  const nextQuestionBtn = document.getElementById("next-question");
  const categoryCheckboxes = document.querySelectorAll("#categories input");
  const playAgainBtn = document.getElementById("play-again");
  const changeModeBtn = document.getElementById("change-mode");
  const showStatsBtn = document.getElementById("show-stats-button");
  const showAchievementsBtn = document.getElementById("show-achievements-button");
  const soundToggle = document.getElementById("sound-toggle");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close");
  const hintBtn = document.getElementById("hint-button");

  // Game state
  const gameState = {
    mode: null,
    categories: [],
    currentQuestion: 0,
    totalQuestions: 0,
    score: 0,
    correctAnswers: 0,
    startTime: 0,
    timerInterval: null,
    selectedOptionIndex: null,
    questionBank: [],
    lastQuestionTime: 0,
    isAnswered: false,
    timeLimit: 120, // 2 minutes for timed mode
    difficultyLevel: 1, // 1-10 for challenge mode
    usedQuestions: [],
    currentHint: "",
    hintsUsed: 0,
    currentStreak: 0,
    maxStreak: 0,
    achievements: {},
    stats: {
      gamesPlayed: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      hintsUsed: 0,
      highScores: {
        timed: 0,
        endless: 0,
        challenge: 0
      },
      categoryStats: {
        bees: 0,
        fields: 0,
        items: 0,
        mechanics: 0,
        bears: 0,
        monsters: 0
      },
      maxStreak: 0
    }
  };

  // Load stats from local storage
  function loadStats() {
    const savedStats = localStorage.getItem("bssTrivia_stats");
    if (savedStats) {
      gameState.stats = JSON.parse(savedStats);
    }
  }

  // Save stats to local storage
  function saveStats() {
    localStorage.setItem("bssTrivia_stats", JSON.stringify(gameState.stats));
  }

  // Load game data
  loadStats();
  loadAchievements();

  // Sound effects
  const sounds = {
    correct: new Audio("sounds/collect.mp3"),
    incorrect: new Audio("sounds/oof.mp3"),
    start: new Audio("sounds/teleport.mp3"),
    gameOver: new Audio("sounds/teleport.mp3"),
    select: new Audio("sounds/select.mp3")
  };

  // Play sound if enabled
  function playSound(sound) {
    if (soundToggle.checked) {
      sounds[sound].currentTime = 0;
      sounds[sound].play().catch(e => console.log("Sound play error:", e));
    }
  }

  // Trivia Questions Database
  // Each question has: text, answers (array), correctAnswer (index), difficulty (1-10), category, explanation (optional), imageUrl (optional)
  const triviaQuestions = [
    // Bees category
    {
      text: "Which bee in Bee Swarm Simulator produces the most honey per pollen?",
      answers: ["Basic Bee", "Honey Bee", "Exhausted Bee", "Gifted Honey Bee"],
      correctAnswer: 3,
      difficulty: 2,
      category: "bees",
      explanation: "Gifted Honey Bee has a +50% honey per pollen bonus and a gifted hive bonus that increases honey production by 5%."
    },
    {
      text: "Which of these is NOT a legendary bee in Bee Swarm Simulator?",
      answers: ["Music Bee", "Diamond Bee", "Shy Bee", "Carpenter Bee"],
      correctAnswer: 2,
      difficulty: 3,
      category: "bees",
      explanation: "Shy Bee is a rare bee, not a legendary bee. The legendary bees are Music, Diamond, Carpenter, Baby, Demon, Lion, and Ninja."
    },
    {
      text: "What is the rarest bee rarity in the game?",
      answers: ["Legendary", "Epic", "Mythic", "Event"],
      correctAnswer: 2,
      difficulty: 1,
      category: "bees",
      explanation: "Mythic bees are the rarest regular bees, with a 1/25,000 chance from a royal jelly."
    },
    {
      text: "Which of these is an Event bee?",
      answers: ["Vector Bee", "Spicy Bee", "Tabby Bee", "Fuzzy Bee"],
      correctAnswer: 2,
      difficulty: 2,
      category: "bees",
      explanation: "Tabby Bee is an Event bee that can be purchased with tickets. Vector, Spicy, and Fuzzy are Mythic bees."
    },
    {
      text: "How many bees are required to access the 35 bee zone?",
      answers: ["30 bees", "35 bees", "40 bees", "25 bees"],
      correctAnswer: 1,
      difficulty: 4,
      category: "bees",
      explanation: "You need exactly 35 bees to access the 35 bee zone where the Coconut Crab can be found."
    },
    {
      text: "Which bee produces Bomb tokens?",
      answers: ["Bomber Bee", "Demo Bee", "Rage Bee", "Fire Bee"],
      correctAnswer: 0,
      difficulty: 2,
      category: "bees",
      explanation: "Bomber Bee is known for producing Bomb tokens which create bomb explosions that collect pollen."
    },
    {
      text: "Which bee has the ability 'Blue Bomb Sync'?",
      answers: ["Buoyant Bee", "Tadpole Bee", "Frosty Bee", "Cool Bee"],
      correctAnswer: 0,
      difficulty: 5,
      category: "bees",
      explanation: "Buoyant Bee has the Blue Bomb Sync ability, which creates synchronized blue bomb explosions."
    },
    {
      text: "What color is Vicious Bee?",
      answers: ["Red", "Blue", "Black", "Purple"],
      correctAnswer: 2,
      difficulty: 1,
      category: "bees",
      explanation: "Vicious Bee is black with red eyes and is known for its spike attack."
    },

    // Fields category
    {
      text: "Which field has the most flowers?",
      answers: ["Sunflower Field", "Mountain Top Field", "Pineapple Patch", "Cactus Field"],
      correctAnswer: 1,
      difficulty: 4,
      category: "fields",
      explanation: "Mountain Top Field has 441 flowers, the most in any field. Sunflower Field has 225, Pineapple has 324, and Cactus has 169."
    },
    {
      text: "What pollen type is the Strawberry Field?",
      answers: ["Red", "Blue", "White", "Mixed Red/White"],
      correctAnswer: 0,
      difficulty: 1,
      category: "fields",
      explanation: "The Strawberry Field produces red pollen."
    },
    {
      text: "Which field is guarded by the Coconut Crab?",
      answers: ["Coconut Field", "Stump Field", "Pepper Patch", "Pineapple Patch"],
      correctAnswer: 0,
      difficulty: 3,
      category: "fields",
      explanation: "The Coconut Crab spawns in the Coconut Field, which is in the 35 bee zone."
    },
    {
      text: "What's special about the Stump Field?",
      answers: ["It has no tokens", "It only grows at night", "It has no monsters", "It cannot be boosted"],
      correctAnswer: 0,
      difficulty: 5,
      category: "fields",
      explanation: "The Stump Field is the only field with no tokens (apart from stick bug tokens)."
    },
    {
      text: "Which field is located highest in the map?",
      answers: ["Pepper Patch", "Mountain Top Field", "Rose Field", "Clover Field"],
      correctAnswer: 0,
      difficulty: 4,
      category: "fields",
      explanation: "Pepper Patch is located in the 35 Bee Zone at the highest point on the map."
    },
    {
      text: "Which field is best for blue pollen?",
      answers: ["Bamboo Field", "Pine Tree Forest", "Blue Flower Field", "Cactus Field"],
      correctAnswer: 2,
      difficulty: 1,
      category: "fields",
      explanation: "Blue Flower Field is specifically designed for collecting blue pollen."
    },
    {
      text: "Which field has the Stick Bug challenge?",
      answers: ["Any field", "Sunflower Field", "Pineapple Patch", "Clover Field"],
      correctAnswer: 0,
      difficulty: 3,
      category: "fields",
      explanation: "The Stick Bug challenge can occur in any field, as Stick Bug moves between fields during the challenge."
    },
    {
      text: "Which field is best for collecting white pollen?",
      answers: ["Spider Field", "Pineapple Patch", "Mountain Top Field", "Coconut Field"],
      correctAnswer: 2,
      difficulty: 2,
      category: "fields",
      explanation: "Mountain Top Field is the best field for white pollen due to its high flower count and white pollen type."
    },

    // Items category
    {
      text: "Which item is used to transform a regular bee into its gifted version?",
      answers: ["Royal Jelly", "Star Jelly", "Star Treat", "Atomic Treat"],
      correctAnswer: 2,
      difficulty: 2,
      category: "items",
      explanation: "Star Treats are the only items guaranteed to make a bee gifted while preserving its type."
    },
    {
      text: "What does a Field Dice do?",
      answers: ["Changes your movement speed", "Randomizes field boosts", "Transforms field flowers", "Creates more tokens"],
      correctAnswer: 1,
      difficulty: 3,
      category: "items",
      explanation: "Field Dice randomize field boosts when used."
    },
    {
      text: "Which item is NOT a code item?",
      answers: ["Atomic Treat", "Marshmallow Bee", "Wealth Clock", "Super Smoothie"],
      correctAnswer: 3,
      difficulty: 6,
      category: "items",
      explanation: "Super Smoothie is crafted, not obtained through codes. The others were available through codes."
    },
    {
      text: "What do you need to craft a Glue?",
      answers: ["50 Gumdrops", "100 Gumdrops", "10 Enzymes + 3 Oil", "5 Royal Jellies + 10 Gumdrops"],
      correctAnswer: 0,
      difficulty: 4,
      category: "items",
      explanation: "It takes 50 Gumdrops to craft a single Glue."
    },
    {
      text: "What does the Purple Potion do?",
      answers: ["Increases luck", "Gives 10x purple flower pollen", "Makes purple flowers", "Creates special tokens"],
      correctAnswer: 2,
      difficulty: 5,
      category: "items",
      explanation: "The Purple Potion temporarily makes all flowers in a field purple."
    },
    {
      text: "What is the most expensive item in the Ticket Tent?",
      answers: ["Star Treat", "Photon Bee", "Night Bell", "Tabby Bee"],
      correctAnswer: 0,
      difficulty: 3,
      category: "items",
      explanation: "Star Treat costs 1,000 tickets, making it the most expensive item in the Ticket Tent."
    },
    {
      text: "What does the Coconut Canister provide?",
      answers: ["Increased pollen capacity", "Coconut collection boost", "Ability to craft coconut items", "All of the above"],
      correctAnswer: 3,
      difficulty: 4,
      category: "items",
      explanation: "The Coconut Canister provides increased capacity, coconut collection boost, and the ability to craft coconut items."
    },
    {
      text: "Which item can be used to instantly convert all your pollen to honey?",
      answers: ["Instant Converter", "Micro-Converter", "Honey Pot", "Honey Dispenser"],
      correctAnswer: 0,
      difficulty: 2,
      category: "items",
      explanation: "The Instant Converter allows you to instantly convert all your pollen to honey without returning to your hive."
    },

    // Game Mechanics
    {
      text: "What happens when you donate a Mythic Egg to the Wind Shrine?",
      answers: ["You get a Spirit Bear quest", "Guaranteed Wild Windy Bee", "Huge boost to favor", "Nothing special"],
      correctAnswer: 2,
      difficulty: 7,
      category: "mechanics",
      explanation: "Donating a Mythic Egg gives a very large boost to favor with the Wind Shrine."
    },
    {
      text: "How many tiers of badges are there for each category?",
      answers: ["4", "5", "6", "7"],
      correctAnswer: 1,
      difficulty: 3,
      category: "mechanics",
      explanation: "There are 5 tiers of badges: Cadet, Hotshot, Ace, Master, and Grandmaster."
    },
    {
      text: "What's the maximum level a bee can reach?",
      answers: ["15", "20", "25", "18"],
      correctAnswer: 1,
      difficulty: 5,
      category: "mechanics",
      explanation: "Bees can reach level 20 as their maximum level."
    },
    {
      text: "What is 'Instant Conversion'?",
      answers: ["Converting at hive without animation", "Turning pollen to honey without returning to hive", "Converting resources instantly", "Generating honey instantly"],
      correctAnswer: 1,
      difficulty: 4,
      category: "mechanics",
      explanation: "Instant Conversion allows you to convert pollen to honey without returning to your hive."
    },
    {
      text: "Which buff allows you to collect multiple tokens at once?",
      answers: ["Haste", "Token Link", "Focus", "Gather"],
      correctAnswer: 1,
      difficulty: 3,
      category: "mechanics",
      explanation: "Token Link lets you collect multiple tokens simultaneously when you collect one token."
    },
    {
      text: "What does the 'Critical Power' stat affect?",
      answers: ["Chance of critical hits", "Damage of critical hits", "Speed of critical hits", "Number of critical hits"],
      correctAnswer: 1,
      difficulty: 3,
      category: "mechanics",
      explanation: "Critical Power affects the multiplier applied to pollen when a critical hit occurs."
    },
    {
      text: "What is the main purpose of the Wealth Clock?",
      answers: ["Increases honey production", "Gives free items every hour", "Tracks playtime", "Boosts field capacity"],
      correctAnswer: 1,
      difficulty: 2,
      category: "mechanics",
      explanation: "The Wealth Clock gives free honey and occasionally other items every hour you play."
    },
    {
      text: "What happens when you use a Micro-Converter?",
      answers: ["Converts 5% of your pollen to honey", "Increases conversion rate", "Gives instant honey", "Reduces conversion time"],
      correctAnswer: 0,
      difficulty: 2,
      category: "mechanics",
      explanation: "A Micro-Converter instantly converts 5% of your pollen to honey."
    },

    // Bears & Quests
    {
      text: "Which bear gives the Star Treat as a final quest reward?",
      answers: ["Black Bear", "Mother Bear", "Brown Bear", "Panda Bear"],
      correctAnswer: 1,
      difficulty: 3,
      category: "bears",
      explanation: "Mother Bear gives a Star Treat after completing all of her quests."
    },
    {
      text: "How many quests does Black Bear offer in total?",
      answers: ["15", "20", "Unlimited", "25"],
      correctAnswer: 2,
      difficulty: 2,
      category: "bears",
      explanation: "Black Bear offers an unlimited number of quests that repeat after completing all of them."
    },
    {
      text: "Which bear requires you to defeat monsters?",
      answers: ["Mother Bear", "Panda Bear", "Science Bear", "Spirit Bear"],
      correctAnswer: 1,
      difficulty: 1,
      category: "bears",
      explanation: "Panda Bear's quests typically involve defeating monsters."
    },
    {
      text: "Which bear is NOT located on the mountain?",
      answers: ["Brown Bear", "Black Bear", "Polar Bear", "Mother Bear"],
      correctAnswer: 1,
      difficulty: 2,
      category: "bears",
      explanation: "Black Bear is located near the Red HQ, not on the mountain."
    },
    {
      text: "Who is the most challenging bear to complete all quests for?",
      answers: ["Spirit Bear", "Stick Bug", "Science Bear", "Sun Bear"],
      correctAnswer: 0,
      difficulty: 4,
      category: "bears",
      explanation: "Spirit Bear offers the most challenging quest line, requiring endgame preparation and resources."
    },
    {
      text: "Which bear focuses on teaching you about bee types and abilities?",
      answers: ["Mother Bear", "Black Bear", "Science Bear", "Bee Bear"],
      correctAnswer: 0,
      difficulty: 2,
      category: "bears",
      explanation: "Mother Bear's quests focus on teaching players about different bee types and their abilities."
    },
    {
      text: "Which bear is only available during certain events?",
      answers: ["Dapper Bear", "Sun Bear", "Bee Bear", "Both B and C"],
      correctAnswer: 3,
      difficulty: 3,
      category: "bears",
      explanation: "Both Sun Bear and Bee Bear are only available during special events in the game."
    },
    {
      text: "What is Onett's role in the game?",
      answers: ["Just another quest bear", "The game's developer and a character", "A special event bear", "The king of all bears"],
      correctAnswer: 1,
      difficulty: 2,
      category: "bears",
      explanation: "Onett is both the developer of Bee Swarm Simulator and appears as a character in the game who gives quests."
    },

    // Monsters & Bosses
    {
      text: "Which boss has the highest health in the game?",
      answers: ["King Beetle", "Tunnel Bear", "Coconut Crab", "Mondo Chick"],
      correctAnswer: 2,
      difficulty: 3,
      category: "monsters",
      explanation: "Coconut Crab has the highest health of any boss in the game, making it one of the most challenging to defeat."
    },
    {
      text: "How often does the King Beetle respawn?",
      answers: ["12 hours", "24 hours", "48 hours", "72 hours"],
      correctAnswer: 1,
      difficulty: 2,
      category: "monsters",
      explanation: "King Beetle respawns every 24 hours after being defeated."
    },
    {
      text: "Which monster drops Stingers?",
      answers: ["Rhino Beetles", "Mantises", "Werewolves", "Spiders"],
      correctAnswer: 1,
      difficulty: 3,
      category: "monsters",
      explanation: "Mantises have a chance to drop Stingers when defeated."
    },
    {
      text: "Where can you find the Stump Snail?",
      answers: ["Stump Field", "Pine Tree Forest", "Bamboo Field", "Spider Field"],
      correctAnswer: 0,
      difficulty: 2,
      category: "monsters",
      explanation: "The Stump Snail is found in the Stump Field and has extremely high health."
    },
    {
      text: "What do you get for defeating the Tunnel Bear?",
      answers: ["Star Jelly", "Royal Jelly", "Tickets", "Honey"],
      correctAnswer: 0,
      difficulty: 3,
      category: "monsters",
      explanation: "Tunnel Bear drops Star Jelly when defeated, which can transform a bee into a random bee type."
    },
    {
      text: "What happens if you defeat the Commando Chick multiple times?",
      answers: ["You get more royal jellies", "It gets stronger", "Its respawn time increases", "It drops better loot"],
      correctAnswer: 1,
      difficulty: 4,
      category: "monsters",
      explanation: "The Commando Chick gets stronger (higher level) each time you defeat it, making subsequent battles more challenging."
    },
    {
      text: "Which monster can steal your pollen while you're collecting?",
      answers: ["Vicious Bee", "Mondo Chick", "Aphids", "Werewolf"],
      correctAnswer: 2,
      difficulty: 5,
      category: "monsters",
      explanation: "Aphids can steal the pollen you're collecting when they're present in a field."
    },
    {
      text: "What is special about the Cave Monsters?",
      answers: ["They only appear at night", "They can't be defeated", "They respawn immediately", "They have a chance to drop amulets"],
      correctAnswer: 3,
      difficulty: 6,
      category: "monsters",
      explanation: "Cave Monsters (such as the Spider) have a chance to drop amulets when defeated."
    },
    {
      text: "What is required to summon Wild Windy Bee?",
      answers: ["Donate items to Wind Shrine", "Complete Spirit Bear's quests", "Use a special item", "Find it in specific fields"],
      correctAnswer: 0,
      difficulty: 4,
      category: "monsters",
      explanation: "Donating items to the Wind Shrine has a chance to summon the Wild Windy Bee depending on your favor level."
    },

    // Events & Features
    {
      text: "What happens during the Honeystorm event?",
      answers: ["Honey rains from the sky", "All bees get boosted", "Monsters spawn everywhere", "Fields get special boosts"],
      correctAnswer: 0,
      difficulty: 3,
      category: "mechanics",
      explanation: "During a Honeystorm, tokens rain from the sky that can be collected for honey and other rewards."
    },
    {
      text: "What is Beesmas?",
      answers: ["A special skin for bees", "A holiday-themed event", "A special bear", "A limited-time field"],
      correctAnswer: 1,
      difficulty: 2,
      category: "mechanics",
      explanation: "Beesmas is a holiday-themed event that occurs annually around December and January with special quests and items."
    },
    {
      text: "What does the Night Bell do?",
      answers: ["Summons night-only monsters", "Makes the game permanently night", "Toggles between day and night", "Creates a honey storm"],
      correctAnswer: 2,
      difficulty: 3,
      category: "items",
      explanation: "The Night Bell toggles between day and night when used."
    },
    {
      text: "What is required to unlock the Petal Wand?",
      answers: ["100 tickets", "Complete all Spirit Bear quests", "Defeat 10 King Beetles", "Collect 10 Spirit Petals"],
      correctAnswer: 1,
      difficulty: 5,
      category: "items",
      explanation: "You need to complete all of Spirit Bear's quests to unlock the Petal Wand."
    },

    // Advanced Game Mechanics
    {
      text: "What determines a bee's attack power?",
      answers: ["Bee level only", "Bee rarity only", "Bee level and bee type", "Bee energy"],
      correctAnswer: 2,
      difficulty: 5,
      category: "mechanics",
      explanation: "A bee's attack power is determined by both its level and its type (different bee types have different base attack values)."
    },
    {
      text: "What happens when bees become tired?",
      answers: ["They stop producing tokens", "They move slower", "They convert less pollen", "All of the above"],
      correctAnswer: 3,
      difficulty: 4,
      category: "mechanics",
      explanation: "When bees become tired, they produce tokens less frequently, move slower, and convert less pollen."
    },
    {
      text: "How do you increase your Critical Chance?",
      answers: ["Collect focus tokens", "Feed your bees strawberries", "Use the critical chance passive", "All of the above"],
      correctAnswer: 3,
      difficulty: 6,
      category: "mechanics",
      explanation: "Critical Chance can be increased through focus tokens, feeding strawberries to bees, and equipping items with the critical chance passive."
    },
    {
      text: "What does 'Super Critical Chance' affect?",
      answers: ["Chance for larger critical hits", "Chance for multiple critical hits", "Chance for special tokens", "Chance to collect double pollen"],
      correctAnswer: 0,
      difficulty: 7,
      category: "mechanics",
      explanation: "Super Critical Chance affects the probability of getting super critical hits, which collect even more pollen than regular critical hits."
    },

    // Bee Types & Abilities
    {
      text: "Which bee can create tornadoes?",
      answers: ["Windy Bee", "Vector Bee", "Vicious Bee", "Cobalt Bee"],
      correctAnswer: 0,
      difficulty: 3,
      category: "bees",
      explanation: "Windy Bee can create tornadoes that collect pollen from flowers in their path."
    },
    {
      text: "What special token does Baby Bee produce?",
      answers: ["Link", "Bomb+", "Impale", "Love"],
      correctAnswer: 3,
      difficulty: 2,
      category: "bees",
      explanation: "Baby Bee produces Love tokens, which can grant bonus pollen and increase bee move speed temporarily."
    },
    {
      text: "Which bee produces the most bomb tokens?",
      answers: ["Bomber Bee", "Demo Bee", "Ninja Bee", "Digital Bee"],
      correctAnswer: 1,
      difficulty: 4,
      category: "bees",
      explanation: "Demo Bee is known for producing the most bomb tokens compared to other bees."
    },
    {
      text: "Which bees are in the Fuzzy Bee's hive bonus set?",
      answers: ["Fuzzy, Tadpole, Vector", "Fuzzy, Spicy, Vector", "Fuzzy, Vector, Buoyant", "Fuzzy, Precise, Spicy"],
      correctAnswer: 0,
      difficulty: 8,
      category: "bees",
      explanation: "The Fuzzy Bee's hive bonus set includes Fuzzy Bee, Tadpole Bee, and Vector Bee."
    },

    // Community & Developer
    {
      text: "Who is the developer of Bee Swarm Simulator?",
      answers: ["Onett", "Badcc", "BeeSwarmDev", "Megurine"],
      correctAnswer: 0,
      difficulty: 1,
      category: "bears",
      explanation: "Onett is the developer of Bee Swarm Simulator, and also appears as a character in the game."
    },
    {
      text: "What is the name of the community-created wiki for Bee Swarm Simulator?",
      answers: ["BSS Wiki", "Bee Swarm Wiki", "Bee Swarm Simulator Wiki", "Onett's BSS Wiki"],
      correctAnswer: 2,
      difficulty: 2,
      category: "mechanics",
      explanation: "The Bee Swarm Simulator Wiki is a community-created resource with detailed information about the game."
    }
  ];

  // Initialize game
  function init() {
    // Mode selection
    modeOptions.forEach(option => {
      option.addEventListener("click", () => {
        modeOptions.forEach(opt => opt.classList.remove("selected"));
        option.classList.add("selected");
        gameState.mode = option.dataset.mode;
        playSound("select");
      });
    });

    // Start game button
    startGameBtn.addEventListener("click", startGame);

    // Next question button
    nextQuestionBtn.addEventListener("click", showNextQuestion);

    // Play again button
    playAgainBtn.addEventListener("click", () => {
      gameResultsSection.classList.add("hidden");
      gameModesSection.classList.remove("hidden");
      playSound("select");
    });

    // Change mode button
    changeModeBtn.addEventListener("click", () => {
      gameResultsSection.classList.add("hidden");
      gameModesSection.classList.remove("hidden");
      playSound("select");
    });

    // Show stats button
    showStatsBtn.addEventListener("click", showStats);

    // Show achievements button
    if (showAchievementsBtn) {
      showAchievementsBtn.addEventListener("click", showAchievements);
    }

    // Hint button
    if (hintBtn) {
      hintBtn.addEventListener("click", showHint);
    }

    // Modal close button
    closeModal.onclick = () => {
      modal.style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // Start the game
  function startGame() {
    // Check if mode is selected
    if (!gameState.mode) {
      showMessage("Please select a game mode");
      return;
    }

    // Check if at least one category is selected
    gameState.categories = [];
    categoryCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        gameState.categories.push(checkbox.value);
      }
    });

    if (gameState.categories.length === 0) {
      showMessage("Please select at least one category");
      return;
    }

    // Reset game state
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.correctAnswers = 0;
    gameState.usedQuestions = [];
    gameState.difficultyLevel = 1;
    clearInterval(gameState.timerInterval);

    // Update UI
    document.getElementById("score").textContent = "0";
    gameState.startTime = Date.now();

    // Set total questions based on mode
    if (gameState.mode === "challenge") {
      gameState.totalQuestions = 20;
    } else if (gameState.mode === "endless") {
      gameState.totalQuestions = 999; // Effectively unlimited
    } else { // timed mode
      gameState.totalQuestions = 999; // Will be limited by time instead
      startTimer();
    }

    document.getElementById("question-number").textContent = `1/${gameState.mode === "challenge" ? 20 : "∞"}`;

    // Build question bank from selected categories
    buildQuestionBank();

    // Switch sections
    gameModesSection.classList.add("hidden");
    gameContentSection.classList.remove("hidden");

    playSound("start");

    // Load first question
    loadQuestion();

    // Track game start in stats
    gameState.stats.gamesPlayed++;
  }

  // Build question bank based on selected categories
  function buildQuestionBank() {
    gameState.questionBank = triviaQuestions.filter(q => gameState.categories.includes(q.category));

    // If there are not enough questions, add all questions (fallback)
    if (gameState.questionBank.length < 20) {
      gameState.questionBank = [...triviaQuestions];
    }

    // Shuffle the question bank
    shuffleArray(gameState.questionBank);
  }

  // Shuffle array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Load question into UI
  function loadQuestion() {
    let question;

    // Choose question based on game mode
    if (gameState.mode === "challenge") {
      // In challenge mode, select questions based on difficulty level
      const availableQuestions = gameState.questionBank.filter(
        q => q.difficulty === gameState.difficultyLevel && !gameState.usedQuestions.includes(q.text)
      );

      if (availableQuestions.length > 0) {
        question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      } else {
        // If no questions at current difficulty, try next difficulty
        for (let i = 1; i <= 10; i++) {
          const nextDiffQuestions = gameState.questionBank.filter(
            q => q.difficulty === (gameState.difficultyLevel + i) % 10 + 1 &&
            !gameState.usedQuestions.includes(q.text)
          );

          if (nextDiffQuestions.length > 0) {
            question = nextDiffQuestions[Math.floor(Math.random() * nextDiffQuestions.length)];
            break;
          }
        }
      }
    } else {
      // For timed and endless modes, select random unused question
      // Weight questions by difficulty in timed mode
      if (gameState.mode === "timed") {
        const easyQuestions = gameState.questionBank.filter(q => q.difficulty <= 3 && !gameState.usedQuestions.includes(q.text));
        const mediumQuestions = gameState.questionBank.filter(q => q.difficulty > 3 && q.difficulty <= 6 && !gameState.usedQuestions.includes(q.text));
        const hardQuestions = gameState.questionBank.filter(q => q.difficulty > 6 && !gameState.usedQuestions.includes(q.text));

        // Determine which pool to pick from (50% easy, 30% medium, 20% hard)
        const rand = Math.random();
        let questionPool;

        if (rand < 0.5 && easyQuestions.length > 0) {
          questionPool = easyQuestions;
        } else if (rand < 0.8 && mediumQuestions.length > 0) {
          questionPool = mediumQuestions;
        } else if (hardQuestions.length > 0) {
          questionPool = hardQuestions;
        } else {
          // Fallback if any category is empty
          questionPool = gameState.questionBank.filter(q => !gameState.usedQuestions.includes(q.text));
        }

        if (questionPool.length > 0) {
          question = questionPool[Math.floor(Math.random() * questionPool.length)];
        }
      } else {
        // Endless mode - random selection
        const unusedQuestions = gameState.questionBank.filter(
          q => !gameState.usedQuestions.includes(q.text)
        );

        if (unusedQuestions.length > 0) {
          question = unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
        }
      }

      // If no question was selected (all used), reset used questions
      if (!question) {
        // Keep the most recent 5 questions as still used
        const recentQuestions = gameState.usedQuestions.slice(-5);
        gameState.usedQuestions = [...recentQuestions];

        const newUnusedQuestions = gameState.questionBank.filter(
          q => !gameState.usedQuestions.includes(q.text)
        );

        question = newUnusedQuestions[Math.floor(Math.random() * newUnusedQuestions.length)];
      }
    }

    // Add to used questions
    gameState.usedQuestions.push(question.text);

    // Reset hint for new question
    gameState.currentHint = generateHint(question);

    // Update hint button visibility based on difficulty
    if (question.difficulty >= 5 && !gameState.isAnswered) {
      hintBtn.classList.remove("hidden");
    } else {
      hintBtn.classList.add("hidden");
    }

    // Update UI with question
    document.getElementById("question-text").textContent = question.text;
    document.getElementById("difficulty-value").textContent =
      question.difficulty <= 3 ? "Easy" :
      question.difficulty <= 6 ? "Medium" : "Hard";
    document.getElementById("category-value").textContent =
      question.category.charAt(0).toUpperCase() + question.category.slice(1);

    // Load answers
    const answerOptions = document.querySelectorAll(".answer-option");
    answerOptions.forEach((option, index) => {
      option.querySelector(".answer-text").textContent = question.answers[index];
      option.classList.remove("selected", "correct", "incorrect");

      // Clear previous event listeners
      option.replaceWith(option.cloneNode(true));
    });

    // Add new event listeners
    document.querySelectorAll(".answer-option").forEach((option, index) => {
      option.addEventListener("click", () => selectAnswer(index, question));
    });

    // Handle optional question image
    const questionImageContainer = document.getElementById("question-image-container");
    if (question.imageUrl) {
      document.getElementById("question-image").src = question.imageUrl;
      questionImageContainer.classList.remove("hidden");
    } else {
      questionImageContainer.classList.add("hidden");
    }

    // Reset state for new question
    gameState.isAnswered = false;
    gameState.selectedOptionIndex = null;
    gameState.lastQuestionTime = Date.now();

    document.getElementById("feedback-message").classList.add("hidden");
    document.getElementById("next-question").classList.add("hidden");
  }

  // Select answer
  function selectAnswer(index, question) {
    // Prevent selecting multiple answers
    if (gameState.isAnswered) return;

    gameState.isAnswered = true;
    gameState.selectedOptionIndex = index;

    const answerOptions = document.querySelectorAll(".answer-option");
    const feedbackMessage = document.getElementById("feedback-message");
    const feedbackText = document.getElementById("feedback-text");
    const feedbackDetails = document.getElementById("feedback-details");

    // Mark selected answer
    answerOptions[index].classList.add("selected");

    // Check if correct
    const isCorrect = index === question.correctAnswer;

    // Add to stats
    gameState.stats.questionsAnswered++;

    if (isCorrect) {
      // Correct answer
      answerOptions[index].classList.add("correct");
      feedbackMessage.classList.remove("incorrect");
      feedbackText.textContent = "Correct!";

      // Update streak
      gameState.currentStreak++;
      if (gameState.currentStreak > gameState.maxStreak) {
        gameState.maxStreak = gameState.currentStreak;
        gameState.stats.maxStreak = gameState.maxStreak;
      }

      // Check for streak achievements
      if (gameState.currentStreak === 5) {
        unlockAchievement("streak5", "On Fire!", "Answer 5 questions correctly in a row");
      } else if (gameState.currentStreak === 10) {
        unlockAchievement("streak10", "Unstoppable!", "Answer 10 questions correctly in a row");
      } else if (gameState.currentStreak === 20) {
        unlockAchievement("streak20", "BSS Master!", "Answer 20 questions correctly in a row");
      }

      // Track category stats
      if (!gameState.stats.categoryStats) {
        gameState.stats.categoryStats = {
          bees: 0,
          fields: 0,
          items: 0,
          mechanics: 0,
          bears: 0,
          monsters: 0
        };
      }

      // Increment the counter for this category
      if (gameState.stats.categoryStats[question.category] !== undefined) {
        gameState.stats.categoryStats[question.category]++;

        // Check for category mastery achievements
        if (gameState.stats.categoryStats[question.category] === 10) {
          unlockAchievement(
            `${question.category}10`,
            `${question.category.charAt(0).toUpperCase() + question.category.slice(1)} Novice`,
            `Answer 10 ${question.category} questions correctly`
          );
        } else if (gameState.stats.categoryStats[question.category] === 25) {
          unlockAchievement(
            `${question.category}25`,
            `${question.category.charAt(0).toUpperCase() + question.category.slice(1)} Expert`,
            `Answer 25 ${question.category} questions correctly`
          );
        }
      }

      // Calculate score based on difficulty and time
      const timeTaken = (Date.now() - gameState.lastQuestionTime) / 1000;
      const timeBonus = Math.max(0, 10 - Math.floor(timeTaken / 2));
      const difficultyBonus = question.difficulty * 10;

      // Enhanced scoring - faster answers and harder questions give more points
      let pointsEarned = 100 + difficultyBonus + timeBonus;

      // Streak bonus for consecutive correct answers
      const streakBonus = Math.min(100, gameState.currentStreak * 5);
      pointsEarned += streakBonus;

      // Update the feedback with streak information
      feedbackDetails.innerHTML = `+${pointsEarned} points! (${difficultyBonus} difficulty, ${timeBonus} time, ${streakBonus} streak)<br>
      <span class="streak-counter">Current streak: ${gameState.currentStreak}</span>`;

      gameState.score += pointsEarned;
      gameState.correctAnswers++;
      gameState.stats.correctAnswers++;

      document.getElementById("score").textContent = gameState.score;

      playSound("correct");

      // In challenge mode, increase difficulty
      if (gameState.mode === "challenge") {
        gameState.difficultyLevel = Math.min(10, gameState.difficultyLevel + 1);
      }

      // Check for score achievements
      if (gameState.score >= 1000 && !gameState.achievements.score1000) {
        unlockAchievement("score1000", "Point Collector", "Score 1,000 points in a single game");
      } else if (gameState.score >= 5000 && !gameState.achievements.score5000) {
        unlockAchievement("score5000", "High Roller", "Score 5,000 points in a single game");
      }

      // Show next question button
      document.getElementById("next-question").classList.remove("hidden");
    } else {
      // Incorrect answer
      answerOptions[index].classList.add("incorrect");
      answerOptions[question.correctAnswer].classList.add("correct");

      feedbackMessage.classList.add("incorrect");
      feedbackText.textContent = "Incorrect!";

      // Reset streak
      gameState.currentStreak = 0;

      if (question.explanation) {
        feedbackDetails.textContent = question.explanation;
      } else {
        feedbackDetails.textContent = `The correct answer is: ${question.answers[question.correctAnswer]}`;
      }

      playSound("incorrect");

      // In endless mode, game over on first wrong answer
      if (gameState.mode === "endless") {
        setTimeout(() => {
          endGame();
        }, 2000);
      } else {
        // For other modes, show next question button
        document.getElementById("next-question").classList.remove("hidden");
      }
    }

    // Show feedback message
    feedbackMessage.classList.remove("hidden");
  }

  // Show next question
  function showNextQuestion() {
    gameState.currentQuestion++;

    // Check if game should end
    if (gameState.currentQuestion >= gameState.totalQuestions) {
      endGame();
      return;
    }

    // Update question counter
    document.getElementById("question-number").textContent =
      `${gameState.currentQuestion + 1}/${gameState.mode === "challenge" ? 20 : "∞"}`;

    // Load next question
    loadQuestion();
  }

  // End the game
  function endGame() {
    // Stop timer
    clearInterval(gameState.timerInterval);

    // Calculate stats
    const timePlayed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(timePlayed / 60);
    const seconds = timePlayed % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update high scores
    let isHighScore = false;
    if (gameState.score > gameState.stats.highScores[gameState.mode]) {
      gameState.stats.highScores[gameState.mode] = gameState.score;
      isHighScore = true;

      // Check for high score achievements
      if (gameState.mode === "timed" && gameState.score >= 2000) {
        unlockAchievement("timed2000", "Time Master", "Score 2,000+ points in Timed Mode");
      } else if (gameState.mode === "endless" && gameState.correctAnswers >= 15) {
        unlockAchievement("endless15", "Endurance Champion", "Answer 15+ questions correctly in Endless Mode");
      } else if (gameState.mode === "challenge" && gameState.score >= 3000) {
        unlockAchievement("challenge3000", "Challenge Conqueror", "Score 3,000+ points in Challenge Mode");
      }
    }

    // Save stats
    saveStats();

    // Update results UI
    document.getElementById("final-score").textContent = gameState.score;
    document.getElementById("correct-answers").textContent = gameState.correctAnswers;
    document.getElementById("total-questions").textContent = gameState.currentQuestion + 1;
    document.getElementById("accuracy").textContent =
      `${Math.round((gameState.correctAnswers / (gameState.currentQuestion + 1)) * 100)}%`;
    document.getElementById("time-played").textContent = timeString;

    // Show high score message if applicable
    const highScoreMessage = document.getElementById("high-score-message");
    if (isHighScore) {
      highScoreMessage.classList.remove("hidden");
    } else {
      highScoreMessage.classList.add("hidden");
    }

    // Switch sections
    gameContentSection.classList.add("hidden");
    gameResultsSection.classList.remove("hidden");

    playSound("gameOver");
  }

  // Start timer for timed mode
  function startTimer() {
    const timerElement = document.getElementById("timer");
    let timeRemaining = gameState.timeLimit;

    // Update timer immediately
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Set interval to update timer
    gameState.timerInterval = setInterval(() => {
      timeRemaining--;

      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      // End game when time runs out
      if (timeRemaining <= 0) {
        clearInterval(gameState.timerInterval);
        endGame();
      }
    }, 1000);
  }

  // Show message in modal
  function showMessage(message) {
    modalText.innerHTML = `<p>${message}</p>`;
    modal.style.display = "block";
  }

  // Show statistics
  function showStats() {
    const accuracy = gameState.stats.questionsAnswered > 0
      ? Math.round((gameState.stats.correctAnswers / gameState.stats.questionsAnswered) * 100)
      : 0;

    modalText.innerHTML = `
      <h2>BSS Trivia Statistics</h2>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Games Played</div>
          <div class="stat-value">${gameState.stats.gamesPlayed}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Questions Answered</div>
          <div class="stat-value">${gameState.stats.questionsAnswered}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Correct Answers</div>
          <div class="stat-value">${gameState.stats.correctAnswers}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Accuracy</div>
          <div class="stat-value">${accuracy}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Hints Used</div>
          <div class="stat-value">${gameState.stats.hintsUsed || 0}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Max Streak</div>
          <div class="stat-value">${gameState.stats.maxStreak || 0}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">High Score (Timed)</div>
          <div class="stat-value">${gameState.stats.highScores.timed}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">High Score (Endless)</div>
          <div class="stat-value">${gameState.stats.highScores.endless}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">High Score (Challenge)</div>
          <div class="stat-value">${gameState.stats.highScores.challenge}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Favorite Category</div>
          <div class="stat-value">${calculateFavoriteCategory()}</div>
        </div>
      </div>
      <button id="reset-stats">Reset Statistics</button>
    `;

    modal.style.display = "block";

    // Add reset stats button functionality
    document.getElementById("reset-stats").addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all trivia statistics? This cannot be undone.")) {
        gameState.stats = {
          gamesPlayed: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
          hintsUsed: 0,
          highScores: {
            timed: 0,
            endless: 0,
            challenge: 0
          },
          categoryStats: {
            bees: 0,
            fields: 0,
            items: 0,
            mechanics: 0,
            bears: 0,
            monsters: 0
          },
          maxStreak: 0
        };
        saveStats();
        showStats(); // Refresh the stats display
      }
    });
  }

  // Helper function to determine favorite category
  function calculateFavoriteCategory() {
    // If no category stats exist, add them to the gameState
    if (!gameState.stats.categoryStats) {
      gameState.stats.categoryStats = {
        bees: 0,
        fields: 0,
        items: 0,
        mechanics: 0,
        bears: 0,
        monsters: 0
      };
      return "None yet";
    }

    const categories = Object.keys(gameState.stats.categoryStats);
    if (categories.length === 0) return "None yet";

    let favorite = categories[0];
    for (const category of categories) {
      if (gameState.stats.categoryStats[category] > gameState.stats.categoryStats[favorite]) {
        favorite = category;
      }
    }

    return favorite.charAt(0).toUpperCase() + favorite.slice(1);
  }

  // Generate hint for a question
  function generateHint(question) {
    // Different hint strategies based on question type
    const correctAnswer = question.answers[question.correctAnswer];

    // Generate a hint that doesn't give away the answer but helps
    let hint;

    switch (question.category) {
      case "bees":
        hint = `This bee is ${correctAnswer.length < 6 ? "a short-named" : "a longer-named"} bee with special abilities.`;
        break;
      case "fields":
        hint = `This field is located in the ${correctAnswer.includes("Mountain") || correctAnswer.includes("Pepper") || correctAnswer.includes("Coconut") ? "upper" : "lower"} part of the map.`;
        break;
      case "items":
        hint = `This item ${correctAnswer.includes("Treat") ? "can affect bees directly" : "is used in gameplay mechanics"}.`;
        break;
      case "mechanics":
        hint = `This game mechanic ${correctAnswer.toLowerCase().includes("crit") ? "affects pollen collection" : "is important for game progression"}.`;
        break;
      case "bears":
        hint = `This bear ${correctAnswer.includes("Bear") ? "has 'Bear' in its name" : "is a special character"}.`;
        break;
      case "monsters":
        hint = `This monster ${correctAnswer.includes("Crab") || correctAnswer.includes("Beetle") ? "is an insect-type monster" : "is a special enemy"}.`;
        break;
      default:
        hint = "Think about what you've seen in the game recently.";
    }

    return hint;
  }

  // Show hint when requested
  function showHint() {
    if (gameState.currentHint && !gameState.isAnswered) {
      gameState.hintsUsed++;
      gameState.stats.hintsUsed++;
      saveStats();

      // Apply a small score penalty for using a hint
      const penalty = 25;
      gameState.score = Math.max(0, gameState.score - penalty);
      document.getElementById("score").textContent = gameState.score;

      showMessage(`Hint: ${gameState.currentHint}<br><small>(Score -${penalty} points for using a hint)</small>`);
    }
  }

  // Unlock achievement
  function unlockAchievement(id, title, description) {
    // Check if achievement already unlocked
    if (gameState.achievements[id]) {
      return;
    }

    // Mark achievement as unlocked
    gameState.achievements[id] = {
      unlocked: true,
      timestamp: Date.now()
    };

    // Save to localStorage
    saveAchievements();

    // Show notification
    showAchievementNotification(title, description);
  }

  // Show achievement notification
  function showAchievementNotification(title, description) {
    const notification = document.createElement("div");
    notification.className = "achievement-notification";
    notification.innerHTML = `
      <div class="achievement-icon">🏆</div>
      <div class="achievement-info">
        <div class="achievement-title">Achievement Unlocked: ${title}</div>
        <div class="achievement-description">${description}</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animation
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after display
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  }

  // Save achievements to localStorage
  function saveAchievements() {
    localStorage.setItem("bssTrivia_achievements", JSON.stringify(gameState.achievements));
  }

  // Load achievements from localStorage
  function loadAchievements() {
    const savedAchievements = localStorage.getItem("bssTrivia_achievements");
    if (savedAchievements) {
      gameState.achievements = JSON.parse(savedAchievements);
    }
  }

  // Show achievements panel
  function showAchievements() {
    // Define the full list of achievements
    const allAchievements = [
      { id: "streak5", title: "On Fire!", description: "Answer 5 questions correctly in a row" },
      { id: "streak10", title: "Unstoppable!", description: "Answer 10 questions correctly in a row" },
      { id: "streak20", title: "BSS Master!", description: "Answer 20 questions correctly in a row" },
      { id: "score1000", title: "Point Collector", description: "Score 1,000 points in a single game" },
      { id: "score5000", title: "High Roller", description: "Score 5,000 points in a single game" },
      { id: "timed2000", title: "Time Master", description: "Score 2,000+ points in Timed Mode" },
      { id: "endless15", title: "Endurance Champion", description: "Answer 15+ questions correctly in Endless Mode" },
      { id: "challenge3000", title: "Challenge Conqueror", description: "Score 3,000+ points in Challenge Mode" },
      { id: "bees10", title: "Bees Novice", description: "Answer 10 bees questions correctly" },
      { id: "bees25", title: "Bees Expert", description: "Answer 25 bees questions correctly" },
      { id: "fields10", title: "Fields Novice", description: "Answer 10 fields questions correctly" },
      { id: "fields25", title: "Fields Expert", description: "Answer 25 fields questions correctly" },
      { id: "items10", title: "Items Novice", description: "Answer 10 items questions correctly" },
      { id: "items25", title: "Items Expert", description: "Answer 25 items questions correctly" },
      { id: "mechanics10", title: "Mechanics Novice", description: "Answer 10 mechanics questions correctly" },
      { id: "mechanics25", title: "Mechanics Expert", description: "Answer 25 mechanics questions correctly" },
      { id: "bears10", title: "Bears Novice", description: "Answer 10 bears questions correctly" },
      { id: "bears25", title: "Bears Expert", description: "Answer 25 bears questions correctly" },
      { id: "monsters10", title: "Monsters Novice", description: "Answer 10 monsters questions correctly" },
      { id: "monsters25", title: "Monsters Expert", description: "Answer 25 monsters questions correctly" }
    ];

    // Create the achievement cards HTML
    let achievementsHTML = `
      <h2>BSS Trivia Achievements</h2>
      <p>Collect achievements by playing BSS Trivia and testing your Bee Swarm knowledge!</p>
      <div class="achievements-grid">
    `;

    // Add each achievement card
    allAchievements.forEach(achievement => {
      const isUnlocked = gameState.achievements[achievement.id];
      const unlockDate = isUnlocked ? new Date(gameState.achievements[achievement.id].timestamp).toLocaleDateString() : null;

      achievementsHTML += `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-card-icon">${isUnlocked ? '🏆' : '🔒'}</div>
          <div class="achievement-card-title">${achievement.title}</div>
          <div class="achievement-card-description">${achievement.description}</div>
          ${isUnlocked ? `<div class="achievement-unlock-date">Unlocked on ${unlockDate}</div>` : ''}
        </div>
      `;
    });

    achievementsHTML += `</div>`;

    // Display in modal
    modalText.innerHTML = achievementsHTML;
    modal.style.display = "block";
  }

  // Initialize the game
  init();
});
