import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { dailyPlan, featureCards, grammarTopics, levels, type Level } from './src/data/curriculum';
import { ProgressBar } from './src/components/ProgressBar';

type Screen = 'home' | 'dashboard' | 'lessons' | 'exercises' | 'profile';
type ThemeMode = 'system' | 'light' | 'dark';

const primaryBlue = '#1E90FF';
const softYellow = '#FFF4BF';
const screens: { id: Screen; label: string; icon: string }[] = [
  { id: 'home', label: 'Accueil', icon: '⌂' },
  { id: 'dashboard', label: 'Progrès', icon: '▣' },
  { id: 'lessons', label: 'Leçons', icon: '✦' },
  { id: 'exercises', label: 'Exos', icon: '✓' },
  { id: 'profile', label: 'Profil', icon: '◉' },
];

export default function App() {
  const systemScheme = useColorScheme();
  const [screen, setScreen] = useState<Screen>('home');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [selectedLevel, setSelectedLevel] = useState<Level>(levels[0]);
  const [answer, setAnswer] = useState('');

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const theme = useMemo(() => createTheme(isDark), [isDark]);
  const totalProgress = levels.reduce((sum, level) => sum + level.progress, 0) / levels.length;

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', rate: 0.88, pitch: 1.02 });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Header isDark={isDark} themeMode={themeMode} setThemeMode={setThemeMode} />
        {screen === 'home' && <HomeScreen theme={theme} onStart={() => setScreen('dashboard')} speak={speak} />}
        {screen === 'dashboard' && (
          <DashboardScreen
            theme={theme}
            totalProgress={totalProgress}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            openLessons={() => setScreen('lessons')}
          />
        )}
        {screen === 'lessons' && <LessonsScreen theme={theme} selectedLevel={selectedLevel} speak={speak} />}
        {screen === 'exercises' && (
          <ExercisesScreen theme={theme} answer={answer} setAnswer={setAnswer} speak={speak} />
        )}
        {screen === 'profile' && <ProfileScreen theme={theme} />}
      </ScrollView>
      <BottomNav active={screen} setActive={setScreen} theme={theme} />
    </SafeAreaView>
  );
}

function Header({
  isDark,
  themeMode,
  setThemeMode,
}: {
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}) {
  const nextMode: ThemeMode = themeMode === 'system' ? 'light' : themeMode === 'light' ? 'dark' : 'system';
  const label = themeMode === 'system' ? 'Auto' : themeMode === 'light' ? 'Clair' : 'Sombre';

  return (
    <View style={styles.header}>
      <View>
        <Text style={[styles.kicker, { color: isDark ? '#9CCBFF' : primaryBlue }]}>English proTM</Text>
        <Text style={[styles.headerTitle, { color: isDark ? '#F8FBFF' : '#0F172A' }]}>Learn. Speak. Write.</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setThemeMode(nextMode)}
        style={[styles.themeButton, { backgroundColor: isDark ? '#172033' : '#EAF4FF' }]}
      >
        <Text style={{ color: isDark ? '#F8FBFF' : primaryBlue, fontWeight: '800' }}>{label}</Text>
      </Pressable>
    </View>
  );
}

function HomeScreen({ theme, onStart, speak }: ScreenProps & { onStart: () => void; speak: (text: string) => void }) {
  return (
    <View>
      <View style={[styles.hero, { backgroundColor: theme.card }]}> 
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>EP</Text>
        </View>
        <Text style={[styles.heroTitle, { color: theme.text }]}>De zéro à conversationnel fluide</Text>
        <Text style={[styles.heroText, { color: theme.muted }]}>Un parcours Android moderne pour apprendre à parler, écrire et comprendre l’anglais avec audio, exercices guidés, grammaire complète et pratique IA.</Text>
        <View style={styles.heroActions}>
          <Pressable style={styles.primaryButton} onPress={onStart}>
            <Text style={styles.primaryButtonText}>Commencer</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={() => speak('I am ready to learn English today.')}> 
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>🔈 Démo audio</Text>
          </Pressable>
        </View>
      </View>
      <SectionTitle theme={theme} title="Programme quotidien" subtitle="Une routine simple pour progresser chaque jour." />
      <View style={styles.grid}>
        {dailyPlan.map((item, index) => (
          <View key={item} style={[styles.smallCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={[styles.cardText, { color: theme.text }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DashboardScreen({
  theme,
  totalProgress,
  selectedLevel,
  setSelectedLevel,
  openLessons,
}: ScreenProps & {
  totalProgress: number;
  selectedLevel: Level;
  setSelectedLevel: (level: Level) => void;
  openLessons: () => void;
}) {
  return (
    <View>
      <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Dashboard</Text>
        <Text style={[styles.heroText, { color: theme.muted }]}>Progression globale vers la fluidité conversationnelle et l’écriture correcte.</Text>
        <ProgressBar progress={totalProgress} color={primaryBlue} trackColor={theme.track} />
        <View style={styles.statsRow}>
          <Stat label="Points" value="1 240" theme={theme} />
          <Stat label="Badges" value="6" theme={theme} />
          <Stat label="Série" value="9 j" theme={theme} />
        </View>
      </View>
      <SectionTitle theme={theme} title="Niveaux" subtitle="Choisis ton parcours actuel." />
      {levels.map((level) => (
        <Pressable
          key={level.id}
          onPress={() => setSelectedLevel(level)}
          style={[
            styles.levelCard,
            { backgroundColor: theme.card, borderColor: selectedLevel.id === level.id ? level.color : theme.border },
          ]}
        >
          <View style={styles.levelTopLine}>
            <Text style={[styles.levelTitle, { color: theme.text }]}>{level.label} · {level.frenchLabel}</Text>
            <Text style={[styles.badge, { backgroundColor: level.color }]}>{level.badge}</Text>
          </View>
          <Text style={[styles.cardText, { color: theme.muted }]}>{level.objective}</Text>
          <ProgressBar progress={level.progress} color={level.color} trackColor={theme.track} />
        </Pressable>
      ))}
      <Pressable style={styles.primaryButton} onPress={openLessons}>
        <Text style={styles.primaryButtonText}>Ouvrir les leçons {selectedLevel.frenchLabel}</Text>
      </Pressable>
    </View>
  );
}

function LessonsScreen({ theme, selectedLevel, speak }: ScreenProps & { selectedLevel: Level; speak: (text: string) => void }) {
  return (
    <View>
      <SectionTitle theme={theme} title={`Leçons · ${selectedLevel.frenchLabel}`} subtitle={selectedLevel.objective} />
      {selectedLevel.lessons.map((lesson) => (
        <View key={lesson.id} style={[styles.lessonCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.levelTopLine}>
            <Text style={[styles.lessonTitle, { color: theme.text }]}>{lesson.title}</Text>
            <Text style={[styles.duration, { color: theme.muted }]}>{lesson.duration}</Text>
          </View>
          <Text style={[styles.cardText, { color: theme.muted }]}>{lesson.subtitle}</Text>
          <View style={styles.chipsRow}>
            {lesson.skills.map((skill) => <Text key={skill} style={styles.chip}>{skill}</Text>)}
          </View>
          <View style={[styles.sampleBox, { backgroundColor: theme.sample }]}> 
            <Text style={[styles.sampleText, { color: theme.text }]}>{lesson.sample}</Text>
          </View>
          <View style={styles.heroActions}>
            <Pressable style={styles.listenButton} onPress={() => speak(lesson.sample)}>
              <Text style={styles.listenButtonText}>🔈 Écouter</Text>
            </Pressable>
            <Text style={[styles.exercisePrompt, { color: theme.muted }]}>{lesson.exercise}</Text>
          </View>
        </View>
      ))}
      <GrammarModule theme={theme} />
    </View>
  );
}

function ExercisesScreen({
  theme,
  answer,
  setAnswer,
  speak,
}: ScreenProps & { answer: string; setAnswer: (value: string) => void; speak: (text: string) => void }) {
  return (
    <View>
      <SectionTitle theme={theme} title="Exercices" subtitle="QCM, traduction, dictée, écriture guidée et jeux de rôle." />
      <View style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.lessonTitle, { color: theme.text }]}>Traduction FR → EN</Text>
        <Text style={[styles.cardText, { color: theme.muted }]}>Écris en anglais : “Je suis étudiant.”</Text>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="I am a student."
          placeholderTextColor={theme.placeholder}
          style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.input }]}
        />
        <View style={styles.heroActions}>
          <Pressable style={styles.primaryButton} onPress={() => speak(answer || 'I am a student.')}> 
            <Text style={styles.primaryButtonText}>Vérifier + écouter</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: theme.border }]}> 
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>🎤 Répéter</Text>
          </Pressable>
        </View>
      </View>
      <View style={[styles.chatCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <Text style={[styles.lessonTitle, { color: theme.text }]}>🤖 Chat IA · Role-play</Text>
        <ChatBubble theme={theme} author="AI Coach" text="Hello! Tell me about your day using the present simple." />
        <ChatBubble theme={theme} author="You" text="I wake up at 7 a.m. and I study English." right />
        <ChatBubble theme={theme} author="AI Coach" text="Great! Add one connector: however, therefore, or because." />
      </View>
      <View style={styles.grid}>
        {['QCM', 'Association mot-image', 'Dictée audio', 'Quiz chronométré', 'Rédaction libre', 'Mini-jeux'].map((item) => (
          <View key={item} style={[styles.smallCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.cardText, { color: theme.text }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfileScreen({ theme }: ScreenProps) {
  return (
    <View>
      <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Apprenant motivé</Text>
        <Text style={[styles.heroText, { color: theme.muted }]}>Objectif : 20 minutes par jour · Mode hors ligne activé · Rappels à 19:00.</Text>
      </View>
      <SectionTitle theme={theme} title="Fonctionnalités clés" subtitle="Tout ce qu’il faut pour parler, écrire et comprendre." />
      {featureCards.map((feature) => (
        <View key={feature} style={[styles.featureRow, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={styles.featureIcon}>★</Text>
          <Text style={[styles.cardText, { color: theme.text }]}>{feature}</Text>
        </View>
      ))}
    </View>
  );
}

function GrammarModule({ theme }: ScreenProps) {
  return (
    <View>
      <SectionTitle theme={theme} title="Grammaire complète" subtitle="Règles importantes expliquées simplement avec exemples." />
      {grammarTopics.map((topic) => (
        <View key={topic.title} style={[styles.grammarCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <Text style={[styles.lessonTitle, { color: theme.text }]}>{topic.title}</Text>
          <Text style={[styles.cardText, { color: theme.muted }]}>{topic.rule}</Text>
          <Text style={[styles.example, { color: theme.text }]}>{topic.example}</Text>
        </View>
      ))}
    </View>
  );
}

function BottomNav({ active, setActive, theme }: { active: Screen; setActive: (screen: Screen) => void; theme: ReturnType<typeof createTheme> }) {
  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.nav, borderColor: theme.border }]}> 
      {screens.map((item) => {
        const isActive = active === item.id;
        return (
          <Pressable key={item.id} onPress={() => setActive(item.id)} style={styles.navItem}>
            <Text style={[styles.navIcon, { color: isActive ? primaryBlue : theme.muted }]}>{item.icon}</Text>
            <Text style={[styles.navText, { color: isActive ? primaryBlue : theme.muted }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionTitle({ theme, title, subtitle }: ScreenProps & { title: string; subtitle: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionHeading, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>{subtitle}</Text>
    </View>
  );
}

function Stat({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof createTheme> }) {
  return (
    <View style={[styles.statBox, { backgroundColor: theme.sample }]}> 
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

function ChatBubble({ theme, author, text, right }: { theme: ReturnType<typeof createTheme>; author: string; text: string; right?: boolean }) {
  return (
    <View style={[styles.chatBubble, right && styles.chatBubbleRight, { backgroundColor: right ? primaryBlue : theme.sample }]}> 
      <Text style={[styles.chatAuthor, { color: right ? '#FFFFFF' : primaryBlue }]}>{author}</Text>
      <Text style={[styles.chatText, { color: right ? '#FFFFFF' : theme.text }]}>{text}</Text>
    </View>
  );
}

type ScreenProps = {
  theme: ReturnType<typeof createTheme>;
};

function createTheme(isDark: boolean) {
  return {
    background: isDark ? '#08111F' : '#F7FBFF',
    card: isDark ? '#101B2E' : '#FFFFFF',
    text: isDark ? '#F8FBFF' : '#0F172A',
    muted: isDark ? '#AAB8D0' : '#64748B',
    border: isDark ? '#22314C' : '#DDEBFA',
    track: isDark ? '#22314C' : '#E6F1FF',
    sample: isDark ? '#172033' : '#F0F7FF',
    input: isDark ? '#0D1728' : '#FFFFFF',
    placeholder: isDark ? '#6F7F99' : '#94A3B8',
    nav: isDark ? '#0D1728' : '#FFFFFF',
  };
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  kicker: { fontSize: 14, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  headerTitle: { fontSize: 26, fontWeight: '900', marginTop: 2 },
  themeButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  hero: { borderRadius: 30, padding: 24, shadowColor: '#1E90FF', shadowOpacity: 0.16, shadowRadius: 20, elevation: 4 },
  logoCircle: { width: 78, height: 78, borderRadius: 26, backgroundColor: primaryBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  logoText: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '900' },
  heroText: { fontSize: 15, lineHeight: 23, marginTop: 10 },
  heroActions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  primaryButton: { backgroundColor: primaryBlue, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  secondaryButton: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13 },
  secondaryButtonText: { fontWeight: '800' },
  sectionTitle: { marginTop: 26, marginBottom: 12 },
  sectionHeading: { fontSize: 22, fontWeight: '900' },
  sectionSubtitle: { fontSize: 14, lineHeight: 21, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  smallCard: { width: '47.5%', borderWidth: 1, borderRadius: 20, padding: 16, minHeight: 92 },
  stepNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: softYellow, textAlign: 'center', textAlignVertical: 'center', color: '#7A5A00', fontWeight: '900', marginBottom: 10 },
  cardText: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  summaryCard: { borderWidth: 1, borderRadius: 26, padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  statBox: { flex: 1, borderRadius: 18, padding: 14 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 12, marginTop: 3, fontWeight: '700' },
  levelCard: { borderWidth: 2, borderRadius: 24, padding: 18, gap: 12, marginBottom: 12 },
  levelTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  levelTitle: { fontSize: 17, fontWeight: '900', flex: 1 },
  badge: { color: '#102033', overflow: 'hidden', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, fontSize: 11, fontWeight: '900' },
  lessonCard: { borderWidth: 1, borderRadius: 24, padding: 18, marginBottom: 14 },
  lessonTitle: { fontSize: 18, fontWeight: '900', flex: 1 },
  duration: { fontSize: 12, fontWeight: '800' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: { backgroundColor: softYellow, color: '#7A5A00', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '900' },
  sampleBox: { borderRadius: 18, padding: 14, marginTop: 14 },
  sampleText: { fontSize: 15, lineHeight: 22, fontWeight: '800' },
  listenButton: { backgroundColor: '#0FBC8C', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  listenButtonText: { color: '#FFFFFF', fontWeight: '900' },
  exercisePrompt: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '700' },
  grammarCard: { borderWidth: 1, borderRadius: 22, padding: 17, marginBottom: 12 },
  example: { marginTop: 10, fontSize: 15, fontWeight: '900' },
  exerciseCard: { borderWidth: 1, borderRadius: 24, padding: 18, marginBottom: 14 },
  input: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 14, fontSize: 16, fontWeight: '700' },
  chatCard: { borderWidth: 1, borderRadius: 24, padding: 18, marginBottom: 14 },
  chatBubble: { maxWidth: '86%', borderRadius: 18, padding: 14, marginTop: 12 },
  chatBubbleRight: { alignSelf: 'flex-end' },
  chatAuthor: { fontSize: 12, fontWeight: '900', marginBottom: 4 },
  chatText: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  profileCard: { borderWidth: 1, borderRadius: 28, padding: 22, alignItems: 'center' },
  avatar: { width: 78, height: 78, borderRadius: 39, backgroundColor: softYellow, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#7A5A00' },
  featureRow: { borderWidth: 1, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  featureIcon: { color: primaryBlue, fontSize: 16, fontWeight: '900' },
  bottomNav: { position: 'absolute', left: 14, right: 14, bottom: 12, borderWidth: 1, borderRadius: 28, paddingVertical: 10, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-around', shadowColor: '#0F172A', shadowOpacity: 0.12, shadowRadius: 16, elevation: 10 },
  navItem: { alignItems: 'center', gap: 3, flex: 1 },
  navIcon: { fontSize: 18, fontWeight: '900' },
  navText: { fontSize: 11, fontWeight: '900' },
});
