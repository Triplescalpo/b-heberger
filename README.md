# English proTM

English proTM is a modern Android-ready mobile learning prototype built with Expo and React Native. It is designed for learners who want to start from zero and progress toward fluent conversation, correct writing, grammar mastery, and stronger listening comprehension.

## Included MVP experience

- Home screen with brand, learning promise, audio demo, and daily study routine.
- Dashboard with global progress, points, badges, streak, and three learning levels.
- Interactive lesson cards for Beginner, Intermediate, and Advanced paths.
- Complete grammar module with simple rules and examples.
- Exercises screen with translation practice, speech playback, simulated voice action, AI role-play mockup, quizzes, dictation, writing, and mini-game entries.
- Profile screen with offline mode, reminders, rewards, and key feature summary.
- Light, dark, and system theme modes.

## Learning structure

### Level 1 — Beginner

Covers the alphabet, pronunciation, numbers from 0 to 1000, core vocabulary, articles, personal pronouns, the verb “to be,” and simple sentences.

### Level 2 — Intermediate

Covers present simple, present continuous, past simple, regular and irregular verbs, sentence forms, prepositions, adjectives, and common expressions.

### Level 3 — Advanced

Covers perfect tenses, reported speech, logical connectors, writing labs, advanced listening, improved pronunciation, dictation, role-play, and simulated AI conversation.

## Technical stack

- Expo
- React Native
- TypeScript
- `expo-speech` for native text-to-speech pronunciation playback

## Run locally

```bash
npm install
npm run android
```

For static type checking:

```bash
npm run typecheck
```

## Next production steps

1. Add real authentication and sync with Firebase or MongoDB-backed Node.js APIs.
2. Connect Speech-to-Text for pronunciation scoring.
3. Add downloadable lesson bundles for robust offline mode.
4. Replace mocked AI chat cards with a secure backend AI conversation endpoint.
5. Add push notifications, user leaderboard, and analytics-based adaptive review.
