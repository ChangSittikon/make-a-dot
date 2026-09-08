import re
import os

content = open('src/components/admin/AgentHubClient.tsx', 'r', encoding='utf-8').read()

# 1. Update Props
content = content.replace(
  "workflowPhases: any[]  \n}) {",
  "workflowPhases: any[],\n  repoAnatomy: any\n}) {"
)

# 2. Update the trigger button in the main UI
btn_old = '''            <button onClick={() => setShowDocsModal(true)} className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition border border-indigo-200">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-database text-xs text-indigo-600"></i>
              </div>
              <div className="text-left leading-none pr-2">
                <p className="text-xs font-bold">Knowledge Base</p>
                <p className="text-[9px] text-indigo-500 mt-1">ศูนย์รวมความรู้และเอกสารสำคัญ</p>
              </div>
            </button>'''

btn_new = '''            <button onClick={() => setShowDocsModal(true)} className="flex items-center gap-2 p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition border border-slate-700 shadow-md">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shadow-sm border border-slate-700">
                <i className="fa-solid fa-code-compare text-xs text-slate-300"></i>
              </div>
              <div className="text-left leading-none pr-2">
                <p className="text-xs font-bold text-slate-100">Repo Control Room</p>
                <p className="text-[9px] text-slate-400 mt-1">ศูนย์ควบคุมวิวัฒนาการซอฟต์แวร์</p>
              </div>
            </button>'''

content = content.replace(btn_old, btn_new)

# 3. Update the Modal content
modal_old_start = '''      {/* View Docs Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:py-10 pointer-events-none">
          <div className="w-full h-full sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-transparent relative pointer-events-auto flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white w-full rounded-t-3xl h-[95%] flex flex-col animate-slide-up relative z-10">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200">
                  <i className="fa-solid fa-database text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none mb-1">Knowledge Base</h3>
                  <p className="text-[10px] text-gray-500 leading-none">ศูนย์รวมความรู้และเอกสารสำคัญ</p>
                </div>
              </div>
              <button onClick={() => setShowDocsModal(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
              <div className="grid grid-cols-1 gap-4">
                {docsList.map((item, idx) => (
                  <div key={idx} onClick={() => setPreviewDoc(item)} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-indigo-300 transition group cursor-pointer flex flex-col">
                    <div className="p-4 flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-inner">
                        <i className="fa-solid fa-file-lines text-xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1 group-hover:text-indigo-700 transition">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                        <i className="fa-regular fa-file-code"></i> {item.filename}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 group-hover:underline flex items-center gap-1">อ่านเอกสาร <i className="fa-solid fa-arrow-right text-[8px]"></i></span>
                    </div>
                  </div>
                ))}
                
                {docsList.length === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                      <i className="fa-solid fa-folder-open text-2xl"></i>
                    </div>
                    <p className="text-sm font-bold text-gray-700 mb-1">ยังไม่มีเอกสาร</p>
                    <p className="text-xs text-gray-500">สร้างเอกสาร .md ในโฟลเดอร์ docs/ เพื่อแสดงผลที่นี่</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}'''

modal_new = '''      {/* View Docs Modal (Repo Evolution Control Room) */}
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

              </div>
            </div>
          </div>
        </div>
      )}'''

# Find and replace the block
# Because the string contains exactly the code, we can just replace.
content = content.replace(modal_old_start, modal_new)

open('src/components/admin/AgentHubClient.tsx', 'w', encoding='utf-8').write(content)
print("Updated AgentHubClient.tsx")
