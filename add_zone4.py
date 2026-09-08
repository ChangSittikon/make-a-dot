import re

content = open('src/components/admin/AgentHubClient.tsx', 'r', encoding='utf-8').read()

zone4 = """
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
"""

if '{/* Zone 3: Mystery Dots */}' in content:
    content = content.replace('{/* Zone 3: Mystery Dots */}', zone4 + '\n\n                {/* Zone 3: Mystery Dots */}')
    open('src/components/admin/AgentHubClient.tsx', 'w', encoding='utf-8').write(content)
    print("Zone 4 Added")
else:
    print("Failed")
