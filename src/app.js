const levels = [
  {
    id: 'beginner',
    label: 'Débutant',
    icon: '🔰',
    color: '#1E90FF',
    progress: 38,
    tagline: 'Les bases pour parler dès les premières leçons.',
    lessons: ['Alphabet anglais avec audio', 'Nombres de 0 à 1000', 'Vocabulaire essentiel du quotidien', 'Articles : a, an, the', 'Verbe “to be”', 'Phrases simples et présentations'],
    exercises: ['QCM', 'Associer mots/images', 'Répétition audio'],
  },
  {
    id: 'intermediate',
    label: 'Intermédiaire',
    icon: '🟡',
    color: '#F6C945',
    progress: 24,
    tagline: 'Construire des phrases naturelles et raconter le passé.',
    lessons: ['Present simple, past simple, present continuous', 'Verbes irréguliers fréquents', 'Construction des phrases affirmatives et négatives', 'Prépositions de lieu et de temps', 'Adjectifs, comparatifs et descriptions'],
    exercises: ['Compléter les phrases', 'Traduction guidée', 'Dialogues interactifs'],
  },
  {
    id: 'advanced',
    label: 'Avancé',
    icon: '🔴',
    color: '#FF5A6A',
    progress: 12,
    tagline: 'Gagner en fluidité, écrire et converser avec confiance.',
    lessons: ['Present perfect, future forms et temps composés', 'Rédaction structurée : email, avis, essai court', 'Compréhension orale avec prise de notes', 'Prononciation avancée et intonation', 'Conversations simulées en contexte professionnel'],
    exercises: ['Rédaction corrigée', 'Écoute active', 'Conversation simulée'],
  },
];

const grammarCards = [
  ['Types de mots', 'Un nom désigne une personne ou une chose, un verbe exprime une action, un adjectif décrit un nom.', 'The clever student reads quickly.'],
  ['Structure des phrases', 'En anglais, l’ordre le plus courant est sujet + verbe + complément.', 'I learn English every day.'],
  ['Accords', 'Au présent simple, on ajoute souvent -s au verbe avec he, she ou it.', 'She speaks English.'],
  ['Articles', 'A/an introduisent un élément général. The désigne un élément précis déjà connu.', 'I see a dog. The dog is friendly.'],
];

const numberLessons = [
  ['0–20', 'Bases', 'zero, one, two, three, twenty'],
  ['21–99', 'Dizaines', 'twenty-one, forty-five, ninety-nine'],
  ['100–1000', 'Centaines', 'one hundred, seven hundred, one thousand'],
];

const quizzes = [
  { question: 'Choisis le bon article : ___ apple.', options: ['an', 'a', 'the'], answer: 'an' },
  { question: 'Complète : She ___ a teacher.', options: ['is', 'are', 'am'], answer: 'is' },
  { question: 'Traduction : “Je suis en train d’apprendre.”', options: ['I am learning.', 'I learn yesterday.', 'I learned now.'], answer: 'I am learning.' },
];

const dailyPlan = ['5 min : prononcer 10 mots nouveaux', '10 min : lire une mini-leçon de grammaire', '10 min : faire un quiz interactif', '5 min : écrire 3 phrases personnelles'];
const state = { activePage: 'home', selectedLevel: 'beginner', darkMode: false, quizAnswers: {}, chatMessages: [{ role: 'bot', text: 'Hi! Tell me about your day in English.' }] };
const app = document.querySelector('#app');

function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

function icon(name) {
  const icons = { home: '🏠', levels: '🎓', lessons: '📘', exercises: '🎯', profile: '👤', progress: '📊', audio: '🔊', mic: '🎤', bot: '🤖', pwa: '📴', calendar: '📅', grammar: '✍️', numbers: '🔢', games: '🎮', award: '🏆', sparkle: '✨' };
  return icons[name] || '•';
}

function setPage(page) { state.activePage = page; render(); }
function setLevel(id) { state.selectedLevel = id; render(); }
function toggleTheme() { state.darkMode = !state.darkMode; render(); }
function answerQuiz(index, answer) { state.quizAnswers[index] = answer; render(); }
function sendMessage() {
  const input = document.querySelector('#chat-input');
  const value = input?.value.trim();
  if (!value) return;
  state.chatMessages.push({ role: 'user', text: value });
  state.chatMessages.push({ role: 'bot', text: 'Great! Try adding one detail with because, for example: “because I want to improve.”' });
  render();
}

function progressBar(value, color) {
  return `<div class="progress-wrap" aria-label="Progression ${value}%"><div class="progress-track"><span style="width:${value}%;background:${color}"></span></div><small>${value}%</small></div>`;
}

function sectionTitle(iconName, title, subtitle) {
  return `<div class="section-title"><span>${icon(iconName)}</span><div><h2>${title}</h2><p>${subtitle}</p></div></div>`;
}

function homePage() {
  const totalProgress = Math.round(levels.reduce((sum, level) => sum + level.progress, 0) / levels.length);
  const features = [
    ['audio', 'Audio', 'Prononciation native avec synthèse vocale intégrée.'],
    ['mic', 'Reconnaissance vocale', 'Préparé pour pratiquer la répétition et la fluidité.'],
    ['bot', 'Chat anglais', 'Mini-conversations pour oser écrire en anglais.'],
    ['pwa', 'PWA ready', 'Structure prête pour mode hors ligne et notifications.'],
  ];
  return `<section class="page-grid hero-page">
    <div class="hero card spotlight">
      <div class="hero-copy">
        <span class="pill">${icon('sparkle')} Programme complet A1 à C1</span>
        <h2>Parle, écris et comprends l’anglais étape par étape.</h2>
        <p>Une expérience interactive avec audio, quiz, grammaire claire, suivi de progression, chat de pratique et programme quotidien personnalisé.</p>
        <div class="hero-actions">
          <button class="primary" data-page="levels">Commencer maintenant ›</button>
          <button class="secondary" data-speak="Welcome to English Master Pro">${icon('audio')} Écouter</button>
        </div>
      </div>
      <div class="hero-panel"><div class="progress-ring" style="--value:${totalProgress * 3.6}deg"><span>${totalProgress}%</span></div><p>Progression globale</p></div>
    </div>
    <div class="feature-grid">${features.map(([i, t, d]) => `<article class="card feature"><span class="feature-emoji">${icon(i)}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div>
    <article class="card daily-plan"><div class="card-heading"><span>${icon('calendar')}</span><h3>Programme quotidien</h3></div><div class="timeline">${dailyPlan.map((item, index) => `<p><span>${index + 1}</span>${item}</p>`).join('')}</div></article>
  </section>`;
}

function levelsPage() {
  const selected = levels.find((level) => level.id === state.selectedLevel);
  return `<section class="page-grid">
    ${sectionTitle('levels', 'Niveaux d’apprentissage', 'Choisis ton parcours et débloque les compétences clés.')}
    <div class="level-grid">${levels.map((level) => `<article class="card level-card ${selected.id === level.id ? 'selected' : ''}" data-level="${level.id}"><span class="level-icon">${level.icon}</span><h3>${level.label}</h3><p>${level.tagline}</p>${progressBar(level.progress, level.color)}</article>`).join('')}</div>
    <article class="card level-details"><div><span class="pill">${selected.icon} Niveau ${selected.label}</span><h3>${selected.tagline}</h3></div><div class="details-grid"><div><h4>Leçons</h4><ul>${selected.lessons.map((lesson) => `<li>✅ ${lesson}</li>`).join('')}</ul></div><div><h4>Exercices</h4><ul>${selected.exercises.map((exercise) => `<li>▶️ ${exercise}</li>`).join('')}</ul></div></div></article>
  </section>`;
}

function lessonsPage() {
  return `<section class="page-grid">
    ${sectionTitle('lessons', 'Leçons guidées', 'Contenu exemple pour apprendre la grammaire, les nombres et la prononciation.')}
    <div class="two-columns">
      <article class="card module-card"><div class="card-heading"><span>${icon('grammar')}</span><h3>Module grammaire</h3></div><div class="grammar-list">${grammarCards.map(([title, text, example]) => `<div class="mini-card"><h4>${title}</h4><p>${text}</p><button data-speak="${example}">${icon('audio')} ${example}</button></div>`).join('')}</div></article>
      <article class="card module-card"><div class="card-heading"><span>${icon('numbers')}</span><h3>Module nombres</h3></div>${numberLessons.map(([range, focus, sample]) => `<div class="number-row"><strong>${range}</strong><div><p>${focus}</p><small>${sample}</small></div><button data-speak="${sample}" aria-label="Écouter ${range}">${icon('audio')}</button></div>`).join('')}</article>
    </div>
    <article class="card pronunciation"><div><span class="pill">${icon('mic')} Laboratoire audio</span><h3>Répète : “I would like to improve my English pronunciation.”</h3><p>Écoute le modèle, répète à voix haute, puis coche la compétence dans ton tableau de progression.</p></div><button class="primary" data-speak="I would like to improve my English pronunciation.">${icon('audio')} Lancer l’audio</button></article>
  </section>`;
}

function exercisesPage() {
  const score = quizzes.filter((quiz, index) => state.quizAnswers[index] === quiz.answer).length;
  return `<section class="page-grid">
    ${sectionTitle('exercises', 'Exercices interactifs', 'Quiz, traduction, répétition audio et jeux éducatifs.')}
    <article class="card quiz-card"><div class="card-heading"><span>${icon('exercises')}</span><h3>Quiz rapide</h3><span class="score">${score}/${quizzes.length}</span></div><div class="quiz-grid">${quizzes.map((quiz, index) => `<div class="mini-card"><h4>${quiz.question}</h4><div class="option-list">${quiz.options.map((option) => `<button class="option ${state.quizAnswers[index] === option ? 'selected' : ''}" data-quiz-index="${index}" data-quiz-answer="${option}">${option}</button>`).join('')}</div>${state.quizAnswers[index] ? `<p class="feedback ${state.quizAnswers[index] === quiz.answer ? 'good' : 'bad'}">${state.quizAnswers[index] === quiz.answer ? 'Correct !' : `Réponse : ${quiz.answer}`}</p>` : ''}</div>`).join('')}</div></article>
    <div class="two-columns"><article class="card chat-card"><div class="card-heading"><span>${icon('bot')}</span><h3>Chat pour pratiquer</h3></div><div class="chat-box">${state.chatMessages.map((message) => `<p class="${message.role}">${message.text}</p>`).join('')}</div><div class="chat-input"><input id="chat-input" placeholder="Write in English..." /><button id="send-chat">Envoyer</button></div></article><article class="card tools-card"><div class="card-heading"><span>${icon('sparkle')}</span><h3>Bonus éducatifs</h3></div><p class="tool-row"><span>${icon('games')}</span>Jeu : associer image et mot</p><p class="tool-row"><span>🌍</span>Traduction instantanée guidée</p><p class="tool-row"><span>${icon('award')}</span>Badges : 7 jours de pratique</p></article></div>
  </section>`;
}

function profilePage() {
  const totalProgress = Math.round(levels.reduce((sum, level) => sum + level.progress, 0) / levels.length);
  return `<section class="page-grid">${sectionTitle('profile', 'Profil utilisateur', 'Un tableau personnel pour visualiser objectifs, badges et routine.')}<div class="profile-layout"><article class="card profile-card"><div class="avatar">A</div><h3>Alex Learner</h3><p>Objectif : parler anglais 15 minutes par jour.</p>${progressBar(totalProgress, '#1E90FF')}</article><article class="card badges-card"><div class="card-heading"><span>${icon('award')}</span><h3>Récompenses</h3></div><div class="badges"><span>🏅 First Words</span><span>🎧 Audio Hero</span><span>✍️ Grammar Starter</span><span>🔥 3-Day Streak</span></div></article></div></section>`;
}

function progressPage() {
  const totalProgress = Math.round(levels.reduce((sum, level) => sum + level.progress, 0) / levels.length);
  return `<section class="page-grid">${sectionTitle('progress', 'Tableau de progression', 'Suis ton évolution par niveau et compétence.')}<div class="dashboard-grid"><article class="card stats-card"><h3>${totalProgress}%</h3><p>Progression totale</p></article>${levels.map((level) => `<article class="card progress-card"><div class="card-heading"><span>${level.icon}</span><h3>${level.label}</h3></div>${progressBar(level.progress, level.color)}<p>${level.lessons.length} leçons • ${level.exercises.length} exercices</p></article>`).join('')}</div></section>`;
}

function renderPage() {
  return { home: homePage, levels: levelsPage, lessons: lessonsPage, exercises: exercisesPage, profile: profilePage, progress: progressPage }[state.activePage]();
}

function render() {
  const navItems = [['home', 'Accueil'], ['levels', 'Niveaux'], ['lessons', 'Leçons'], ['exercises', 'Exercices'], ['profile', 'Profil'], ['progress', 'Progression']];
  app.innerHTML = `<div class="app ${state.darkMode ? 'dark' : ''}"><aside class="sidebar"><button class="brand" data-page="home" aria-label="Retour accueil"><span class="brand-mark">EM</span><span><strong>English</strong><small>Master Pro</small></span></button><nav aria-label="Navigation principale">${navItems.map(([id, label]) => `<button class="nav-link ${state.activePage === id ? 'active' : ''}" data-page="${id}"><span>${icon(id)}</span>${label}</button>`).join('')}</nav><div class="sidebar-card"><span>${icon('award')}</span><strong>Badge du jour</strong><p>Grammar Starter</p></div></aside><main class="main-content"><header class="topbar"><div><p class="eyebrow">Apprendre • Pratiquer • Progresser</p><h1>English Master Pro</h1></div><button class="theme-toggle" id="theme-toggle">${state.darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}</button></header>${renderPage()}</main></div>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => setPage(button.dataset.page)));
  document.querySelectorAll('[data-level]').forEach((card) => card.addEventListener('click', () => setLevel(card.dataset.level)));
  document.querySelectorAll('[data-speak]').forEach((button) => button.addEventListener('click', () => speak(button.dataset.speak)));
  document.querySelectorAll('[data-quiz-index]').forEach((button) => button.addEventListener('click', () => answerQuiz(button.dataset.quizIndex, button.dataset.quizAnswer)));
  document.querySelector('#theme-toggle')?.addEventListener('click', toggleTheme);
  document.querySelector('#send-chat')?.addEventListener('click', sendMessage);
  document.querySelector('#chat-input')?.addEventListener('keydown', (event) => { if (event.key === 'Enter') sendMessage(); });
}

render();
