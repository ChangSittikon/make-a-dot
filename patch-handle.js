const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

const targetLines = `      if (isEditingRule) { 
        // Edit existing rule -> PUT all skills 
        const newSkills = [...skillsList]; 
        newSkills[editRuleIdx] = { title: ruleTitle, desc: ruleDesc, content: ruleContent }; 
         
        const res = await fetch("/api/admin/agent-skills", { 
          method: "PUT", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ skills: newSkills }) 
        }); 
         
        if (res.ok) { 
          setSkillsList(newSkills); 
          setShowRuleModal(false); 
          setShowSkillsModal(true); 
          router.refresh(); 
        } else alert("เกิดข้อผิดพลาดในการบันทึกแก้ไข"); 
         
      } else {`;

// Well, since string match is hard due to utf-8 thai chars, I'll splice it by line number.
const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('if (isEditingRule) {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('} else {'));

if (startIdx !== -1 && endIdx !== -1) {
    const newCode = `        if (isEditingRule) {
          const isSkill = activeSkillsTab === 'skills';
          const currentList = isSkill ? skillsList : rulesList;
          const editingItem = currentList[editRuleIdx];
          
          let res;
          if (editingItem.filename) {
             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                   title: ruleTitle, 
                   desc: ruleDesc, 
                   content: ruleContent,
                   type: isSkill ? 'skill' : 'rule',
                   filename: editingItem.filename 
                })
             });
          } else {
             const newRules = [...rulesList];
             newRules[editRuleIdx] = { title: ruleTitle, desc: ruleDesc, content: ruleContent };
             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills: newRules })
             });
          }
          
          if (res.ok) {
            const newList = [...currentList];
            newList[editRuleIdx] = { ...editingItem, title: ruleTitle, desc: ruleDesc, content: ruleContent };
            if (isSkill) setSkillsList(newList);
            else setRulesList(newList);
            
            setShowRuleModal(false);
            setShowSkillsModal(true);
            router.refresh();
          } else alert("Error saving");`;
          
    lines.splice(startIdx, endIdx - startIdx, newCode);
    fs.writeFileSync('src/components/admin/AgentHubClient.tsx', lines.join('\n'));
    console.log('done');
}
