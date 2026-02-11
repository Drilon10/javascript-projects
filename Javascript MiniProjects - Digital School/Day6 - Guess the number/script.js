// Generate a random number between 1 and 100
let secretNumber = Math.floor(Math.random() * 100) + 1;

// Store number of attempts
let attempts = 0;

// Select DOM elements
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");

// Guess button click event
guessBtn.addEventListener("click", function () {
    const userGuess = Number(guessInput.value);

    // Validate input
    if (!userGuess || userGuess < 1 || userGuess > 100) {
        message.textContent = "⚠️ Please enter a number between 1 and 100.";
        message.style.color = "orange";
        return;
    }

    attempts++;
    attemptsText.textContent = `Attempts: ${attempts}`;

    // Compare guess with secret number
    if (userGuess === secretNumber) {
        message.textContent = `🎉 Correct! The number was ${secretNumber}`;
        message.style.color = "green";
    } else if (userGuess > secretNumber) {
        message.textContent = "⬆️ Too high! Try again.";
        message.style.color = "red";
    } else {
        message.textContent = "⬇️ Too low! Try again.";
        message.style.color = "red";
    }

    guessInput.value = "";
});

// Reset button click event
resetBtn.addEventListener("click", function () {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    message.textContent = "";
    attemptsText.textContent = "Attempts: 0";
    guessInput.value = "";
});
