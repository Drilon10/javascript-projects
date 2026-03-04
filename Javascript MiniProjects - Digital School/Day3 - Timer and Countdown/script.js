// ===== DIGITAL CLOCK =====
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = formatTime(hours);
  minutes = formatTime(minutes);
  seconds = formatTime(seconds);

  document.getElementById('clock').innerText =
    `${hours}:${minutes}:${seconds}`;
}

function formatTime(value) {
  return value < 10 ? '0' + value : value;
}

setInterval(updateClock, 1000);
updateClock();


// ===== COUNTDOWN TIMER =====
let timer = null;
let timeLeft = 0;

const timeInput = document.getElementById('timeInput');
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

startBtn.addEventListener('click', () => {
  if (timeLeft === 0) {
    timeLeft = Number(timeInput.value);
  }

  if (timeLeft <= 0) return;

  // Disable the start button so the user cannot click it again while running
  startBtn.disabled = true;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = formatTime(timeLeft);

    if (timeLeft === 0) {
      clearInterval(timer);
      // Re-enable start button when the timer finishes naturally
      startBtn.disabled = false;
    }
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  clearInterval(timer);
  // Re-enable start button so the user can resume
  startBtn.disabled = false;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  timeLeft = 0;
  timerDisplay.innerText = '00';
  timeInput.value = '';
  // Re-enable start button after reset
  startBtn.disabled = false;
});
