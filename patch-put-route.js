const fs = require('fs');
let code = fs.readFileSync('src/app/api/admin/agent-skills/route.ts', 'utf8');

const oldPut = `  export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
      logger.warn('Unauthorized attempt to edit agent skills');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const { skills } = await req.json();
      if (!skills || !Array.isArray(skills)) {
        return NextResponse.json({ error: 'Invalid skills data' }, { status: 400 });
      }
  
      let fileContent = '# Agent Autonomy & Execution Rules\\n\\n';
      skills.forEach((s: any) => {
        fileContent += \`## \${s.title}\\n\${s.desc}\\n\\n\`;
      });
  
      const geminiPath = path.join(process.cwd(), 'GEMINI.md');
      fs.writeFileSync(geminiPath, fileContent, 'utf8');
  
      logActivity("Agent Rules Updated", \`อัปเดตแก้ไข Agent Rules\`);
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to update agent skills');
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }`;

const newPut = `  export async function PUT(req: NextRequest) {
    if (!(await isAdmin())) {
      logger.warn('Unauthorized attempt to edit agent skills');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const body = await req.json();
      
      // Legacy bulk edit for GEMINI.md
      if (body.skills && Array.isArray(body.skills)) {
        let fileContent = '# Agent Autonomy & Execution Rules\\n\\n';
        body.skills.forEach((s: any) => {
          if (!s.filename) { // Only rules without filename go into GEMINI.md
            fileContent += \`## \${s.title}\\n\${s.desc}\\n\\n\`;
          }
        });
        const geminiPath = path.join(process.cwd(), 'GEMINI.md');
        fs.writeFileSync(geminiPath, fileContent, 'utf8');
        logActivity("Agent Rules Updated", \`อัปเดตแก้ไข Agent Rules\`);
        return NextResponse.json({ success: true });
      }
      
      // New specific file edit
      const { title, desc, type, filename } = body;
      if (!filename || !title || !desc || !type) {
        return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
      }
      
      const dir = type === 'skill' ? 'skills' : 'rules';
      const filepath = path.join(process.cwd(), '.agents', dir, filename);
      
      if (!fs.existsSync(filepath)) {
         return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      const content = \`---
name: \${title}
description: \${desc}
trigger: model_decision
---

# \${title}
\${desc}
\`; 
      fs.writeFileSync(filepath, content, 'utf8');
      
      const action = type === 'skill' ? "Agent Skill Updated" : "Agent Rule Updated";
      logActivity(action, \`อัปเดต \${type}: \${title}\`);
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to update agent skills/rules');
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }`;

// I will use string index replacement since I have the exact code.
const startIdx = code.indexOf('export async function PUT');
const endIdx = code.indexOf('function logActivity');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newPut + '\n\n  ' + code.substring(endIdx);
    fs.writeFileSync('src/app/api/admin/agent-skills/route.ts', code);
    console.log('Successfully updated PUT route');
} else {
    console.log('Could not find PUT route in route.ts');
}
