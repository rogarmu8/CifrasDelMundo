let unseenQuestions = [];
let seenQuestions = [];
let currentQuestion = null;

const questionElem = document.getElementById('currentQuestion');
const answerDisplay = document.getElementById('answerDisplay');
const answerNumber = document.getElementById('answerNumber');
const answerExplanation = document.getElementById('answerExplanation');
const questionsSeenElem = document.getElementById('questionsSeen');
const mainBtn = document.getElementById('mainBtn');
const btnLabel = document.getElementById('btnLabel');
const categoryDisplay = document.getElementById('categoryDisplay');

const HOLD_TIME = 600; // ms to hold for action
let holdTimeout = null;
let state = 'respuesta'; // or 'siguiente'
let isClickable = true;
const CLICK_DEBOUNCE = 500; // ms to prevent double clicks

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function initGame() {
  unseenQuestions = [...questions];
  shuffle(unseenQuestions);
  seenQuestions = [];
  questionsSeenElem.textContent = '0';
  showNextQuestion();
}

function showNextQuestion() {
  answerNumber.textContent = '';
  answerExplanation.textContent = '';
  answerDisplay.classList.remove('visible');
  answerDisplay.classList.add('answer-placeholder');
  if (unseenQuestions.length === 0) {
    // Reset if all questions seen
    unseenQuestions = [...seenQuestions];
    seenQuestions = [];
    shuffle(unseenQuestions);
    questionsSeenElem.textContent = '0';
  }
  currentQuestion = unseenQuestions.pop();
  seenQuestions.push(currentQuestion);
  questionElem.textContent = currentQuestion.question;
  questionsSeenElem.textContent = seenQuestions.length;
  btnLabel.textContent = 'Respuesta';
  state = 'respuesta';
  mainBtn.classList.remove('holding');
  mainBtn.classList.add('reset-progress');
  setTimeout(() => mainBtn.classList.remove('reset-progress'), 10);
  
  // Display category
  displayCategory(currentQuestion.category);
}

function showAnswer() {
  answerNumber.textContent = currentQuestion.answer;
  answerExplanation.textContent = currentQuestion.explanation;
  answerDisplay.classList.add('visible');
  answerDisplay.classList.remove('answer-placeholder');
  btnLabel.textContent = 'Siguiente';
  state = 'siguiente';
  mainBtn.classList.remove('holding');
  mainBtn.classList.add('reset-progress');
  setTimeout(() => mainBtn.classList.remove('reset-progress'), 10);
}

function displayCategory(category) {
  // Remove accents and convert to lowercase
  const normalized = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase();
  categoryDisplay.textContent = category;
  categoryDisplay.className = 'category-display category-' + normalized;
}

// Hold-to-show for Respuesta, Hold-to-next for Siguiente
function handleHoldStart(e) {
  e.preventDefault();
  mainBtn.classList.add('holding');
  holdTimeout = setTimeout(() => {
    if (state === 'respuesta') {
      showAnswer();
    } else if (state === 'siguiente') {
      showNextQuestion();
    }
  }, HOLD_TIME);
}

function handleHoldEnd(e) {
  clearTimeout(holdTimeout);
  mainBtn.classList.remove('holding');
  // If we are in 'respuesta' state and user releases before hold, do nothing
  // If we are in 'siguiente' state, do nothing (wait for hold)
}

function handleClick(e) {
  e.preventDefault();
  if (!isClickable) return;
  
  isClickable = false;
  mainBtn.classList.add('clicked');
  
  if (state === 'respuesta') {
    showAnswer();
  } else if (state === 'siguiente') {
    showNextQuestion();
  }
  
  setTimeout(() => {
    mainBtn.classList.remove('clicked');
    isClickable = true;
  }, CLICK_DEBOUNCE);
}

// Mouse events for PC
mainBtn.addEventListener('mousedown', handleHoldStart);
mainBtn.addEventListener('mouseup', handleHoldEnd);
mainBtn.addEventListener('mouseleave', handleHoldEnd);
mainBtn.addEventListener('click', handleClick);

// Touch events for mobile
mainBtn.addEventListener('touchstart', handleHoldStart);
mainBtn.addEventListener('touchend', handleHoldEnd);

// Start game
window.onload = initGame; 