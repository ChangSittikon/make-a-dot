const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

// 1. Unrestrict the pencil button
const targetButton = `                    {activeSkillsTab === 'rules' && (
                      <button 
                        onClick={() => openEditRule(idx, item)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-100"
                        title="แก้ไขกฎ (Edit Rule)"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                    )}`;
const replacementButton = `                    <button 
                      onClick={() => openEditRule(idx, item)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-100 opacity-0 group-hover:opacity-100"
                      title={activeSkillsTab === 'rules' ? 'แก้ไขกฎ (Edit Rule)' : 'แก้ไขทักษะ (Edit Skill)'}
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>`;
code = code.replace(targetButton, replacementButton);

// 2. Fix handleSaveRule
const targetSave = `        if (isEditingRule) {
          // Edit existing rule -> PUT all skills
          const newSkills = [...skillsList];
          newSkills[editRuleIdx] = { title: ruleTitle, desc: ruleDesc };
          
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
          
        }`;
const replacementSave = `        if (isEditingRule) {
          // Edit existing item
          const isSkill = activeSkillsTab === 'skills';
          const currentList = isSkill ? skillsList : rulesList;
          const editingItem = currentList[editRuleIdx];
          
          let res;
          
          if (editingItem.filename) {
             // Specific file update
             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                   title: ruleTitle, 
                   desc: ruleDesc, 
                   type: isSkill ? 'skill' : 'rule',
                   filename: editingItem.filename 
                })
             });
          } else {
             // Legacy GEMINI.md bulk update (only rules)
             const newRules = [...rulesList];
             newRules[editRuleIdx] = { title: ruleTitle, desc: ruleDesc };
             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills: newRules }) // the backend expects "skills" array for legacy
             });
          }
          
          if (res.ok) {
            const newList = [...currentList];
            newList[editRuleIdx] = { ...editingItem, title: ruleTitle, desc: ruleDesc };
            if (isSkill) setSkillsList(newList);
            else setRulesList(newList);
            
            setShowRuleModal(false);
            setShowSkillsModal(true);
            router.refresh();
          } else alert("เกิดข้อผิดพลาดในการบันทึกแก้ไข");
          
        }`;

code = code.replace(targetSave, replacementSave);

fs.writeFileSync('src/components/admin/AgentHubClient.tsx', code);
console.log('Successfully updated AgentHubClient');
