const fs = require('fs');

const clientPath = 'C:/Users/CHANG-PCSONSAI/.gemini/antigravity/scratch/make-a-dot/src/components/admin/AgentHubClient.tsx';
let code = fs.readFileSync(clientPath, 'utf8');

// 1. Add props and state
code = code.replace(
  /export default function AgentHubClient\(\{ \r?\n\s*initialSkills,/,
  \`export default function AgentHubClient({ 
    initialRules,
    initialSkills,\`
);
code = code.replace(
  /\}: \{ \r?\n\s*initialSkills: any\[\],/,
  \`}: { 
    initialRules: any[],
    initialSkills: any[],\`
);

code = code.replace(
  /const \[workflow, setWorkflow\] = useState\(initialWorkflow\);/,
  \`const [workflow, setWorkflow] = useState(initialWorkflow);
    const [rulesList, setRulesList] = useState(initialRules);
    const [activeSkillsTab, setActiveSkillsTab] = useState<'rules' | 'skills'>('rules');\`
);

// 3. Update POST route for saving rules/skills
code = code.replace(
  /body: JSON\.stringify\(\{ title: ruleTitle, desc: ruleDesc \}\)/,
  "body: JSON.stringify({ title: ruleTitle, desc: ruleDesc, type: activeSkillsTab === 'skills' ? 'skill' : 'rule' })"
);

code = code.replace(
  /setSkillsList\(\[\.\.\.skillsList, \{ title: ruleTitle, desc: ruleDesc \}\]\);/,
  \`if (activeSkillsTab === 'skills') {
            setSkillsList([...skillsList, { title: ruleTitle, desc: ruleDesc }]);
          } else {
            setRulesList([...rulesList, { title: ruleTitle, desc: ruleDesc }]);
          }\`
);

// 4. Replace View Skills Modal
const skillsModalOld = code.substring(code.indexOf('{/* View Skills Modal */}'), code.indexOf('{/* View Logs Modal */}'));
const skillsModalNew = \`{/* View Skills Modal */}
      {showSkillsModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-book text-xs"></i>
                </div>
                <h3 className="font-bold text-gray-900">กฎและทักษะ (Agent Rules)</h3>
              </div>
              <button onClick={() => setShowSkillsModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="flex gap-2 px-5 py-3 bg-white border-b border-gray-100">
              <button 
                onClick={() => setActiveSkillsTab('rules')}
                className={\\\`flex-1 py-2 text-xs font-bold rounded-xl transition \${activeSkillsTab === 'rules' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\\\`}
              >
                Rules ({rulesList.length})
              </button>
              <button 
                onClick={() => setActiveSkillsTab('skills')}
                className={\\\`flex-1 py-2 text-xs font-bold rounded-xl transition \${activeSkillsTab === 'skills' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\\\`}
              >
                Skills ({skillsList.length})
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-gray-50 space-y-4">
              <div className="space-y-3">
                {(activeSkillsTab === 'rules' ? rulesList : skillsList).map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-4 hover:border-blue-300 transition group relative">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <i className={\\\`fa-solid \${activeSkillsTab === 'rules' ? 'fa-code-branch' : 'fa-bolt'} text-xs\\\`}></i>
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-3">{item.desc}</p>
                      </div>
                    </div>
                    {activeSkillsTab === 'rules' && (
                      <button 
                        onClick={() => openEditRule(idx, item)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-100"
                        title="แก้ไขกฎ (Edit Rule)"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                    )}
                  </div>
                ))}
                
                {activeSkillsTab === 'rules' && rulesList.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">No rules found.</p>
                )}
                {activeSkillsTab === 'skills' && skillsList.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">No skills found.</p>
                )}
              </div>
              
              <button 
                onClick={openAddRule}
                className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
              >
                <i className="fa-solid fa-plus"></i>
                {activeSkillsTab === 'rules' ? 'เพิ่มกฎใหม่ (Add New Rule)' : 'เพิ่มทักษะใหม่ (Add New Skill)'}
              </button>
            </div>
          </div>
        </div>
      )}

      \`;
code = code.replace(skillsModalOld, skillsModalNew);

// 5. Replace Tech Updates Section
const techUpdatesOld = code.substring(code.indexOf('{/* 3. Tech News / Updates */}'), code.lastIndexOf('</section>') + 10);
const techUpdatesNew = \`{/* 3. Tech News / Updates */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">Tech Updates</h3>
          <button 
            onClick={fetchTechUpdates}
            disabled={loadingUpdates}
            className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1 disabled:opacity-50"
          >
            <i className={\\\`fa-solid fa-rotate \${loadingUpdates ? 'fa-spin' : ''}\\\`}></i>
            ซิงค์อัปเดต
          </button>
        </div>
        
        <div className="flex gap-2 px-1 mb-2">
          {(['tech', 'ai', 'others'] as const).map(tabKey => {
            const unreadCount = getUnreadCount(tabKey);
            return (
              <button 
                key={tabKey}
                onClick={() => { setActiveTab(tabKey); setExpandedUpdateId(null); }}
                className={\\\`text-[10px] font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1.5 \${
                  activeTab === tabKey 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\\\`}
              >
                {techUpdates[tabKey]?.label}
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="space-y-2">
          {loadingUpdates ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex justify-center">
              <i className="fa-solid fa-spinner fa-spin text-blue-500"></i>
            </div>
          ) : techUpdates[activeTab]?.updates?.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">ไม่มีข้อมูลอัปเดต</p>
            </div>
          ) : (
            techUpdates[activeTab]?.updates?.map((update: any) => {
              const isUnread = update.importance?.isNew && !readUpdates.includes(update.id);
              return (
                <div 
                  key={update.id} 
                  onClick={() => handleExpandUpdate(update.id)}
                  className={\\\`bg-white rounded-xl border \${isUnread ? 'border-red-300' : 'border-gray-200'} p-3 shadow-sm hover:border-blue-300 transition cursor-pointer relative overflow-hidden\\\`}
                >
                  {isUnread && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-bl-lg"></div>}
                  <div className={\\\`flex gap-3 items-center \${isUnread ? '' : 'opacity-80'}\\\`}>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <i className={\\\`fa-solid \${update.icon || 'fa-newspaper'} text-gray-700\\\`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={\\\`font-bold text-xs flex items-center gap-2 \${isUnread ? 'text-gray-900' : 'text-gray-700'}\\\`}>
                          {update.name}
                          {update.importance?.level === 'high' && (
                            <span className="bg-red-100 text-red-600 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                              Important
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-1 mb-2">
                        <p className="text-[10px] text-gray-500">
                          {update.currentVersion} <i className="fa-solid fa-arrow-right mx-1 text-gray-300"></i> <span className="font-bold text-blue-600">{update.version}</span>
                        </p>
                      </div>
                      <p className={\\\`text-[11px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap \${expandedUpdateId === update.id ? '' : 'line-clamp-2'}\\\`}>
                        {update.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>\`;
code = code.replace(techUpdatesOld, techUpdatesNew);

fs.writeFileSync(clientPath, code, 'utf8');
console.log("Clean repair complete");
