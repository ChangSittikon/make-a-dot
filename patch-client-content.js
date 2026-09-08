const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AgentHubClient.tsx', 'utf8');

// 1. Add state
code = code.replace(
  'const [ruleDesc, setRuleDesc] = useState("");',
  'const [ruleDesc, setRuleDesc] = useState("");\n  const [ruleContent, setRuleContent] = useState("");'
);

// 2. Add to openAddRule
code = code.replace(
  'setRuleDesc("");',
  'setRuleDesc("");\n    setRuleContent("");'
);

// 3. Add to openEditRule
code = code.replace(
  'setRuleDesc(skill.desc);',
  'setRuleDesc(skill.desc);\n    setRuleContent(skill.content || "");'
);

// 4. Update handleSaveRule
const targetSave = `             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                   title: ruleTitle, 
                   desc: ruleDesc, 
                   type: isSkill ? 'skill' : 'rule',
                   filename: editingItem.filename 
                })
             });`;
const replacementSave = `             res = await fetch("/api/admin/agent-skills", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                   title: ruleTitle, 
                   desc: ruleDesc, 
                   content: ruleContent,
                   type: isSkill ? 'skill' : 'rule',
                   filename: editingItem.filename 
                })
             });`;
code = code.replace(targetSave, replacementSave);

// 5. Update UI rendering in Modal
const targetUI = `                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">คำอธิบายกฎ (Instructions)</label>
                  <textarea 
                    rows={5}
                    value={ruleDesc} 
                    onChange={e => setRuleDesc(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="อธิบายว่าต้องการให้เอเจนต์ทำงาน..."
                  ></textarea>
                </div>
                <button`;

const replacementUI = `                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">คำอธิบายย่อ (Short Description)</label>
                  <textarea 
                    rows={2}
                    value={ruleDesc} 
                    onChange={e => setRuleDesc(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 mb-3"
                    placeholder="คำอธิบายสั้นๆ..."
                  ></textarea>
                  
                  {activeSkillsTab === 'skills' && (
                    <>
                      <label className="block text-xs font-bold text-gray-700 mb-1">เนื้อหาทักษะ (Full Markdown Content)</label>
                      <textarea 
                        rows={10}
                        value={ruleContent} 
                        onChange={e => setRuleContent(e.target.value)}
                        className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono text-xs"
                        placeholder="รายละเอียด Markdown ของทักษะนี้..."
                      ></textarea>
                    </>
                  )}
                </div>
                <button`;

code = code.replace(targetUI, replacementUI);

fs.writeFileSync('src/components/admin/AgentHubClient.tsx', code);
console.log('done client');
