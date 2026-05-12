import { readFileSync, statSync } from 'node:fs';

const requiredFiles = ['index.html', 'src/styles.css', 'src/app.js'];
const requiredContent = ['English Master Pro', 'Débutant', 'Intermédiaire', 'Avancé', 'Module grammaire'];

for (const file of requiredFiles) {
  const stat = statSync(file);
  if (!stat.isFile() || stat.size === 0) {
    throw new Error(`${file} is missing or empty`);
  }
}

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('src/app.js', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const bundle = `${html}\n${js}\n${css}`;

for (const text of requiredContent) {
  if (!bundle.includes(text)) {
    throw new Error(`Required content not found: ${text}`);
  }
}

console.log('Build check passed: static site files and required learning content are present.');
