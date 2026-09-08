const fs = require('fs');
let code = fs.readFileSync('src/app/profile/settings/page.tsx', 'utf8');

const targetStr = `            <div className="space-y-6 animate-fade-in"> 
              <div className="bg-[#111111] rounded-3xl p-6 shadow-2xl relative overflow-hidden border border-[#333333]"> 
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div> 
                <div className="relative z-10"> 
                  <h2 className="text-xl font-black text-white">System Administration</h2> 
                  <p className="text-sm text-gray-400 mt-1">แผงควบคุมหลักสำหรับ Tier 5</p> 
                </div> 
              </div> 
 
              <section className="bg-white rounded-3xl p-5 border border-brand-red/30 shadow-sm"> 
                <h3 className="text-sm font-bold text-brand-red mb-4 flex items-center gap-2"> 
                  <i className="fa-solid fa-wand-magic-sparkles"></i> 
                  เครื่องมือผู้ดูแลระบบ 
                </h3> 
                <Link  
                  href="/profile/settings/flow-builder" 
                  className="flex items-center justify-between p-3 bg-brand-red/5 rounded-xl border border-brand-red/10 hover:bg-brand-red/10 transition-colors" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0"> 
                      <i className="fa-solid fa-sitemap text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm">จัดการ Flow & Tree</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">ตั้งค่าคำถาม แผนผัง และอุตสาหกรรม</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-brand-red text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/ai-config" 
                  className="flex items-center justify-between p-3 mt-3 bg-[#111111] rounded-xl border border-gray-800 hover:bg-[#222222] transition-colors" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20"> 
                      <i className="fa-solid fa-microchip text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-white text-sm">ตั้งค่าระบบ AI (AI Config)</h4> 
                      <p className="text-xs text-gray-400 mt-0.5">จัดการ API, โมเดล, ขีดจำกัดการใช้งาน</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-600 text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/agent-hub" 
                  className="flex items-center justify-between p-3 mt-3 bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl border border-blue-800/50 hover:from-blue-800 hover:to-slate-800 transition-colors shadow-lg shadow-blue-900/20 relative overflow-hidden group" 
                > 
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div> 
                  <div className="flex items-center gap-4 relative z-10"> 
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"> 
                      <i className="fa-solid fa-robot text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-white text-sm">ตั้งค่าเอเจนต์ (Agent Hub)</h4> 
                      <p className="text-[10px] text-blue-200 mt-0.5">เชื่อมต่อ, Skills, ประเมินระบบ</p> 
                    </div> 
                  </div> 
                  <div className="relative z-10 flex items-center gap-2"> 
                    <span className="flex h-2 w-2 relative"> 
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span> 
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span> 
                    </span> 
                    <i className="fa-solid fa-chevron-right text-blue-500 group-hover:text-blue-300 transition-colors"></i> 
                  </div> 
                </Link> 
 
                <Link  
                  href="/profile/settings/feature-studio" 
                  className="flex items-center justify-between p-3 mt-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl border border-orange-500/50 hover:from-amber-400 hover:to-orange-500 transition-colors shadow-lg shadow-orange-500/20 relative overflow-hidden group" 
                > 
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div> 
                  <div className="flex items-center gap-4 relative z-10"> 
                    <div className="w-10 h-10 rounded-full bg-orange-900/20 border border-orange-200/30 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"> 
                      <i className="fa-solid fa-lightbulb text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-white text-sm">แผงพัฒนาฟีเจอร์ (Feature Studio)</h4> 
                      <p className="text-[10px] text-orange-200 mt-0.5">เครื่องมือช่วยคิดและสั่งงาน AI เพื่อสร้าง DOT ใหม่</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-white/70 group-hover:text-white transition-colors"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/dot-synthesizer" 
                  className="flex items-center justify-between p-3 mt-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-xl border border-purple-400/50 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 transition-colors shadow-lg shadow-purple-500/20 relative overflow-hidden group" 
                > 
                  <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-300 opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div> 
                  <div className="flex items-center gap-4 relative z-10"> 
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"> 
                      <i className="fa-solid fa-diagram-project text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-white text-sm">ผสานดอท (Dot Synthesizer)</h4> 
                      <p className="text-[10px] text-purple-100 mt-0.5">โยนไอเดียมั่วๆ ให้ AI ช่วยตีความและหาทางออก</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-white/70 group-hover:text-white transition-colors"></i> 
                </Link> 
              </section> 
            </div>`;

// Wait, I will use string index to slice it properly just in case of formatting.
const startIdx = code.indexOf(`          {user.role === 'ADMIN' ? (`);
const endIdx = code.indexOf(`          ) : user.role === 'DIRECTOR'`);

if (startIdx !== -1 && endIdx !== -1) {
    const newAdminSection = `          {user.role === 'ADMIN' ? ( 
            <div className="space-y-6 animate-fade-in"> 
              <div className="bg-brand-black rounded-3xl p-6 shadow-sm relative overflow-hidden border border-gray-800"> 
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div> 
                <div className="relative z-10"> 
                  <h2 className="text-xl font-black text-white">System Administration</h2> 
                  <p className="text-sm text-gray-400 mt-1">แผงควบคุมหลักสำหรับ Tier 5</p> 
                </div> 
              </div> 
 
              <section className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3"> 
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"> 
                  <div className="w-6 h-6 bg-brand-red/10 text-brand-red rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i> 
                  </div>
                  เครื่องมือผู้ดูแลระบบ 
                </h3> 

                <Link  
                  href="/profile/settings/flow-builder" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-sitemap text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">จัดการ Flow & Tree</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">ตั้งค่าคำถาม แผนผัง และอุตสาหกรรม</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/ai-config" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-microchip text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ตั้งค่าระบบ AI (AI Config)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">จัดการ API, โมเดล, ขีดจำกัดการใช้งาน</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/agent-hub" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group relative overflow-hidden" 
                > 
                  <div className="flex items-center gap-4 relative z-10"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors relative"> 
                      <i className="fa-solid fa-robot text-sm"></i> 
                      {/* Breathing dot to signify AI agent activity */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-red rounded-full border-2 border-white" style={{ animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite' }}></div>
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ตั้งค่าเอเจนต์ (Agent Hub)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">เชื่อมต่อ, Skills, ประเมินระบบ</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/feature-studio" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-lightbulb text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">แผงพัฒนาฟีเจอร์ (Feature Studio)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">เครื่องมือช่วยคิดและสั่งงาน AI เพื่อสร้าง DOT ใหม่</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
 
                <Link  
                  href="/profile/settings/dot-synthesizer" 
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors group" 
                > 
                  <div className="flex items-center gap-4"> 
                    <div className="w-10 h-10 rounded-full bg-brand-gray text-brand-black flex items-center justify-center shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors"> 
                      <i className="fa-solid fa-diagram-project text-sm"></i> 
                    </div> 
                    <div> 
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-red transition-colors">ผสานดอท (Dot Synthesizer)</h4> 
                      <p className="text-xs text-gray-500 mt-0.5">โยนไอเดียมั่วๆ ให้ AI ช่วยตีความและหาทางออก</p> 
                    </div> 
                  </div> 
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-brand-red transition-colors text-xs"></i> 
                </Link> 
              </section> 
            </div> 
`;
    code = code.substring(0, startIdx) + newAdminSection + code.substring(endIdx);
    fs.writeFileSync('src/app/profile/settings/page.tsx', code);
    console.log('done fixing ui');
} else {
    console.log('could not find boundaries');
}
