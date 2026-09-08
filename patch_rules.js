const fs = require('fs');
const path = 'src/app/profile/settings/agent-hub/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const replacement = `  // 1. Read Agent Skills & Rules
  const initialRules = [];
  try {
    const geminiPath = require('path').join(process.cwd(), 'GEMINI.md');
    if (fs.existsSync(geminiPath)) {
      const content = fs.readFileSync(geminiPath, 'utf8');
      const sections = content.split('## ').slice(1);
      sections.forEach(sec => {
        const lines = sec.trim().split('\\n');
        const title = lines[0].trim();
        const desc = lines.slice(1).join('\\n').trim();
        initialRules.push({ title, desc });
      });
    }
  } catch (e) {}

  // Also include anything from .agents/rules
  initialRules.push(...getItems('rules'));
  const initialSkills = getItems('skills');`;

code = code.replace(
  /  \/\/ 1\. Read Agent Skills & Rules\r?\n  const initialRules = getItems\('rules'\);\r?\n  const initialSkills = getItems\('skills'\);/,
  replacement
);

fs.writeFileSync(path, code);
