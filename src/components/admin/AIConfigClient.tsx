"use client";

import { useState, useEffect } from "react";

export default function AIConfigClient() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);
  
  const [primaryModel, setPrimaryModel] = useState("models/gemini-3.8-flash");
  const [fallbackModels, setFallbackModels] = useState<string[]>(["models/gemini-3.7-flash"]);
  
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoFallback, setAutoFallback] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [activeModal, setActiveModal] = useState<"primary" | "fallback" | null>(null);

  // Fetch config from DB
  useEffect(() => {
    fetch('/api/admin/ai-config')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setAiEnabled(data.aiEnabled);
          setAutoFallback(data.autoFallback);
          if (data.primaryModel) setPrimaryModel(data.primaryModel);
          if (data.fallbackModels) setFallbackModels(data.fallbackModels.split(','));
          if (data.apiKey) {
            setApiKey(data.apiKey);
            fetchModels(data.apiKey); // Fetch model list once config is loaded
          }
        }
        setLoadingConfig(false);
      })
      .catch(err => {
        console.error("Failed to load config", err);
        setLoadingConfig(false);
      });
  }, []);

  // Fetch models from Google API
  const fetchModels = async (key: string) => {
    if (!key) return;
    setIsLoadingModels(true);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await res.json();
      if (data.models) {
        setAvailableModels(data.models.filter((m: any) => m.name.includes('gemini') || m.name.includes('research') || m.name.includes('antigravity')));
      }
    } catch (err) {
      console.error("Failed to fetch models", err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSaveKey = () => {
    setIsEditingKey(false);
    fetchModels(apiKey);
    // API key is not saved to DB, we just update the model list
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiEnabled,
          autoFallback,
          primaryModel,
          fallbackModels: fallbackModels.join(',')
        })
      });
      alert("บันทึกการตั้งค่า AI ลงฐานข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  const toggleFallback = (modelName: string) => {
    setFallbackModels(prev => 
      prev.includes(modelName) 
        ? prev.filter(m => m !== modelName)
        : [...prev, modelName]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="font-bold text-gray-900">
                {activeModal === "primary" ? "เลือกโมเดลหลัก" : "เลือกโมเดลสำรอง (เลือกได้หลายตัว)"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-2">
              {isLoadingModels ? (
                <div className="py-10 text-center text-gray-400">กำลังดึงข้อมูลโมเดล...</div>
              ) : availableModels.length === 0 ? (
                <div className="py-10 text-center text-gray-400">ไม่พบโมเดล (ตรวจสอบ API Key)</div>
              ) : (
                availableModels.map(model => {
                  const isSelected = activeModal === "primary" 
                    ? primaryModel === model.name 
                    : fallbackModels.includes(model.name);

                  return (
                    <div 
                      key={model.name}
                      onClick={() => {
                        if (activeModal === "primary") {
                          setPrimaryModel(model.name);
                          setActiveModal(null);
                        } else {
                          toggleFallback(model.name);
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-colors cursor-pointer flex gap-3 items-start ${
                        isSelected ? 'bg-brand-red/5 border-brand-red shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="mt-0.5">
                        {activeModal === "primary" ? (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-brand-red' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-brand-red rounded-full"></div>}
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-brand-red bg-brand-red' : 'border-gray-300 bg-white'}`}>
                            {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${isSelected ? 'text-brand-red' : 'text-gray-900'}`}>{model.displayName}</h4>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">{model.name.replace('models/', '')}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{model.description}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            {activeModal === "fallback" && (
              <div className="p-4 border-t border-gray-100 bg-white pb-8">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 bg-brand-red text-white text-sm font-bold rounded-xl"
                >
                  ยืนยันการเลือก
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Status Card */}
      <div className="bg-[#111111] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">Gemini AI</h2>
            <p className="text-xs text-green-400 mt-1 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              เชื่อมต่อสำเร็จ (Active)
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
            <i className="fa-solid fa-microchip text-xl text-white"></i>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-400 mb-1">การใช้งานเดือนนี้</p>
            <p className="text-sm font-bold text-white">1,245 <span className="text-[10px] text-gray-500 font-normal">Requests</span></p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <p className="text-[10px] text-gray-400 mb-1">ค่าใช้จ่ายโดยประมาณ</p>
            <p className="text-sm font-bold text-white">฿45.50</p>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-900">ตั้งค่าโมเดล (Models)</h3>
          {isLoadingModels && <i className="fa-solid fa-spinner fa-spin text-brand-red text-xs"></i>}
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div 
            onClick={() => setActiveModal("primary")}
            className="p-4 border-b border-gray-100 flex items-start justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">โมเดลหลัก (Primary)</h4>
              <p className="text-xs text-brand-red mt-1 font-mono bg-brand-red/5 px-2 py-0.5 rounded inline-block">
                {primaryModel.replace('models/', '')}
              </p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 mt-1"></i>
          </div>
          
          <div 
            onClick={() => setActiveModal("fallback")}
            className="p-4 flex items-start justify-between hover:bg-gray-50 cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">โมเดลสำรอง (Fallback)</h4>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {fallbackModels.length > 0 ? (
                  fallbackModels.map(m => (
                    <span key={m} className="text-[10px] text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                      {m.replace('models/', '')}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">ไม่มี</span>
                )}
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 mt-1"></i>
          </div>
        </div>
      </section>

      {/* API Keys */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 px-1">คีย์การเข้าถึง (API Keys)</h3>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-gray-900">Google AI Studio Key</h4>
            {isEditingKey ? (
              <button onClick={handleSaveKey} className="text-xs text-brand-red font-bold hover:underline bg-brand-red/10 px-2 py-1 rounded">บันทึก</button>
            ) : (
              <button onClick={() => setIsEditingKey(true)} className="text-xs text-blue-600 font-bold hover:underline">แก้ไข</button>
            )}
          </div>
          
          {isEditingKey ? (
            <input 
              type="text" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full text-xs p-3 border border-brand-red/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-red bg-red-50/30"
              placeholder="วาง API Key ที่นี่..."
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between">
              <code className="text-xs text-gray-600 font-mono tracking-wider w-full overflow-hidden text-ellipsis">
                {showKey ? apiKey : apiKey.replace(/./g, '•').substring(0, 24) + '...'}
              </code>
              <button onClick={() => setShowKey(!showKey)} className="ml-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200">
                <i className={`fa-regular ${showKey ? 'fa-eye' : 'fa-eye-slash'} text-gray-400 text-xs`}></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Rate Limits & Features */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-gray-900 px-1">การควบคุม (Controls)</h3>
        
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div 
            onClick={() => setAiEnabled(!aiEnabled)}
            className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">เปิดใช้งาน "น้องดอทช่วยสร้าง"</h4>
              <p className="text-xs text-gray-500 mt-0.5">อนุญาตให้ใช้งานปุ่ม AI ใน Flow Builder</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative shadow-inner transition-colors ${aiEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${aiEnabled ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>

          <div 
            onClick={() => setAutoFallback(!autoFallback)}
            className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">Auto-Fallback</h4>
              <p className="text-xs text-gray-500 mt-0.5">สลับโมเดลอัตโนมัติเมื่อคิวเต็ม (429)</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative shadow-inner transition-colors ${autoFallback ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${autoFallback ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </div>
          
          <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => alert("กำลังพัฒนาระบบตั้งโควต้า")}>
            <div>
              <h4 className="font-bold text-sm text-gray-900">จำกัดโควต้า (Rate Limit)</h4>
              <p className="text-xs text-gray-500 mt-0.5">100 ครั้ง / วัน / อุตสาหกรรม</p>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 mt-1"></i>
          </div>
        </div>
      </section>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 bg-brand-red text-white text-sm font-bold rounded-xl hover:bg-red-600 transition shadow-md shadow-brand-red/20 mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {saving && <i className="fa-solid fa-spinner fa-spin"></i>}
        {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
      </button>
    </div>
  );
}
