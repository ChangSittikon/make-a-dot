"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentHubClient({ 
  initialRules,
  initialSkills, 
  initialDocs,
  initialLogs, 
  workflowPhases, 
  repoAnatomy 
}: { 
  initialRules: any[],
  initialSkills: any[], 
  initialDocs: any[],
  initialLogs: any[],
  workflowPhases: any[], repoAnatomy: any 
}) {
  const router = useRouter();
  
  // Modals
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [activeSkillsTab, setActiveSkillsTab] = useState<'rules' | 'skills' | 'docs'>('rules');
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  
  // States
  const [workflow, setWorkflow] = useState(workflowPhases);
  const [rulesList, setRulesList] = useState(initialRules);
  const [skillsList, setSkillsList] = useState(initialSkills);
  const [docsList, setDocsList] = useState(initialDocs);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);
  const [loadingHealth, setLoadingHealth] = useState(true);
  
  const [techUpdates, setTechUpdates] = useState<any>({
    tech: { label: 'Tech', updates: [], unread: 0 },
    ai: { label: 'AI News', updates: [], unread: 0 },
    others: { label: 'Others', updates: [], unread: 0 }
  });
  const [activeTab, setActiveTab] = useState<'tech' | 'ai' | 'others'>('tech');
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);
  const [readUpdates, setReadUpdates] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('makeadot_read_updates');
    if (saved) {
      try { setReadUpdates(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleExpandUpdate = (id: string) => {
    setExpandedUpdateId(expandedUpdateId === id ? null : id);
    if (!readUpdates.includes(id)) {
      const newRead = [...readUpdates, id];
      setReadUpdates(newRead);
      localStorage.setItem('makeadot_read_updates', JSON.stringify(newRead));
    }
  };
  
  const getUnreadCount = (tabKey: 'tech' | 'ai' | 'others') => {
    if (!techUpdates[tabKey]) return 0;
    return techUpdates[tabKey].updates.filter((u: any) => u.importance?.isNew && !readUpdates.includes(u.id)).length;
  };
  
  const fetchTechUpdates = async () => {
    setLoadingUpdates(true);
    try {
      const res = await fetch("/api/admin/tech-updates");
      const data = await res.json();
      if (data.tabs) setTechUpdates(data.tabs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUpdates(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/system-health")
      .then(res => res.json())
      .then(data => {
        if (data.metrics) setHealthMetrics(data.metrics);
        setLoadingHealth(false);
      })
      .catch(() => setLoadingHealth(false));
      
    fetchTechUpdates();
  }, []);
  
  // Edit Rule State
  const [isEditingRule, setIsEditingRule] = useState(false);
  const [editRuleIdx, setEditRuleIdx] = useState(-1);
  const [ruleTitle, setRuleTitle] = useState("");
  const [ruleDesc, setRuleDesc] = useState("");
  const [ruleContent, setRuleContent] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [savingWf, setSavingWf] = useState(false);

  const handleCallAgent = () => {
    setShowWorkflowModal(true);
  };

  const openAddRule = () => {
    setIsEditingRule(false);
    setRuleTitle("");
    setRuleDesc("");
    setRuleContent("");
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };

  const openEditRule = (idx: number, skill: any) => {
    setIsEditingRule(true);
    setEditRuleIdx(idx);
    setRuleTitle(skill.title);
    setRuleDesc(skill.desc);
    setRuleContent(skill.content || "");
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };

  const handleSaveRule = async () => {
    if (!ruleTitle.trim() || !ruleDesc.trim()) return alert("กรุณากรอกข้อมูลให้ครบ");
    setSaving(true);
    
    try {
        if (isEditingRule) {
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
          } else alert("Error saving");
      } else {
        // Add new rule -> POST 
        const res = await fetch("/api/admin/agent-skills", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ title: ruleTitle, desc: ruleDesc, type: activeSkillsTab === 'skills' ? 'skill' : 'rule' }) 
        }); 
         
        if (res.ok) { 
          if (activeSkillsTab === 'skills') {
            setSkillsList([...skillsList, { title: ruleTitle, desc: ruleDesc }]);
          } else {
            setRulesList([...rulesList, { title: ruleTitle, desc: ruleDesc }]);
          }
          setShowRuleModal(false); 
          setShowSkillsModal(true); 
          router.refresh(); 
        } else alert("เกิดข้อผิดพลาดในการเพิ่มกฎ"); 
      } 
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWorkflow = async () => {
    setSavingWf(true);
    try {
      const res = await fetch("/api/admin/agent-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phases: workflow })
      });
      if (res.ok) {
        setShowWorkflowModal(false);
        router.refresh();
      } else alert("บันทึกไม่สำเร็จ");
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSavingWf(false);
    }
  };

  const updateWf = (idx: number, field: string, val: string) => {
    const newWf = [...workflow];
    newWf[idx] = { ...newWf[idx], [field]: val };
    setWorkflow(newWf);
  };

  return (
    <div className="space-y-6">
      
      {/* Workflow Modal */}
      {showWorkflowModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-list-check text-xs"></i>
                </div>
                <h3 className="font-bold text-gray-900">การตั้งค่าขั้นตอนการทำงาน (Workflow)</h3>
              </div>
              <button onClick={() => setShowWorkflowModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6 bg-gray-50 flex-1 relative">
              <div className="absolute top-8 bottom-8 left-9 w-0.5 bg-blue-100"></div>

              {workflow.map((phase, idx) => (
                <div key={phase.id} className="relative z-10 flex gap-4">
                  <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm mt-1 ${phase.status === 'active' ? 'bg-blue-500 text-white' : phase.status === 'pending' ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <span className="text-[10px] font-black">{idx + 1}</span>
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-sm text-gray-900">{phase.name}</h4>
                      <select 
                        value={phase.status} 
                        onChange={(e) => updateWf(idx, 'status', e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full outline-none ${
                          phase.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          phase.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="pending">รอดำเนินการ (Pending)</option>
                        <option value="active">กำลังทำงาน (Active)</option>
                        <option value="completed">เสร็จสิ้น (Completed)</option>
                        <option value="standby">เตรียมพร้อม (Standby)</option>
                      </select>
                    </div>
                    
                    <label className="text-[10px] text-gray-500 font-bold mb-1 block">คำสั่งการทำงาน (Work Instruction - WI):</label>
                    <textarea 
                      rows={2}
                      value={phase.wi}
                      onChange={(e) => updateWf(idx, 'wi', e.target.value)}
                      className="w-full text-xs text-gray-700 p-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
              <button 
                onClick={handleSaveWorkflow}
                disabled={savingWf}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-blue-500/20"
              >
                {savingWf ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                บันทึกการตั้งค่า (Save Settings)
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-bold text-gray-900">{isEditingRule ? "แก้ไขกฎ (Edit Rule)" : "เพิ่มกฎให้ Agent ใหม่ (Add New Rule)"}</h3>
              <button onClick={() => { setShowRuleModal(false); setShowSkillsModal(true); }} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">ชื่อกฎ (Rule Title)</label>
                <input 
                  type="text" 
                  value={ruleTitle}
                  onChange={e => setRuleTitle(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="เช่น Proactive Execution (การทำงานเชิงรุก)"
                />
              </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">คำอธิบายย่อ (Short Description)</label>
                  <textarea 
                    rows={2}
                    value={ruleDesc}
                    onChange={e => setRuleDesc(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 mb-3"
                    placeholder="คำอธิบายสั้นๆ สำหรับแสดงผลในการ์ด..."
                  ></textarea>
                  
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">เนื้อหา (Full Markdown Content)</label>
                  <textarea 
                    rows={10}
                    value={ruleContent} 
                    onChange={e => setRuleContent(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-mono text-xs"
                    placeholder="รายละเอียด Markdown แบบจัดเต็ม..."
                  ></textarea>
                </div>
              <button 
                onClick={handleSaveRule}
                disabled={saving}
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl flex justify-center items-center gap-2"
              >
                {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
                {isEditingRule ? "บันทึกการแก้ไข (Save Changes)" : "บันทึกกฎใหม่ (Save New Rule)"}
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* View Skills Modal */}
      {showSkillsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
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
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${activeSkillsTab === 'rules' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Rules ({rulesList.length})
              </button>
              <button 
                onClick={() => setActiveSkillsTab('skills')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${activeSkillsTab === 'skills' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Skills ({skillsList.length})
              </button>
              
            </div>

            <div className="p-5 overflow-y-auto flex-1 bg-gray-50 space-y-4">
              <div className="space-y-3">
                {(activeSkillsTab === 'rules' ? rulesList : activeSkillsTab === 'skills' ? skillsList : docsList).map((item, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-4 hover:border-blue-300 transition group relative">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <i className={`fa-solid ${activeSkillsTab === 'rules' ? 'fa-code-branch' : activeSkillsTab === 'skills' ? 'fa-bolt' : 'fa-book-open'} text-xs`}></i>
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-3">{item.desc}</p>
                        {item.filename && (
                          <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-400">
                            <i className="fa-regular fa-file"></i>
                            <span className="font-mono">{item.filename}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {item.filename && activeSkillsTab !== 'docs' && (
                      <button 
                        onClick={() => openEditRule(idx, item)}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition hover:bg-blue-50 hover:text-blue-600"
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
                {activeSkillsTab === 'docs' && docsList.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">No documentation found.</p>
                )}
              </div>
              
              {activeSkillsTab !== 'docs' && (
                <button 
                  onClick={openAddRule}
                  className="w-full mt-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
                >
                  <i className="fa-solid fa-plus"></i>
                  {activeSkillsTab === 'rules' ? 'เพิ่มกฎใหม่ (Add New Rule)' : 'เพิ่มทักษะใหม่ (Add New Skill)'}
                </button>
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* View Docs Modal (Repo Evolution Control Room) */}
      {showDocsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
            <div className="bg-slate-50 w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10 border-t border-slate-700">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-code-compare text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm">Software Evolution Control</h3>
                    <p className="text-[10px] text-slate-500 leading-none">ศูนย์ควบคุมวิวัฒนาการซอฟต์แวร์</p>
                  </div>
                </div>
                <button onClick={() => setShowDocsModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto flex-1 space-y-8">
                
                {/* Zone 1: DNA */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-dna text-rose-500"></i>
                    <h4 className="font-bold text-sm text-slate-800">1. Core DNA & Intent (จิตวิญญาณ)</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">Architecture Decision Records และเป้าหมายดั้งเดิมของระบบ</p>
                  <div className="space-y-3">
                    {docsList.filter(d => d.category === 'dna').map((item, idx) => (
                      <div key={idx} onClick={() => setPreviewDoc(item)} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-rose-300 transition cursor-pointer flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                          <i className="fa-solid fa-scroll"></i>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-xs text-slate-900 mb-1">{item.title}</h5>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Zone 2: Anatomy */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-network-wired text-blue-500"></i>
                    <h4 className="font-bold text-sm text-slate-800">2. System Anatomy (ตรรกะและวิทยาศาสตร์)</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">การผูกมัดกฎเกณฑ์ AI เข้ากับโครงสร้าง Directory ของแอป</p>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {repoAnatomy?.mappings?.map((mapItem: any, idx: number) => (
                      <div key={idx} className={`p-4 ${idx > 0 ? 'border-t border-slate-100' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-md text-[10px] font-mono text-slate-700 border border-slate-200">
                            <i className="fa-regular fa-folder-open text-blue-500"></i> {mapItem.directory}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${mapItem.aiConfidenceRequired === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {mapItem.aiConfidenceRequired} Risk
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800 mb-1"><i className="fa-solid fa-link text-slate-400 mr-1"></i> Rule: {mapItem.ruleTitle}</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{mapItem.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                
                {/* Zone 3: Mystery Dots */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-star-of-life text-indigo-500"></i>
                    <h4 className="font-bold text-sm text-slate-800">3. Mystery Dots (ปริศนาที่รอการเชื่อมโยง)</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">จุดฝากแนวคิดหรือ Time Capsule สำหรับวิทยาการ AI ในอนาคต</p>
                  <div className="grid grid-cols-1 gap-3">
                    {docsList.filter(d => d.category === 'mystery_dot').map((item, idx) => (
                      <div key={idx} onClick={() => setPreviewDoc(item)} className="bg-slate-900 rounded-2xl border border-slate-700 p-4 shadow-md hover:border-indigo-400 transition cursor-pointer relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                          <i className="fa-solid fa-meteor text-4xl text-white"></i>
                        </div>
                        <div className="flex gap-4 items-start relative z-10">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                            <i className="fa-solid fa-circle-nodes"></i>
                          </div>
                          <div className="flex-1 text-white">
                            <h5 className="font-bold text-xs mb-1 group-hover:text-indigo-300 transition">{item.title}</h5>
                            <p className="text-[10px] text-slate-400 line-clamp-2">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Zone 4: Architecture */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-sitemap text-emerald-500"></i>
                    <h4 className="font-bold text-sm text-slate-800">4. System Architecture & Flow (โครงสร้างและกระบวนการ)</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-4">แผนภาพ Diagram, เส้นทางผู้ใช้ (User Flow), และโครงสร้างฐานข้อมูล</p>
                  <div className="space-y-3">
                    {docsList.filter((d: any) => d.category === 'architecture').map((item: any, idx: number) => (
                      <div key={idx} onClick={() => setPreviewDoc(item)} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-emerald-300 transition cursor-pointer flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                          <i className="fa-solid fa-project-diagram"></i>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-xs text-slate-900 mb-1">{item.title}</h5>
                          <p className="text-[10px] text-slate-500 line-clamp-2">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Doc Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
                  <i className="fa-regular fa-file-lines text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none mb-1 line-clamp-1">{previewDoc.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-none font-mono">{previewDoc.filename}</p>
                </div>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="w-8 h-8 flex shrink-0 items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <div className="max-w-2xl mx-auto">
                <pre className="text-[13px] text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {previewDoc.content || 'ไม่มีข้อมูล (No content)'}
                </pre>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* View Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                </div>
                <h3 className="font-bold text-gray-900">ประวัติการทำงาน (Activity Log)</h3>
              </div>
              <button onClick={() => setShowLogsModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
                <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-gray-100"></div>
                <div className="space-y-6 relative z-10">
                  {initialLogs.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center">ยังไม่มีประวัติการทำงาน (No Activity Log)</p>
                  ) : (
                    initialLogs.map((log: any) => {
                      const d = new Date(log.timestamp);
                      const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} น.`;
                      
                      return (
                        <div key={log.id} className="flex gap-4 items-start group">
                          <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          </div>
                          <div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <h4 className="font-bold text-sm text-gray-900">{log.action}</h4>
                              <span className="text-[10px] text-gray-400 font-medium">{timeStr}</span>
                            </div>
                            <p className="text-xs text-gray-600">{log.details}</p>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* 1. Header Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 shadow-sm relative overflow-hidden border border-blue-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shadow-inner relative shrink-0">
            <i className="fa-solid fa-robot text-2xl text-blue-600"></i>
            <span className="absolute bottom-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-900">Antigravity Agent</h2>
            <p className="text-xs text-blue-600 mt-1 font-medium">Co-Developer & Monitor</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed mb-4 relative z-10">
          เอเจนต์อัจฉริยะที่เชื่อมโยงกับโค้ดเบสของ MAKE A DOT โดยตรง พร้อมช่วยพัฒนาระบบ ตรวจสอบบั๊ก และอัปเดตเทคโนโลยีใหม่ๆ อยู่เสมอ
        </p>

        <button 
          onClick={handleCallAgent}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 relative z-10 mb-3"
        >
          <i className="fa-solid fa-bolt"></i>
          ตั้งค่า Workflow ของ Agent
        </button>

        <div className="grid grid-cols-2 gap-2 relative z-10"> 
          <button 
            onClick={() => {
              setActiveSkillsTab('rules');
              setShowSkillsModal(true);
            }} 
            className="w-full py-2 bg-white border border-blue-100 hover:bg-blue-50 text-blue-700 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm" 
          > 
            <i className="fa-solid fa-book"></i> 
            กฎและทักษะ 
          </button> 
          <button  
            onClick={() => setShowLogsModal(true)} 
            className="w-full py-2 bg-white border border-blue-100 hover:bg-blue-50 text-blue-700 text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm" 
          > 
            <i className="fa-solid fa-clock-rotate-left"></i> 
            Activity Log 
          </button>
          <button  
            onClick={() => setShowDocsModal(true)}  
            className="col-span-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md border border-slate-700"  
          >  
            <i className="fa-solid fa-code-compare"></i>  
            Repo Control Room
          </button> 
        </div> 
      </div>

      {/* 2. System Health / Monitoring */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">ความสมบูรณ์ระบบ (System Health)</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {loadingHealth ? (
            <div className="col-span-2 py-4 flex justify-center items-center">
              <i className="fa-solid fa-spinner fa-spin text-blue-500"></i>
            </div>
          ) : (
            healthMetrics.map(metric => (
              <div key={metric.id} className={`bg-white rounded-xl p-3 border border-gray-200 border-l-4 border-l-${metric.color} shadow-sm relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-12 h-12 bg-${metric.color} opacity-5 rounded-bl-full`}></div>
                <p className="text-[10px] text-gray-500 mb-1">{metric.label}</p>
                <div className="flex items-center gap-2">
                  <i className={`fa-solid ${metric.icon} text-${metric.color} text-xs`}></i>
                  <p className="text-sm font-bold text-gray-900">{metric.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Tech News / Updates */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">Tech Updates</h3>
          <button 
            onClick={fetchTechUpdates}
            disabled={loadingUpdates}
            className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1 disabled:opacity-50"
          >
            <i className={`fa-solid fa-rotate ${loadingUpdates ? 'fa-spin' : ''}`}></i>
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
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  activeTab === tabKey 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
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
                  className={`bg-white rounded-xl border ${isUnread ? 'border-red-300' : 'border-gray-200'} p-3 shadow-sm hover:border-blue-300 transition cursor-pointer relative overflow-hidden`}
                >
                  {isUnread && <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-bl-lg"></div>}
                  <div className={`flex gap-3 items-center ${isUnread ? '' : 'opacity-80'}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <i className={`fa-solid ${update.icon || 'fa-newspaper'} text-gray-700`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-xs flex items-center gap-2 ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {update.name}
                          {update.importance?.level === 'Critical' || update.importance?.level === 'high' && (
                            <span className="bg-red-100 text-red-600 text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                              Important
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] text-gray-500">
                          {update.currentVersion} <i className="fa-solid fa-arrow-right mx-1 text-gray-300"></i> <span className="font-bold text-blue-600">{update.version}</span>
                        </p>
                      </div>
                      <p className={`text-[11px] font-medium text-gray-800 leading-relaxed whitespace-pre-wrap ${expandedUpdateId === update.id ? '' : 'line-clamp-2'}`}>
                        {update.summary}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
