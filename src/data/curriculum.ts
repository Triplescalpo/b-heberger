export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  skills: string[];
  sample: string;
  exercise: string;
};

export type Level = {
  id: Difficulty;
  label: string;
  frenchLabel: string;
  objective: string;
  badge: string;
  color: string;
  progress: number;
  lessons: Lesson[];
};

export type GrammarTopic = {
  title: string;
  rule: string;
  example: string;
};

export const levels: Level[] = [
  {
    id: 'Beginner',
    label: 'Level 1',
    frenchLabel: 'Débutant',
    objective: 'Partir de zéro avec les sons, mots essentiels et phrases simples.',
    badge: 'First Words',
    color: '#1E90FF',
    progress: 0.32,
    lessons: [
      {
        id: 'alphabet',
        title: 'Alphabet & pronunciation',
        subtitle: '26 lettres avec audio natif et répétition vocale.',
        duration: '12 min',
        skills: ['Écoute', 'Prononciation'],
        sample: 'A /eɪ/, B /biː/, C /siː/',
        exercise: 'Écoute la lettre puis répète-la à voix haute.',
      },
      {
        id: 'numbers-0-1000',
        title: 'Numbers 0–1000',
        subtitle: 'Lire, écrire et comprendre les nombres du quotidien.',
        duration: '18 min',
        skills: ['Vocabulaire', 'Écriture'],
        sample: '0 zero, 10 ten, 100 one hundred, 1000 one thousand',
        exercise: 'Associe chaque nombre à son écriture anglaise.',
      },
      {
        id: 'to-be',
        title: 'Verb “to be”',
        subtitle: 'am, is, are pour construire tes premières phrases.',
        duration: '15 min',
        skills: ['Grammaire', 'Phrases simples'],
        sample: 'I am a student. She is happy. They are friends.',
        exercise: 'Complète : He ___ a teacher.',
      },
    ],
  },
  {
    id: 'Intermediate',
    label: 'Level 2',
    frenchLabel: 'Intermédiaire',
    objective: 'Construire des phrases affirmatives, négatives et interrogatives correctes.',
    badge: 'Sentence Builder',
    color: '#FFD45A',
    progress: 0.18,
    lessons: [
      {
        id: 'present-tenses',
        title: 'Present simple vs continuous',
        subtitle: 'Choisir le bon présent selon l’habitude ou l’action en cours.',
        duration: '20 min',
        skills: ['Conjugaison', 'Conversation'],
        sample: 'I work every day. I am working now.',
        exercise: 'Traduis : Je lis maintenant.',
      },
      {
        id: 'past-simple',
        title: 'Past simple',
        subtitle: 'Verbes réguliers, irréguliers et questions au passé.',
        duration: '22 min',
        skills: ['Conjugaison', 'Traduction'],
        sample: 'I visited Paris. She went home.',
        exercise: 'Transforme : I go to school → Yesterday, I ___.',
      },
      {
        id: 'prepositions',
        title: 'Prepositions in, on, at',
        subtitle: 'Parler du lieu et du temps avec précision.',
        duration: '14 min',
        skills: ['Grammaire', 'Quiz chronométré'],
        sample: 'at 8 o’clock, on Monday, in May',
        exercise: 'Choisis : I wake up ___ 7 a.m.',
      },
    ],
  },
  {
    id: 'Advanced',
    label: 'Level 3',
    frenchLabel: 'Avancé',
    objective: 'Parler et écrire couramment avec nuances, connecteurs et rédaction longue.',
    badge: 'Fluent Speaker',
    color: '#FF6B6B',
    progress: 0.07,
    lessons: [
      {
        id: 'perfect-tenses',
        title: 'Perfect tenses',
        subtitle: 'Present perfect, past perfect et futur pour raconter clairement.',
        duration: '24 min',
        skills: ['Temps avancés', 'Rédaction'],
        sample: 'I have finished. She had left before I arrived.',
        exercise: 'Explique une expérience avec “I have never…”.',
      },
      {
        id: 'reported-speech',
        title: 'Reported speech',
        subtitle: 'Transformer les paroles directes en discours indirect.',
        duration: '19 min',
        skills: ['Grammaire avancée', 'Compréhension'],
        sample: 'He said, “I am tired.” → He said that he was tired.',
        exercise: 'Transforme une phrase de dialogue en discours indirect.',
      },
      {
        id: 'writing-lab',
        title: 'Writing lab',
        subtitle: 'Emails, textes et conversations corrigés par objectifs.',
        duration: '25 min',
        skills: ['Écriture libre', 'Correction IA'],
        sample: 'However, I believe this solution is effective.',
        exercise: 'Rédige un email court pour demander un rendez-vous.',
      },
    ],
  },
];

export const grammarTopics: GrammarTopic[] = [
  {
    title: 'Types de mots',
    rule: 'Un nom désigne une personne ou chose, un verbe exprime une action, un adjectif décrit un nom.',
    example: 'The young student reads a book.',
  },
  {
    title: 'Structure de phrase',
    rule: 'La structure de base est sujet + verbe + complément pour garder une phrase claire.',
    example: 'I learn English every day.',
  },
  {
    title: 'Articles',
    rule: 'Utilise “a” avant un son consonne, “an” avant un son voyelle et “the” pour quelque chose de précis.',
    example: 'A teacher, an apple, the blue notebook.',
  },
  {
    title: 'Accords simples',
    rule: 'Au présent simple, ajoute souvent -s au verbe avec he, she ou it.',
    example: 'She speaks English. They speak English.',
  },
];

export const dailyPlan = [
  '5 min de révision vocabulaire',
  '10 min de leçon guidée',
  '5 min d’écoute et répétition',
  '1 mini-jeu ou quiz chronométré',
];

export const featureCards = [
  'Audio natif Text-to-Speech',
  'Reconnaissance vocale pour parler',
  'Chat IA de conversation simulée',
  'Mode hors ligne avec contenu téléchargé',
  'Badges, points et classement',
  'Notifications de rappel quotidien',
];
