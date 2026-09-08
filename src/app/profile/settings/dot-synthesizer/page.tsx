'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type HistoryItem = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: any; // For structured AI response
};

export default function DotSynthesizerPage() {
  const [currentThought, setCurrentThought] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSynthesize = async (thoughtOverride?: string) => {
    const thoughtToSend = thoughtOverride || currentThought;
    if (!thoughtToSend.trim()) return;

    const userMessage: HistoryItem = {
      id: Date.now().toString(),
      role: 'user',
      content: thoughtToSend
    };
    
    setHistory(prev => [...prev, userMessage]);
    setCurrentThought('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: history,
          currentThought: thoughtToSend
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMessage: HistoryItem = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.analysis,
          data: data
        };
        setHistory(prev => [...prev, aiMessage]);
      } else {
        const err = await res.json();
        const errorMsg: HistoryItem = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ ข้อผิดพลาดจากระบบ: ${err.error}\n\nกรุณาลองใหม่อีกครั้ง หรือตรวจสอบ API Key / โควต้าการใช้งานของคุณ`
        };
        setHistory(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      console.error(error);
      const errorMsg: HistoryItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ ขาดการเชื่อมต่อ: ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้`
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChoiceClick = (choice: any) => {
    const text = `ต่อยอดจากไอเดียนี้: ${choice.title}\n${choice.description}`;
    handleSynthesize(text);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#161a1e] font-prompt sm:py-10 transition-colors duration-300">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white dark:bg-[#161a1e] relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300">
        
        {/* Header */}
        <header className="px-5 py-4 sticky top-0 bg-white/90 dark:bg-[#1e2329]/90 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <Link href="/profile/settings" className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-[#2b3139] rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
               <i className="fa-solid fa-brain text-[10px]"></i>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">ผสานดอท (Synthesizer)</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">รวบรวมไอเดียเพื่อสร้างผลิตภัณฑ์</p>
            </div>
          </div>
        </header>

        {/* Chat / History Area */}
        <main className="flex-1 overflow-y-auto p-5 scrollable-content bg-gray-50/50 dark:bg-[#161a1e]">
          
          {history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4 animate-fade-in">
              <div className="w-24 h-24 relative mb-6">
                <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900/30 rounded-full animate-ping opacity-20"></div>
                <div className="w-full h-full bg-gradient-to-tr from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1e2329] shadow-lg relative z-10">
                  <i className="fa-solid fa-network-wired text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"></i>
                </div>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">โยนความคิดของคุณมาได้เลย</h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                ไม่ต้องเรียบเรียง ไม่ต้องสนตรรกะ AI จะประมวลผลโค้ด, สภาพแวดล้อม และระบบที่มีอยู่ทั้งหมด เพื่อหาทางออกที่เป็น Smart Choices ให้คุณต่อยอด
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                 <span className="text-[10px] px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md font-medium"><i className="fa-brands fa-react mr-1"></i> Codebase Aware</span>
                 <span className="text-[10px] px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md font-medium"><i className="fa-solid fa-database mr-1"></i> Schema Linked</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {history.map((item) => (
              <div key={item.id} className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                {item.role === 'user' ? (
                   <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm text-sm whitespace-pre-wrap">
                     {item.content}
                   </div>
                ) : (
                   <div className="w-full">
                     <div className="flex items-center gap-2 mb-2">
                       <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] shadow-sm">
                         <i className="fa-solid fa-sparkles"></i>
                       </div>
                       <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
                         AI Synthesizer
                       </span>
                     </div>
                     
                     <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                       <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                         {item.data?.analysis || item.content}
                       </p>

                       {/* Smart Choices */}
                       {item.data?.smartChoices && item.data.smartChoices.length > 0 && (
                         <div className="mb-4">
                           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Smart Choices (เลือกเพื่อต่อยอด)</h4>
                           <div className="space-y-2">
                             {item.data.smartChoices.map((choice: any, idx: number) => (
                               <button 
                                 key={idx}
                                 onClick={() => handleChoiceClick(choice)}
                                 className="w-full text-left p-3 rounded-xl border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors group"
                               >
                                 <div className="flex justify-between items-start mb-1">
                                    <h5 className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                                      <i className="fa-solid fa-lightbulb text-purple-500"></i> {choice.title}
                                    </h5>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                      choice.feasibility === 'HIGH' ? 'bg-green-100 text-green-700' :
                                      choice.feasibility === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>ความเป็นไปได้: {choice.feasibility}</span>
                                 </div>
                                 <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-2 leading-relaxed">{choice.description}</p>
                                 <div className="text-[9px] text-gray-500 bg-white/50 dark:bg-black/20 p-1.5 rounded flex gap-1.5 items-start">
                                    <i className="fa-solid fa-code-branch mt-0.5 text-gray-400"></i>
                                    <span><strong className="text-gray-700 dark:text-gray-300">ผลกระทบ:</strong> {choice.impact}</span>
                                 </div>
                               </button>
                             ))}
                           </div>
                         </div>
                       )}

                       {/* Pathways */}
                       {item.data?.pathways && item.data.pathways.length > 0 && (
                         <div>
                           <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pathways (แนวทางพัฒนา)</h4>
                           <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                             {item.data.pathways.map((path: any, idx: number) => (
                               <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                 <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#1e2329] bg-indigo-500 text-white font-bold text-[10px] shadow shrink-0 ml-0 relative z-10">
                                   {path.step}
                                 </div>
                                 <div className="w-[calc(100%-2rem)] p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-sm ml-3">
                                   <h5 className="font-bold text-xs text-gray-900 dark:text-white mb-1">{path.action}</h5>
                                   <p className="text-[10px] text-gray-500 dark:text-gray-400">{path.details}</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
                )}
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] shadow-sm animate-pulse">
                  <i className="fa-solid fa-sparkles"></i>
                </div>
                <div className="bg-white dark:bg-[#1e2329] border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm p-4 shadow-sm text-sm text-gray-500 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  กำลังวิเคราะห์บริบทโปรเจกต์และผสานดอท...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-[#1e2329] border-t border-gray-100 dark:border-gray-800 z-40 relative">
           <div className="relative flex items-end">
             <textarea 
               value={currentThought}
               onChange={(e) => setCurrentThought(e.target.value)}
               placeholder="โยนไอเดียมั่วๆ ซั่วๆ มาที่นี่... (เช่น อยากให้หน้าแรกมีที่โชว์ผลงานคน แต่เอ๊ะ จะจ่ายเงินยังไงนะ)"
               className="w-full max-h-32 min-h-[50px] p-3 pr-12 text-sm bg-gray-50 dark:bg-[#161a1e] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none text-gray-900 dark:text-white"
               rows={Math.max(1, currentThought.split('\n').length)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   handleSynthesize();
                 }
               }}
             />
             <button 
               onClick={() => handleSynthesize()}
               disabled={!currentThought.trim() || isGenerating}
               className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-sm"
             >
               <i className="fa-solid fa-paper-plane text-xs"></i>
             </button>
           </div>
           <p className="text-[9px] text-center text-gray-400 mt-2">
             <i className="fa-solid fa-lock text-[8px] mr-1"></i> Data in context: Codebase, Schema, Dev History
           </p>
        </div>
      </div>
    </div>
  );
}
