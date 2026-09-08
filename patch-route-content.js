const fs = require('fs');
let code = fs.readFileSync('src/app/api/admin/agent-skills/route.ts', 'utf8');

const targetStr = `      const content = \`---
name: \${title}
description: \${desc}
trigger: model_decision
---

# \${title}
\${desc}
\`; `;

const replacementStr = `      const newContent = body.content || \`# \${title}\\n\${desc}\`;
      const content = \`---
name: \${title}
description: \${desc}
trigger: model_decision
---

\${newContent}
\`; `;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/app/api/admin/agent-skills/route.ts', code);
console.log('done route');
