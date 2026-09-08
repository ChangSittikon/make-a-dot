const fs = require('fs');
const path = 'src/components/admin/AgentHubClient.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Update openAddRule to handle activeSkillsTab
code = code.replace(
  /const openAddRule = \(\) => \{/,
  `const openAddRule = () => {
    setIsEditingRule(false);
    setRuleTitle("");
    setRuleDesc("");
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };
  
  const openAddSkill = () => {
    setIsEditingRule(false);
    setRuleTitle("");
    setRuleDesc("");
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };
  
  // This avoids syntax error by just injecting openAddSkill, wait I'll just change the button directly to use openAddRule for both and pass type`
);

// Better to just change the POST body in handleSaveRule
code = code.replace(
  /body: JSON\.stringify\(\{ title: ruleTitle, desc: ruleDesc \}\)/,
  "body: JSON.stringify({ title: ruleTitle, desc: ruleDesc, type: activeSkillsTab === 'skills' ? 'skill' : 'rule' })"
);

// Also we need to update state differently based on tab
const successBlockOld = `          if (res.ok) {
            setRulesList([...rulesList, { title: ruleTitle, desc: ruleDesc }]);
            setShowRuleModal(false);
            setShowSkillsModal(true);
            router.refresh();
          }`;
const successBlockNew = `          if (res.ok) {
            if (activeSkillsTab === 'skills') {
              setSkillsList([...skillsList, { title: ruleTitle, desc: ruleDesc }]);
            } else {
              setRulesList([...rulesList, { title: ruleTitle, desc: ruleDesc }]);
            }
            setShowRuleModal(false);
            setShowSkillsModal(true);
            router.refresh();
          }`;
code = code.replace(successBlockOld, successBlockNew);

// Add the button to the UI for both tabs, just changing the label
const buttonOld = `{activeSkillsTab === 'rules' && (
                  <button 
                    onClick={openAddRule}
                    className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                  >
                    <i className="fa-solid fa-plus"></i>
                    เพิ่มกฎใหม่ (Add New Rule)
                  </button>
                )}`;
const buttonNew = `
                  <button 
                    onClick={openAddRule}
                    className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                  >
                    <i className="fa-solid fa-plus"></i>
                    {activeSkillsTab === 'rules' ? 'เพิ่มกฎใหม่ (Add New Rule)' : 'เพิ่มทักษะใหม่ (Add New Skill)'}
                  </button>
`;
code = code.replace(buttonOld, buttonNew);

fs.writeFileSync(path, code);
console.log("Updated Client UI");
