let secretNumber = Math.floor(Math.random() * 100) + 1;

let attempts = 0;

const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const attemptsText = document.getElementById('attempts');

guessBtn.addEventListener('click', function() {
    const userGuess = Number(guessInput.value);

    if(!userGuess || userGuess < 1 || userGuess > 100) {
        message.textContent = "⚠️ Please enter a number between 1 and 100."
        message.style.color = "orange";
        return;
    }

    attempts++;
    attemptsText.textContent = `Attempts: ${attempts}`;

    if(userGuess === secretNumber) {
        message.textContent = `👏 Correct! The number was ${secretNumber}`;
        message.style.color = "green";
    }

    else if(userGuess > secretNumber) {
        message.textContent = `⬆️ To high! Try again;`;
        message.style.color = "red";
    }

    else {
        message.textContent = `⬇️ To low! Try again;`;
        message.style.color = "red";
    }

    guessInput.value = "";
});


resetBtn.addEventListener('click', function() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;

    message.textContent = "";
    attemptsText.textContent = "Attemts: 0";
    guessInput.value = "";
})