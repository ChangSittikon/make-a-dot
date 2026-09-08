import re
import os

content = open('src/app/profile/settings/agent-hub/page.tsx', 'r', encoding='utf-8').read()
content = content.replace("trigger: parsed.attributes.trigger || 'model_decision',", "trigger: parsed.attributes.trigger || 'model_decision',\n      category: parsed.attributes.category || 'dna',")

anatomy_load = '''
  // 4. Read Repo Anatomy
  let repoAnatomy = null;
  try {
    const anatomyPath = path.join(process.cwd(), 'repo-anatomy.json');
    if (fs.existsSync(anatomyPath)) {
      repoAnatomy = JSON.parse(fs.readFileSync(anatomyPath, 'utf8'));
    }
  } catch (err) {
    console.error("Failed to read repo-anatomy.json", err);
  }
'''
content = content.replace("  return (", anatomy_load + "\n  return (")

content = content.replace("workflowPhases={workflowPhases}", "workflowPhases={workflowPhases}\n              repoAnatomy={repoAnatomy}")

open('src/app/profile/settings/agent-hub/page.tsx', 'w', encoding='utf-8').write(content)
print("Updated page.tsx")
