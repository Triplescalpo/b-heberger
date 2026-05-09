import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0F1E",
  surface: "#111827",
  card: "#161D2F",
  border: "#1E2A45",
  accent: "#3B82F6",
  accentGlow: "#60A5FA",
  green: "#10B981",
  purple: "#8B5CF6",
  gold: "#F59E0B",
  text: "#F1F5F9",
  muted: "#64748B",
  soft: "#94A3B8",
};

const lessons = {
  beginner: [
    { id: 1, title: "The Alphabet", icon: "🔤", xp: 10, done: true },
    { id: 2, title: "Basic Greetings", icon: "👋", xp: 15, done: true },
    { id: 3, title: "Colors & Shapes", icon: "🎨", xp: 20, done: false },
    { id: 4, title: "Numbers 1–10", icon: "🔢", xp: 20, done: false },
    { id: 5, title: "Simple Sentences", icon: "💬", xp: 25, done: false },
  ],
  intermediate: [
    { id: 6, title: "Present Tense", icon: "⏱️", xp: 30, done: false },
    { id: 7, title: "Articles: a/an/the", icon: "📰", xp: 30, done: false },
    { id: 8, title: "Common Vocabulary", icon: "📚", xp: 35, done: false },
    { id: 9, title: "Question Formation", icon: "❓", xp: 35, done: false },
    { id: 10, title: "Real Dialogues", icon: "🗣️", xp: 40, done: false },
  ],
  advanced: [
    { id: 11, title: "Complex Grammar", icon: "🧩", xp: 50, done: false },
    { id: 12, title: "Fluent Conversation", icon: "🌊", xp: 60, done: false },
    { id: 13, title: "Writing & Essays", icon: "✍️", xp: 70, done: false },
    { id: 14, title: "Idioms & Slang", icon: "🎭", xp: 70, done: false },
    { id: 15, title: "Business English", icon: "💼", xp: 80, done: false },
  ],
};

const numbersData = [
  { n: 0, en: "zero" }, { n: 1, en: "one" }, { n: 2, en: "two" },
  { n: 3, en: "three" }, { n: 4, en: "four" }, { n: 5, en: "five" },
  { n: 6, en: "six" }, { n: 7, en: "seven" }, { n: 8, en: "eight" },
  { n: 9, en: "nine" }, { n: 10, en: "ten" }, { n: 11, en: "eleven" },
  { n: 12, en: "twelve" }, { n: 13, en: "thirteen" }, { n: 14, en: "fourteen" },
  { n: 15, en: "fifteen" }, { n: 16, en: "sixteen" }, { n: 17, en: "seventeen" },
  { n: 18, en: "eighteen" }, { n: 19, en: "nineteen" }, { n: 20, en: "twenty" },
  { n: 30, en: "thirty" }, { n: 40, en: "forty" }, { n: 50, en: "fifty" },
  { n: 60, en: "sixty" }, { n: 70, en: "seventy" }, { n: 80, en: "eighty" },
  { n: 90, en: "ninety" }, { n: 100, en: "one hundred" }, { n: 200, en: "two hundred" },
  { n: 500, en: "five hundred" }, { n: 1000, en: "one thousand" },
];

const badges = [
  { id: 1, icon: "🌱", label: "Starter", desc: "Complete your first lesson", unlocked: true },
  { id: 2, icon: "📖", label: "Reader", desc: "Read 10 lessons", unlocked: true },
  { id: 3, icon: "🧠", label: "Grammar Pro", desc: "Master grammar module", unlocked: false },
  { id: 4, icon: "🔥", label: "7-Day Streak", desc: "Learn 7 days in a row", unlocked: false },
  { id: 5, icon: "🌍", label: "Globetrotter", desc: "Complete travel dialogues", unlocked: false },
  { id: 6, icon: "🏆", label: "Fluent Speaker", desc: "Reach 100% progress", unlocked: false },
];

const chatScenarios = ["🍽️ Restaurant", "✈️ Airport", "🏫 School", "💼 Office", "🛒 Shopping"];

const mockBotReplies = [
  "Good try! In English, we say: \"{corrected}\". Notice the verb placement.",
  "Excellent! Your sentence is correct. Keep going — you're improving fast!",
  "Almost perfect! Try: \"{corrected}\". The article 'the' is needed here.",
  "Well done! Native speakers would also say: \"{corrected}\" — a bit more natural.",
  "Great effort! One small fix: \"{corrected}\". Practice makes perfect!",
];

function getCorrection(input) {
  const reply = mockBotReplies[Math.floor(Math.random() * mockBotReplies.length)];
  return reply.replace("{corrected}", input.charAt(0).toUpperCase() + input.slice(1) + ".");
}

const navItems = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "lessons", icon: "📚", label: "Leçons" },
  { id: "numbers", icon: "🔢", label: "Nombres" },
  { id: "chat", icon: "🤖", label: "Chat IA" },
  { id: "progress", icon: "📊", label: "Progrès" },
  { id: "badges", icon: "🏅", label: "Badges" },
];

export default function TMProEnglish() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);
  const [xp, setXp] = useState(25);
  const [streak, setStreak] = useState(3);
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", text: "Hello! I'm your AI English coach. Choose a scenario and let's practice! 🎯" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [scenario, setScenario] = useState(chatScenarios[0]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizInput, setQuizInput] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  const totalXp = 500;
  const progress = Math.min(100, Math.round((xp / totalXp) * 100));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", text: chatInput };
    const botMsg = { role: "bot", text: getCorrection(chatInput) };
    setChatMessages((m) => [...m, userMsg, botMsg]);
    setChatInput("");
    setXp((x) => x + 2);
  };

  const checkQuiz = () => {
    const correct = numbersData[quizIdx].en.toLowerCase();
    const isRight = quizInput.trim().toLowerCase() === correct;
    setQuizResult(isRight);
    if (isRight) setXp((x) => x + 5);
  };

  const nextQuiz = () => {
    setQuizIdx((i) => (i + 1) % numbersData.length);
    setQuizInput("");
    setQuizResult(null);
  };

  const bg = darkMode ? COLORS.bg : "#F0F4FF";
  const surface = darkMode ? COLORS.surface : "#FFFFFF";
  const cardBg = darkMode ? COLORS.card : "#F8FAFF";
  const borderCol = darkMode ? COLORS.border : "#E2E8F0";
  const textCol = darkMode ? COLORS.text : "#0F172A";
  const mutedCol = darkMode ? COLORS.muted : "#64748B";

  const styles = {
    app: {
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      background: bg,
      color: textCol,
      minHeight: "100vh",
      display: "flex",
      transition: "all 0.3s",
    },
    sidebar: {
      width: 220,
      background: surface,
      borderRight: `1px solid ${borderCol}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      position: "fixed",
      top: 0,
      left: sidebarOpen ? 0 : -220,
      height: "100vh",
      zIndex: 100,
      transition: "left 0.3s",
      boxShadow: sidebarOpen ? "4px 0 30px rgba(0,0,0,0.4)" : "none",
    },
    sidebarDesktop: {
      width: 220,
      background: surface,
      borderRight: `1px solid ${borderCol}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
    },
    logo: {
      padding: "0 20px 24px",
      borderBottom: `1px solid ${borderCol}`,
      marginBottom: 8,
    },
    logoText: {
      fontSize: 20,
      fontWeight: 800,
      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: -0.5,
    },
    logoSub: { fontSize: 11, color: mutedCol, marginTop: 2 },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 20px",
      margin: "2px 8px",
      borderRadius: 10,
      cursor: "pointer",
      background: active ? `${COLORS.accent}20` : "transparent",
      color: active ? COLORS.accentGlow : mutedCol,
      fontWeight: active ? 600 : 400,
      fontSize: 14,
      borderLeft: active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
      transition: "all 0.2s",
    }),
    main: {
      flex: 1,
      overflow: "auto",
      marginLeft: 0,
    },
    topbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 24px",
      borderBottom: `1px solid ${borderCol}`,
      background: surface,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    content: { padding: 24, maxWidth: 900, margin: "0 auto" },
    card: {
      background: cardBg,
      border: `1px solid ${borderCol}`,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
    },
    badge: (unlocked) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      padding: "16px 12px",
      borderRadius: 14,
      background: unlocked ? `${COLORS.gold}15` : cardBg,
      border: `1px solid ${unlocked ? COLORS.gold + "40" : borderCol}`,
      opacity: unlocked ? 1 : 0.5,
      filter: unlocked ? "none" : "grayscale(1)",
      minWidth: 90,
      flex: "0 0 auto",
    }),
    btn: (color = COLORS.accent) => ({
      background: `linear-gradient(135deg, ${color}, ${color}CC)`,
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "10px 20px",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 14,
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }),
    input: {
      background: darkMode ? "#0D1526" : "#F1F5F9",
      border: `1px solid ${borderCol}`,
      borderRadius: 10,
      color: textCol,
      padding: "10px 14px",
      fontSize: 14,
      outline: "none",
      width: "100%",
    },
    progressBar: {
      height: 8,
      background: darkMode ? "#1E2A45" : "#E2E8F0",
      borderRadius: 99,
      overflow: "hidden",
    },
    progressFill: (pct, color = COLORS.accent) => ({
      height: "100%",
      width: `${pct}%`,
      background: `linear-gradient(90deg, ${color}, ${color}99)`,
      borderRadius: 99,
      transition: "width 0.6s ease",
    }),
    statCard: (color) => ({
      background: `${color}15`,
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: "16px 20px",
      flex: 1,
      minWidth: 120,
    }),
    tag: (color) => ({
      background: `${color}20`,
      color: color,
      border: `1px solid ${color}40`,
      borderRadius: 99,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 600,
    }),
    chatBubble: (isBot) => ({
      maxWidth: "80%",
      alignSelf: isBot ? "flex-start" : "flex-end",
      background: isBot ? (darkMode ? "#1A2540" : "#F0F4FF") : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
      color: isBot ? textCol : "#fff",
      borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
      padding: "12px 16px",
      fontSize: 14,
      lineHeight: 1.6,
      border: isBot ? `1px solid ${borderCol}` : "none",
      boxShadow: isBot ? "none" : "0 4px 15px rgba(59,130,246,0.3)",
    }),
  };

  const renderDashboard = () => (
    <div>
      {/* Hero greeting */}
      <div style={{ ...styles.card, background: `linear-gradient(135deg, #1E3A5F, #2D1B69)`, border: "none", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>👋 Good morning, learner!</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Continue your English journey</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={styles.tag(COLORS.green)}>🔥 {streak} day streak</span>
              <span style={styles.tag(COLORS.gold)}>⭐ {xp} XP</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#94A3B8", marginBottom: 6 }}>
                <span>Overall Progress</span><span style={{ color: COLORS.accentGlow, fontWeight: 700 }}>{progress}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill(progress)} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: 80, filter: "drop-shadow(0 0 20px rgba(139,92,246,0.5))" }}>🌍</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "XP Total", val: xp, icon: "⚡", color: COLORS.accent },
          { label: "Leçons faites", val: 2, icon: "📖", color: COLORS.green },
          { label: "Streak", val: `${streak}j`, icon: "🔥", color: "#F97316" },
          { label: "Badges", val: "2/6", icon: "🏅", color: COLORS.gold },
        ].map((s) => (
          <div key={s.label} style={styles.statCard(s.color)}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: mutedCol }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div style={styles.card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🚀 Accès rapide</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { label: "Continuer la leçon", icon: "▶️", nav: "lessons", color: COLORS.accent },
            { label: "Quiz Nombres", icon: "🔢", nav: "numbers", color: COLORS.green },
            { label: "Chat IA", icon: "🤖", nav: "chat", color: COLORS.purple },
            { label: "Voir les badges", icon: "🏆", nav: "badges", color: COLORS.gold },
          ].map((q) => (
            <div key={q.label} onClick={() => setActiveNav(q.nav)}
              style={{ ...styles.card, padding: "16px", cursor: "pointer", textAlign: "center", marginBottom: 0, border: `1px solid ${q.color}30`, background: `${q.color}10` }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: q.color }}>{q.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily goal */}
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>🎯 Objectif du jour</div>
          <span style={styles.tag(COLORS.green)}>En cours</span>
        </div>
        {[
          { label: "Compléter 1 leçon", done: true, xp: 10 },
          { label: "Faire 5 messages IA", done: false, xp: 10 },
          { label: "Quiz nombres", done: false, xp: 5 },
        ].map((g, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${borderCol}` : "none" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: g.done ? COLORS.green : borderCol, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>
              {g.done ? "✓" : "○"}
            </div>
            <div style={{ flex: 1, fontSize: 14, textDecoration: g.done ? "line-through" : "none", color: g.done ? mutedCol : textCol }}>{g.label}</div>
            <span style={styles.tag(COLORS.gold)}>+{g.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLessons = () => (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>📚 Mes Leçons</div>
      <div style={{ color: mutedCol, fontSize: 14, marginBottom: 24 }}>Progressez de débutant à avancé</div>

      {Object.entries(lessons).map(([level, items]) => {
        const levelColors = { beginner: COLORS.green, intermediate: COLORS.accent, advanced: COLORS.purple };
        const levelLabels = { beginner: "🌱 Débutant", intermediate: "⚡ Intermédiaire", advanced: "🔥 Avancé" };
        const color = levelColors[level];
        const isLocked = level === "advanced";

        return (
          <div key={level} style={{ ...styles.card, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color }}>{levelLabels[level]}</div>
                <div style={{ fontSize: 12, color: mutedCol }}>{items.filter(i => i.done).length}/{items.length} complétées</div>
              </div>
              {isLocked && <span style={{ ...styles.tag("#94A3B8"), fontSize: 12 }}>🔒 Verrouillé</span>}
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(items.filter(i => i.done).length / items.length * 100, color)} />
            </div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((lesson) => (
                <div key={lesson.id} onClick={() => { if (!isLocked) { setXp(x => x + (lesson.done ? 0 : lesson.xp)); } }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: lesson.done ? `${color}10` : (darkMode ? "#0D1526" : "#F8FAFF"), border: `1px solid ${lesson.done ? color + "40" : borderCol}`, cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.5 : 1, transition: "all 0.2s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: lesson.done ? color : borderCol, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {lesson.done ? "✓" : lesson.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{lesson.title}</div>
                    <div style={{ fontSize: 12, color: mutedCol }}>+{lesson.xp} XP</div>
                  </div>
                  {lesson.done ? <span style={styles.tag(color)}>✓ Fait</span> : <span style={{ fontSize: 18, color: mutedCol }}>›</span>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderNumbers = () => (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🔢 Numbers in English</div>
      <div style={{ color: mutedCol, fontSize: 14, marginBottom: 24 }}>Apprenez les nombres de 0 à 1000</div>

      {/* Quiz */}
      <div style={{ ...styles.card, background: `linear-gradient(135deg, #0D2137, #1A1040)`, border: `1px solid ${COLORS.accent}30`, marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: COLORS.accentGlow }}>🧠 Quiz Interactif</div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.accent, marginBottom: 8 }}>{numbersData[quizIdx].n}</div>
          <div style={{ fontSize: 14, color: mutedCol, marginBottom: 20 }}>Comment dit-on ce nombre en anglais ?</div>
          <div style={{ display: "flex", gap: 10, maxWidth: 400, margin: "0 auto" }}>
            <input value={quizInput} onChange={e => setQuizInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !quizResult && checkQuiz()}
              placeholder="Écrivez en anglais..."
              style={{ ...styles.input, flex: 1 }} />
            {!quizResult
              ? <button onClick={checkQuiz} style={styles.btn()}>Vérifier</button>
              : <button onClick={nextQuiz} style={styles.btn(COLORS.green)}>Suivant ›</button>
            }
          </div>
          {quizResult !== null && (
            <div style={{ marginTop: 14, fontSize: 15, color: quizResult ? COLORS.green : "#F87171", fontWeight: 600 }}>
              {quizResult ? `✅ Correct! "${numbersData[quizIdx].en}"` : `❌ La réponse est : "${numbersData[quizIdx].en}"`}
            </div>
          )}
        </div>
      </div>

      {/* Reference table */}
      <div style={styles.card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 Référence complète</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {numbersData.map(({ n, en }) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: darkMode ? "#0D1526" : "#F1F5F9", border: `1px solid ${borderCol}` }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.accent }}>{n}</span>
              <span style={{ fontSize: 13, color: mutedCol }}>{en}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🤖 Coach IA</div>
      <div style={{ color: mutedCol, fontSize: 14, marginBottom: 20 }}>Entraînez-vous avec votre professeur artificiel</div>

      {/* Scenario picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {chatScenarios.map(s => (
          <button key={s} onClick={() => setScenario(s)}
            style={{ ...styles.btn(s === scenario ? COLORS.accent : COLORS.surface), border: `1px solid ${s === scenario ? COLORS.accent : borderCol}`, padding: "7px 14px", fontSize: 13 }}>
            {s}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div style={{ ...styles.card, padding: 0, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.purple}20)`, padding: "14px 20px", borderBottom: `1px solid ${borderCol}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>English Coach AI</div>
            <div style={{ fontSize: 12, color: COLORS.green }}>● Online — {scenario}</div>
          </div>
        </div>
        <div style={{ height: 340, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={styles.chatBubble(msg.role === "bot")}>{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${borderCol}`, display: "flex", gap: 10 }}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Écrivez en anglais..."
            style={{ ...styles.input }} />
          <button onClick={sendMessage} style={{ ...styles.btn(), flexShrink: 0 }}>Envoyer ↗</button>
        </div>
      </div>

      {/* Translator */}
      <div style={{ ...styles.card, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🌐 Traducteur rapide</div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input placeholder="Français..." style={{ ...styles.input, flex: 1 }} />
          <span style={{ color: mutedCol, fontSize: 18 }}>⇄</span>
          <input placeholder="English..." style={{ ...styles.input, flex: 1 }} />
        </div>
        <div style={{ fontSize: 12, color: mutedCol, marginTop: 8 }}>Utilisez cet espace pour préparer vos phrases avant de les envoyer au coach.</div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>📊 Ma Progression</div>
      <div style={{ color: mutedCol, fontSize: 14, marginBottom: 24 }}>Suivez votre évolution semaine par semaine</div>

      <div style={styles.card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎯 Progression globale</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: mutedCol }}>XP total</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: COLORS.accent }}>{xp} / {totalXp}</span>
        </div>
        <div style={{ ...styles.progressBar, height: 14 }}>
          <div style={{ ...styles.progressFill(progress), height: "100%", borderRadius: 99, boxShadow: `0 0 10px ${COLORS.accent}60` }} />
        </div>
        <div style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: COLORS.accent, marginTop: 12 }}>{progress}%</div>
      </div>

      {/* Per-level */}
      {[
        { label: "🌱 Débutant", pct: 40, color: COLORS.green },
        { label: "⚡ Intermédiaire", pct: 5, color: COLORS.accent },
        { label: "🔥 Avancé", pct: 0, color: COLORS.purple },
      ].map(l => (
        <div key={l.label} style={{ ...styles.card, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 600 }}>{l.label}</span>
            <span style={{ color: l.color, fontWeight: 700 }}>{l.pct}%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(l.pct, l.color)} />
          </div>
        </div>
      ))}

      {/* Weekly activity (bar chart) */}
      <div style={styles.card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Activité cette semaine</div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 80 }}>
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d, i) => {
            const h = [60, 90, 40, 80, 30, 100, 55][i];
            return (
              <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", height: h * 0.7, borderRadius: "6px 6px 0 0", background: i === 4 ? `linear-gradient(to top, ${COLORS.accent}, ${COLORS.purple})` : `${COLORS.accent}30`, boxShadow: i === 4 ? `0 0 10px ${COLORS.accent}50` : "none" }} />
                <div style={{ fontSize: 11, color: mutedCol }}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderBadges = () => (
    <div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>🏅 Mes Badges</div>
      <div style={{ color: mutedCol, fontSize: 14, marginBottom: 24 }}>Débloquez des récompenses en apprenant</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14 }}>
        {badges.map(b => (
          <div key={b.id} style={{ ...styles.card, ...styles.badge(b.unlocked), textAlign: "center", cursor: "pointer", marginBottom: 0 }}>
            <div style={{ fontSize: 40 }}>{b.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: b.unlocked ? COLORS.gold : mutedCol }}>{b.label}</div>
            <div style={{ fontSize: 11, color: mutedCol, lineHeight: 1.4 }}>{b.desc}</div>
            {!b.unlocked && <span style={{ ...styles.tag(mutedCol), marginTop: 4, display: "inline-block" }}>🔒 Verrouillé</span>}
          </div>
        ))}
      </div>
    </div>
  );

  const pages = { dashboard: renderDashboard, lessons: renderLessons, numbers: renderNumbers, chat: renderChat, progress: renderProgress, badges: renderBadges };

  return (
    <div style={styles.app}>
      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }} />}

      {/* Mobile sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoText}>TM Pro-English</div>
          <div style={styles.logoSub}>Learn English with AI</div>
        </div>
        {navItems.map(n => (
          <div key={n.id} style={styles.navItem(activeNav === n.id)} onClick={() => { setActiveNav(n.id); setSidebarOpen(false); }}>
            <span>{n.icon}</span><span>{n.label}</span>
          </div>
        ))}
      </div>

      {/* Desktop sidebar */}
      <div style={{ ...styles.sidebarDesktop, display: "flex" }} className="desktop-sidebar">
        <div style={styles.logo}>
          <div style={styles.logoText}>TM Pro-English</div>
          <div style={styles.logoSub}>Learn English with AI</div>
          <div style={{ marginTop: 12, ...styles.progressBar }}>
            <div style={styles.progressFill(progress)} />
          </div>
          <div style={{ fontSize: 11, color: mutedCol, marginTop: 4 }}>{xp} XP · {progress}% global</div>
        </div>
        {navItems.map(n => (
          <div key={n.id} style={styles.navItem(activeNav === n.id)} onClick={() => setActiveNav(n.id)}>
            <span>{n.icon}</span><span>{n.label}</span>
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px 20px 0", borderTop: `1px solid ${borderCol}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Mon compte</div>
              <div style={{ fontSize: 11, color: mutedCol }}>{xp} XP · Niveau 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: textCol, cursor: "pointer", fontSize: 20, padding: "0 8px 0 0" }}>☰</button>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{navItems.find(n => n.id === activeNav)?.icon} {navItems.find(n => n.id === activeNav)?.label}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={styles.tag(COLORS.gold)}>🔥 {streak}j</span>
            <span style={styles.tag(COLORS.accent)}>⚡ {xp} XP</span>
            <button onClick={() => setDarkMode(!darkMode)}
              style={{ background: "none", border: `1px solid ${borderCol}`, borderRadius: 8, color: textCol, cursor: "pointer", padding: "6px 10px", fontSize: 14 }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
        <div style={styles.content}>
          {pages[activeNav]?.()}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2A45; border-radius: 10px; }
        input::placeholder { color: #4A5568; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
