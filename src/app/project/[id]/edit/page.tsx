'use client'; 
import { useState, use, useEffect } from 'react'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

export default function ProjectBuilderPage({ params }: { params: Promise<{ id: string }> }) { 
  const { id } = use(params); 
  const router = useRouter();
   
  const [project, setProject] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);

  // Mock configuration for which sections are enabled
  // In a real app, this would be saved in the database under Project.displayConfig or similar
  const [sections, setSections] = useState([ 
    { id: 'overview', title: 'ภาพรวมโปรเจกต์ (The Big Picture)', icon: 'fa-chart-pie', enabled: true, desc: 'จุดประสงค์ เป้าหมาย และสถานะของโครงการ' }, 
    { id: 'in_kind_capital', title: 'โครงสร้างเงินทุนไร้เงินสด (Bootstrapping Capital)', icon: 'fa-coins', enabled: true, desc: 'แสดงมูลค่าทรัพยากร (ของ/แรง) เทียบกับเงินสดที่ต้องการจริง (Cashless Gauge)' }, 
    { id: 'resource_to_equity', title: 'การจัดสรรหุ้นส่วน (Resource-to-Equity)', icon: 'fa-scale-balanced', enabled: true, desc: 'คำนวณและแจกแจงหุ้นส่วนตามมูลค่าทรัพยากร (Sweat Equity) ที่แต่ละคนนำมาลง' }, 
    { id: 'resource_matchmaker', title: 'กระดานแลกเปลี่ยนทรัพยากร (Resource Matchmaker)', icon: 'fa-handshake', enabled: true, desc: 'ประกาศหาทรัพยากรที่ขาด (คน/ของ/สถานที่) และเสนอแลกเปลี่ยนด้วย Sweat Equity' }, 
    { id: 'team_resources', title: 'ทีมงานปัจจุบัน (Connected Dots)', icon: 'fa-users', enabled: true, desc: 'รายชื่อทีมงาน และทรัพยากรที่พวกเขาได้สมทบไปแล้ว' }, 
    { id: 'simulator', title: 'จำลองจุดคุ้มทุน (Breakeven Simulator)', icon: 'fa-flask', enabled: false, desc: 'จำลองความคุ้มค่าและจุดคุ้มทุน เมื่อไม่ต้องจ่ายเงินก้อนเป็นค่าเช่า/ค่าแรงล่วงหน้า' }, 
    { id: 'trust', title: 'การรับรอง (Trust & Endorsements)', icon: 'fa-shield-halved', enabled: true, desc: 'การรับรองจาก Director และการค้ำประกันทรัพยากร' }, 
  ]); 
 
  useEffect(() => { 
    async function fetchProject() { 
      try { 
        const res = await fetch(`/api/projects/${id}`, { cache: 'no-store' }); 
        if (res.ok) { 
          const data = await res.json(); 
          setProject(data); 
        } 
      } catch (error) { 
        console.error("Failed to fetch project:", error); 
      } finally { 
        setIsLoading(false); 
      } 
    } 
    fetchProject(); 
  }, [id]); 
 
  const toggleSection = (sectionId: string) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, enabled: !s.enabled } : s));
  };

  if (isLoading) { 
    return <div className="min-h-screen flex items-center justify-center font-prompt text-gray-500">กำลังโหลดแผงควบคุม...</div>; 
  } 
 
  if (!project) { 
    return <div className="min-h-screen flex items-center justify-center font-prompt text-[#FF1A1A]">ไม่พบโปรเจกต์</div>; 
  } 
 
  return ( 
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300"> 
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white dark:bg-[#1e2329] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300"> 
         
        {/* Header */} 
        <header className="px-5 py-4 sticky top-0 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3"> 
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-[#2b3139] rounded-full hover:bg-gray-100 transition-colors text-gray-600"> 
            <i className="fa-solid fa-arrow-left"></i> 
          </button> 
          <div className="flex-1 min-w-0"> 
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">จัดการเนื้อหาโปรเจกต์</h1> 
            <p className="text-[10px] text-gray-500">{project.title}</p> 
          </div> 
        </header> 
 
        <main className="flex-1 overflow-y-auto p-5 space-y-6 scrollable-content pb-24 bg-gray-50"> 
           
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
             <div>
                <h2 className="text-sm font-black text-gray-900">หัวข้อแสดงผลหน้าสรุป</h2>
                <p className="text-xs text-gray-500 mt-1">เลือกหัวข้อที่จะเปิดโชว์ให้นักลงทุนเห็น</p>
             </div>
             <div className="w-10 h-10 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center shrink-0">
                <i className="fa-solid fa-layer-group"></i>
             </div>
          </div>

          <div className="space-y-3">
             {sections.map(section => (
                 <div key={section.id} className={`bg-white rounded-2xl p-4 border ${section.enabled ? 'border-brand-red/30' : 'border-gray-100'} shadow-sm transition-colors`}>
                    <div className="flex items-start gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${section.enabled ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <i className={`fa-solid ${section.icon}`}></i>
                       </div>
                       <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className={`text-sm font-bold ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>{section.title}</h3>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{section.desc}</p>
                       </div>
                       
                       {/* Toggle Switch */}
                       <button 
                         onClick={() => toggleSection(section.id)}
                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${section.enabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                       >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${section.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                       </button>
                    </div>

                    {/* Edit Details Button */} 
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end"> 
                       <button 
                         onClick={() => setActiveEditSection(section.id)}
                         className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors ${section.enabled ? 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`} disabled={!section.enabled}> 
                          <i className="fa-solid fa-pen-to-square mr-1.5"></i> แก้ไขรายละเอียด
                       </button> 
                    </div> 
                 </div> 
             ))} 
          </div> 
  
        </main>  
         
        {/* Fixed Preview Button */} 
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent pt-10 pointer-events-none"> 
           <Link href={`/project/${id}`} className="w-full bg-brand-black text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors pointer-events-auto"> 
              <i className="fa-solid fa-eye mr-2"></i> ดูตัวอย่างหน้าโปรเจกต์ 
           </Link> 
        </div> 

        {/* Edit Modal */}
        {activeEditSection && (
          <div className="absolute inset-0 z-50 flex flex-col bg-gray-50 animate-fade-in">
            <header className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Edit Section</p>
                 <h2 className="text-sm font-bold text-gray-900 truncate pr-4">
                   {sections.find(s => s.id === activeEditSection)?.title}
                 </h2>
               </div>
               <button onClick={() => setActiveEditSection(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors shrink-0">
                 <i className="fa-solid fa-xmark"></i>
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 scrollable-content pb-20">
               {activeEditSection === 'in_kind_capital' && (
                  <div className="space-y-6">
                     <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <i className="fa-solid fa-calculator text-brand-red"></i> 
                           เพิ่มทรัพยากร (In-Kind Asset)
                        </h3>
                        <div className="space-y-3">
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ประเภททรัพยากร</label>
                              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-red/50">
                                 <option>LABOR (แรงงาน/ความรู้)</option>
                                 <option>EQUIPMENT (อุปกรณ์/เครื่องมือ)</option>
                                 <option>VENUE (สถานที่/พื้นที่)</option>
                                 <option>IP (ทรัพย์สินทางปัญญา)</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">คำอธิบาย</label>
                              <input type="text" placeholder="เช่น สตูดิโอถ่ายทำ 3 วัน" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-red/50" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ประเมินมูลค่าเทียบเท่าเงินสด (THB)</label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">฿</span>
                                <input type="number" placeholder="15000" className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-red/50" />
                              </div>
                           </div>
                           <button className="w-full bg-gray-900 text-white font-bold text-xs py-3 rounded-xl hover:bg-gray-800 transition-colors mt-2">
                              + เพิ่มเข้าบัญชีทรัพยากร
                           </button>
                        </div>
                     </div>
                     
                     <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <i className="fa-solid fa-chart-line"></i>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase">จำลองผลลัพธ์ (Cashless Gauge)</p>
                              <p className="text-xs text-emerald-800">ลดการใช้เงินสดไปได้ ฿0</p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeEditSection !== 'in_kind_capital' && (
                  <div className="text-center text-gray-400 mt-16">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-hammer text-2xl text-gray-300"></i>
                     </div>
                     <p className="text-sm font-bold text-gray-500">กำลังก่อสร้างแบบฟอร์ม</p>
                     <p className="text-xs mt-1">ฟอร์มสำหรับหัวข้อนี้จะเปิดให้ใช้งานเร็วๆ นี้</p>
                  </div>
               )}
            </div>

            <div className="p-5 bg-white border-t border-gray-100">
               <button onClick={() => setActiveEditSection(null)} className="w-full bg-brand-red text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-brand-red/20 hover:bg-red-600 transition-colors">
                  บันทึกการเปลี่ยนแปลง
               </button>
            </div>
          </div>
        )}
      </div> 
    </div> 
  ); 
}
