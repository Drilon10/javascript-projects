// ============================================
//  TYPING SPEED TEST — JavaScript
//  Concepts covered:
//    - Keyboard events ('input' event on textarea)
//    - String comparison (character by character)
//    - setInterval / clearInterval for a countdown timer
//    - Real-time calculations (WPM, accuracy)
//    - DOM class toggling for visual feedback
//    - Arrays of objects for structured data
//    - Ternary operators and template literals
//    - Math methods (floor, round, max)
// ============================================

// ========== 1. GRAB DOM ELEMENTS ==========

const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const errorsEl = document.getElementById('errors');
const progressBar = document.getElementById('progressBar');
const restartBtn = document.getElementById('restartBtn');
const difficultySelect = document.getElementById('difficultySelect');
const timeSelect = document.getElementById('timeSelect');

// Results overlay elements
const resultsOverlay = document.getElementById('resultsOverlay');
const finalWpmEl = document.getElementById('finalWpm');
const finalAccuracyEl = document.getElementById('finalAccuracy');
const finalCharsEl = document.getElementById('finalChars');
const finalErrorsEl = document.getElementById('finalErrors');
const resultsMessage = document.getElementById('resultsMessage');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// ========== 2. TEXT DATA ==========
// Three difficulty levels with different text pools.
// The game picks a random text from the selected difficulty.

const texts = {
  easy: [
    "the cat sat on the mat and looked out the window at the birds flying by in the blue sky",
    "she went to the store to buy some milk and bread for the family dinner tonight",
    "the dog ran fast in the park and jumped over the small fence to catch the ball",
    "it was a warm day so they went to the beach and played in the sand all afternoon",
    "he read a book every night before bed and dreamed about going on great adventures",
    "the sun was bright and the flowers in the garden were blooming with many colors",
    "they sat around the table and shared stories about their day at school and work"
  ],

  medium: [
    "The quick brown fox jumps over the lazy dog while the sun sets behind the distant mountains casting long shadows across the valley below.",
    "Programming is the art of telling a computer what to do. Every line of code you write brings you one step closer to building something incredible.",
    "Learning to type faster is not just about speed. It is about building muscle memory so your fingers know where each key is without looking down.",
    "JavaScript is one of the most popular programming languages in the world. It powers websites, servers, mobile apps, and even desktop applications.",
    "Practice makes perfect. The more you type, the faster and more accurate you become. Focus on accuracy first, and speed will follow naturally over time.",
    "A good developer writes code that humans can understand. Clean code is not about clever tricks, it is about clarity, simplicity, and good communication."
  ],

  hard: [
    "const result = array.filter(item => item.active).map(item => ({ id: item.id, name: item.name.toUpperCase() }));",
    "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
    "async function fetchData(url) { try { const response = await fetch(url); if (!response.ok) throw new Error(response.status); return await response.json(); } catch (err) { console.error(err); } }",
    "document.querySelectorAll('.card').forEach(card => card.addEventListener('click', (e) => e.currentTarget.classList.toggle('flipped')));",
    "const [state, setState] = useState([]); useEffect(() => { fetch('/api/data').then(res => res.json()).then(data => setState(data)); }, []);",
    "export default class EventEmitter { constructor() { this.events = {}; } on(event, fn) { (this.events[event] ||= []).push(fn); } emit(event, ...args) { this.events[event]?.forEach(fn => fn(...args)); } }"
  ]
};

// ========== 3. GAME STATE VARIABLES ==========

let currentText = '';         // The text the user must type
let charSpans = [];           // Array of <span> elements — one per character
let timerInterval = null;     // Reference to the countdown interval
let timeLeft = 60;            // Seconds remaining
let totalTime = 60;           // Total time selected by the user
let gameStarted = false;      // Has the user started typing?
let gameOver = false;         // Is the game finished?
let totalErrors = 0;          // Cumulative count of wrong keypresses
let correctChars = 0;         // Count of correctly typed characters
let totalTyped = 0;           // Total characters the user has typed

// ========== 4. INITIALIZE THE GAME ==========
// Sets up a fresh game with a new random text

function initGame() {
  // Step 1: Get the selected difficulty and time
  const difficulty = difficultySelect.value;
  totalTime = parseInt(timeSelect.value);
  timeLeft = totalTime;

  // Step 2: Pick a random text from the chosen difficulty
  const textPool = texts[difficulty];
  currentText = textPool[Math.floor(Math.random() * textPool.length)];

  // Step 3: Reset state
  gameStarted = false;
  gameOver = false;
  totalErrors = 0;
  correctChars = 0;
  totalTyped = 0;
  clearInterval(timerInterval);

  // Step 4: Reset UI
  inputArea.value = '';
  inputArea.disabled = false;
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100';
  timerEl.textContent = timeLeft;
  errorsEl.textContent = '0';
  progressBar.style.width = '0%';
  resultsOverlay.classList.add('hidden');

  // Step 5: Render the text as individual character spans
  renderText();

  // Step 6: Focus the input so the user can start typing immediately
  inputArea.focus();
}

// ========== 5. RENDER TEXT AS CHARACTER SPANS ==========
// Wraps every character in a <span> so we can style each one
// individually (correct = green, incorrect = red, current = highlighted)

function renderText() {
  // Clear the display
  textDisplay.innerHTML = '';
  charSpans = [];

  // Loop through every character in the text
  currentText.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;

    // Mark the very first character as the "current" one
    if (index === 0) {
      span.classList.add('current');
    }

    textDisplay.appendChild(span);
    charSpans.push(span);
  });
}

// ========== 6. HANDLE USER INPUT ==========
// This fires on EVERY keystroke in the textarea.
// We compare what the user has typed against the original text.

inputArea.addEventListener('input', () => {
  // Don't process input if the game is over
  if (gameOver) return;

  // Start the countdown timer on the very first keystroke
  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  // Get what the user has typed
  const typed = inputArea.value;
  totalTyped = typed.length;

  // Reset error and correct counts for this check
  // We recalculate from scratch each time (simpler & avoids bugs)
  let currentErrors = 0;
  let currentCorrect = 0;

  // Compare each typed character against the original text
  charSpans.forEach((span, index) => {
    // Remove all state classes first
    span.classList.remove('correct', 'incorrect', 'current');

    if (index < typed.length) {
      // This character has been typed — check if it's correct
      if (typed[index] === currentText[index]) {
        span.classList.add('correct');
        currentCorrect++;
      } else {
        span.classList.add('incorrect');
        currentErrors++;
      }
    } else if (index === typed.length) {
      // This is the NEXT character to type — highlight it
      span.classList.add('current');
    }
    // Characters beyond the cursor remain unstyled (dim)
  });

  // Update tracked values
  correctChars = currentCorrect;
  totalErrors = currentErrors;
  errorsEl.textContent = totalErrors;

  // Calculate and display accuracy in real time
  // Accuracy = correct characters / total typed × 100
  // Math.max(1, totalTyped) prevents division by zero
  const accuracy = Math.round((correctChars / Math.max(1, totalTyped)) * 100);
  accuracyEl.textContent = accuracy;

  // Update progress bar
  // Progress = how far through the text the user has typed
  const progress = Math.round((typed.length / currentText.length) * 100);
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  // Calculate WPM (Words Per Minute) in real time
  updateWPM();

  // Check if the user has finished typing the entire text
  if (typed.length >= currentText.length) {
    endGame();
  }
});

// ========== 7. CALCULATE WPM ==========
// WPM = (characters typed / 5) / minutes elapsed
// Dividing by 5 converts characters to "words" (standard measure)

function updateWPM() {
  // How many seconds have passed since the game started
  const elapsedSeconds = totalTime - timeLeft;

  // Avoid division by zero — if no time has passed, WPM is 0
  if (elapsedSeconds === 0) {
    wpmEl.textContent = '0';
    return;
  }

  // Convert elapsed seconds to minutes (as a decimal)
  const elapsedMinutes = elapsedSeconds / 60;

  // Standard WPM formula:
  // Net WPM = (correct chars / 5) / minutes
  // We use correctChars (not totalTyped) so errors don't inflate WPM
  const wpm = Math.round((correctChars / 5) / elapsedMinutes);

  // Make sure WPM is never negative
  wpmEl.textContent = Math.max(0, wpm);
}

// ========== 8. COUNTDOWN TIMER ==========
// Starts a 1-second interval that counts down to zero

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    // Also update WPM every second for a live reading
    updateWPM();

    // When time runs out, end the game
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ========== 9. END THE GAME ==========
// Called when time runs out or the user finishes typing the text

function endGame() {
  gameOver = true;
  clearInterval(timerInterval);
  inputArea.disabled = true;

  // Calculate final stats
  const elapsedSeconds = totalTime - timeLeft;
  const elapsedMinutes = Math.max(elapsedSeconds, 1) / 60;
  const finalWpm = Math.max(0, Math.round((correctChars / 5) / elapsedMinutes));
  const finalAcc = Math.round((correctChars / Math.max(1, totalTyped)) * 100);

  // Populate the results overlay
  finalWpmEl.textContent = finalWpm;
  finalAccuracyEl.textContent = finalAcc + '%';
  finalCharsEl.textContent = totalTyped;
  finalErrorsEl.textContent = totalErrors;

  // Show a performance message based on WPM
  // This uses chained ternary operators (condition ? valueIfTrue : valueIfFalse)
  resultsMessage.textContent =
    finalWpm >= 80 ? "🔥 Blazing fast! You're a typing master!" :
    finalWpm >= 60 ? "🚀 Excellent speed! Above average typist!" :
    finalWpm >= 40 ? "👍 Good job! Keep practicing to get faster." :
    finalWpm >= 20 ? "📝 Decent start! Practice a little every day." :
                     "🌱 Keep going! Everyone starts somewhere. Practice daily!";

  // Show the results overlay (remove the 'hidden' class)
  resultsOverlay.classList.remove('hidden');
}

// ========== 10. PREVENT CHEATING ==========
// Disable paste — the user must actually type!
// The 'paste' event fires when the user tries to paste text

inputArea.addEventListener('paste', (e) => {
  e.preventDefault();  // Cancel the paste action
});

// ========== 11. KEYBOARD SHORTCUT ==========
// Let the user press Tab to restart quickly
// This adds a global keyboard listener

document.addEventListener('keydown', (e) => {
  // If Tab is pressed and the game is over, restart
  if (e.key === 'Tab' && gameOver) {
    e.preventDefault();   // Prevent Tab from moving focus
    initGame();
  }
});

// ========== 12. EVENT LISTENERS FOR CONTROLS ==========

// Restart button
restartBtn.addEventListener('click', initGame);

// Try Again button (inside results overlay)
tryAgainBtn.addEventListener('click', initGame);

// When difficulty or time changes, restart with new settings
difficultySelect.addEventListener('change', initGame);
timeSelect.addEventListener('change', initGame);

// ========== 13. START THE GAME ==========
// Call initGame() when the page first loads

initGame();
