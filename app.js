const state = {
  progress: Number(localStorage.getItem('tm-progress') || 18),
  lessons: Number(localStorage.getItem('tm-lessons') || 2),
  score: Number(localStorage.getItem('tm-score') || 140),
  dialogs: Number(localStorage.getItem('tm-dialogs') || 1),
  quizNumber: 42,
};

const levels = [
  {
    name: 'Débutant',
    icon: '🌱',
    threshold: 0,
    description: 'Alphabet, mots simples, salutations, phrases courtes et prononciation de base.',
    lessons: ['Alphabet', 'Greetings', 'Simple sentences'],
  },
  {
    name: 'Intermédiaire',
    icon: '🚀',
    threshold: 35,
    description: 'Grammaire, vocabulaire élargi, dialogues guidés et compréhension rapide.',
    lessons: ['Articles', 'Subject/verb', 'Dialogues'],
  },
  {
    name: 'Avancé',
    icon: '🏆',
    threshold: 70,
    description: 'Conversation fluide, compréhension fine, rédaction et argumentation.',
    lessons: ['Fluency', 'Listening', 'Writing'],
  },
];

const vocab = {
  Voyage: ['airport', 'ticket', 'luggage', 'passport', 'reservation', 'hotel'],
  Travail: ['meeting', 'deadline', 'project', 'team', 'report', 'interview'],
  École: ['teacher', 'homework', 'classroom', 'lesson', 'exam', 'notebook'],
  Quotidien: ['breakfast', 'family', 'shopping', 'weather', 'health', 'routine'],
};

const conjugations = {
  'to be': ['I am', 'You are', 'He/She is', 'We are', 'They are'],
  'to have': ['I have', 'You have', 'He/She has', 'We have', 'They have'],
  'to learn': ['I learn', 'You learn', 'He/She learns', 'We learn', 'They learn'],
};

const exercises = [
  { question: 'Complete: She ___ English every day.', choices: ['learn', 'learns', 'learning'], answer: 'learns' },
  { question: 'Choose the correct article: ___ apple.', choices: ['a', 'an', 'the'], answer: 'an' },
  { question: 'Past simple: Yesterday, I ___ to school.', choices: ['go', 'went', 'going'], answer: 'went' },
];
let exerciseIndex = 0;

const dictionary = {
  hello: 'bonjour',
  'how are you?': 'comment vas-tu ?',
  'i would like a coffee': 'je voudrais un café',
  'where is the station?': 'où est la gare ?',
  'thank you': 'merci',
  'good morning': 'bonjour',
};

function persist() {
  localStorage.setItem('tm-progress', state.progress);
  localStorage.setItem('tm-lessons', state.lessons);
  localStorage.setItem('tm-score', state.score);
  localStorage.setItem('tm-dialogs', state.dialogs);
}

function updateProgress(delta = 0) {
  state.progress = Math.min(100, Math.max(0, state.progress + delta));
  persist();
  document.getElementById('progressValue').textContent = state.progress;
  document.getElementById('progressBar').style.width = `${state.progress}%`;
  document.getElementById('lessonCount').textContent = state.lessons;
  document.getElementById('scoreCount').textContent = state.score;
  document.getElementById('dialogCount').textContent = state.dialogs;
  renderLevels();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderLevels() {
  const grid = document.getElementById('levelsGrid');
  grid.innerHTML = levels.map((level) => {
    const unlocked = state.progress >= level.threshold;
    return `
      <article class="level-card ${unlocked ? '' : 'locked'}">
        <span class="level-status">${unlocked ? 'Déverrouillé' : `Verrouillé à ${level.threshold}%`}</span>
        <h3>${level.icon} ${level.name}</h3>
        <p>${level.description}</p>
        <div class="word-cloud">${level.lessons.map((lesson) => `<span>${lesson}</span>`).join('')}</div>
      </article>
    `;
  }).join('');
}

function renderVocab(theme = Object.keys(vocab)[0]) {
  document.getElementById('vocabTabs').innerHTML = Object.keys(vocab).map((name) => (
    `<button type="button" class="${name === theme ? 'active' : ''}" data-theme-name="${name}">${name}</button>`
  )).join('');
  document.getElementById('wordCloud').innerHTML = vocab[theme].map((word) => `<span>${word}</span>`).join('');
}

function numberToWords(number) {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  if (number < 20) return ones[number];
  if (number < 100) {
    const ten = Math.floor(number / 10);
    const rest = number % 10;
    return rest ? `${tens[ten]}-${ones[rest]}` : tens[ten];
  }
  if (number < 1000) {
    const hundred = Math.floor(number / 100);
    const rest = number % 100;
    return rest ? `${ones[hundred]} hundred ${numberToWords(rest)}` : `${ones[hundred]} hundred`;
  }
  return 'one thousand';
}

function updateNumberWord() {
  const input = document.getElementById('numberInput');
  const value = Math.min(1000, Math.max(0, Number(input.value || 0)));
  input.value = value;
  document.getElementById('numberWord').textContent = numberToWords(value);
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    showToast('Synthèse vocale non disponible sur ce navigateur.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

function newQuizNumber() {
  state.quizNumber = [7, 19, 42, 88, 100, 315, 1000][Math.floor(Math.random() * 7)];
  document.getElementById('quizPrompt').textContent = `Écris ${state.quizNumber} en anglais`;
  document.getElementById('quizAnswer').value = '';
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ').replace(/-/g, ' ');
}

function renderExercise() {
  const exercise = exercises[exerciseIndex];
  document.getElementById('exerciseQuestion').textContent = exercise.question;
  document.getElementById('choiceGrid').innerHTML = exercise.choices.map((choice) => `<button type="button" data-choice="${choice}">${choice}</button>`).join('');
}

function addMessage(role, text) {
  const messages = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = `message ${role}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function coachReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes('i has')) {
    return 'Correction: say “I have”, not “I has”. Alternative: “I have a question.”';
  }
  if (lower.includes('she go')) {
    return 'Correction: with she/he/it, add -s: “She goes”. Alternative: “She goes to school every day.”';
  }
  if (text.split(' ').length < 4) {
    return 'Good start! Try a longer sentence: “I would like to practice English today.”';
  }
  return 'Great sentence! A more natural version could be: “' + text.charAt(0).toUpperCase() + text.slice(1).replace(/\.$/, '') + '.” Keep going!';
}

function translate(text) {
  const key = text.toLowerCase().trim();
  if (dictionary[key]) return dictionary[key];
  const reverse = Object.entries(dictionary).find(([, value]) => value === key);
  if (reverse) return reverse[0];
  return 'Traduction suggérée: ' + text.split(' ').reverse().join(' ') + ' (démo hors ligne).';
}

function initEvents() {
  document.querySelector('.mobile-menu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
  document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('tm-theme', next);
  });
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.querySelector(button.dataset.scroll).scrollIntoView()));
  document.querySelectorAll('.call-button').forEach((button) => button.addEventListener('click', () => document.getElementById('chat').scrollIntoView()));
  document.querySelector('.start-lesson').addEventListener('click', () => {
    state.lessons += 1;
    state.score += 25;
    updateProgress(7);
    showToast('Leçon complétée: +7% et +25 points!');
  });
  document.getElementById('vocabTabs').addEventListener('click', (event) => {
    if (event.target.dataset.themeName) renderVocab(event.target.dataset.themeName);
  });
  document.querySelectorAll('.rule-item').forEach((button) => button.addEventListener('click', () => {
    document.getElementById('grammarExplanation').textContent = button.dataset.rule;
  }));
  document.getElementById('verbSelect').addEventListener('change', renderConjugation);
  document.getElementById('numberInput').addEventListener('input', updateNumberWord);
  document.getElementById('listenNumber').addEventListener('click', () => speak(document.getElementById('numberWord').textContent));
  document.getElementById('checkQuiz').addEventListener('click', () => {
    const correct = normalize(document.getElementById('quizAnswer').value) === normalize(numberToWords(state.quizNumber));
    document.getElementById('quizFeedback').textContent = correct ? 'Excellent! Réponse correcte.' : `Presque: la bonne réponse est ${numberToWords(state.quizNumber)}.`;
    if (correct) {
      state.score += 10;
      updateProgress(3);
      setTimeout(newQuizNumber, 900);
    }
  });
  document.getElementById('choiceGrid').addEventListener('click', (event) => {
    if (!event.target.dataset.choice) return;
    const exercise = exercises[exerciseIndex];
    const correct = event.target.dataset.choice === exercise.answer;
    document.getElementById('exerciseFeedback').textContent = correct ? 'Correct! Ton score augmente.' : `Correction: ${exercise.answer}.`;
    if (correct) {
      state.score += 15;
      updateProgress(4);
      exerciseIndex = (exerciseIndex + 1) % exercises.length;
      setTimeout(renderExercise, 800);
    }
  });
  document.getElementById('chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    const reply = coachReply(text);
    setTimeout(() => {
      addMessage('bot', reply);
      speak(reply);
    }, 350);
    input.value = '';
    state.dialogs += 1;
    state.score += 5;
    updateProgress(2);
  });
  document.querySelector('.scenario-panel').addEventListener('click', (event) => {
    const scenario = event.target.dataset.scenario;
    if (!scenario) return;
    const prompts = {
      restaurant: 'Welcome! What would you like to order today?',
      school: 'Hi! Can you tell me about your favorite subject?',
      travel: 'Hello traveler! Where would you like to go?',
      work: 'Good morning. Can you present your project update?',
    };
    addMessage('bot', prompts[scenario]);
    speak(prompts[scenario]);
  });
  document.getElementById('translateButton').addEventListener('click', () => {
    const value = document.getElementById('translatorInput').value;
    document.getElementById('translationOutput').textContent = translate(value || 'hello');
  });
}

function renderConjugation() {
  const verb = document.getElementById('verbSelect').value;
  document.getElementById('conjugationOutput').innerHTML = conjugations[verb].map((line) => `<span>${line}</span>`).join('');
}

function init() {
  document.documentElement.dataset.theme = localStorage.getItem('tm-theme') || 'light';
  renderVocab();
  renderConjugation();
  updateNumberWord();
  newQuizNumber();
  renderExercise();
  initEvents();
  addMessage('bot', 'Hello! I am your English coach. Write a sentence and I will correct it in real time.');
  updateProgress(0);
}

init();
