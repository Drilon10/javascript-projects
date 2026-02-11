const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "Hight Text Machine Language",
            "Hyperlink Tool Markup Language",
        ],
        correct: 0
    },
    
    {
        question: "Which symbol is used for comments in Javascript?",
        answers: [
            "//",
            "<!-- -->",
            "#",
        ],
        correct: 0
    },

    {
        question: "Which company created Javascript?",
        answers: [
            "Microsoft",
            "Netscape",
            "Google",
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const progressEl = document.getElementById('progress');
const animationOverlay = document.getElementById('animationOverlay');
const animationText = document.getElementById('animationText');
const animationIcon = document.getElementById('animationIcon');

function showQuestion() {
    const q = questions[currentQuestion];

    questionEl.innerText = q.question;
    answersEl.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.className = "btn btn-outline-primary";
        button.innerText = answer;

        button.addEventListener("click", () => {
            checkAnswer(index)
        })


        answersEl.appendChild(button);
    });

    progressEl.innerText = `Question ${currentQuestion + 1} of ${questions.length}`
}

function showAnimation(isCorrect) {
    if(isCorrect) {
        animationText.innerText = "Correct Answer!";
        animationText.className = "correctText";
        animationIcon.innerText = "✅";
    }

    else {
        animationText.innerText = "Wrong Answer!";
        animationText.className = "wrongText";
        animationIcon.innerText = "❌";
    }

    animationOverlay.classList.add("show");

    setTimeout(() => {
        animationOverlay.classList.remove("show");
    }, 3000);
}

function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestion].correct; 
    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
        score++;
    }

    showAnimation(isCorrect);

    setTimeout(() => {
        currentQuestion++;

        if(currentQuestion < questions.length) {
            showQuestion();
        }

        else {
            showResult();
        }
    }, 3000);
}

function showResult() {
    questionEl.innerText = `🎉 Your score is: ${score} / ${questions.length}`;
    answersEl.innerHTML = "";
    progressEl.innerText = "";

    const restart = document.createElement("button");
    restart.className = "btn btn-success mt-3";
    restart.innerText = "Restart Quiz";

    restart.addEventListener("click", restartQuiz);

    answersEl.appendChild(restart);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

showQuestion();