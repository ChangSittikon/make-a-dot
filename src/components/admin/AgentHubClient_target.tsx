"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentHubClient({ 
  initialSkills, 
  initialLogs, 
  initialWorkflow 
}: { 
  initialSkills: any[], 
  initialLogs: any[],
  initialWorkflow: any[] 
}) {
  const router = useRouter();
  
  // Modals
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  
  // States
  const [workflow, setWorkflow] = useState(initialWorkflow);
  const [skillsList, setSkillsList] = useState(initialSkills);
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
  
  const [saving, setSaving] = useState(false);
  const [savingWf, setSavingWf] = useState(false);

  const handleCallAgent = () => {
    setShowWorkflowModal(true);
  };

  const openAddRule = () => {
    setIsEditingRule(false);
    setRuleTitle("");
    setRuleDesc("");
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };

  const openEditRule = (idx: number, skill: any) => {
    setIsEditingRule(true);
    setEditRuleIdx(idx);
    setRuleTitle(skill.title);
    setRuleDesc(skill.desc);
    setShowSkillsModal(false);
    setShowRuleModal(true);
  };

  const handleSaveRule = async () => {
    if (!ruleTitle.trim() || !ruleDesc.trim()) return alert("กรุณากรอกข้อมูลให้ครบ");
    setSaving(true);
    
    try {
      if (isEditingRule) {
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
        
      } else {
        // Add new rule -> POST
        const res = await fetch("/api/admin/agent-skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: ruleTitle, desc: ruleDesc })
        });
        
        if (res.ok) {
          setSkillsList([...skillsList, { title: ruleTitle, desc: ruleDesc }]);
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
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up">
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
      )}

      {/* Add/Edit Rule Modal */}
      {showRuleModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up">
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
                <label className="text-xs font-bold text-gray-700 block mb-1.5">คำอธิบายกฎ (Instructions)</label>
                <textarea 
                  rows={6}
                  value={ruleDesc}
                  onChange={e => setRuleDesc(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="อธิบายรายละเอียดการทำงาน..."
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
      )}

      {/* View Skills Modal */}
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
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50 space-y-4">
              <button 
                onClick={openAddRule}
                className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-200 border-dashed text-sm font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-blue-100 transition"
              >
                <i className="fa-solid fa-plus"></i>
                เพิ่มกฎใหม่ (Add New Rule)
              </button>

              <div className="space-y-3">
                {skillsList.map((skill, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-4 hover:border-blue-300 transition group relative">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <i className="fa-solid fa-code-branch text-xs"></i>
                      </div>
                      <div className="flex-1 pr-8">
                        <h4 className="font-bold text-sm text-gray-900">{skill.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-3">{skill.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => openEditRule(idx, skill)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition border border-gray-100"
                      title="แก้ไขกฎ (Edit Rule)"
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Logs Modal */}
      {showLogsModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
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
            onClick={() => setShowSkillsModal(true)}
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
          <button className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1">
            <i className="fa-solid fa-rotate"></i>
            ซิงค์อัพเดท
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">Next.js 15 อัปเดตใหม่!</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">มีการปรับปรุงระบบ Caching และ Turbopack ให้คอมไพล์เร็วขึ้น 30% เอเจนต์แนะนำให้อัปเกรดเพื่อประสิทธิภาพที่ดีขึ้น</p>
              <button 
                onClick={() => alert("ระบบกำลังตรวจสอบความเข้ากันได้ของ Dependency ก่อนทำการอัปเกรดอัตโนมัติ")}
                className="text-[10px] text-blue-600 font-bold hover:underline mt-2"
              >
                ดูรายละเอียดการอัปเกรด
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
