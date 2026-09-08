'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FeatureStudioPage() {
  const [featureName, setFeatureName] = useState('');
  const [goal, setGoal] = useState('');
  const [actors, setActors] = useState('');
  const [dataFields, setDataFields] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    const prompt = `[FEATURE REQUEST - DOT BUILDER]
สวัสดี AI ช่วยสร้างฟีเจอร์ (DOT) ใหม่ให้โปรเจกต์ MAKE A DOT ตามรายละเอียดนี้:

1. ชื่อฟีเจอร์/DOT: ${featureName || '-'}
2. เป้าหมาย/การทำงานหลัก (Core Action): ${goal || '-'}
3. ผู้ใช้งานหลักที่เกี่ยวข้อง (Target Actors): ${actors || '-'}
4. ข้อมูลที่ต้องจัดเก็บ/ตัวแปร (Data required): ${dataFields || '-'}

คำสั่ง (Instructions):
- ช่วยวิเคราะห์โครงสร้างข้อมูล (Prisma Schema) ที่จำเป็นต้องเพิ่มหรือแก้ไข
- ช่วยออกแบบ Backend API Routes ที่ต้องใช้
- ช่วยออกแบบหน้า UI Layout ให้อยู่ในกรอบ Mobile Frame ตาม Design System ของเรา
- โปรดนำเสนอ Implementation Plan ให้ฉันพิจารณาก่อนลงมือเขียนโค้ดจริง`;

    setGeneratedPrompt(prompt);
    setIsCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Header */}
        <header className="px-5 py-4 sticky top-0 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Link href="/profile/settings" className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-[#2b3139] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">แผงพัฒนาฟีเจอร์</h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Feature Studio (DOT Builder)</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 scrollable-content">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-4 mb-6 border border-orange-100 dark:border-orange-900/30">
            <h2 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-1 flex items-center gap-2">
              <i className="fa-solid fa-lightbulb"></i> แปลงไอเดียเป็นโค้ด
            </h2>
            <p className="text-[10px] text-orange-600 dark:text-orange-300/80 leading-relaxed">
              คิดฟีเจอร์ออก แต่ไม่รู้จะสั่ง AI ยังไง? กรอกข้อมูลด้านล่างให้มากที่สุดเท่าที่คิดออก ระบบจะแปลงเป็น "Prompt มาตรฐาน" ให้คุณก๊อปปี้ไปสั่งงาน AI (Antigravity) ได้ทันที
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">1. ชื่อฟีเจอร์ / DOT (ถ้ามี)</label>
              <input 
                type="text" 
                placeholder="เช่น ระบบส่งพอร์ตโฟลิโอ"
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">2. อยากให้ทำอะไรได้บ้าง? (Core Action)</label>
              <textarea 
                placeholder="อธิบายสิ่งที่คุณอยากได้แบบภาษาคนธรรมดา เช่น อยากให้คนสมัครงานอัปโหลดรูปผลงานได้ 3 รูป แล้วให้เจ้าของโปรเจกต์กดให้คะแนนได้"
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">3. ใครเป็นคนใช้งานหน้านี้? (Target Actors)</label>
              <input 
                type="text" 
                placeholder="เช่น User ทั่วไป, แอดมิน, Director"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">4. ข้อมูลอะไรบ้างที่ต้องเก็บ? (Data to save)</label>
              <input 
                type="text" 
                placeholder="เช่น รูปภาพ, ข้อความ, วันที่, ลิงก์ (ไม่รู้ให้ข้ามได้)"
                value={dataFields}
                onChange={(e) => setDataFields(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2329] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:from-amber-400 hover:to-orange-500 transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> เสกคำสั่งให้ AI (Generate Prompt)
            </button>
          </div>

          {generatedPrompt && (
            <div className="mt-8 animate-fade-in pb-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-terminal text-gray-400"></i> ผลลัพธ์คำสั่ง (Copy ไปคุยกับ AI ได้เลย)
                </h3>
                <button 
                  onClick={handleCopy}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    isCopied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {isCopied ? <><i className="fa-solid fa-check mr-1"></i> คัดลอกแล้ว</> : 'คัดลอกคำสั่ง'}
                </button>
              </div>
              <div className="bg-[#1e2329] p-4 rounded-xl relative overflow-hidden group">
                <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
