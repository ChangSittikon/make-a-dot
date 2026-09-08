const fs = require('fs');
const path = 'src/app/api/admin/agent-skills/route.ts';
let code = fs.readFileSync(path, 'utf8');

// Update POST
code = code.replace(
  /const { title, desc } = await req\.json\(\);/,
  "const { title, desc, type } = await req.json();"
);

const newPostLogic = `    if (type === 'skill') {
      const skillsDir = path.join(process.cwd(), '.agents', 'skills');
      if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir, { recursive: true });
      
      const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.md';
      const filepath = path.join(skillsDir, filename);
      
      const content = \`---
name: \${title}
description: \${desc}
trigger: model_decision
---

# \${title}
\${desc}
\`;
      fs.writeFileSync(filepath, content, 'utf8');
      logActivity("Agent Skill Added", \`เพิ่มทักษะใหม่: \${title}\`);
    } else {
      const geminiPath = path.join(process.cwd(), 'GEMINI.md');
      const newContent = \`\\n\\n## \${title}\\n\${desc}\\n\`;
      fs.appendFileSync(geminiPath, newContent, 'utf8');
      logActivity("Agent Rule Added", \`เพิ่มกฎใหม่: \${title}\`);
    }`;

code = code.replace(
  /    const geminiPath = path\.join\(process\.cwd\(\), 'GEMINI\.md'\);\s*const newContent = `\\n\\n## \$\{title\}\\n\$\{desc\}\\n`;\s*fs\.appendFileSync\(geminiPath, newContent, 'utf8'\);\s*\/\/ Log the activity\s*logActivity\("Agent Rule Added", `.*`\);/,
  newPostLogic
);

fs.writeFileSync(path, code);
console.log("Updated API route POST");
