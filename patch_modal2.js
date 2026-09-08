const fs = require('fs');
const path = 'src/components/admin/AgentHubClient.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetStart = '<div className="p-5 overflow-y-auto flex-1 bg-gray-50 space-y-4">';
const targetEnd = '{/* View Logs Modal */}';

const startIndex = code.indexOf(targetStart);
const endIndex = code.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find block!");
  process.exit(1);
}

const replacement = `<div className="flex gap-2 px-5 py-3 bg-white border-b border-gray-100">
                <button 
                  onClick={() => setActiveSkillsTab('rules')}
                  className={\`flex-1 py-2 text-xs font-bold rounded-xl transition \${activeSkillsTab === 'rules' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
                >
                  Rules ({rulesList.length})
                </button>
                <button 
                  onClick={() => setActiveSkillsTab('skills')}
                  className={\`flex-1 py-2 text-xs font-bold rounded-xl transition \${activeSkillsTab === 'skills' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}
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
                          <i className={\`fa-solid \${activeSkillsTab === 'rules' ? 'fa-code-branch' : 'fa-bolt'} text-xs\`}></i>
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
                
                {activeSkillsTab === 'rules' && (
                  <button 
                    onClick={openAddRule}
                    className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                  >
                    <i className="fa-solid fa-plus"></i>
                    เพิ่มกฎใหม่ (Add New Rule)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
  
        `;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync(path, code);
console.log("Success");
