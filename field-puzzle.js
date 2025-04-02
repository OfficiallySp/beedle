// Field Puzzle Game Logic
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const fieldsGrid = document.getElementById("fields-grid");
  const beesGrid = document.getElementById("bees-grid");
  const assignmentsContainer = document.getElementById("assignments");
  const submitButton = document.getElementById("submit-assignments");
  const resetButton = document.getElementById("reset-assignments");
  const nextLevelButton = document.getElementById("next-level");
  const resultContainer = document.getElementById("result-container");
  const resultMessage = document.getElementById("result-message");
  const resultScore = document.getElementById("result-score");
  const pointsDisplay = document.getElementById("points");
  const timeDisplay = document.getElementById("time-remaining");
  const levelDisplay = document.getElementById("current-level");
  const streakDisplay = document.getElementById("current-streak");
  const soundToggle = document.getElementById("sound-toggle");
  const showStatsButton = document.getElementById("show-stats-button");
  const showCombosButton = document.getElementById("show-combos-button");
  const showTutorialButton = document.getElementById("show-tutorial");
  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeModal = document.querySelector(".close");
  const fieldInfoModal = document.getElementById("field-info-modal");
  const fieldInfoClose = document.querySelector(".field-close");
  const fieldName = document.getElementById("field-name");
  const fieldImage = document.getElementById("field-image");
  const fieldDescription = document.getElementById("field-description");
  const idealBeesList = document.getElementById("ideal-bees-list");

  // Game state
  const gameState = {
    score: 0,
    level: 1,
    timeRemaining: 60,
    timerInterval: null,
    assignments: {},
    combos: {}, // Track combos for each field
    currentStreak: 0, // Track correct assignments streak
    stats: {
      gamesPlayed: 0,
      highestScore: 0,
      highestLevel: 1,
      totalScore: 0,
      highestStreak: 0, // Track highest streak achieved
      perfectAssignments: 0 // Track number of perfect assignments
    }
  };

  // Field data
  const fields = [
    {
      id: 1,
      name: "Dandelion Field",
      type: "White",
      image: "bee/dandelion_field.png", // Placeholder
      description: "A field full of dandelions, perfect for beginner bees. It provides a steady source of white pollen.",
      idealBees: [1, 3, 4], // IDs of bees that work best in this field
      color: "White",
      difficulty: 1
    },
    {
      id: 2,
      name: "Sunflower Field",
      type: "White",
      image: "bee/sunflower_field.png", // Placeholder
      description: "A bright field of sunflowers that produces white pollen at a medium rate.",
      idealBees: [2, 3, 6],
      color: "White",
      difficulty: 1
    },
    {
      id: 3,
      name: "Mushroom Field",
      type: "Red",
      image: "bee/mushroom_field.png", // Placeholder
      description: "A field with many mushrooms that produces red pollen. Red bees excel here.",
      idealBees: [5, 9, 11],
      color: "Red",
      difficulty: 2
    },
    {
      id: 4,
      name: "Blue Flower Field",
      type: "Blue",
      image: "bee/blue_flower_field.png", // Placeholder
      description: "A field of blue flowers that produces blue pollen. Blue bees thrive in this environment.",
      idealBees: [6, 8, 10],
      color: "Blue",
      difficulty: 2
    },
    {
      id: 5,
      name: "Clover Field",
      type: "Blue",
      image: "bee/clover_field.png", // Placeholder
      description: "A field of clovers that produces blue pollen. Great for blue bees and those that like conversion.",
      idealBees: [4, 10, 12],
      color: "Blue",
      difficulty: 2
    },
    {
      id: 6,
      name: "Spider Field",
      type: "White",
      image: "bee/spider_field.png", // Placeholder
      description: "A field with spider webs that produces white pollen. Brave bees do well here.",
      idealBees: [3, 6, 7],
      color: "White",
      difficulty: 3
    },
    {
      id: 7,
      name: "Strawberry Field",
      type: "Red",
      image: "bee/strawberry_field.png", // Placeholder
      description: "A field of strawberry plants that produces red pollen. Red bees will be most efficient here.",
      idealBees: [7, 9, 12],
      color: "Red",
      difficulty: 3
    },
    {
      id: 8,
      name: "Bamboo Field",
      type: "White",
      image: "bee/bamboo_field.png", // Placeholder
      description: "A field of bamboo plants that produces white pollen. Good for versatile bees.",
      idealBees: [2, 5, 8],
      color: "White",
      difficulty: 3
    },
    {
      id: 9,
      name: "Pineapple Patch",
      type: "Blue",
      image: "bee/pineapple_field.png", // Placeholder
      description: "A patch of pineapple plants that produces blue pollen. Excellent for blue bees.",
      idealBees: [6, 8, 12],
      color: "Blue",
      difficulty: 4
    },
    {
      id: 10,
      name: "Rose Field",
      type: "Red",
      image: "bee/rose_field.png", // Placeholder
      description: "A beautiful field of roses that produces red pollen. Red bees will excel here.",
      idealBees: [5, 10, 11],
      color: "Red",
      difficulty: 4
    }
  ];

  // Bee data
  const bees = [
    { id: 1, name: "Basic Bee", type: "Common", color: "White", img: "bee/basic.png", speciality: "Balanced" },
    { id: 2, name: "Hasty Bee", type: "Rare", color: "White", img: "bee/hasty.png", speciality: "Speed" },
    { id: 3, name: "Brave Bee", type: "Rare", color: "White", img: "bee/brave.png", speciality: "Attack" },
    { id: 4, name: "Looker Bee", type: "Rare", color: "Blue", img: "bee/looker.png", speciality: "Tokens" },
    { id: 5, name: "Shocked Bee", type: "Rare", color: "Red", img: "bee/shocked.png", speciality: "Bombs" },
    { id: 6, name: "Commander Bee", type: "Epic", color: "Blue", img: "bee/commander.png", speciality: "Boost" },
    { id: 7, name: "Demo Bee", type: "Epic", color: "Red", img: "bee/demo.png", speciality: "Bombs" },
    { id: 8, name: "Exhausted Bee", type: "Epic", color: "Blue", img: "bee/exhausted.png", speciality: "Energy" },
    { id: 9, name: "Fire Bee", type: "Epic", color: "Red", img: "bee/fire.png", speciality: "Flames" },
    { id: 10, name: "Fuzzy Bee", type: "Legendary", color: "Red", img: "bee/fuzzy.png", speciality: "Pollen" },
    { id: 11, name: "Vicious Bee", type: "Legendary", color: "Red", img: "bee/vicious.png", speciality: "Attack" },
    { id: 12, name: "Vector Bee", type: "Legendary", color: "Blue", img: "bee/vector.png", speciality: "Marks" }
  ];

  // Bee combo definitions
  const beeComboDefinitions = [
    {
      name: "Attack Squad",
      requiredSpecialities: ["Attack", "Attack"],
      bonusPoints: 15,
      description: "Two attack-focused bees working together"
    },
    {
      name: "Bomb Squad",
      requiredSpecialities: ["Bombs", "Bombs"],
      bonusPoints: 15,
      description: "Two bomb-producing bees create explosive synergy"
    },
    {
      name: "Royal Collection",
      requiredTypes: ["Legendary", "Legendary"],
      bonusPoints: 20,
      description: "Two legendary bees working together"
    },
    {
      name: "Color Harmony",
      checkFunction: (beeIds) => {
        const beeColors = beeIds.map(id => bees.find(b => b.id === id).color);
        return beeColors.length >= 3 && beeColors.every(color => color === beeColors[0]);
      },
      bonusPoints: 25,
      description: "Three bees of the same color creating harmony"
    },
    {
      name: "Balanced Team",
      checkFunction: (beeIds) => {
        const beeTypes = beeIds.map(id => bees.find(b => b.id === id).type);
        return new Set(beeTypes).size >= 3;
      },
      bonusPoints: 20,
      description: "A diverse team with at least three different bee types"
    }
  ];

  // Initialize game
  function initGame() {
    loadGameStats();
    setupLevel();
    setupEventListeners();
  }

  // Load game stats from localStorage
  function loadGameStats() {
    const savedStats = localStorage.getItem("fieldPuzzleStats");
    if (savedStats) {
      gameState.stats = JSON.parse(savedStats);
    }
  }

  // Save game stats to localStorage
  function saveGameStats() {
    localStorage.setItem("fieldPuzzleStats", JSON.stringify(gameState.stats));
  }

  // Set up the current level
  function setupLevel() {
    // Reset assignments
    gameState.assignments = {};
    gameState.combos = {};
    assignmentsContainer.innerHTML = "";

    // Hide result container
    resultContainer.classList.add("hidden");

    // Update level display
    levelDisplay.textContent = gameState.level;

    // Update streak display
    streakDisplay.textContent = gameState.currentStreak;

    // Set time based on level (decreases slightly as levels increase for challenge)
    gameState.timeRemaining = Math.max(30, 70 - (gameState.level * 2));
    timeDisplay.textContent = gameState.timeRemaining;

    // Clear existing timer if any
    if (gameState.timerInterval) {
      clearInterval(gameState.timerInterval);
    }

    // Start timer
    startTimer();

    // Load fields and bees based on level
    loadFieldsForLevel();
    loadBeesForLevel();
  }

  // Start the timer
  function startTimer() {
    gameState.timerInterval = setInterval(() => {
      gameState.timeRemaining--;
      timeDisplay.textContent = gameState.timeRemaining;

      if (gameState.timeRemaining <= 0) {
        clearInterval(gameState.timerInterval);
        evaluateAssignments();
      }
    }, 1000);
  }

  // Load fields for the current level
  function loadFieldsForLevel() {
    fieldsGrid.innerHTML = "";

    // Number of fields increases with level (max 5)
    const numFields = Math.min(3 + Math.floor(gameState.level / 2), 5);

    // Filter fields by difficulty appropriate for current level
    const appropriateFields = fields.filter(field => {
      return field.difficulty <= Math.min(4, Math.ceil(gameState.level / 2));
    });

    // Shuffle and select fields
    const shuffledFields = [...appropriateFields].sort(() => Math.random() - 0.5);
    const levelFields = shuffledFields.slice(0, numFields);

    // Create field cards
    levelFields.forEach(field => {
      const fieldCard = createFieldCard(field);
      fieldsGrid.appendChild(fieldCard);

      // Create an empty assignment for this field
      createAssignment(field);
    });
  }

  // Load bees for the current level
  function loadBeesForLevel() {
    beesGrid.innerHTML = "";

    // Number of bee options increases with level
    const numBees = 6 + Math.floor(gameState.level / 2);

    // Shuffle and select bees
    const shuffledBees = [...bees].sort(() => Math.random() - 0.5);
    const levelBees = shuffledBees.slice(0, numBees);

    // Create bee cards
    levelBees.forEach(bee => {
      const beeCard = createBeeCard(bee);
      beesGrid.appendChild(beeCard);
    });
  }

  // Create a field card element
  function createFieldCard(field) {
    const fieldCard = document.createElement("div");
    fieldCard.className = "field-card";
    fieldCard.dataset.id = field.id;

    const fieldImg = document.createElement("img");
    fieldImg.src = field.image;
    fieldImg.alt = field.name;

    const fieldNameElement = document.createElement("div");
    fieldNameElement.className = "field-name";
    fieldNameElement.textContent = field.name;

    const fieldTypeElement = document.createElement("div");
    fieldTypeElement.className = "field-type";
    fieldTypeElement.textContent = field.type;

    // Add difficulty indicator
    const difficultyElement = document.createElement("div");
    difficultyElement.className = "field-difficulty";
    difficultyElement.textContent = "⭐".repeat(field.difficulty);

    fieldCard.appendChild(fieldImg);
    fieldCard.appendChild(fieldNameElement);
    fieldCard.appendChild(fieldTypeElement);
    fieldCard.appendChild(difficultyElement);

    // Add click event to show field info
    fieldCard.addEventListener("click", () => {
      showFieldInfo(field);
    });

    return fieldCard;
  }

  // Show field information in modal
  function showFieldInfo(field) {
    fieldName.textContent = field.name;
    fieldImage.src = field.image;
    fieldImage.alt = field.name;
    fieldDescription.textContent = field.description;

    // Show ideal bees
    idealBeesList.innerHTML = "";
    field.idealBees.forEach(beeId => {
      const bee = bees.find(b => b.id === beeId);
      if (bee) {
        const listItem = document.createElement("li");

        const beeImg = document.createElement("img");
        beeImg.src = bee.img;
        beeImg.alt = bee.name;

        const beeName = document.createElement("span");
        beeName.textContent = `${bee.name} (${bee.color}) - ${bee.speciality}`;

        listItem.appendChild(beeImg);
        listItem.appendChild(beeName);

        idealBeesList.appendChild(listItem);
      }
    });

    fieldInfoModal.style.display = "block";
  }

  // Create a bee card element
  function createBeeCard(bee) {
    const beeCard = document.createElement("div");
    beeCard.className = "bee-card";
    beeCard.dataset.id = bee.id;

    const beeImg = document.createElement("img");
    beeImg.src = bee.img;
    beeImg.alt = bee.name;

    const beeName = document.createElement("div");
    beeName.className = "bee-card-name";
    beeName.textContent = bee.name;

    const beeType = document.createElement("div");
    beeType.className = "bee-card-type";
    beeType.textContent = `${bee.type} - ${bee.color}`;

    const beeSpeciality = document.createElement("div");
    beeSpeciality.className = "bee-card-speciality";
    beeSpeciality.textContent = `${bee.speciality}`;

    beeCard.appendChild(beeImg);
    beeCard.appendChild(beeName);
    beeCard.appendChild(beeType);
    beeCard.appendChild(beeSpeciality);

    // Make the bee card draggable
    beeCard.draggable = true;

    // Add drag events
    beeCard.addEventListener("dragstart", handleBeeDragStart);

    // Add click event for mobile (simpler than drag/drop)
    beeCard.addEventListener("click", () => {
      showBeeAssignmentDialog(bee);
    });

    return beeCard;
  }

  // Show dialog to select which field to assign the bee to
  function showBeeAssignmentDialog(bee) {
    // Generate a simple field selection dialog
    let fieldOptions = "";

    Object.keys(gameState.assignments).forEach(fieldId => {
      const field = fields.find(f => f.id === parseInt(fieldId));
      if (field) {
        fieldOptions += `<div class="field-option" data-id="${field.id}">
          <img src="${field.image}" alt="${field.name}">
          <span>${field.name}</span>
        </div>`;
      }
    });

    const dialogContent = `
      <h3>Assign ${bee.name} to Field</h3>
      <div class="bee-preview">
        <img src="${bee.img}" alt="${bee.name}">
        <div>${bee.name} (${bee.color}) - ${bee.speciality}</div>
      </div>
      <p>Select a field to assign this bee to:</p>
      <div class="field-options">
        ${fieldOptions}
      </div>
      <button id="cancel-assignment">Cancel</button>
    `;

    modalText.innerHTML = dialogContent;
    modal.style.display = "block";

    // Add click event to field options
    const fieldOptionElements = modalText.querySelectorAll(".field-option");
    fieldOptionElements.forEach(option => {
      option.addEventListener("click", () => {
        const fieldId = option.dataset.id;
        assignBeeToField(bee, parseInt(fieldId));
        modal.style.display = "none";
      });
    });

    // Add click event to cancel button
    const cancelButton = document.getElementById("cancel-assignment");
    cancelButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  // Create an assignment container for a field
  function createAssignment(field) {
    // Initialize empty assignment in game state
    gameState.assignments[field.id] = [];
    gameState.combos[field.id] = [];

    // Create assignment element
    const assignment = document.createElement("div");
    assignment.className = "assignment";
    assignment.dataset.fieldId = field.id;

    const fieldElement = document.createElement("div");
    fieldElement.className = "assignment-field";

    const fieldImg = document.createElement("img");
    fieldImg.src = field.image;
    fieldImg.alt = field.name;

    const fieldNameElement = document.createElement("div");
    fieldNameElement.textContent = field.name;

    const fieldDifficultyElement = document.createElement("div");
    fieldDifficultyElement.className = "field-difficulty-small";
    fieldDifficultyElement.textContent = "⭐".repeat(field.difficulty);

    fieldElement.appendChild(fieldImg);
    fieldElement.appendChild(fieldNameElement);
    fieldElement.appendChild(fieldDifficultyElement);

    const beesElement = document.createElement("div");
    beesElement.className = "assignment-bees";
    beesElement.dataset.fieldId = field.id;

    // Make the bees container a drop target
    beesElement.addEventListener("dragover", handleFieldDragOver);
    beesElement.addEventListener("drop", handleFieldDrop);

    assignment.appendChild(fieldElement);
    assignment.appendChild(beesElement);

    assignmentsContainer.appendChild(assignment);
  }

  // Add a bee to a field assignment
  function assignBeeToField(bee, fieldId) {
    // Check if assignment exists
    if (!gameState.assignments[fieldId]) {
      return;
    }

    // Check if bee is already assigned elsewhere and remove if so
    Object.keys(gameState.assignments).forEach(fId => {
      const beeIndex = gameState.assignments[fId].indexOf(bee.id);
      if (beeIndex !== -1) {
        removeBeeFromField(bee.id, parseInt(fId));
      }
    });

    // Add bee to assignment
    gameState.assignments[fieldId].push(bee.id);

    // Update UI
    const assignmentBeesElement = document.querySelector(`.assignment-bees[data-field-id="${fieldId}"]`);

    const assignedBee = document.createElement("div");
    assignedBee.className = "assigned-bee";
    assignedBee.dataset.beeId = bee.id;

    const beeImg = document.createElement("img");
    beeImg.src = bee.img;
    beeImg.alt = bee.name;

    const beeName = document.createElement("span");
    beeName.textContent = bee.name;

    const removeButton = document.createElement("span");
    removeButton.className = "remove-bee";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      removeBeeFromField(bee.id, fieldId);
    });

    assignedBee.appendChild(beeImg);
    assignedBee.appendChild(beeName);
    assignedBee.appendChild(removeButton);

    assignmentBeesElement.appendChild(assignedBee);

    // Check for combos after assignment
    checkForCombos(fieldId);

    // Play assign sound
    if (soundToggle.checked) {
      playSound("sound/assign.mp3");
    }
  }

  // Check if the bees in a field create any combos
  function checkForCombos(fieldId) {
    const assignedBeeIds = gameState.assignments[fieldId];
    const currentCombos = [];

    // Check each combo definition to see if it applies
    beeComboDefinitions.forEach(comboDefinition => {
      // Skip if we already have this combo
      if (gameState.combos[fieldId] && gameState.combos[fieldId].includes(comboDefinition.name)) {
        return;
      }

      let comboActivated = false;

      // Check for speciality-based combos
      if (comboDefinition.requiredSpecialities) {
        const beeSpecialties = assignedBeeIds.map(id => bees.find(b => b.id === id).speciality);
        const specialityCounts = {};

        beeSpecialties.forEach(speciality => {
          specialityCounts[speciality] = (specialityCounts[speciality] || 0) + 1;
        });

        comboActivated = comboDefinition.requiredSpecialities.every(speciality => {
          return (specialityCounts[speciality] || 0) > 0;
        });
      }

      // Check for type-based combos
      else if (comboDefinition.requiredTypes) {
        const beeTypes = assignedBeeIds.map(id => bees.find(b => b.id === id).type);
        const typeCounts = {};

        beeTypes.forEach(type => {
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        comboActivated = comboDefinition.requiredTypes.every(type => {
          return (typeCounts[type] || 0) > 0;
        });
      }

      // Use custom check function if provided
      else if (comboDefinition.checkFunction) {
        comboActivated = comboDefinition.checkFunction(assignedBeeIds);
      }

      if (comboActivated) {
        currentCombos.push(comboDefinition.name);

        // Update UI to show the combo
        showComboEffect(fieldId, comboDefinition);
      }
    });

    // Update the gameState with new combos
    gameState.combos[fieldId] = currentCombos;
  }

  // Show visual effect for a combo activation
  function showComboEffect(fieldId, comboDefinition) {
    const assignmentElement = document.querySelector(`.assignment[data-field-id="${fieldId}"]`);

    // Check if combo notification already exists
    let comboElement = assignmentElement.querySelector(`.combo-notification[data-combo="${comboDefinition.name}"]`);

    if (!comboElement) {
      comboElement = document.createElement("div");
      comboElement.className = "combo-notification";
      comboElement.dataset.combo = comboDefinition.name;
      comboElement.textContent = `${comboDefinition.name} Combo! +${comboDefinition.bonusPoints} points`;

      assignmentElement.appendChild(comboElement);

      // Animate the combo notification
      comboElement.style.opacity = "0";
      comboElement.style.transform = "translateY(20px)";

      setTimeout(() => {
        comboElement.style.transition = "opacity 0.5s, transform 0.5s";
        comboElement.style.opacity = "1";
        comboElement.style.transform = "translateY(0)";
      }, 10);

      // Play combo sound
      if (soundToggle.checked) {
        playSound("sound/combo.mp3");
      }
    }
  }

  // Remove a bee from a field assignment
  function removeBeeFromField(beeId, fieldId) {
    // Remove from game state
    const beeIndex = gameState.assignments[fieldId].indexOf(beeId);
    if (beeIndex !== -1) {
      gameState.assignments[fieldId].splice(beeIndex, 1);
    }

    // Remove from UI
    const assignedBeeElement = document.querySelector(`.assignment-bees[data-field-id="${fieldId}"] .assigned-bee[data-bee-id="${beeId}"]`);
    if (assignedBeeElement) {
      assignedBeeElement.remove();

      // Play remove sound
      if (soundToggle.checked) {
        playSound("sound/remove.mp3");
      }
    }

    // Re-check combos
    checkForCombos(fieldId);

    // Remove combo notifications if no longer valid
    const assignmentElement = document.querySelector(`.assignment[data-field-id="${fieldId}"]`);
    const comboNotifications = assignmentElement.querySelectorAll(".combo-notification");

    comboNotifications.forEach(notification => {
      const comboName = notification.dataset.combo;
      if (!gameState.combos[fieldId] || !gameState.combos[fieldId].includes(comboName)) {
        // Animate out
        notification.style.opacity = "0";
        notification.style.transform = "translateY(20px)";

        setTimeout(() => {
          notification.remove();
        }, 500);
      }
    });
  }

  // Reset all assignments
  function resetAssignments() {
    // Clear game state assignments
    Object.keys(gameState.assignments).forEach(fieldId => {
      gameState.assignments[fieldId] = [];
      gameState.combos[fieldId] = [];
    });

    // Clear UI assignments
    const assignmentBeesElements = document.querySelectorAll(".assignment-bees");
    assignmentBeesElements.forEach(element => {
      element.innerHTML = "";
    });

    // Clear combo notifications
    const comboNotifications = document.querySelectorAll(".combo-notification");
    comboNotifications.forEach(notification => {
      notification.remove();
    });

    // Play reset sound
    if (soundToggle.checked) {
      playSound("sound/reset.mp3");
    }
  }

  // Evaluate the player's field assignments
  function evaluateAssignments() {
    // Stop timer
    clearInterval(gameState.timerInterval);

    // Calculate score
    let levelScore = 0;
    let feedback = "";
    let perfectFields = 0;
    let totalFields = Object.keys(gameState.assignments).length;

    Object.keys(gameState.assignments).forEach(fieldId => {
      const field = fields.find(f => f.id === parseInt(fieldId));
      const assignedBeeIds = gameState.assignments[fieldId];

      // Points for each correctly assigned bee
      let fieldPoints = 0;
      let fieldFeedback = [];
      let perfectAssignment = true;

      assignedBeeIds.forEach(beeId => {
        const bee = bees.find(b => b.id === beeId);

        // Check if bee is ideal for this field
        if (field.idealBees.includes(beeId)) {
          fieldPoints += 10;
          fieldFeedback.push(`${bee.name} is perfect for ${field.name}! +10 points`);
        }
        // Check if bee color matches field color
        else if (bee.color === field.color) {
          fieldPoints += 5;
          fieldFeedback.push(`${bee.name}'s color matches ${field.name}. +5 points`);
          perfectAssignment = false;
        }
        // Any bee assigned gives some points
        else {
          fieldPoints += 2;
          fieldFeedback.push(`${bee.name} is working in ${field.name}. +2 points`);
          perfectAssignment = false;
        }
      });

      // Apply combo bonuses
      const fieldCombos = gameState.combos[fieldId] || [];
      fieldCombos.forEach(comboName => {
        const combo = beeComboDefinitions.find(c => c.name === comboName);
        if (combo) {
          fieldPoints += combo.bonusPoints;
          fieldFeedback.push(`${combo.name} Combo: ${combo.description}. +${combo.bonusPoints} points`);
        }
      });

      // Apply difficulty multiplier
      const difficultyMultiplier = 1 + ((field.difficulty - 1) * 0.2);
      const adjustedPoints = Math.round(fieldPoints * difficultyMultiplier);

      if (adjustedPoints > fieldPoints) {
        fieldFeedback.push(`Difficulty bonus: x${difficultyMultiplier.toFixed(1)}. +${adjustedPoints - fieldPoints} points`);
      }

      fieldPoints = adjustedPoints;
      levelScore += fieldPoints;

      // Track perfect assignments
      if (perfectAssignment && assignedBeeIds.length > 0) {
        perfectFields++;
      }

      // Add field feedback to overall feedback
      if (fieldFeedback.length > 0) {
        feedback += `<div class="field-feedback">
          <h4>${field.name}:</h4>
          <ul>
            ${fieldFeedback.map(fb => `<li>${fb}</li>`).join("")}
          </ul>
        </div>`;
      }
    });

    // Bonus for completing within time limit
    if (gameState.timeRemaining > 0) {
      const timeBonus = gameState.timeRemaining;
      levelScore += timeBonus;
      feedback += `<div class="time-bonus">Time Bonus: +${timeBonus} points</div>`;
    }

    // Perfect assignment bonus
    if (perfectFields > 0) {
      const perfectBonus = perfectFields * 20;
      levelScore += perfectBonus;
      feedback += `<div class="perfect-bonus">Perfect Assignment Bonus: ${perfectFields}/${totalFields} fields perfect! +${perfectBonus} points</div>`;

      // Update stats for perfect assignments
      gameState.stats.perfectAssignments += perfectFields;
    }

    // Streak bonus
    if (perfectFields === totalFields && totalFields > 0 && Object.values(gameState.assignments).flat().length > 0) {
      gameState.currentStreak++;
      streakDisplay.textContent = gameState.currentStreak;

      if (gameState.currentStreak > 1) {
        const streakBonus = gameState.currentStreak * 15;
        levelScore += streakBonus;
        feedback += `<div class="streak-bonus">Perfect Streak Bonus (${gameState.currentStreak} in a row): +${streakBonus} points</div>`;
      }

      // Update highest streak
      if (gameState.currentStreak > gameState.stats.highestStreak) {
        gameState.stats.highestStreak = gameState.currentStreak;
      }
    } else {
      gameState.currentStreak = 0;
      streakDisplay.textContent = gameState.currentStreak;
    }

    // Update total score
    gameState.score += levelScore;
    pointsDisplay.textContent = gameState.score;

    // Show results
    resultMessage.innerHTML = `<h3>Level ${gameState.level} Complete!</h3>${feedback}`;
    resultScore.textContent = `Level Score: ${levelScore} | Total Score: ${gameState.score}`;
    resultContainer.classList.remove("hidden");

    // Update stats
    gameState.stats.gamesPlayed++;
    gameState.stats.totalScore += levelScore;

    if (gameState.score > gameState.stats.highestScore) {
      gameState.stats.highestScore = gameState.score;
    }

    if (gameState.level > gameState.stats.highestLevel) {
      gameState.stats.highestLevel = gameState.level;
    }

    saveGameStats();

    // Play success sound
    if (soundToggle.checked) {
      playSound("sound/success.mp3");
    }
  }

  // Go to next level
  function nextLevel() {
    gameState.level++;
    setupLevel();
  }

  // Show game stats
  function showStats() {
    const statsContent = `
      <h2>Field Puzzle Stats</h2>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Games Played:</div>
          <div class="stat-value">${gameState.stats.gamesPlayed}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Highest Score:</div>
          <div class="stat-value">${gameState.stats.highestScore}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Highest Level:</div>
          <div class="stat-value">${gameState.stats.highestLevel}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Total Score:</div>
          <div class="stat-value">${gameState.stats.totalScore}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Perfect Assignments:</div>
          <div class="stat-value">${gameState.stats.perfectAssignments}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Highest Streak:</div>
          <div class="stat-value">${gameState.stats.highestStreak}</div>
        </div>
      </div>
      <div class="stats-tips">
        <h3>Field Tips</h3>
        <ul>
          <li>Match bee colors to field colors for bonus points</li>
          <li>Each field has ideal bees that earn maximum points</li>
          <li>Create bee combos for significant bonus points</li>
          <li>Complete levels faster for time bonus points</li>
          <li>Perfect assignments across all fields build streaks</li>
          <li>Higher difficulty fields have score multipliers</li>
        </ul>
      </div>
    `;

    modalText.innerHTML = statsContent;
    modal.style.display = "block";
  }

  // Drag and drop handlers
  function handleBeeDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.id);
    e.target.classList.add("dragging");
  }

  function handleFieldDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleFieldDrop(e) {
    e.preventDefault();

    const beeId = parseInt(e.dataTransfer.getData("text/plain"));
    const fieldId = parseInt(e.target.dataset.fieldId);

    const bee = bees.find(b => b.id === beeId);
    if (bee) {
      assignBeeToField(bee, fieldId);
    }

    // Remove dragging class from all bee cards
    document.querySelectorAll(".bee-card").forEach(card => {
      card.classList.remove("dragging");
    });
  }

  // Play sound effect
  function playSound(src) {
    if (!soundToggle.checked) return;

    const sound = new Audio(src);
    sound.play();
  }

  // Set up event listeners
  function setupEventListeners() {
    // Submit button
    submitButton.addEventListener("click", evaluateAssignments);

    // Reset button
    resetButton.addEventListener("click", resetAssignments);

    // Next level button
    nextLevelButton.addEventListener("click", nextLevel);

    // Show stats button
    showStatsButton.addEventListener("click", showStats);

    // Tutorial button event is handled in HTML

    // Show combos button
    showCombosButton.addEventListener("click", () => {
      // Event handled in HTML
    });

    // Close modal
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Close field info modal
    fieldInfoClose.addEventListener("click", () => {
      fieldInfoModal.style.display = "none";
    });

    // Close modals when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
      if (e.target === fieldInfoModal) {
        fieldInfoModal.style.display = "none";
      }
    });
  }

  // Initialize the game
  initGame();
});
