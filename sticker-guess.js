const stickers = [
  "Play Button",
  "Gamer Chat Icon",
  "Flying Rad Bee",
  "Flying Ninja Bee",
  "Flying Brave Bee",
  "Flying Photon Bee",
  "Drooping Stubborn Bee",
  "Wobbly Looker Bee",
  "Blob Bumble Bee",
  "Round Rascal Bee",
  "Round Basic Bee",
  "Diamond Diamond Bee",
  "4-Pronged Vector Bee",
  "Shocked Hive Slot",
  "Bear Bee Offer",
  "Tabby Scratch",
  "Tabby From Behind",
  "Fuzz Bomb",
  "Precise Eye",
  "Chef Hat Polar Bear",
  "Honey Bee Bear",
  "Bomber Bee Bear",
  "Uplooking Bear",
  "Sitting Green Shirt Bear",
  "Shy Brown Bear",
  "Sitting Mother Bear",
  "Squashed Head Bear",
  "Stretched Head Bear",
  "Panicked Science Bear",
  "Dapper From Above",
  "Sideways Spirit Bear",
  "Glowering Gummy Bear",
  "Menacing Mantis",
  "Little Scorpion",
  "Left Facing Ant",
  "Walking Stick Nymph",
  "Forward Facing Spider",
  "Forward Facing Aphid",
  "Right Facing Stump Snail",
  "Standing Bean Bug",
  "Small Blue Chick",
  "Tadpole",
  "Happy Fish",
  "Coiled Snake",
  "Standing Caterpillar",
  "Round Green Critter",
  "Flying Magenta Critter",
  "Blue Triangle Critter",
  "Purple Pointed Critter",
  "Orange Leg Critter",
  "Green Plus Sign",
  "Green Check Mark",
  "Red X",
  "Alert Icon",
  "Yellow Right Arrow",
  "Yellow Left Arrow",
  "Simple Sun",
  "Pink Cupcake",
  "Rubber Duck",
  "Baseball Swing",
  "Yellow Coffee Mug",
  "Launching Rocket",
  "Thumbs Up Hand",
  "Peace Sign Hand",
  "Traffic Light",
  "Window",
  "Simple Skyscraper",
  "Simple Mountain",
  "Pale Heart",
  "Colorful Buttons",
  "Giraffe",
  "Silly Tongue",
  "White Flag",
  "Pyramid",
  "Tiny House",
  "TNT",
  "Wishbone",
  "Yellow Umbrella",
  "Red Palm Hand",
  "Yellow Sticky Hand",
  "Yellow Walking Wiggly Person",
  "Green SELL",
  "Yellow Hi",
  "AFK",
  "Auryn",
  "Pink Chair",
  "Doodle S",
  "Triple Exclamation",
  "Eighth Note",
  "Eviction",
  "Fork And Knife",
  "Shining Halo",
  "Rhubarb",
  "Sprout",
  "Palm Tree",
  "Jack-O-Lantern",
  "Lightning",
  "Simple Cloud",
  "Grey Raining Cloud",
  "Tornado",
  "Small Flame",
  "Dark Flame",
  "Small Shield",
  "Robot Head",
  "Cyan Hilted Sword",
  "Cool Backpack",
  "Standing Beekeeper",
  "Red Wailing Cry",
  "Hourglass",
  "Atom Symbol",
  "Barcode",
  "Wall Crack",
  "Green Circle",
  "Blue Square",
  "Black Diamond",
  "Waxing Crescent Moon",
  "Glowing Smile",
  "Saturn",
  "Black Star",
  "Cyan Star",
  "Shining Star",
  "Grey Diamond Logo",
  "Orphan Dog",
  "Pizza Delivery Man",
  "Interrobang Block",
  "Theatrical Intruder",
  "Desperate Booth",
  "Built Ship",
  "Grey Shape Companion",
  "Evil Pig",
  "Waving Townsperson",
  "Cop And Robber",
  "Tough Potato",
  "Young Elf",
  "Shrugging Heart",
  "Classic Killroy",
  "Killroy With Hair",
  "Taunting Doodle Person",
  "Prehistoric Hand",
  "Prehistoric Boar",
  "Red Doodle Person",
  "Pearl Girl",
  "Abstract Color Painting",
  "Prism Painting",
  "Banana Painting",
  "Moai",
  "Nessie",
  "Ionic Column Top",
  "Ionic Column Middle",
  "Ionic Column Base",
  "Orange Step Array",
  "Orange Green Tri Deco",
  "Orange Swirled Marble",
  "Blue And Green Marble",
  "Yellow Swirled Marble",
  "Diamond Cluster",
  "Diamond Trim",
  "Cyan Decorative Border",
  "Left Gold Swirled Fleuron",
  "Right Gold Swirled Fleuron",
  "Left Shining Diamond Fleuron",
  "Right Shining Diamond Fleuron",
  "Left Mythic Gem Fleuron",
  "Right Mythic Gem Fleuron",
  "Purple Fleuron",
  "Royal Symbol",
  "Royal Bear",
  "Mythic M",
  "Satisfying Nectar Icon",
  "Refreshing Nectar Icon",
  "Motivating Nectar Icon",
  "Invigorating Nectar Icon",
  "Comforting Nectar Icon",
  "Small Tickseed",
  "Small White Daisy",
  "Small Pink Tulip",
  "Small Dandelion",
  "Purple 4-Point Flower",
  "Spore Covered Puffshroom",
  "White Button Mushroom",
  "Fly Agaric Mushroom",
  "Porcini Mushroom",
  "Oiler Mushroom",
  "Morel Mushroom",
  "Chanterelle Mushroom",
  "Shiitake Mushroom",
  "Black Truffle Mushroom",
  "Prismatic Mushroom",
  "Blowing Leaf",
  "Cordate Leaf",
  "Cunate Leaf",
  "Elliptic Leaf",
  "Hastate Leaf",
  "Lanceolate Leaf",
  "Lyrate Leaf",
  "Oblique Leaf",
  "Rhomboid Leaf",
  "Reniform Leaf",
  "Spatulate Leaf",
  "Scooper",
  "Rake",
  "Clippers",
  "Magnet",
  "Vacuum",
  "Super-Scooper",
  "Pulsar",
  "Electro-Magnet",
  "Scissors",
  "Honey Dipper",
  "Bubble Wand",
  "Scythe",
  "Golden Rake",
  "Spark Staff",
  "Porcelain Dipper",
  "Petal Wand",
  "Tide Popper",
  "Dark Scythe",
  "Gummyballer",
  "Capricorn Star Sign",
  "Aquarius Star Sign",
  "Pisces Star Sign",
  "Aries Star Sign",
  "Taurus Star Sign",
  "Gemini Star Sign",
  "Cancer Star Sign",
  "Leo Star Sign",
  "Virgo Star Sign",
  "Libra Star Sign",
  "Scorpio Star Sign",
  "Sagittarius Star Sign",
  "Sunflower Field Stamp",
  "Dandelion Field Stamp",
  "Mushroom Field Stamp",
  "Blue Flower Field Stamp",
  "Clover Field Stamp",
  "Strawberry Field Stamp",
  "Spider Field Stamp",
  "Bamboo Field Stamp",
  "Pineapple Patch Stamp",
  "Stump Field Stamp",
  "Cactus Field Stamp",
  "Pumpkin Patch Stamp",
  "Pine Tree Forest Stamp",
  "Rose Field Stamp",
  "Hub Field Stamp",
  "Mountain Top Field Stamp",
  "Pepper Patch Stamp",
  "Coconut Field Stamp",
  "Ant Field Stamp",
  "Green Beesmas Light",
  "Blue Beesmas Light",
  "Red Beesmas Light",
  "Yellow Beesmas Light",
  "Critter In A Stocking",
  "Flying Festive Bee",
  "Flying Bee Bear",
  "Party Robo Bear",
  "Festive Pufferfish",
  "Festive Pea",
  "BBM From Below",
  "Cub Buddy Voucher",
  "Bear Bee Voucher",
  "x2 Bee Gather Voucher",
  "x2 Convert Speed",
  "Basic Red Hive Skin",
  "Basic Blue Hive Skin",
  "Basic Pink Hive Skin",
  "Basic Green Hive Skin",
  "Basic White Hive Skin",
  "Basic Black Hive Skin",
  "Wavy Yellow Hive Skin",
  "Wavy Cyan Hive Skin",
  "Wavy Purple Hive Skin",
  "Wavy Festive Hive Skin",
  "Wavy Doodle Hive Skin",
  "Brown Cub Skin",
  "Robo Cub Skin",
  "Stick Cub Skin",
  "Star Cub Skin",
  "Noob Cub Skin",
  "Bee Cub Skin",
  "Gingerbread Cub Skin",
  "Snow Cub Skin",
  "Peppermint Robo Cub Skin",
  "Doodle Cub Skin",
];

let currentSticker;
let attempts;
const maxAttempts = 1;
let score = 0;
let timer;
const timeLimit = 10; // 15 seconds per question

let isMultipleChoice = true;

function initGame() {
  currentSticker = getRandomSticker();
  attempts = maxAttempts;
  updateAttemptsDisplay();
  updateScoreDisplay();
  document.getElementById(
    "sticker-image"
  ).src = `stickers/${currentSticker.replace(/ /g, "_")}.png`;
  document.getElementById("result").textContent = "";
  document.getElementById("next-sticker").style.display = "none";
  document.getElementById("sticker-image").style.filter = "blur(10px)";
  setInputMethod();
  startTimer();
}

function setInputMethod() {
  isMultipleChoice = !document.getElementById("toggle-input").checked;
  if (isMultipleChoice) {
    generateAnswerOptions();
  } else {
    const answerContainer = document.getElementById("answer-options");
    answerContainer.innerHTML = `
            <input type="text" id="guess-input" placeholder="Enter your guess">
            <button onclick="checkGuess(document.getElementById('guess-input').value)">Submit</button>
        `;
  }
}

function generateAnswerOptions() {
  const answerContainer = document.getElementById("answer-options");
  answerContainer.innerHTML = "";

  const options = [currentSticker];
  while (options.length < 4) {
    const randomSticker = getRandomSticker();
    if (!options.includes(randomSticker)) {
      options.push(randomSticker);
    }
  }

  // Shuffle options
  options.sort(() => Math.random() - 0.5);

  const gridContainer = document.createElement("div");
  gridContainer.className = "answer-grid";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className = "answer-button";
    button.addEventListener("click", () => checkGuess(option));
    gridContainer.appendChild(button);
  });

  answerContainer.appendChild(gridContainer);
}

function getRandomSticker() {
  return stickers[Math.floor(Math.random() * stickers.length)];
}

function updateAttemptsDisplay() {
  document.getElementById(
    "remaining-attempts"
  ).textContent = `Attempts left: ${attempts}`;
}

function updateScoreDisplay() {
  document.getElementById("score").textContent = `Score: ${score}`;
}

function checkGuess(guess) {
  clearInterval(timer);
  if (guess.toLowerCase() === currentSticker.toLowerCase()) {
    document.getElementById("result").textContent =
      "Correct! You guessed the sticker!";
    document.getElementById("sticker-image").style.filter = "blur(0)";
    score += 1; // Increase score based on remaining attempts
    updateScoreDisplay();
    document.getElementById("next-sticker").style.display = "inline-block";
  } else {
    attempts--;
    updateAttemptsDisplay();
    if (attempts > 0) {
      document.getElementById("result").textContent = "Incorrect. Try again!";
      document.getElementById("sticker-image").style.filter = `blur(${
        10 - (maxAttempts - attempts) * 2
      }px)`;
      startTimer();
    } else {
      endGame();
    }
  }
}

function startTimer() {
  let timeLeft = timeLimit;
  updateTimerDisplay(timeLeft);

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      attempts--;
      updateAttemptsDisplay();
      if (attempts > 0) {
        document.getElementById("result").textContent = "Time's up! Try again!";
        startTimer();
      } else {
        endGame();
      }
    }
  }, 1000);
}

function updateTimerDisplay(time) {
  document.getElementById("timer").textContent = `Time left: ${time}s`;
}

function endGame() {
  clearInterval(timer);
  document.getElementById(
    "result"
  ).textContent = `Game over! The sticker was ${currentSticker}.`;
  document.getElementById("sticker-image").style.filter = "blur(0)";
  document.getElementById("next-sticker").style.display = "inline-block";
}

document.getElementById("next-sticker").addEventListener("click", initGame);
document
  .getElementById("toggle-input")
  .addEventListener("change", setInputMethod);

initGame();

function addTouchSupport() {
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);

  let xDown = null;
  let yDown = null;

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 0) {
        // Left swipe
      } else {
        // Right swipe
      }
    } else {
      if (yDiff > 0) {
        // Up swipe
      } else {
        // Down swipe
      }
    }

    xDown = null;
    yDown = null;
  }
}

addTouchSupport();

document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbar = document.querySelector('.navbar');

    navbarToggle.addEventListener('click', function() {
        navbar.classList.toggle('expanded');
    });

    // Close navbar when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbar.contains(event.target) || navbarToggle.contains(event.target);
        if (!isClickInside && navbar.classList.contains('expanded')) {
            navbar.classList.remove('expanded');
        }
    });

    // Close navbar when a link is clicked
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navbar.classList.remove('expanded');
            }
        });
    });
});