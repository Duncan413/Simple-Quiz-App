const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");
const quizCreationContainer = document.getElementById("quiz-creation-container");
const quizCreationForm = document.getElementById("quiz-creation-form");
const questionsContainer = document.getElementById("questions-container");
const addQuestionButton = document.getElementById("add-question-btn");

let shuffledQuestions, currentQuestionIndex, score;
let createdQuizzes = [];

// Sample questions for default quiz
const questions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
      { text: "222", correct: false },
      { text: "2222", correct: false },
    ],
  },
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "HyperText Markup Language", correct: true },
      { text: "HighText Machine Language", correct: false },
      { text: "HyperText Machine Language", correct: false },
      { text: "HighText Markup Language", correct: false },
    ],
  },
  {
    question: "Which property is used to change the background color?",
    answers: [
      { text: "color", correct: false },
      { text: "bgColor", correct: false },
      { text: "background-color", correct: true },
      { text: "background", correct: false },
    ],
  },
  {
    question: "Inside which HTML element do we put the JavaScript?",
    answers: [
      { text: "<js>", correct: false },
      { text: "<javascript>", correct: false },
      { text: "<script>", correct: true },
      { text: "<scripting>", correct: false },
    ],
  },
];

startQuiz();

function startQuiz() {
  score = 0;
  questionContainer.style.display = "flex";
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  nextButton.classList.remove("hide");
  restartButton.classList.add("hide");
  resultDiv.classList.add("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach((answer, index) => {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = "answer" + index;
    radio.name = "answer";
    radio.value = index;

    const label = document.createElement("label");
    label.htmlFor = "answer" + index;
    label.innerText = answer.text;

    inputGroup.appendChild(radio);
    inputGroup.appendChild(label);
    answerButtons.appendChild(inputGroup);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

nextButton.addEventListener("click", () => {
  const answerIndex = Array.from(
    answerButtons.querySelectorAll("input")
  ).findIndex((radio) => radio.checked);
  if (answerIndex !== -1) {
    if (shuffledQuestions[currentQuestionIndex].answers[answerIndex].correct) {
      score++;
    }
    currentQuestionIndex++;
    if (shuffledQuestions.length > currentQuestionIndex) {
      setNextQuestion();
    } else {
      endQuiz();
    }
  } else {
    alert("Please select an answer.");
  }
});

restartButton.addEventListener("click", startQuiz);

function endQuiz() {
  questionContainer.style.display = "none";
  nextButton.classList.add("hide");
  restartButton.classList.remove("hide");
  resultDiv.classList.remove("hide");
  resultDiv.innerText = `Your final score: ${score} / ${shuffledQuestions.length}`;
}

// Quiz creation functionality
addQuestionButton.addEventListener("click", addQuestionInput);

function addQuestionInput() {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question-input");

  questionDiv.innerHTML = `
    <label>Question:</label>
    <input type="text" class="question-text" required />
    <label>Answers:</label>
    <input type="text" class="answer-text" required placeholder="Answer 1" />
    <input type="text" class="answer-text" required placeholder="Answer 2" />
    <input type="text" class="answer-text" required placeholder="Answer 3" />
    <input type="text" class="answer-text" required placeholder="Answer 4" />
    <label>Correct Answer:</label>
    <input type="number" class="correct-answer" required min="1" max="4" />
    <hr>
  `;

  questionsContainer.appendChild(questionDiv);
}

quizCreationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  saveQuiz();
});

function saveQuiz() {
  const quizTitle = document.getElementById("quiz-title").value;
  const questionInputs = document.querySelectorAll(".question-input");

  const quiz = {
    title: quizTitle,
    questions: [],
  };

  questionInputs.forEach((questionDiv) => {
    const questionText = questionDiv.querySelector(".question-text").value;
    const answers = Array.from(questionDiv.querySelectorAll(".answer-text")).map(
      (input) => input.value
    );
    const correctAnswerIndex = questionDiv.querySelector(".correct-answer").value - 1;

    quiz.questions.push({
      question: questionText,
      answers: answers.map((answer, index) => ({
        text: answer,
        correct: index === correctAnswerIndex,
      })),
    });
  });

  createdQuizzes.push(quiz);
  alert("Quiz saved successfully!");

  // Reset the form after saving
  quizCreationForm.reset();
  questionsContainer.innerHTML = "";
}
