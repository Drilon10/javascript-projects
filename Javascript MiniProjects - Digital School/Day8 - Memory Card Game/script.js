// ============================================
//  MEMORY CARD GAME — JavaScript
//  Concepts covered:
//    - Arrays & Array methods (map, sort, forEach)
//    - DOM manipulation (createElement, classList, innerHTML)
//    - Event listeners (click events)
//    - setTimeout for delayed actions
//    - setInterval for a live timer
//    - Game state management with variables
//    - The Fisher-Yates shuffle algorithm
//    - CSS 3D flip via toggling classes
// ============================================

// ========== 1. GRAB DOM ELEMENTS ==========
// We get references to the HTML elements we need to update

const gameBoard = document.getElementById('gameBoard');
const moveCountEl = document.getElementById('moveCount');
const pairsFoundEl = document.getElementById('pairsFound');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const winModal = document.getElementById('winModal');
const finalMovesEl = document.getElementById('finalMoves');
const finalTimeEl = document.getElementById('finalTime');
const playAgainBtn = document.getElementById('playAgainBtn');

// ========== 2. GAME DATA ==========
// We use emoji as our card symbols — 8 unique emojis = 8 pairs = 16 cards total
// Feel free to change these to anything you like!

const emojis = ['🐶', '🐱', '🦊', '🐸', '🐵', '🦁', '🐼', '🐨'];

// ========== 3. GAME STATE VARIABLES ==========
// These variables track the current state of the game

let cards = [];             // Array of card objects after shuffling
let flippedCards = [];      // Temporarily holds the 1 or 2 cards currently flipped
let matchedPairs = 0;       // How many pairs the player has found
let moveCount = 0;          // How many moves (a move = flipping 2 cards)
let timerInterval = null;   // Reference to the timer's setInterval (so we can stop it)
let secondsElapsed = 0;     // Total seconds since the game started
let gameStarted = false;    // Has the player flipped their first card?
let lockBoard = false;      // Prevents clicking while two cards are being compared

// ========== 4. INITIALIZE THE GAME ==========
// This function sets up (or resets) everything for a new game

function initGame() {
  // Step 1: Reset all state variables
  flippedCards = [];
  matchedPairs = 0;
  moveCount = 0;
  secondsElapsed = 0;
  gameStarted = false;
  lockBoard = false;

  // Step 2: Stop any existing timer
  clearInterval(timerInterval);

  // Step 3: Update the UI to show zeroed-out stats
  moveCountEl.textContent = '0';
  pairsFoundEl.textContent = '0';
  timerEl.textContent = '0:00';

  // Step 4: Hide the win modal (in case it's showing)
  winModal.classList.add('hidden');

  // Step 5: Create the card deck
  // We duplicate the emojis array so each emoji appears twice (= a pair)
  // Then we shuffle the combined array randomly
  cards = shuffle([...emojis, ...emojis]);

  // Step 6: Render the cards onto the game board
  renderBoard();
}

// ========== 5. SHUFFLE FUNCTION (Fisher-Yates Algorithm) ==========
// This is a well-known algorithm that randomly rearranges an array.
// It loops from the end of the array to the beginning,
// swapping each element with a randomly chosen earlier element.

function shuffle(array) {
  // We loop backwards through the array
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j
    // This is called "destructuring assignment" — a neat JS trick!
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// ========== 6. RENDER THE BOARD ==========
// Creates the card HTML elements and adds them to the page

function renderBoard() {
  // Clear any existing cards from the board
  gameBoard.innerHTML = '';

  // Loop through every card in our shuffled array
  cards.forEach((emoji, index) => {
    // Create the outer card container
    const card = document.createElement('div');
    card.className = 'card-item';

    // Store the emoji and index as data attributes
    // data-* attributes let us attach custom data to HTML elements
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    // Build the inner card structure:
    //   - card-inner: the element that rotates
    //   - card-front: shows the emoji (hidden until flipped)
    //   - card-back: shows "?" (visible by default)
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${emoji}</div>
        <div class="card-back">?</div>
      </div>
    `;

    // Add a click event listener to each card
    card.addEventListener('click', () => handleCardClick(card));

    // Append the card element to the game board
    gameBoard.appendChild(card);
  });
}

// ========== 7. HANDLE CARD CLICK ==========
// This is the main game logic — runs every time a player clicks a card

function handleCardClick(card) {
  // --- Guard clauses (early returns to prevent invalid actions) ---

  // If the board is locked (two cards are being compared), ignore clicks
  if (lockBoard) return;

  // If this card is already flipped, ignore the click
  if (card.classList.contains('flipped')) return;

  // If this card is already matched, ignore the click
  if (card.classList.contains('matched')) return;

  // --- Start the timer on the very first click ---
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  // --- Flip the card ---
  // Adding the 'flipped' class triggers the CSS 3D rotation
  card.classList.add('flipped');

  // Add this card to our "currently flipped" array
  flippedCards.push(card);

  // --- Check if two cards are flipped ---
  if (flippedCards.length === 2) {
    // Increment the move counter (one move = two card flips)
    moveCount++;
    moveCountEl.textContent = moveCount;

    // Check if the two flipped cards match
    checkForMatch();
  }
}

// ========== 8. CHECK FOR A MATCH ==========
// Compares the two currently flipped cards

function checkForMatch() {
  // Get the emoji value from each card's data attribute
  const [card1, card2] = flippedCards;
  const emoji1 = card1.dataset.emoji;
  const emoji2 = card2.dataset.emoji;

  if (emoji1 === emoji2) {
    // ✅ MATCH FOUND!
    handleMatch(card1, card2);
  } else {
    // ❌ NO MATCH — flip them back after a short delay
    handleMismatch(card1, card2);
  }
}

// ========== 9. HANDLE A MATCH ==========
// When two cards match, mark them and check for a win

function handleMatch(card1, card2) {
  // Add the 'matched' class — this adds a green glow and disables clicks
  card1.classList.add('matched');
  card2.classList.add('matched');

  // Increment the matched pairs counter
  matchedPairs++;
  pairsFoundEl.textContent = matchedPairs;

  // Clear the flipped cards array for the next turn
  flippedCards = [];

  // Check if ALL pairs have been found (game over!)
  if (matchedPairs === emojis.length) {
    // Small delay so the player can see the last match
    setTimeout(() => {
      endGame();
    }, 600);
  }
}

// ========== 10. HANDLE A MISMATCH ==========
// When two cards don't match, flip them back after a delay

function handleMismatch(card1, card2) {
  // Lock the board so the player can't flip more cards during the delay
  lockBoard = true;

  // Wait 800ms so the player can see both cards before flipping back
  setTimeout(() => {
    // Remove the 'flipped' class to trigger the reverse CSS animation
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');

    // Clear the flipped cards array
    flippedCards = [];

    // Unlock the board so the player can click again
    lockBoard = false;
  }, 800);
}

// ========== 11. TIMER FUNCTIONS ==========
// Starts a live timer that updates every second

function startTimer() {
  // setInterval calls a function repeatedly at a fixed time interval
  // Here, we call it every 1000ms (1 second)
  timerInterval = setInterval(() => {
    secondsElapsed++;

    // Format the time as M:SS (e.g., 1:05, 0:30)
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;

    // .padStart(2, '0') ensures seconds are always 2 digits (e.g., "05" not "5")
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// ========== 12. END GAME ==========
// Called when all pairs are found — stops the timer and shows the win screen

function endGame() {
  // Stop the timer
  clearInterval(timerInterval);

  // Display the final stats in the win modal
  finalMovesEl.textContent = moveCount;
  finalTimeEl.textContent = timerEl.textContent;

  // Show the win modal by removing the 'hidden' class
  winModal.classList.remove('hidden');
}

// ========== 13. EVENT LISTENERS ==========
// Restart buttons — both the main one and the one inside the win modal

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// ========== 14. START THE GAME ON PAGE LOAD ==========
// Call initGame() once when the script first runs

initGame();
