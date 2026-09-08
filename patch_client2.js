const fs = require('fs');
const path = 'src/components/admin/AgentHubClient.tsx';
let code = fs.readFileSync(path, 'utf8');

const buttonOld = `{activeSkillsTab === 'rules' && (
                    <button 
                      onClick={openAddRule}
                      className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                    >
                      <i className="fa-solid fa-plus"></i>
                      เพิ่มกฎใหม่ (Add New Rule)
                    </button>
                  )}`;
                  
const buttonNew = `                  <button 
                    onClick={openAddRule}
                    className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                  >
                    <i className="fa-solid fa-plus"></i>
                    {activeSkillsTab === 'rules' ? 'เพิ่มกฎใหม่ (Add New Rule)' : 'เพิ่มทักษะใหม่ (Add New Skill)'}
                  </button>`;

code = code.replace(buttonOld, buttonNew);

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

// Better to just change the POST body in handleSaveRule
code = code.replace(
  /body: JSON\.stringify\(\{ title: ruleTitle, desc: ruleDesc \}\)/,
  "body: JSON.stringify({ title: ruleTitle, desc: ruleDesc, type: activeSkillsTab === 'skills' ? 'skill' : 'rule' })"
);

fs.writeFileSync(path, code);
console.log("Updated Client UI (Fixed)");
