import re

content = open('src/components/admin/AgentHubClient.tsx', 'r', encoding='utf-8').read()

# 1. Replace the trigger button
# The button contains "onClick={() => setShowDocsModal(true)}"
# We can find the button using regex
btn_regex = re.compile(r'<button[^>]*onClick=\{\(\) => setShowDocsModal\(true\)\}[^>]*>.*?Repository & Knowledge Base\s*</button>', re.DOTALL)

btn_new = '''<button  
            onClick={() => setShowDocsModal(true)}  
            className="col-span-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md border border-slate-700"  
          >  
            <i className="fa-solid fa-code-compare"></i>  
            Repo Control Room
          </button>'''

if btn_regex.search(content):
    content = btn_regex.sub(btn_new, content)
    print("Matched and replaced button")
else:
    print("Failed to match button")


# 2. Replace the modal
# Match from {/* View Docs Modal */} to {/* Doc Preview Modal */}
modal_regex = re.compile(r'\{\/\* View Docs Modal \*\/\}[\s\S]*?(?=\{\/\* Doc Preview Modal \*\/})')

modal_new = '''{/* View Docs Modal (Repo Evolution Control Room) */}
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
      )}
      
      '''

if modal_regex.search(content):
    content = modal_regex.sub(modal_new, content)
    print("Matched and replaced modal")
else:
    print("Failed to match modal")

open('src/components/admin/AgentHubClient.tsx', 'w', encoding='utf-8').write(content)
print("Updated AgentHubClient.tsx")
