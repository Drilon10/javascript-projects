// ===== QUIZ DATA (ARRAY OF OBJECTS) =====
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlink Tool Markup Language"
    ],
    correct: 0
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    answers: [
      "//",
      "<!-- -->",
      "**"
    ],
    correct: 0
  },
  {
    question: "Which company created JavaScript?",
    answers: [
      "Microsoft",
      "Netscape",
      "Google"
    ],
    correct: 1
  }
];

// ===== STATE VARIABLES =====
let currentQuestion = 0;
let score = 0;

// ===== DOM ELEMENTS =====
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");
const animationOverlay = document.getElementById("animationOverlay");
const animationText = document.getElementById("animationText");
const animationIcon = document.getElementById("animationIcon");

// ===== SHOW QUESTION =====
function showQuestion() {
  const q = questions[currentQuestion];

  questionEl.innerText = q.question;
  answersEl.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline-primary";
    button.innerText = answer;

    button.addEventListener("click", () => {
      checkAnswer(index);
    });

    answersEl.appendChild(button);
  });

  progressEl.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

// ===== SHOW ANIMATION =====
function showAnimation(isCorrect) {
  // Set text and icon based on answer
  if (isCorrect) {
    animationText.innerText = "Correct Answer!";
    animationText.className = "correct-text";
    animationIcon.innerText = "✓";
    animationIcon.style.color = "#4CAF50";
  } else {
    animationText.innerText = "Wrong Answer!";
    animationText.className = "wrong-text";
    animationIcon.innerText = "✗";
    animationIcon.style.color = "#f44336";
  }

  // Show overlay
  animationOverlay.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    animationOverlay.classList.remove("show");
  }, 3000);
}

// ===== CHECK ANSWER =====
function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestion].correct;
  const isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
    score++;
  }

  // Show animation
  showAnimation(isCorrect);

  // Wait for animation to finish before moving to next question
  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 3000);
}

// ===== SHOW FINAL RESULT =====
function showResult() {
  questionEl.innerText = `🎉 Your Score: ${score} / ${questions.length}`;
  answersEl.innerHTML = "";
  progressEl.innerText = "";

  const restartBtn = document.createElement("button");
  restartBtn.className = "btn btn-success mt-3";
  restartBtn.innerText = "Restart Quiz";

  restartBtn.addEventListener("click", restartQuiz);

  answersEl.appendChild(restartBtn);
}

// ===== RESTART QUIZ =====
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

// ===== START QUIZ =====
showQuestion();
