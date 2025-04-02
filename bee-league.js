// Bee League Challenge Game Logic
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const beeOptionsContainer = document.getElementById("bee-options");
  const beeSolutionContainer = document.getElementById("bee-solution");
  const submitSolutionButton = document.getElementById("submit-solution");
  const nextChallengeButton = document.getElementById("next-challenge");
  const resultMessage = document.getElementById("result-message");
  const pointsEarned = document.getElementById("points-earned");
  const challengeResult = document.getElementById("challenge-result");
  const playerName = document.getElementById("player-name");
  const playerLeague = document.getElementById("player-league");
  const playerPoints = document.getElementById("player-points");
  const playerStreak = document.getElementById("player-streak");
  const leaderboardBody = document.getElementById("leaderboard-body");
  const soundToggle = document.getElementById("sound-toggle");
  const showStatsButton = document.getElementById("show-stats-button");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close");
  const useHintButton = document.getElementById("use-hint");
  const hintContent = document.getElementById("hint-content");
  const streakBonus = document.getElementById("streak-bonus");
  const bonusPoints = document.getElementById("bonus-points");

  // Game state
  let currentPlayer = {
    name: "Guest",
    points: 0,
    league: "Bronze",
    completedChallenges: 0,
    streak: 0,
    lastChallengeDate: null,
    hintsUsed: 0,
    history: []
  };

  // Available bees for challenges
  const bees = [
    { id: 1, name: "Basic Bee", type: "Common", honeyProd: 10, attack: 1, energy: 10, gatherAmount: 5, conversion: 10, img: "bee/basic.png" },
    { id: 2, name: "Hasty Bee", type: "Rare", honeyProd: 15, attack: 3, energy: 15, gatherAmount: 10, conversion: 15, img: "bee/hasty.png" },
    { id: 3, name: "Brave Bee", type: "Rare", honeyProd: 18, attack: 10, energy: 20, gatherAmount: 10, conversion: 15, img: "bee/brave.png" },
    { id: 4, name: "Looker Bee", type: "Rare", honeyProd: 16, attack: 2, energy: 15, gatherAmount: 8, conversion: 15, img: "bee/looker.png" },
    { id: 5, name: "Shocked Bee", type: "Rare", honeyProd: 17, attack: 5, energy: 16, gatherAmount: 10, conversion: 15, img: "bee/shocked.png" },
    { id: 6, name: "Commander Bee", type: "Epic", honeyProd: 22, attack: 8, energy: 25, gatherAmount: 12, conversion: 20, img: "bee/commander.png" },
    { id: 7, name: "Demo Bee", type: "Epic", honeyProd: 25, attack: 15, energy: 30, gatherAmount: 15, conversion: 20, img: "bee/demo.png" },
    { id: 8, name: "Exhausted Bee", type: "Epic", honeyProd: 20, attack: 4, energy: 40, gatherAmount: 20, conversion: 20, img: "bee/exhausted.png" },
    { id: 9, name: "Fire Bee", type: "Epic", honeyProd: 24, attack: 12, energy: 25, gatherAmount: 15, conversion: 18, img: "bee/fire.png" },
    { id: 10, name: "Fuzzy Bee", type: "Legendary", honeyProd: 30, attack: 15, energy: 35, gatherAmount: 20, conversion: 25, img: "bee/fuzzy.png" },
    { id: 11, name: "Vicious Bee", type: "Legendary", honeyProd: 35, attack: 30, energy: 40, gatherAmount: 5, conversion: 15, img: "bee/vicious.png" },
    { id: 12, name: "Vector Bee", type: "Legendary", honeyProd: 32, attack: 20, energy: 35, gatherAmount: 25, conversion: 30, img: "bee/vector.png" },
    { id: 13, name: "Tabby Bee", type: "Event", honeyProd: 40, attack: 25, energy: 50, gatherAmount: 30, conversion: 35, img: "bee/tabby.png" },
    { id: 14, name: "Photon Bee", type: "Event", honeyProd: 45, attack: 20, energy: 60, gatherAmount: 35, conversion: 40, img: "bee/photon.png" },
    { id: 15, name: "Gummy Bee", type: "Event", honeyProd: 38, attack: 10, energy: 45, gatherAmount: 40, conversion: 50, img: "bee/gummy.png" }
  ];

  // Sample challenges
  const challenges = [
    {
      id: 1,
      description: "Arrange the bees in order from highest to lowest honey production",
      beeIds: [1, 3, 6, 8, 12],
      solutionCheck: (arrangement) => {
        const correctOrder = [12, 6, 3, 8, 1]; // IDs in correct order
        const currentOrder = arrangement.map(b => b.id);

        let isCorrect = true;
        for (let i = 0; i < correctOrder.length; i++) {
          if (correctOrder[i] !== currentOrder[i]) {
            isCorrect = false;
            break;
          }
        }
        return isCorrect;
      },
      hint: "Compare the honeyProd values of each bee. The bee with the highest honeyProd should be first.",
      points: 25
    },
    {
      id: 2,
      description: "Arrange the bees by rarity from Common to Legendary",
      beeIds: [1, 4, 7, 10],
      solutionCheck: (arrangement) => {
        // Check if arranged by rarity: Common -> Rare -> Epic -> Legendary
        let currentRarity = "Common";
        let correctOrder = true;

        for (const bee of arrangement) {
          const beeData = bees.find(b => b.id === bee.id);
          if (!beeData) continue;

          // Check if current bee's rarity is appropriate
          if (currentRarity === "Common") {
            currentRarity = beeData.type === "Common" ? "Rare" : currentRarity;
          } else if (currentRarity === "Rare") {
            currentRarity = beeData.type === "Rare" ? "Epic" : currentRarity;
          } else if (currentRarity === "Epic") {
            currentRarity = beeData.type === "Epic" ? "Legendary" : currentRarity;
          }

          // If bee type doesn't match expected rarity pattern
          if (
            (currentRarity === "Common" && beeData.type !== "Common") ||
            (currentRarity === "Rare" && beeData.type !== "Rare") ||
            (currentRarity === "Epic" && beeData.type !== "Epic") ||
            (currentRarity === "Legendary" && beeData.type !== "Legendary")
          ) {
            correctOrder = false;
            break;
          }
        }

        return correctOrder;
      },
      hint: "Bee rarities from lowest to highest are: Common, Rare, Epic, Legendary, Event.",
      points: 30
    },
    {
      id: 3,
      description: "Select only the Epic bees and arrange them in order of honey production",
      beeIds: [5, 6, 7, 8, 9, 11],
      solutionCheck: (arrangement) => {
        // Only Epic bees should be selected
        const epicBeesIds = [6, 7, 8, 9];
        const selectedIds = arrangement.map(b => b.id).sort();
        const correctIds = epicBeesIds.sort();

        // Check if only Epic bees are selected
        if (selectedIds.length !== correctIds.length) return false;

        for (let i = 0; i < selectedIds.length; i++) {
          if (selectedIds[i] !== correctIds[i]) return false;
        }

        // Check if arranged by honey production
        const correctOrder = [7, 9, 6, 8]; // Sorted by honey production
        const currentOrder = arrangement.map(b => b.id);

        for (let i = 0; i < correctOrder.length; i++) {
          if (correctOrder[i] !== currentOrder[i]) return false;
        }

        return true;
      },
      hint: "First identify all Epic bees, then arrange them by their honey production from highest to lowest.",
      points: 50
    },
    {
      id: 4,
      description: "Arrange bees in order from highest to lowest attack power",
      beeIds: [3, 7, 11, 13, 9],
      solutionCheck: (arrangement) => {
        const sortedByAttack = arrangement.slice().sort((a, b) => b.attack - a.attack);

        for (let i = 0; i < arrangement.length; i++) {
          if (arrangement[i].id !== sortedByAttack[i].id) {
            return false;
          }
        }
        return true;
      },
      hint: "Vicious Bee has the highest attack, followed by Tabby Bee. Compare attack values of each bee.",
      points: 40
    },
    {
      id: 5,
      description: "Select only Event bees",
      beeIds: [10, 11, 12, 13, 14, 15],
      solutionCheck: (arrangement) => {
        const eventBeeIds = [13, 14, 15];
        const selectedIds = arrangement.map(b => b.id).sort();

        if (selectedIds.length !== eventBeeIds.length) return false;

        for (let i = 0; i < selectedIds.length; i++) {
          if (!eventBeeIds.includes(selectedIds[i])) return false;
        }

        return true;
      },
      hint: "Event bees include Tabby Bee, Photon Bee, and Gummy Bee. These are special bees that cannot be obtained from Royal Jellies.",
      points: 35
    },
    {
      id: 6,
      description: "Arrange bees from highest to lowest conversion rate",
      beeIds: [1, 5, 12, 14, 15],
      solutionCheck: (arrangement) => {
        const sortedByConversion = arrangement.slice().sort((a, b) => b.conversion - a.conversion);

        for (let i = 0; i < arrangement.length; i++) {
          if (arrangement[i].id !== sortedByConversion[i].id) {
            return false;
          }
        }
        return true;
      },
      hint: "Conversion rate determines how quickly a bee converts pollen to honey. Gummy Bee has the highest conversion rate.",
      points: 45
    },
    {
      id: 7,
      description: "Select bees that have both high attack (15+) and high energy (35+)",
      beeIds: [7, 10, 11, 12, 13, 14, 15],
      solutionCheck: (arrangement) => {
        const correctBeeIds = bees
          .filter(b => b.attack >= 15 && b.energy >= 35)
          .map(b => b.id);

        const selectedIds = arrangement.map(b => b.id).sort();
        const sortedCorrectIds = correctBeeIds.sort();

        if (selectedIds.length !== sortedCorrectIds.length) return false;

        for (let i = 0; i < selectedIds.length; i++) {
          if (selectedIds[i] !== sortedCorrectIds[i]) return false;
        }

        return true;
      },
      hint: "Look for bees that have both high attack (15 or more) and high energy (35 or more).",
      points: 60
    }
  ];

  // Sample leaderboard data
  const leaderboardData = [
    { rank: 1, name: "HoneyMaster", league: "Diamond", points: 850 },
    { rank: 2, name: "BeeKeeper2023", league: "Diamond", points: 720 },
    { rank: 3, name: "SwarmChampion", league: "Gold", points: 540 },
    { rank: 4, name: "NectarCollector", league: "Gold", points: 480 },
    { rank: 5, name: "BeeBuddy", league: "Silver", points: 290 },
    { rank: 6, name: "JellyBeans", league: "Silver", points: 210 },
    { rank: 7, name: "PollenPal", league: "Bronze", points: 95 },
    { rank: 8, name: "HiveNewbie", league: "Bronze", points: 40 }
  ];

  // Current challenge
  let currentChallenge = null;
  let selectedBees = [];

  // Initialize game
  function initGame() {
    loadPlayerData();
    renderLeaderboard();
    loadNewChallenge();
    setupEventListeners();
    checkDailyStreak();
  }

  // Check and update daily streak
  function checkDailyStreak() {
    const today = new Date().toDateString();

    if (currentPlayer.lastChallengeDate) {
      const lastDate = new Date(currentPlayer.lastChallengeDate).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastDate === yesterdayString) {
        // Maintain streak
      } else if (lastDate === today) {
        // Already played today, no streak increase
      } else {
        // Streak broken
        currentPlayer.streak = 0;
      }
    }

    updatePlayerStreak();
  }

  // Update player streak display
  function updatePlayerStreak() {
    playerStreak.textContent = `Streak: ${currentPlayer.streak} days`;
  }

  // Load player data from local storage
  function loadPlayerData() {
    const savedPlayer = localStorage.getItem("beeLeaguePlayer");
    if (savedPlayer) {
      currentPlayer = JSON.parse(savedPlayer);
      updatePlayerDisplay();
      updatePlayerStreak();
    }
  }

  // Save player data to local storage
  function savePlayerData() {
    localStorage.setItem("beeLeaguePlayer", JSON.stringify(currentPlayer));
  }

  // Update the player info display
  function updatePlayerDisplay() {
    playerName.textContent = `Player: ${currentPlayer.name}`;
    playerLeague.textContent = `League: ${currentPlayer.league}`;
    playerPoints.textContent = `Points: ${currentPlayer.points}`;
  }

  // Update player's league based on points
  function updatePlayerLeague() {
    if (currentPlayer.points >= 1001) {
      currentPlayer.league = "Master";
    } else if (currentPlayer.points >= 601) {
      currentPlayer.league = "Diamond";
    } else if (currentPlayer.points >= 301) {
      currentPlayer.league = "Gold";
    } else if (currentPlayer.points >= 101) {
      currentPlayer.league = "Silver";
    } else {
      currentPlayer.league = "Bronze";
    }
  }

  // Render leaderboard
  function renderLeaderboard() {
    leaderboardBody.innerHTML = "";

    leaderboardData.forEach(player => {
      const row = document.createElement("tr");

      const rankCell = document.createElement("td");
      rankCell.textContent = player.rank;

      const nameCell = document.createElement("td");
      nameCell.textContent = player.name;

      const leagueCell = document.createElement("td");
      leagueCell.textContent = player.league;

      const pointsCell = document.createElement("td");
      pointsCell.textContent = player.points;

      row.appendChild(rankCell);
      row.appendChild(nameCell);
      row.appendChild(leagueCell);
      row.appendChild(pointsCell);

      leaderboardBody.appendChild(row);
    });
  }

  // Load a new challenge
  function loadNewChallenge() {
    // Reset UI
    beeSolutionContainer.innerHTML = "";
    selectedBees = [];
    challengeResult.classList.add("hidden");
    hintContent.classList.add("hidden");
    hintContent.textContent = "";

    // Select a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    currentChallenge = challenges[randomIndex];

    // Update challenge description
    const challengeDescription = document.getElementById("challenge-description");
    challengeDescription.textContent = currentChallenge.description;

    // Load bee options
    loadBeeOptions();
  }

  // Load bee options for the current challenge
  function loadBeeOptions() {
    beeOptionsContainer.innerHTML = "";

    // Get the bees for this challenge
    const challengeBees = currentChallenge.beeIds.map(id =>
      bees.find(bee => bee.id === id)
    ).filter(bee => bee !== undefined);

    // Shuffle bees for display
    const shuffledBees = shuffleArray([...challengeBees]);

    // Create bee elements
    shuffledBees.forEach(bee => {
      const beeElement = createBeeElement(bee);
      beeOptionsContainer.appendChild(beeElement);
    });
  }

  // Shuffle array (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create a draggable bee element
  function createBeeElement(bee) {
    const beeElement = document.createElement("div");
    beeElement.classList.add("bee-item");
    beeElement.setAttribute("draggable", "true");
    beeElement.dataset.id = bee.id;

    const beeIcon = document.createElement("img");
    beeIcon.src = bee.img;
    beeIcon.alt = bee.name;

    const beeName = document.createElement("span");
    beeName.textContent = bee.name;

    beeElement.appendChild(beeIcon);
    beeElement.appendChild(beeName);

    // Add tooltip with bee stats
    const tooltip = document.createElement("div");
    tooltip.classList.add("bee-tooltip");
    tooltip.innerHTML = `
      <div><strong>${bee.name}</strong> (${bee.type})</div>
      <div>Honey Production: ${bee.honeyProd}</div>
      <div>Attack: ${bee.attack}</div>
      <div>Energy: ${bee.energy}</div>
      <div>Gather Amount: ${bee.gatherAmount}</div>
      <div>Conversion Rate: ${bee.conversion}</div>
    `;
    beeElement.appendChild(tooltip);

    // Show tooltip on hover
    beeElement.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
    });

    beeElement.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    // Add drag and drop event listeners
    beeElement.addEventListener("dragstart", handleDragStart);

    return beeElement;
  }

  // Handle drag start
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.id);
    e.dataTransfer.effectAllowed = "move";
  }

  // Handle drag over
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // Handle drop
  function handleDrop(e) {
    e.preventDefault();
    const beeId = e.dataTransfer.getData("text/plain");
    const beeElement = document.querySelector(`.bee-item[data-id="${beeId}"]`);

    if (beeElement) {
      // Clone the bee element
      const clonedBee = beeElement.cloneNode(true);
      clonedBee.addEventListener("dragstart", handleDragStart);

      // Remove original if it's in the solution container
      if (beeElement.parentElement === beeSolutionContainer) {
        beeElement.remove();
      }

      // Add to solution container
      beeSolutionContainer.appendChild(clonedBee);

      // Update selected bees
      updateSelectedBees();
    }
  }

  // Update the selected bees array based on the solution container
  function updateSelectedBees() {
    selectedBees = [];
    const beeElements = beeSolutionContainer.querySelectorAll(".bee-item");

    beeElements.forEach(element => {
      const beeId = parseInt(element.dataset.id);
      const bee = bees.find(b => b.id === beeId);
      if (bee) {
        selectedBees.push(bee);
      }
    });
  }

  // Show hint
  function showHint() {
    if (currentPlayer.points >= 5) {
      currentPlayer.points -= 5;
      currentPlayer.hintsUsed++;
      updatePlayerDisplay();

      hintContent.textContent = currentChallenge.hint;
      hintContent.classList.remove("hidden");

      // Add the hint usage to history
      currentPlayer.history.push({
        date: new Date().toISOString(),
        type: "hint_used",
        challenge: currentChallenge.id,
        points: -5
      });

      savePlayerData();

      if (soundToggle.checked) {
        playSound("sound/hint.mp3");
      }
    } else {
      showMessage("You need at least 5 points to use a hint!");
    }
  }

  // Submit solution
  function submitSolution() {
    const isCorrect = currentChallenge.solutionCheck(selectedBees);

    // Show result
    challengeResult.classList.remove("hidden");

    if (isCorrect) {
      // Play success sound
      if (soundToggle.checked) {
        playSound("sound/correct.mp3");
      }

      // Calculate bonus points based on streak
      let streakBonusPoints = 0;
      if (currentPlayer.streak >= 5) {
        streakBonusPoints = Math.floor(currentChallenge.points * 0.5); // 50% bonus for 5+ day streak
      } else if (currentPlayer.streak >= 3) {
        streakBonusPoints = Math.floor(currentChallenge.points * 0.3); // 30% bonus for 3+ day streak
      } else if (currentPlayer.streak >= 1) {
        streakBonusPoints = Math.floor(currentChallenge.points * 0.1); // 10% bonus for any streak
      }

      // Update result message
      resultMessage.textContent = "Excellent work! Your bee arrangement is correct!";
      pointsEarned.textContent = `+${currentChallenge.points} points`;

      // Show streak bonus if applicable
      if (streakBonusPoints > 0) {
        bonusPoints.classList.remove("hidden");
        streakBonus.textContent = `+${streakBonusPoints}`;
      } else {
        bonusPoints.classList.add("hidden");
      }

      // Add points to player
      const totalPoints = currentChallenge.points + streakBonusPoints;
      currentPlayer.points += totalPoints;
      currentPlayer.completedChallenges++;

      // Update streak
      const today = new Date().toDateString();
      if (!currentPlayer.lastChallengeDate || new Date(currentPlayer.lastChallengeDate).toDateString() !== today) {
        currentPlayer.streak++;
      }
      currentPlayer.lastChallengeDate = new Date().toISOString();
      updatePlayerStreak();

      // Add to history
      currentPlayer.history.push({
        date: new Date().toISOString(),
        challenge: currentChallenge.id,
        points: totalPoints,
        streakBonus: streakBonusPoints,
        success: true
      });

      // Update league if needed
      updatePlayerLeague();
      updatePlayerDisplay();
      savePlayerData();
    } else {
      // Play fail sound
      if (soundToggle.checked) {
        playSound("sound/incorrect.mp3");
      }

      // Update result message
      resultMessage.textContent = "That's not quite right. Try again!";
      pointsEarned.textContent = "+0 points";
      bonusPoints.classList.add("hidden");

      // Add to history
      currentPlayer.history.push({
        date: new Date().toISOString(),
        challenge: currentChallenge.id,
        points: 0,
        success: false
      });

      savePlayerData();
    }
  }

  // Next challenge
  function goToNextChallenge() {
    loadNewChallenge();
  }

  // Show stats
  function showStats() {
    modal.style.display = "block";
    modalText.innerHTML = `
      <h2>Bee League Stats</h2>
      <div class="stats-container">
        <div class="stats-item">
          <span class="stats-label">Player:</span>
          <span class="stats-value">${currentPlayer.name}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">League:</span>
          <span class="stats-value">${currentPlayer.league}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Points:</span>
          <span class="stats-value">${currentPlayer.points}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Points to Next League:</span>
          <span class="stats-value">${getPointsToNextLeague()}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Current Streak:</span>
          <span class="stats-value">${currentPlayer.streak} days</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Challenges Completed:</span>
          <span class="stats-value">${currentPlayer.completedChallenges}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">Hints Used:</span>
          <span class="stats-value">${currentPlayer.hintsUsed}</span>
        </div>
      </div>
      <h3>Recent Activity</h3>
      <div class="history-container">
        ${getHistoryHTML()}
      </div>
      <button id="reset-stats-button">Reset Stats</button>
    `;

    // Add event listener to reset button
    const resetButton = document.getElementById("reset-stats-button");
    resetButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset your stats? This cannot be undone.")) {
        currentPlayer = {
          name: "Guest",
          points: 0,
          league: "Bronze",
          completedChallenges: 0,
          streak: 0,
          lastChallengeDate: null,
          hintsUsed: 0,
          history: []
        };
        savePlayerData();
        updatePlayerDisplay();
        updatePlayerStreak();
        modal.style.display = "none";
      }
    });
  }

  // Get points needed to reach next league
  function getPointsToNextLeague() {
    if (currentPlayer.league === "Bronze") {
      return 101 - currentPlayer.points;
    } else if (currentPlayer.league === "Silver") {
      return 301 - currentPlayer.points;
    } else if (currentPlayer.league === "Gold") {
      return 601 - currentPlayer.points;
    } else if (currentPlayer.league === "Diamond") {
      return 1001 - currentPlayer.points;
    } else {
      return "At Maximum League";
    }
  }

  // Get HTML for history display
  function getHistoryHTML() {
    if (currentPlayer.history.length === 0) {
      return "<p>No activity yet. Start completing challenges!</p>";
    }

    // Get latest 10 entries
    const recentHistory = [...currentPlayer.history]
      .reverse()
      .slice(0, 10);

    let html = "<ul class='history-list'>";

    recentHistory.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      let entryText = "";

      if (entry.type === "hint_used") {
        entryText = `Used a hint on Challenge #${entry.challenge} (${entry.points} points)`;
      } else if (entry.success) {
        entryText = `Completed Challenge #${entry.challenge} (+${entry.points} points)`;
        if (entry.streakBonus > 0) {
          entryText += ` (includes ${entry.streakBonus} streak bonus)`;
        }
      } else {
        entryText = `Failed Challenge #${entry.challenge}`;
      }

      html += `<li><span class="history-date">${date}</span>: ${entryText}</li>`;
    });

    html += "</ul>";
    return html;
  }

  // Play sound
  function playSound(src) {
    if (soundToggle.checked) {
      const sound = new Audio(src);
      sound.play().catch(e => console.log("Sound play error:", e));
    }
  }

  // Show message in modal
  function showMessage(text) {
    modal.style.display = "block";
    modalText.innerHTML = `<p>${text}</p>`;
  }

  // Setup event listeners
  function setupEventListeners() {
    // Drag and drop
    beeSolutionContainer.addEventListener("dragover", handleDragOver);
    beeSolutionContainer.addEventListener("drop", handleDrop);

    // Remove bee from solution by clicking
    beeSolutionContainer.addEventListener("click", (e) => {
      if (e.target.closest(".bee-item")) {
        e.target.closest(".bee-item").remove();
        updateSelectedBees();
      }
    });

    // Submit solution
    submitSolutionButton.addEventListener("click", submitSolution);

    // Next challenge
    nextChallengeButton.addEventListener("click", goToNextChallenge);

    // Show stats
    showStatsButton.addEventListener("click", showStats);

    // Use hint
    useHintButton.addEventListener("click", showHint);

    // Close modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Close modal on click outside
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    // Tab navigation
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        // Handle tab switching logic
        const tabGroup = btn.closest("div").querySelectorAll(".tab-btn");
        tabGroup.forEach(tab => tab.classList.remove("active"));
        btn.classList.add("active");

        // For tab content switching
        if (btn.dataset.tab) {
          const contents = document.querySelectorAll(".tab-content");
          contents.forEach(content => content.classList.remove("active"));
          document.getElementById(`${btn.dataset.tab}-content`)?.classList.add("active");
        }
      });
    });

    // Mobile navbar toggle
    const navbarToggle = document.getElementById("navbar-toggle");
    const navbarMenu = document.getElementById("navbar-menu");
    navbarToggle.addEventListener("click", () => {
      navbarMenu.classList.toggle("active");
    });

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", themeToggle.checked);
    });

    // Load saved theme preference
    if (localStorage.getItem("darkMode") === "true") {
      themeToggle.checked = true;
      document.body.classList.add("dark-mode");
    }
  }

  // Initialize game
  initGame();
});
