"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ProjectBuilder() {
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const [knownDots, setKnownDots] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mocking the AI Analysis
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
    }, 2000);
  };

  const toggleDot = (dot: string) => {
    if (knownDots.includes(dot)) {
      setKnownDots(knownDots.filter(d => d !== dot));
    } else {
      setKnownDots([...knownDots, dot]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Header */}
      <div className="w-full max-w-3xl mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Project Builder</h1>
        <p className="text-slate-500 text-sm">เปลี่ยนไอเดียลอยๆ ให้กลายเป็นความจริง ด้วยการจัดระเบียบและค้นหา Dot ที่ขาดหาย</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-10 px-4">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-rose-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 1 ? 'bg-rose-100' : 'bg-slate-200'}`}>1</div>
          <span className="text-xs font-bold">The Idea</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-rose-600' : 'bg-slate-200'}`}></div>
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-rose-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 2 ? 'bg-rose-100' : 'bg-slate-200'}`}>2</div>
          <span className="text-xs font-bold">Known Dots</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= 3 ? 'bg-indigo-100' : 'bg-slate-200'}`}>3</div>
          <span className="text-xs font-bold">Synergy Engine</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Step 1: Idea */}
        {step === 1 && (
          <div className="p-8 sm:p-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <i className="fa-solid fa-lightbulb text-2xl text-rose-500"></i>
              <h2 className="text-xl font-bold text-slate-800">โปรเจกต์ของคุณเกี่ยวกับอะไร?</h2>
            </div>
            <textarea 
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="เช่น อยากทำแอพพลิเคชันช่วยเหลือสัตว์จรจัด โดยใช้ AI สแกนใบหน้าสัตว์..."
              className="w-full h-40 p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none resize-none transition text-slate-700"
            ></textarea>
            <div className="mt-8 flex justify-end">
              <button 
                disabled={!idea.trim()}
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ถัดไป <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Known Dots */}
        {step === 2 && (
          <div className="p-8 sm:p-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-box-open text-2xl text-rose-500"></i>
              <h2 className="text-xl font-bold text-slate-800">จัดระเบียบสิ่งที่คุณมี (Known Dots)</h2>
            </div>
            <p className="text-sm text-slate-500 mb-8">เลือกทรัพยากรตั้งต้นที่คุณพร้อมลงทุนในโปรเจกต์นี้ด้วยตัวเอง</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {[
                { id: 'dev', name: 'เขียนโค้ด', icon: 'fa-code' },
                { id: 'design', name: 'ออกแบบ UI/UX', icon: 'fa-pen-nib' },
                { id: 'marketing', name: 'การตลาด', icon: 'fa-bullhorn' },
                { id: 'capital', name: 'เงินทุน (บางส่วน)', icon: 'fa-coins' },
                { id: 'time', name: 'เวลา (Full-time)', icon: 'fa-clock' },
                { id: 'connection', name: 'คอนเนคชัน', icon: 'fa-handshake' },
              ].map(dot => (
                <button 
                  key={dot.id}
                  onClick={() => toggleDot(dot.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition ${
                    knownDots.includes(dot.id) 
                      ? 'border-rose-500 bg-rose-50 text-rose-700' 
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <i className={`fa-solid ${dot.icon} text-2xl`}></i>
                  <span className="text-sm font-bold">{dot.name}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition"
              >
                ย้อนกลับ
              </button>
              <button 
                onClick={handleAnalyze}
                className="px-8 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-xl font-bold hover:from-rose-700 hover:to-rose-600 transition shadow-lg shadow-rose-200 flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> กำลังวิเคราะห์มุมบอด...</>
                ) : (
                  <><i className="fa-solid fa-wand-magic-sparkles"></i> สแกนหาดอทที่ขาดหาย</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Synergy Engine (Mystery Dots) */}
        {step === 3 && (
          <div className="p-8 sm:p-12 animate-fade-in bg-slate-900 text-white rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <i className="fa-solid fa-star-of-life text-2xl text-indigo-400"></i>
              <h2 className="text-xl font-bold text-white">ผลการวิเคราะห์จาก Synergy Engine</h2>
            </div>
            <p className="text-sm text-slate-400 mb-8">ระบบได้วิเคราะห์จากไอเดียและทรัพยากรของคุณ นี่คือ "มุมบอด" ที่คุณอาจคาดไม่ถึง</p>

            <div className="space-y-6 mb-10">
              
              {/* Missing Dot */}
              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded-md text-[10px] font-bold uppercase tracking-wider">Missing Dot</span>
                    <h3 className="font-bold text-slate-200">สายเทคนิค (Tech Partner)</h3>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">คุณมีไอเดียและเวลา แต่ขาดคนเขียนระบบหลังบ้านที่ต้องใช้ความปลอดภัยสูง</p>
                <button className="w-full py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition">
                  <i className="fa-solid fa-magnifying-glass mr-2"></i> ค้นหาพาร์ทเนอร์สายเทค (Sweat Equity)
                </button>
              </div>

              {/* Mystery Dot */}
              <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 rounded-2xl p-5 border border-indigo-500/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <i className="fa-solid fa-meteor text-6xl text-white"></i>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-sparkles"></i> Mystery Dot
                      </span>
                      <h3 className="font-bold text-white">นักจิตวิทยาสัตว์เลี้ยง (Pet Psychologist)</h3>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-200/80 mb-4 pr-10">ระบบวิเคราะห์ว่า "แอปสแกนหน้าสัตว์จรจัด" จะมี Impact มากขึ้น 300% ถ้ามีผู้เชี่ยวชาญด้านพฤติกรรมสัตว์มาร่วมออกแบบ UX เพื่อไม่ให้สัตว์ตื่นกลัวเวลาถูกสแกน</p>
                  <Link href="/project/simulator" className="w-full py-2 flex items-center justify-center bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition shadow-lg shadow-indigo-900/50">
                    <i className="fa-solid fa-vr-cardboard mr-2"></i> นำเข้า 'What If' Simulator
                  </Link>
                </div>
              </div>

            </div>

            <div className="flex justify-center">
              <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition shadow-lg">
                บันทึกโปรเจกต์ (Draft)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
