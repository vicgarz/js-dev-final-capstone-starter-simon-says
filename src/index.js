/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * PAD SETUP
 */
const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("./assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("./assets/simon-says-sound-2.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("./assets/simon-says-sound-3.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("./assets/simon-says-sound-4.mp3"),
  },
];

/**
 * GLOBAL GAME VARIABLES
 */
let computerSequence = [];
let humanSequence = [];
let level = 1;
let roundCount = 0;
let currentRound = 1;


/**
 * GAME FUNCTIONS
 */
function setLevel(input = 1) {
  const validLevels = { 1: 8, 2: 14, 3: 20, 4: 31 };
  if (!validLevels[input]) return `Invalid level: ${input}`;
  level = input;
  roundCount = validLevels[input];
  currentRound = 1; // start from round 1
  return roundCount;
}


function setText(element, text) {
  element.textContent = text;
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function activatePad(color) {
  const pad = pads.find((p) => p.color === color);
  if (!pad) return;
  pad.sound.play();
  pad.selector.classList.add("activated");
  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 300);
}

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, index * 600);
  });
}

function playComputerTurn() {
  const { color } = getRandomItem(pads);
  computerSequence.push(color);

  // ✅ Show status message
  setText(statusSpan, `Round ${computerSequence.length} — Watch closely`);
  statusSpan.classList.remove("hidden");

  // ⏯ Play the sequence
  activatePads(computerSequence);

  // ⏱ After sequence, switch to human's turn
  setTimeout(() => playHumanTurn(), computerSequence.length * 600 + 1000);
}



function playHumanTurn() {
  setText(statusSpan, "Your turn");
  padContainer.classList.remove("unclickable");
  humanSequence = [];
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  activatePad(color);
  humanSequence.push(color);
  checkPress(color);
}

function checkPress(color) {
  const index = humanSequence.length - 1;
  if (humanSequence[index] !== computerSequence[index]) {
    resetGame("Oops! Try again.");
    return;
  }
  if (humanSequence.length === computerSequence.length) {
    checkRound();
  }
}

function checkRound() {
  if (computerSequence.length === roundCount) {
    resetGame("You win!");
  } else {
    currentRound++; // 🎯 Increment round
    padContainer.classList.add("unclickable");
    setTimeout(() => playComputerTurn(), 1000);
  }
}


function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
  computerSequence = [];
  humanSequence = [];
  roundCount = 0;
  currentRound = 0;
}

function startButtonHandler() {
  setLevel(1);
  startButton.classList.add("hidden");
  setText(heading, "Simon Says"); 
  computerSequence = [];
  humanSequence = [];
  currentRound = 1;
  playComputerTurn();
}


/**
 * EVENT LISTENERS
 */
startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);
