// Quest Adventure Game Logic
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const bearsList = document.getElementById("bears-list");
  const questList = document.getElementById("quest-list");
  const dialogBearImg = document.getElementById("dialog-bear-img");
  const bearName = document.getElementById("bear-name");
  const questText = document.getElementById("quest-text");
  const availableQuests = document.getElementById("available-quests");
  const activeQuest = document.getElementById("active-quest");
  const activeQuestTitle = document.getElementById("active-quest-title");
  const activeQuestDescription = document.getElementById("active-quest-description");
  const objectivesList = document.getElementById("objectives-list");
  const collectPollenBtn = document.getElementById("collect-pollen");
  const convertHoneyBtn = document.getElementById("convert-honey");
  const completeQuestBtn = document.getElementById("complete-quest");
  const abandonQuestBtn = document.getElementById("abandon-quest");
  const honeyAmount = document.getElementById("honey-amount");
  const pollenAmount = document.getElementById("pollen-amount");
  const energyAmount = document.getElementById("energy-amount");
  const energyBar = document.getElementById("energy-bar");
  const completedQuestsCounter = document.getElementById("completed-quests");
  const xpLevel = document.getElementById("xp-level");
  const xpProgress = document.getElementById("xp-progress");
  const inventorySlots = document.getElementById("inventory-slots");
  const collectorName = document.getElementById("collector-name");
  const bagName = document.getElementById("bag-name");
  const bootsName = document.getElementById("boots-name");
  const fieldSelector = document.getElementById("field-selector");
  const currentField = document.getElementById("current-field");
  const soundToggle = document.getElementById("sound-toggle");
  const showStatsButton = document.getElementById("show-stats-button");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close");
  const rewardModal = document.getElementById("reward-modal");
  const rewardHoney = document.getElementById("reward-honey");
  const rewardXp = document.getElementById("reward-xp");
  const rewardSpecial = document.getElementById("reward-special");
  const specialReward = document.getElementById("special-reward");
  const completionMessage = document.getElementById("completion-message");
  const claimRewardsBtn = document.getElementById("claim-rewards");
  const rewardClose = document.querySelector(".reward-close");
  const restEnergyBtn = document.getElementById("rest-energy");

  // Game State
  const gameState = {
    currentBear: "black",
    honey: 0,
    pollen: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegenRate: 5,
    pollenCapacity: 100,
    pollenCollectionRate: 5,
    conversionRate: 1,
    completedQuests: 0,
    activeQuest: null,
    xp: 0,
    level: 1,
    inventory: [],
    currentField: "dandelion",
    equipment: {
      collector: { name: "Scooper", level: 1, collectionBonus: 0 },
      bag: { name: "Default Bag", level: 1, capacityBonus: 0 },
      boots: { name: "Beekeeper's Boots", level: 1, speedBonus: 0 }
    },
    questProgress: {
      objectives: []
    },
    lastEnergyRegen: Date.now(),
    questCooldowns: {},
    stats: {
      totalHoney: 0,
      totalPollen: 0,
      questsCompleted: {
        black: 0,
        brown: 0,
        polar: 0,
        panda: 0
      },
      itemsCollected: 0,
      timeSpent: 0,
      fieldsVisited: {}
    }
  };

  // Field data
  const fields = {
    dandelion: {
      name: "Dandelion Field",
      image: "bee/dandelion_field.png",
      pollenMultiplier: 1.0,
      description: "A basic field with dandelions. Good for beginners."
    },
    clover: {
      name: "Clover Field",
      image: "bee/clover_field.png",
      pollenMultiplier: 1.2,
      description: "Clover flowers provide slightly more pollen."
    },
    mushroom: {
      name: "Mushroom Field",
      image: "bee/mushroom_field.png",
      pollenMultiplier: 1.5,
      description: "Dense mushrooms that are rich in pollen."
    },
    sunflower: {
      name: "Sunflower Field",
      image: "bee/sunflower_field.png",
      pollenMultiplier: 1.8,
      description: "Large sunflowers with abundant pollen."
    }
  };

  // Bear data
  const bears = {
    black: {
      name: "Black Bear",
      image: "bee/black_bear.png",
      greeting: "Hi there! I'm Black Bear. I have some simple quests for beginners. Would you like to help me collect some pollen?",
      quests: [
        {
          id: "black_1",
          title: "Pollen Basics",
          description: "Let's start with the basics. I need you to collect some pollen and convert it to honey.",
          difficulty: "easy",
          objectives: [
            { id: "collect_pollen", description: "Collect 50 pollen", target: 50, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 25 honey", target: 25, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 100,
            xp: 50,
            special: null
          }
        },
        {
          id: "black_2",
          title: "Pollen Collector",
          description: "You're doing great! Now let's collect a bit more pollen for my research.",
          difficulty: "easy",
          objectives: [
            { id: "collect_pollen", description: "Collect 100 pollen", target: 100, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 50 honey", target: 50, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 200,
            xp: 100,
            special: {
              type: "collector",
              name: "Silver Scooper",
              level: 2,
              bonus: 2
            }
          }
        },
        {
          id: "black_3",
          title: "Honey Production",
          description: "Let's focus on honey production. We need a good amount for the hive.",
          difficulty: "medium",
          objectives: [
            { id: "collect_pollen", description: "Collect 150 pollen", target: 150, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 100 honey", target: 100, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 300,
            xp: 150,
            special: null
          }
        },
        {
          id: "black_4",
          title: "Field Explorer",
          description: "I want you to explore different fields! Visit the Dandelion and Clover fields to collect pollen.",
          difficulty: "medium",
          objectives: [
            { id: "field_dandelion", description: "Collect from Dandelion Field", target: 5, progress: 0, type: "field_dandelion" },
            { id: "field_clover", description: "Collect from Clover Field", target: 5, progress: 0, type: "field_clover" },
            { id: "convert_honey", description: "Convert to 100 honey", target: 100, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 350,
            xp: 175,
            special: {
              type: "boots",
              name: "Field Jumper Boots",
              level: 2,
              bonus: 3
            }
          }
        }
      ]
    },
    brown: {
      name: "Brown Bear",
      image: "bee/brown_bear.png",
      greeting: "Hello beekeeper! Brown Bear here. I have some interesting quests that will help you improve your pollen collection skills.",
      quests: [
        {
          id: "brown_1",
          title: "Efficient Collection",
          description: "I need you to collect pollen efficiently. Let's see how fast you can fill your bag!",
          difficulty: "medium",
          objectives: [
            { id: "collect_pollen", description: "Collect 200 pollen", target: 200, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 150 honey", target: 150, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 400,
            xp: 200,
            special: {
              type: "boots",
              name: "Honey Boots",
              level: 2,
              bonus: 2
            }
          }
        },
        {
          id: "brown_2",
          title: "Honey Expert",
          description: "Time to become a honey expert! Let's produce a significant amount of honey.",
          difficulty: "medium",
          objectives: [
            { id: "collect_pollen", description: "Collect 250 pollen", target: 250, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 200 honey", target: 200, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 500,
            xp: 250,
            special: null
          }
        },
        {
          id: "brown_3",
          title: "Mushroom Specialist",
          description: "I need someone to collect pollen from the Mushroom Field. It has unique properties.",
          difficulty: "medium",
          objectives: [
            { id: "field_mushroom", description: "Collect from Mushroom Field", target: 10, progress: 0, type: "field_mushroom" },
            { id: "convert_honey", description: "Convert to 200 honey", target: 200, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 500,
            xp: 250,
            special: {
              type: "bag",
              name: "Mushroom Bag",
              level: 2,
              bonus: 25
            }
          }
        },
        {
          id: "brown_4",
          title: "Energy Conservation",
          description: "Let's work on your energy management. Collect pollen while conserving energy.",
          difficulty: "hard",
          objectives: [
            { id: "collect_pollen", description: "Collect 300 pollen", target: 300, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 250 honey", target: 250, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 600,
            xp: 300,
            special: {
              type: "collector",
              name: "Energy Saver Scooper",
              level: 3,
              bonus: 4
            }
          }
        }
      ]
    },
    polar: {
      name: "Polar Bear",
      image: "bee/polar_bear.png",
      greeting: "Greetings, beekeeper! Polar Bear at your service. My quests are a bit more challenging, but the rewards are worth it!",
      quests: [
        {
          id: "polar_1",
          title: "Cold Collection",
          description: "Collecting pollen in cold conditions is challenging! Show me your skills by collecting a large amount.",
          difficulty: "hard",
          objectives: [
            { id: "collect_pollen", description: "Collect 300 pollen", target: 300, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 250 honey", target: 250, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 600,
            xp: 300,
            special: {
              type: "bag",
              name: "Freezer Bag",
              level: 2,
              bonus: 50
            }
          }
        },
        {
          id: "polar_2",
          title: "Field Master",
          description: "A true beekeeper can collect from any field. Show me you can handle different environments.",
          difficulty: "hard",
          objectives: [
            { id: "field_dandelion", description: "Collect from Dandelion Field", target: 5, progress: 0, type: "field_dandelion" },
            { id: "field_clover", description: "Collect from Clover Field", target: 5, progress: 0, type: "field_clover" },
            { id: "field_mushroom", description: "Collect from Mushroom Field", target: 5, progress: 0, type: "field_mushroom" },
            { id: "field_sunflower", description: "Collect from Sunflower Field", target: 5, progress: 0, type: "field_sunflower" }
          ],
          rewards: {
            honey: 800,
            xp: 400,
            special: {
              type: "boots",
              name: "Field Hopper Boots",
              level: 3,
              bonus: 5
            }
          }
        },
        {
          id: "polar_3",
          title: "Energy Master",
          description: "You need to master your energy usage to be efficient. Show me your energy conservation skills.",
          difficulty: "hard",
          objectives: [
            { id: "collect_pollen", description: "Collect 400 pollen", target: 400, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 350 honey", target: 350, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 800,
            xp: 400,
            special: {
              type: "collector",
              name: "Arctic Scooper",
              level: 3,
              bonus: 8
            }
          }
        }
      ]
    },
    panda: {
      name: "Panda Bear",
      image: "bee/panda_bear.png",
      greeting: "Hey there! Panda Bear here. I have some serious challenges for experienced beekeepers. Are you up for it?",
      quests: [
        {
          id: "panda_1",
          title: "Master Collector",
          description: "Only a master beekeeper can complete this challenge. Collect a massive amount of pollen and convert it to honey!",
          difficulty: "hard",
          objectives: [
            { id: "collect_pollen", description: "Collect 500 pollen", target: 500, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 400 honey", target: 400, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 1000,
            xp: 500,
            special: {
              type: "collector",
              name: "Golden Scooper",
              level: 3,
              bonus: 5
            }
          }
        },
        {
          id: "panda_2",
          title: "Sunflower Supremacy",
          description: "Sunflowers give the most pollen but require expertise to harvest efficiently.",
          difficulty: "extreme",
          objectives: [
            { id: "field_sunflower", description: "Collect from Sunflower Field", target: 15, progress: 0, type: "field_sunflower" },
            { id: "convert_honey", description: "Convert to 500 honey", target: 500, progress: 0, type: "honey" }
          ],
          rewards: {
            honey: 1500,
            xp: 750,
            special: {
              type: "bag",
              name: "Sunflower Mega Bag",
              level: 4,
              bonus: 100
            }
          }
        },
        {
          id: "panda_3",
          title: "Ultimate Beekeeper",
          description: "This is the ultimate test of your beekeeping skills. Only the best will succeed!",
          difficulty: "extreme",
          objectives: [
            { id: "collect_pollen", description: "Collect 1000 pollen", target: 1000, progress: 0, type: "pollen" },
            { id: "convert_honey", description: "Convert to 800 honey", target: 800, progress: 0, type: "honey" },
            { id: "field_sunflower", description: "Collect from Sunflower Field", target: 20, progress: 0, type: "field_sunflower" }
          ],
          rewards: {
            honey: 2000,
            xp: 1000,
            special: {
              type: "collector",
              name: "Ultimate Scooper",
              level: 5,
              bonus: 15
            }
          }
        }
      ]
    }
  };

  // Initialize game
  function initGame() {
    loadGameData();
    setupInventory();
    setupFieldSelector();
    updateStatDisplays();
    setupEventListeners();
    changeBear("black"); // Start with Black Bear
    startEnergyRegen();
  }

  // Load game data from localStorage
  function loadGameData() {
    const savedData = localStorage.getItem("questAdventureData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.assign(gameState, parsedData);
      updateEquipmentDisplay();
    }
  }

  // Save game data to localStorage
  function saveGameData() {
    localStorage.setItem("questAdventureData", JSON.stringify(gameState));
  }

  // Set up inventory slots
  function setupInventory() {
    inventorySlots.innerHTML = "";

    // Create 9 inventory slots
    for (let i = 0; i < 9; i++) {
      const slot = document.createElement("div");
      slot.className = "inventory-slot";
      slot.dataset.slot = i;

      if (gameState.inventory[i]) {
        const item = gameState.inventory[i];
        slot.classList.add("filled");

        const itemImg = document.createElement("img");
        itemImg.src = item.image || "bee/item_placeholder.png";
        itemImg.alt = item.name;
        itemImg.title = `${item.name} - ${item.description}`;

        slot.appendChild(itemImg);

        // Add click event to use/equip item
        slot.addEventListener("click", () => useItem(i));
      }

      inventorySlots.appendChild(slot);
    }
  }

  // Update equipment display
  function updateEquipmentDisplay() {
    collectorName.textContent = `${gameState.equipment.collector.name} (Lv.${gameState.equipment.collector.level})`;
    bagName.textContent = `${gameState.equipment.bag.name} (Lv.${gameState.equipment.bag.level})`;
    bootsName.textContent = `${gameState.equipment.boots.name} (Lv.${gameState.equipment.boots.level})`;

    // Update game stats based on equipment
    gameState.pollenCapacity = 100 + gameState.equipment.bag.capacityBonus;
    gameState.pollenCollectionRate = 5 + gameState.equipment.collector.collectionBonus + gameState.equipment.boots.speedBonus;
  }

  // Update stat displays
  function updateStatDisplays() {
    honeyAmount.textContent = gameState.honey;
    pollenAmount.textContent = `${gameState.pollen}/${gameState.pollenCapacity}`;
    completedQuestsCounter.textContent = gameState.completedQuests;
    updateEnergyDisplay();
    updateXPDisplay();
  }

  // Change the current bear
  function changeBear(bearId) {
    // Update active bear
    gameState.currentBear = bearId;

    // Update UI
    const bear = bears[bearId];
    dialogBearImg.src = bear.image;
    bearName.textContent = bear.name;
    questText.textContent = bear.greeting;

    // Update bear options
    const bearOptions = document.querySelectorAll(".bear-option");
    bearOptions.forEach(option => {
      if (option.dataset.bear === bearId) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });

    // Show available quests
    showAvailableQuests(bearId);

    // Hide active quest if any
    activeQuest.classList.add("hidden");
    availableQuests.classList.remove("hidden");

    // Reset active quest
    gameState.activeQuest = null;

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/bear_select.mp3");
    }
  }

  // Show available quests for a bear
  function showAvailableQuests(bearId) {
    questList.innerHTML = "";

    const bear = bears[bearId];
    const now = Date.now();

    bear.quests.forEach(quest => {
      const questItem = document.createElement("div");
      questItem.className = "quest-item";
      questItem.dataset.questId = quest.id;

      // Check if quest is on cooldown
      const cooldownTime = gameState.questCooldowns[quest.id] || 0;
      const isOnCooldown = cooldownTime > now;

      if (isOnCooldown) {
        questItem.classList.add("on-cooldown");

        // Calculate time remaining
        const timeRemaining = cooldownTime - now;
        const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
        const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

        questItem.dataset.cooldown = `${hoursRemaining}h ${minutesRemaining}m`;
      }

      const titleElement = document.createElement("div");
      titleElement.className = "quest-title";
      titleElement.textContent = quest.title;

      const descElement = document.createElement("div");
      descElement.className = "quest-desc";
      descElement.textContent = quest.description;

      const difficultyElement = document.createElement("div");
      difficultyElement.className = `quest-difficulty difficulty-${quest.difficulty}`;
      difficultyElement.textContent = `Difficulty: ${quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}`;

      // Show cooldown if applicable
      if (isOnCooldown) {
        const cooldownElement = document.createElement("div");
        cooldownElement.className = "quest-cooldown";
        cooldownElement.textContent = `Available in: ${questItem.dataset.cooldown}`;
        questItem.appendChild(cooldownElement);
      }

      questItem.appendChild(titleElement);
      questItem.appendChild(descElement);
      questItem.appendChild(difficultyElement);

      // Add click event to select this quest if not on cooldown
      if (!isOnCooldown) {
        questItem.addEventListener("click", () => selectQuest(quest.id));
      }

      questList.appendChild(questItem);
    });
  }

  // Select a quest
  function selectQuest(questId) {
    // Find the quest
    const bearId = gameState.currentBear;
    const quest = bears[bearId].quests.find(q => q.id === questId);

    if (!quest) return;

    // Update game state
    gameState.activeQuest = quest;

    // Reset quest progress
    gameState.questProgress.objectives = JSON.parse(JSON.stringify(quest.objectives)); // Deep copy

    // Update UI
    activeQuestTitle.textContent = quest.title;
    activeQuestDescription.textContent = quest.description;

    // Show objectives
    objectivesList.innerHTML = "";
    gameState.questProgress.objectives.forEach(objective => {
      const li = document.createElement("li");
      li.className = "objective-incomplete";
      li.dataset.objectiveId = objective.id;
      li.textContent = `${objective.description} (${objective.progress}/${objective.target})`;
      objectivesList.appendChild(li);
    });

    // Show active quest, hide available quests
    availableQuests.classList.add("hidden");
    activeQuest.classList.remove("hidden");

    // Update complete button state
    updateCompleteButtonState();

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/quest_accept.mp3");
    }
  }

  // Collect pollen
  function collectPollen() {
    // Check if bag is full
    if (gameState.pollen >= gameState.pollenCapacity) {
      showMessage("Your pollen bag is full! Convert some pollen to honey.");
      return;
    }

    // Check if has energy
    if (gameState.energy < 10) {
      showMessage("You don't have enough energy! Rest to recover energy.");
      return;
    }

    // Use energy
    gameState.energy -= 10;

    // Calculate collection amount based on field multiplier
    const fieldMultiplier = fields[gameState.currentField].pollenMultiplier || 1;
    const collectionAmount = Math.floor(gameState.pollenCollectionRate * fieldMultiplier);

    // Update pollen amount, ensuring we don't exceed capacity
    const newPollen = Math.min(gameState.pollen + collectionAmount, gameState.pollenCapacity);
    const actualCollected = newPollen - gameState.pollen;

    gameState.pollen = newPollen;
    gameState.stats.totalPollen += actualCollected;

    // Update objectives if needed
    if (gameState.activeQuest) {
      updateObjectiveProgress("pollen", actualCollected);
      updateObjectiveProgress("field_" + gameState.currentField, 1);
    }

    // Update displays
    updateStatDisplays();
    updateEnergyDisplay();

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/collect.mp3");
    }
  }

  // Convert pollen to honey
  function convertToHoney() {
    // Check if there's pollen to convert
    if (gameState.pollen <= 0) {
      showMessage("You don't have any pollen to convert!");
      return;
    }

    // Check if has energy
    if (gameState.energy < 5) {
      showMessage("You don't have enough energy! Rest to recover energy.");
      return;
    }

    // Use energy
    gameState.energy -= 5;

    // Convert pollen to honey
    const honeyGained = Math.floor(gameState.pollen * gameState.conversionRate);
    gameState.honey += honeyGained;
    gameState.stats.totalHoney += honeyGained;

    // Reset pollen
    gameState.pollen = 0;

    // Update objectives if needed
    if (gameState.activeQuest) {
      updateObjectiveProgress("honey", honeyGained);
    }

    // Update display
    updateStatDisplays();
    updateEnergyDisplay();

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/convert.mp3");
    }
  }

  // Update objective progress
  function updateObjectiveProgress(type, amount) {
    let allCompleted = true;

    gameState.questProgress.objectives.forEach(objective => {
      if (objective.type === type) {
        objective.progress += amount;
        if (objective.progress > objective.target) {
          objective.progress = objective.target;
        }
      }

      // Update objective display
      const objectiveElement = document.querySelector(`#objectives-list li[data-objective-id="${objective.id}"]`);
      if (objectiveElement) {
        objectiveElement.textContent = `${objective.description} (${objective.progress}/${objective.target})`;

        if (objective.progress >= objective.target) {
          objectiveElement.classList.remove("objective-incomplete");
          objectiveElement.classList.add("objective-complete");
        } else {
          allCompleted = false;
        }
      }
    });

    // Update complete button state
    updateCompleteButtonState();
  }

  // Update complete button state
  function updateCompleteButtonState() {
    const allCompleted = gameState.questProgress.objectives.every(
      objective => objective.progress >= objective.target
    );

    completeQuestBtn.disabled = !allCompleted;
  }

  // Complete current quest
  function completeQuest() {
    if (!gameState.activeQuest) return;

    const quest = gameState.activeQuest;
    const rewards = quest.rewards;

    // Calculate XP based on difficulty
    let xpReward = rewards.xp;
    if (quest.difficulty === "medium") {
      xpReward = Math.floor(xpReward * 1.2);
    } else if (quest.difficulty === "hard") {
      xpReward = Math.floor(xpReward * 1.5);
    }

    // Show reward modal
    rewardHoney.textContent = `+${rewards.honey}`;
    rewardXp.textContent = `+${xpReward}`;

    if (rewards.special) {
      specialReward.style.display = "flex";
      rewardSpecial.textContent = rewards.special.name;
    } else {
      specialReward.style.display = "none";
    }

    completionMessage.textContent = `You've successfully completed "${quest.title}"!`;

    rewardModal.style.display = "block";

    // Set cooldown for this quest (6 hours in real time)
    const cooldownTime = Date.now() + (6 * 60 * 60 * 1000);
    gameState.questCooldowns[quest.id] = cooldownTime;

    // Update XP
    addXP(xpReward);

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/quest_complete.mp3");
    }
  }

  // Claim quest rewards
  function claimRewards() {
    if (!gameState.activeQuest) return;

    const quest = gameState.activeQuest;
    const rewards = quest.rewards;

    // Add rewards
    gameState.honey += rewards.honey;
    gameState.completedQuests++;
    gameState.stats.questsCompleted[gameState.currentBear]++;

    // Add special reward if any
    if (rewards.special) {
      addSpecialReward(rewards.special);
    }

    // Update stats
    updateStatDisplays();

    // Close reward modal
    rewardModal.style.display = "none";

    // Return to quest selection
    availableQuests.classList.remove("hidden");
    activeQuest.classList.add("hidden");

    // Reset active quest
    gameState.activeQuest = null;

    // Save game data
    saveGameData();

    // Show success message
    showMessage("Quest completed! Rewards claimed.");

    // Change bear dialog
    questText.textContent = `Thanks for your help! You completed "${quest.title}" successfully.`;
  }

  // Abandon current quest
  function abandonQuest() {
    if (!gameState.activeQuest) return;

    // Confirm abandonment
    if (!confirm("Are you sure you want to abandon this quest? Your progress will be lost.")) {
      return;
    }

    // Return to quest selection
    availableQuests.classList.remove("hidden");
    activeQuest.classList.add("hidden");

    // Reset active quest
    gameState.activeQuest = null;

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/quest_abandon.mp3");
    }

    // Change bear dialog
    questText.textContent = "That's okay. You can try again later or choose a different quest.";
  }

  // Add special reward to equipment or inventory
  function addSpecialReward(special) {
    if (special.type === "collector" || special.type === "bag" || special.type === "boots") {
      // Equip the item
      gameState.equipment[special.type] = {
        name: special.name,
        level: special.level,
        collectionBonus: special.type === "collector" ? special.bonus : 0,
        capacityBonus: special.type === "bag" ? special.bonus : 0,
        speedBonus: special.type === "boots" ? special.bonus : 0
      };

      // Update equipment display
      updateEquipmentDisplay();
    } else {
      // Add to inventory
      const emptySlot = gameState.inventory.findIndex(item => !item);

      if (emptySlot !== -1) {
        gameState.inventory[emptySlot] = {
          name: special.name,
          description: special.description || "A special item",
          image: special.image || "bee/item_placeholder.png",
          type: special.type
        };

        setupInventory();
      } else {
        showMessage("Your inventory is full! The item was discarded.");
      }
    }

    gameState.stats.itemsCollected++;
  }

  // Use an item from inventory
  function useItem(slotIndex) {
    const item = gameState.inventory[slotIndex];

    if (!item) return;

    // Implement item usage based on type
    switch (item.type) {
      case "consumable":
        // Logic for consumable items
        showMessage(`Used ${item.name}!`);
        gameState.inventory[slotIndex] = null;
        break;
      case "equipment":
        // Logic for equippable items
        showMessage(`Equipped ${item.name}!`);
        // Add equipment logic here
        break;
      default:
        showMessage(`${item.name} can't be used directly.`);
        break;
    }

    // Update inventory display
    setupInventory();
  }

  // Show stats
  function showStats() {
    const statsContent = `
      <h2>Quest Adventure Stats</h2>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Player Level:</div>
          <div class="stat-value">${gameState.level}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Quests Completed:</div>
          <div class="stat-value">${gameState.completedQuests}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Honey Collected:</div>
          <div class="stat-value">${gameState.stats.totalHoney}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Pollen Collected:</div>
          <div class="stat-value">${gameState.stats.totalPollen}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Items Collected:</div>
          <div class="stat-value">${gameState.stats.itemsCollected}</div>
        </div>
      </div>

      <h3>Quest Completion</h3>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Black Bear Quests:</div>
          <div class="stat-value">${gameState.stats.questsCompleted.black}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Brown Bear Quests:</div>
          <div class="stat-value">${gameState.stats.questsCompleted.brown}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Polar Bear Quests:</div>
          <div class="stat-value">${gameState.stats.questsCompleted.polar}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Panda Bear Quests:</div>
          <div class="stat-value">${gameState.stats.questsCompleted.panda}</div>
        </div>
      </div>

      <h3>Fields Visited</h3>
      <div class="stats-container">
        ${Object.entries(gameState.stats.fieldsVisited).map(([fieldId, count]) => `
          <div class="stat-item">
            <div class="stat-label">${fields[fieldId]?.name || fieldId}:</div>
            <div class="stat-value">${count} times</div>
          </div>
        `).join('')}
      </div>

      <h3>Equipment</h3>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Pollen Collector:</div>
          <div class="stat-value">${gameState.equipment.collector.name} (Lv.${gameState.equipment.collector.level})</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Pollen Bag:</div>
          <div class="stat-value">${gameState.equipment.bag.name} (Lv.${gameState.equipment.bag.level})</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Boots:</div>
          <div class="stat-value">${gameState.equipment.boots.name} (Lv.${gameState.equipment.boots.level})</div>
        </div>
      </div>
    `;

    modalText.innerHTML = statsContent;
    modal.style.display = "block";
  }

  // Show a message
  function showMessage(message) {
    // Simple alert for now
    alert(message);
  }

  // Play sound effect
  function playSound(src) {
    const sound = new Audio(src);
    sound.play().catch(e => {
      // Suppress errors when audio files don't exist
      console.log("Audio file not found:", src);
    });
  }

  // Setup event listeners
  function setupEventListeners() {
    // Bear selection
    bearsList.querySelectorAll(".bear-option").forEach(option => {
      option.addEventListener("click", () => {
        changeBear(option.dataset.bear);
      });
    });

    // Pollen collection and honey conversion
    collectPollenBtn.addEventListener("click", collectPollen);
    convertHoneyBtn.addEventListener("click", convertToHoney);

    // Quest actions
    completeQuestBtn.addEventListener("click", completeQuest);
    abandonQuestBtn.addEventListener("click", abandonQuest);

    // Energy recovery
    if (restEnergyBtn) {
      restEnergyBtn.addEventListener("click", restToRecoverEnergy);
    }

    // Claim rewards
    claimRewardsBtn.addEventListener("click", claimRewards);

    // Show stats
    showStatsButton.addEventListener("click", showStats);

    // Close modals
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    rewardClose.addEventListener("click", () => {
      rewardModal.style.display = "none";
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
      if (e.target === rewardModal) {
        rewardModal.style.display = "none";
      }
    });
  }

  // Start energy regeneration timer
  function startEnergyRegen() {
    setInterval(() => {
      // Only regenerate if not at max
      if (gameState.energy < gameState.maxEnergy) {
        const now = Date.now();
        const timePassed = now - gameState.lastEnergyRegen;

        // Regenerate energy every 10 seconds
        if (timePassed >= 10000) {
          gameState.energy = Math.min(gameState.energy + gameState.energyRegenRate, gameState.maxEnergy);
          gameState.lastEnergyRegen = now;
          updateEnergyDisplay();
        }
      }
    }, 1000);
  }

  // Set up field selector
  function setupFieldSelector() {
    fieldSelector.innerHTML = "";

    Object.keys(fields).forEach(fieldId => {
      const field = fields[fieldId];
      const option = document.createElement("div");
      option.className = "field-option";
      option.dataset.field = fieldId;

      if (fieldId === gameState.currentField) {
        option.classList.add("active");
      }

      const fieldImage = document.createElement("img");
      fieldImage.src = field.image || "bee/field_placeholder.png";
      fieldImage.alt = field.name;

      const fieldName = document.createElement("span");
      fieldName.textContent = field.name;

      option.appendChild(fieldImage);
      option.appendChild(fieldName);

      option.addEventListener("click", () => changeField(fieldId));

      fieldSelector.appendChild(option);
    });

    // Update current field display
    if (currentField) {
      const field = fields[gameState.currentField];
      currentField.textContent = field.name;
    }
  }

  // Update energy display
  function updateEnergyDisplay() {
    if (energyAmount) {
      energyAmount.textContent = `${gameState.energy}/${gameState.maxEnergy}`;
    }
    if (energyBar) {
      const percentage = (gameState.energy / gameState.maxEnergy) * 100;
      energyBar.style.width = `${percentage}%`;

      // Change color based on energy level
      if (percentage > 60) {
        energyBar.style.backgroundColor = "#4CAF50"; // Green
      } else if (percentage > 30) {
        energyBar.style.backgroundColor = "#FFC107"; // Yellow/Orange
      } else {
        energyBar.style.backgroundColor = "#F44336"; // Red
      }
    }
  }

  // Change the current field
  function changeField(fieldId) {
    if (!fields[fieldId]) return;

    // Update active field
    gameState.currentField = fieldId;

    // Update field options
    const fieldOptions = document.querySelectorAll(".field-option");
    fieldOptions.forEach(option => {
      if (option.dataset.field === fieldId) {
        option.classList.add("active");
      } else {
        option.classList.remove("active");
      }
    });

    // Update current field display
    if (currentField) {
      const field = fields[gameState.currentField];
      currentField.textContent = field.name;
    }

    // Update stats
    if (!gameState.stats.fieldsVisited[fieldId]) {
      gameState.stats.fieldsVisited[fieldId] = 0;
    }
    gameState.stats.fieldsVisited[fieldId]++;

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/field_change.mp3");
    }

    // Save game data
    saveGameData();
  }

  // Add XP and handle level ups
  function addXP(amount) {
    gameState.xp += amount;

    // Check for level up - simple formula: 100 * level for next level
    const xpForNextLevel = 100 * gameState.level;

    if (gameState.xp >= xpForNextLevel) {
      gameState.xp -= xpForNextLevel;
      gameState.level++;

      // Level up benefits
      gameState.maxEnergy += 10;
      gameState.energy = gameState.maxEnergy; // Refill energy on level up

      // Show level up message
      showMessage(`Level Up! You are now level ${gameState.level}. Your max energy has increased!`);

      // Play level up sound
      if (soundToggle.checked) {
        playSound("sound/level_up.mp3");
      }
    }

    // Update XP display
    updateXPDisplay();
  }

  // Update XP display
  function updateXPDisplay() {
    if (xpLevel) {
      xpLevel.textContent = gameState.level;
    }

    if (xpProgress) {
      const xpForNextLevel = 100 * gameState.level;
      const percentage = (gameState.xp / xpForNextLevel) * 100;
      xpProgress.style.width = `${percentage}%`;
      xpProgress.setAttribute("title", `${gameState.xp}/${xpForNextLevel} XP`);
    }
  }

  // Rest to recover energy
  function restToRecoverEnergy() {
    // Rest costs honey but recovers energy
    const restCost = 10 * gameState.level;

    if (gameState.honey < restCost) {
      showMessage(`You need ${restCost} honey to rest!`);
      return;
    }

    gameState.honey -= restCost;
    gameState.energy = gameState.maxEnergy;

    // Update displays
    updateEnergyDisplay();
    updateStatDisplays();

    // Play sound
    if (soundToggle.checked) {
      playSound("sound/rest.mp3");
    }

    showMessage(`You rested and recovered all your energy for ${restCost} honey.`);
  }

  // Initialize the game
  initGame();
});
