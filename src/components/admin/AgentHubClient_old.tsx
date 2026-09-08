"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgentHubClient({ initialSkills, initialLogs }: { initialSkills: any[], initialLogs: any[] }) {
  const router = useRouter();
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCallAgent = () => {
    alert("สถานะ: พร้อมรับคำสั่ง! \n\nคุณสามารถพิมพ์สั่งงาน Antigravity Agent ได้ผ่านช่องแชท (Chat Window) นอกหน้าต่างเว็บนี้ได้ตลอดเวลาครับ ผมเฝ้าดูหน้าจอนี้อยู่เสมอ");
  };

  const handleAddRule = async () => {
    if (!newTitle.trim() || !newDesc.trim()) return alert("กรุณากรอกข้อมูลให้ครบ");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/agent-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, desc: newDesc })
      });
      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setShowRuleModal(false);
        router.refresh(); // Refresh server component data
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-bold text-gray-900">เพิ่มกฎให้ Agent ใหม่</h3>
              <button onClick={() => setShowRuleModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">ชื่อกฎ (Rule Title)</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="เช่น การใช้ Component Button..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">คำอธิบายกฎ (Instructions)</label>
                <textarea 
                  rows={4}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="อธิบายว่าอยากให้ Agent ทำงานยังไง..."
                ></textarea>
              </div>
              <button 
                onClick={handleAddRule}
                disabled={saving}
                className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl flex justify-center items-center gap-2"
              >
                {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
                บันทึกกฎ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
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
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 relative z-10"
        >
          <i className="fa-solid fa-bolt"></i>
          เรียกใช้งาน Agent
        </button>
      </div>

      {/* Skill List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">กฎและทักษะที่เรียนรู้ (Agent Rules)</h3>
          <button 
            onClick={() => setShowRuleModal(true)}
            className="text-[10px] text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 transition"
          >
            + เพิ่มกฏใหม่
          </button>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {initialSkills.map((skill, idx) => (
            <div key={idx} className="p-4 border-b border-gray-100 flex items-start justify-between cursor-pointer hover:bg-gray-50 transition">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <i className="fa-solid fa-code-branch text-xs"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{skill.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{skill.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dev Activity Log */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 px-1">Activity Log (การพัฒนาระบบ)</h3>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
          
          <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-gray-100"></div>

          <div className="space-y-4 relative z-10">
            {initialLogs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center">ยังไม่มีประวัติการทำงาน</p>
            ) : (
              initialLogs.map((log: any) => {
                const d = new Date(log.timestamp);
                const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} น.`;
                
                return (
                  <div key={log.id} className="flex gap-3 items-start group">
                    <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-bold text-xs text-gray-900">{log.action}</h4>
                        <span className="text-[9px] text-gray-400">{timeStr}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* System Health / Monitoring */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 px-1">ประเมินความสมบูรณ์ (System Health)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-gray-200 border-l-4 border-l-emerald-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500 opacity-5 rounded-bl-full"></div>
            <p className="text-[10px] text-gray-500 mb-1">Codebase Status</p>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-check text-emerald-500 text-xs"></i>
              <p className="text-sm font-bold text-gray-900">Stable</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-3 border border-gray-200 border-l-4 border-l-blue-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500 opacity-5 rounded-bl-full"></div>
            <p className="text-[10px] text-gray-500 mb-1">Agent Sync</p>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-rotate text-blue-500 text-xs"></i>
              <p className="text-sm font-bold text-gray-900">Synced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech News / Updates */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 px-1">Tech Updates</h3>
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
