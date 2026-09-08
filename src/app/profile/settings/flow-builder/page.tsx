"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/admin/Sidebar";
import { NodeCard } from "@/components/admin/NodeCard";
import { EditModal } from "@/components/admin/EditModal";
import { AlgorithmTab } from "@/components/admin/AlgorithmTab";

interface Industry {
  id: string;
  name: string;
  icon: string;
  nodeCount?: number;
}

interface Option {
  id: string;
  label: string;
  icon?: string | null;
  targetNodeId?: string | null;
  order?: number;
}

interface Node {
  id: string;
  type: string;
  question: string | null;
  order: number;
  options: Option[];
}

export default function AdminPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [activeIndustryId, setActiveIndustryId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);

  const [activeTab, setActiveTab] = useState<'FLOW' | 'SETTINGS' | 'ALGORITHM'>('FLOW');
  const [macroFee, setMacroFee] = useState(0);
  const [industryName, setIndustryName] = useState("");
  const [industryIcon, setIndustryIcon] = useState("");
  const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('pc');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiPromptDirective, setAiPromptDirective] = useState("");
  const [aiNodeCount, setAiNodeCount] = useState(5);
  const [aiToneLevel, setAiToneLevel] = useState(2); // 0-7 index
  const [aiSmartChoices, setAiSmartChoices] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/industries', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setIndustries(data);
        if (data.length > 0) {
          setActiveIndustryId(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeIndustryId) {
      fetch(`/api/flow/${activeIndustryId}`, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => setNodes(data));

      const ind = industries.find(i => i.id === activeIndustryId);
      if (ind) {
        setIndustryName(ind.name || "");
        setIndustryIcon(ind.icon || "");
        if ((ind as any).macroFeePercentage) {
          setMacroFee((ind as any).macroFeePercentage / 100);
        } else {
          setMacroFee(5); // default 5%
        }
        setAiPromptDirective((ind as any).aiPromptDirective || "");
        setAiNodeCount((ind as any).aiNodeCount || 5);
        setAiToneLevel((ind as any).aiToneLevel ?? 2);
        setAiSmartChoices((ind as any).aiSmartChoices ? JSON.parse((ind as any).aiSmartChoices) : []);
      }
    }
  }, [activeIndustryId, industries]);

  const handleSave = async () => {
    if (!activeIndustryId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/flow/${activeIndustryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      
      alert('บันทึกสำเร็จ!');
      
      // Update node count in sidebar
      setIndustries(inds => inds.map(ind => 
        ind.id === activeIndustryId 
          ? { ...ind, nodeCount: nodes.length }
          : ind
      ));
    } catch (err: any) {
      alert('บันทึกล้มเหลว: ' + (err?.message || 'Unknown error'));
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!activeIndustryId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/industries/${activeIndustryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: industryName,
          icon: industryIcon,
          macroFeePercentage: macroFee * 100,
          aiPromptDirective: aiPromptDirective || null,
          aiNodeCount: aiNodeCount,
          aiToneLevel: aiToneLevel,
          aiSmartChoices: JSON.stringify(aiSmartChoices)
        })
      });
      if (res.ok) {
        alert('บันทึกการตั้งค่าสำเร็จ');
        setIndustries(inds => inds.map(ind => 
          ind.id === activeIndustryId 
            ? { ...ind, name: industryName, icon: industryIcon }
            : ind
        ));
      } else {
        alert('บันทึกล้มเหลว');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = (node: Node) => {
    setEditingNode(node);
    setEditModalOpen(true);
  };

  const handleSaveOptionWeight = async (optionId: string, weightJson: string) => {
    try {
      const res = await fetch(`/api/options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectorWeight: weightJson })
      });
      if (res.ok) {
        setNodes(prev => prev.map(n => ({
          ...n,
          options: n.options.map(o => o.id === optionId ? { ...o, vectorWeight: weightJson } : o)
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNode = (questionText: string, newOptions: any[]) => {
    if (!editingNode) return;
    setNodes(nodes.map(n => {
      if (n.id === editingNode.id) {
        return {
          ...n,
          question: questionText,
          options: newOptions.map((o, idx) => ({
            id: o.id || crypto.randomUUID(),
            label: o.label,
            targetNodeId: o.target,
            order: idx
          }))
        };
      }
      return n;
    }));
    setEditModalOpen(false);
  };

  const activeIndustry = industries.find(i => i.id === activeIndustryId);

  // Target options for EditModal
  const targetOptionsForModal = [
    { value: "", label: "ไม่มี (Empty)" },
    ...nodes.map((n, i) => ({
      value: n.id,
      label: `คำถามที่ ${i + 1}: ${n.question?.substring(0, 20) || '...'}`
    }))
  ];

  return ( 
    <div className={`min-h-screen bg-slate-100 flex items-center justify-center transition-all duration-300 text-gray-800 ${viewMode === 'mobile' ? 'p-0 sm:p-4' : 'p-0'}`}>
      <div className={`bg-brand-gray-light overflow-hidden relative flex transition-all duration-300 ${
        viewMode === 'mobile' 
          ? 'flex-col w-full h-[100dvh] sm:h-[850px] sm:w-[430px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900' 
          : 'flex-row w-full h-[100dvh]'
      }`}>
      
        {viewMode === 'pc' && (
          <Sidebar 
            industries={industries}  
            activeId={activeIndustryId || undefined}  
            onSelect={setActiveIndustryId} 
          />
        )}
        
                {viewMode === 'mobile' && (
          <>
            <header className="bg-white border-b border-gray-200 shrink-0 z-20 relative">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-bars text-sm"></i>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-black rounded-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-brand-red rounded-full" />
                    </div>
                    <span className="font-bold text-sm">Flow Admin</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode('pc')} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
                    <i className="fa-solid fa-desktop text-xs"></i>
                  </button>
                  <a href="/" className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
                    <i className="fa-solid fa-house text-xs"></i>
                  </a>
                </div>
              </div>
            </header>

            {/* Mobile Sidebar Drawer */}
            {mobileMenuOpen && (
              <div className="absolute inset-0 z-50 flex">
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="relative w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                  <Sidebar 
                    industries={industries}  
                    activeId={activeIndustryId || undefined}  
                    onSelect={(id) => {
                      setActiveIndustryId(id);
                      setMobileMenuOpen(false);
                    }} 
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col bg-brand-gray-light relative overflow-hidden">
          {viewMode === 'pc' && (
            <header className="bg-white border-b border-gray-200 px-6 pt-4 shadow-sm z-10 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-bold text-sm text-gray-900">{activeIndustry?.name || "Loading..."}</h1>
                  <p className="text-[10px] text-gray-500">
                    จัดการโครงสร้างและตั้งค่าวงการ
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode('mobile')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center shrink-0">
                    <i className="fa-solid fa-mobile-screen text-xs mr-1"></i> โหมดมือถือ
                  </button>

                  <a
                    href="/"
                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition shadow-sm flex items-center shrink-0"
                  >
                    <i className="fa-solid fa-play text-[10px] mr-1" /> พรีวิว Flow
                  </a>
                  {activeTab === 'FLOW' && (
                    <button 
                      onClick={handleSave}
                      disabled={saving || !activeIndustryId}
                      className="px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                    >
                      {saving ? 'กำลังบันทึก...' : 'บันทึก Flow'}
                    </button>
                  )}
                  {activeTab === 'SETTINGS' && (
                    <button 
                      onClick={handleSaveSettings}
                      disabled={saving || !activeIndustryId}
                      className="px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                    >
                      {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-6 border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('FLOW')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'FLOW' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Logic Map (Flow)
                </button>
                <button 
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Industry Settings
                </button>
                <button 
                  onClick={() => setActiveTab('ALGORITHM')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'ALGORITHM' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-atom mr-1" />
                  ตัวแปรอัลกอริทึม
                </button>
              </div>
            </header>
          )}

          <div className="flex-1 overflow-auto p-8 relative">
            {activeTab === 'FLOW' && (
              <div className="relative max-w-3xl pb-32">
                {/* Vertical tree line */}
                {nodes.length > 0 && (
                  <div
                    className="absolute left-[24px] top-[40px] w-[2px] bg-gray-200 z-0"
                    style={{ bottom: '200px' }}
                  />
                )}

                {nodes.map((node, idx) => {
                  const indent = node.type === 'RESULT' ? 2 : (idx > 0 ? 1 : 0);
                  const paddingLeft = indent * (viewMode === 'mobile' ? 24 : 48);

                  return (
                    <div key={node.id} className="relative mb-6" style={{ paddingLeft }}>
                      {/* Horizontal connector line */}
                      {indent > 0 && (
                        <div
                          className="absolute top-1/2 h-[2px] bg-gray-200 z-0"
                          style={{ left: paddingLeft - (viewMode === 'mobile' ? 12 : 24), width: (viewMode === 'mobile' ? 10 : 20) }}
                        />
                      )}
                      <NodeCard
                        number={idx + 1}
                        label={`คำถามที่ ${idx + 1}`}
                        question={node.question || "ไม่มีคำถาม"}
                        options={(node.options || []).map(opt => {
                          const targetNodeIndex = nodes.findIndex(n => n.id === opt.targetNodeId);
                          const targetNode = nodes[targetNodeIndex];
                          let targetLabel = "ว่างเปล่า!";
                          let targetType: "question" | "result" | "empty" = "empty";
                          
                          if (targetNode) {
                            targetLabel = `ไป Q${targetNodeIndex + 1}`;
                            targetType = targetNode.type === 'RESULT' ? 'result' : 'question';
                          }

                          return {
                            label: opt.label,
                            icon: opt.icon || undefined,
                            targetLabel,
                            targetType
                          };
                        })}
                        dotColor={idx === 0 ? "bg-brand-red" : "bg-blue-500"}
                        onEdit={() => handleEdit(node)}
                      />
                    </div>
                  );
                })}

                {/* Add Node Buttons */}
                <div className="relative flex flex-col items-start gap-3 mt-6" style={{ paddingLeft: nodes.length > 0 ? (viewMode === 'mobile' ? 24 : 48) : 0 }}>
                  <button 
                    onClick={() => {
                      const newNode: Node = {
                        id: crypto.randomUUID(),
                        type: "QUESTION",
                        question: "คำถามใหม่",
                        order: nodes.length,
                        options: []
                      };
                      setNodes([...nodes, newNode]);
                      setEditModalOpen(true);
                      setEditingNode(newNode);
                    }}
                    className="w-[280px] bg-white border border-gray-200 text-gray-700 rounded-xl py-3 px-4 text-xs font-semibold shadow-sm hover:border-gray-400 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-pen-to-square text-gray-400 group-hover:text-gray-600" />
                      <span>สร้างคำถามด้วยตัวเอง</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300" />
                  </button>

                  <button
                    onClick={() => {
                      const q1Id = crypto.randomUUID();
                      const q2Id = crypto.randomUUID();
                      const resId = crypto.randomUUID();

                      setNodes([
                        ...nodes,
                        {
                          id: q1Id,
                          type: "START",
                          question: "คุณต้องการโปรเจกต์แนวไหน?",
                          order: nodes.length,
                          options: [
                            { id: crypto.randomUUID(), label: "ทำเล่นๆ ขำๆ", icon: "fa-solid fa-face-smile", targetNodeId: q2Id, order: 0 },
                            { id: crypto.randomUUID(), label: "ทำจริงจัง หวังรวย", icon: "fa-solid fa-money-bill-wave", targetNodeId: q2Id, order: 1 }
                          ]
                        },
                        {
                          id: q2Id,
                          type: "QUESTION",
                          question: "งบประมาณที่คุณมีตอนนี้?",
                          order: nodes.length + 1,
                          options: [
                            { id: crypto.randomUUID(), label: "สายฟรี เน้นแรงงาน", icon: "fa-solid fa-hand-sparkles", targetNodeId: resId, order: 0 },
                            { id: crypto.randomUUID(), label: "มีงบพร้อมลุย", icon: "fa-solid fa-sack-dollar", targetNodeId: resId, order: 1 }
                          ]
                        },
                        {
                          id: resId,
                          type: "RESULT",
                          question: "นี่คือทีมที่เหมาะกับคุณ!",
                          order: nodes.length + 2,
                          options: []
                        }
                      ]);
                    }}
                    className="w-[280px] bg-white border border-gray-200 text-gray-700 rounded-xl py-3 px-4 text-xs font-semibold shadow-sm hover:border-blue-400 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-copy text-blue-400 group-hover:text-blue-500" />
                      <span>ชุดคำถามเริ่มต้น</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300" />
                  </button>

                  <button
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await fetch('/api/ai/generate-flow', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ industryName: activeIndustry?.name || "ทั่วไป", industryId: activeIndustryId })
                        });
                        
                        const data = await res.json();
                        
                        if (!res.ok) {
                          if (data.error === 'Missing GOOGLE_GENERATIVE_AI_API_KEY in .env') {
                            alert('ยังไม่ได้ตั้งค่า GOOGLE_GENERATIVE_AI_API_KEY ในไฟล์ .env ครับ');
                          } else {
                            alert('เกิดข้อผิดพลาดในการสร้างด้วย AI: ' + (data.error || 'Unknown'));
                          }
                          return;
                        }
                        
                        if (data.nodes) {
                          const newNodes = data.nodes.map((n: any, i: number) => ({
                            ...n,
                            order: nodes.length + i
                          }));
                          setNodes([...nodes, ...newNodes]);
                        }
                      } catch (e) {
                        console.error(e);
                        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ AI");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="w-[280px] bg-brand-red-50 border border-brand-red/20 text-brand-red rounded-xl py-3 px-4 text-xs font-semibold shadow-sm hover:bg-brand-red hover:text-white transition flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-wand-magic-sparkles"} />
                      <span>{saving ? 'กำลังให้น้องดอทช่วยคิด...' : 'ให้น้องดอทช่วยสร้าง (AI)'}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-brand-red/50 group-hover:text-white/80" />
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'SETTINGS' && (
              <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">ตั้งค่าวงการ: {activeIndustry?.name}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อวงการ</label>
                    <input 
                      type="text" 
                      value={industryName}
                      onChange={e => setIndustryName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ไอคอน (FontAwesome Class)</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 border border-gray-200">
                        <i className={industryIcon || "fa-solid fa-question"} />
                      </div>
                      <input 
                        type="text" 
                        value={industryIcon}
                        onChange={e => setIndustryIcon(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                        placeholder="e.g. fa-solid fa-music"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">หักส่วนแบ่งแพลตฟอร์ม (Macro Fee %)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={macroFee}
                        onChange={e => setMacroFee(Number(e.target.value))}
                        className="w-32 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                        min="0"
                        max="100"
                      />
                      <span className="text-gray-500 text-sm">% ของรายได้ในระบบ</span>
                    </div>
                  </div>

                  {/* AI Control Panel */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <i className="fa-solid fa-robot text-purple-500" />
                      <h3 className="text-sm font-bold text-gray-900">ศูนย์บัญชาการน้องดอท (AI Control Panel)</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      กำหนดทิศทางให้น้องดอทสร้าง Flow ที่เจาะลึกเฉพาะวงการนี้ คำสั่งที่คุณเขียนที่นี่จะถูกส่งให้ AI เป็นลำดับความสำคัญสูงสุด
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <i className="fa-solid fa-wand-magic-sparkles text-purple-400 mr-1" />
                          คำสั่งพิเศษสั่งการน้องดอท (AI Directive)
                        </label>
                        <textarea 
                          value={aiPromptDirective}
                          onChange={e => setAiPromptDirective(e.target.value)}
                          rows={4}
                          className="w-full border border-purple-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none bg-purple-50/50 placeholder:text-gray-400"
                          placeholder={`ตัวอย่าง:\n- เน้นคำถามเกี่ยวกับการลงทุนซื้อเครื่องจักร และที่ดิน\n- ถามเรื่องฤดูกาลเก็บเกี่ยว และตลาดส่งออก\n- ห้ามถามเรื่องส่วนตัว`}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">ยิ่งเขียนชัดเจน น้องดอทยิ่งสร้าง Flow ที่ตรงจุดครับ</p>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <i className="fa-solid fa-list-ol text-purple-400 mr-1" />
                          จำนวนคำถามที่ AI ควรสร้าง
                        </label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="range"
                            min="3"
                            max="10"
                            value={aiNodeCount}
                            onChange={e => setAiNodeCount(Number(e.target.value))}
                            className="flex-1 accent-purple-500"
                          />
                          <span className="text-lg font-bold text-purple-600 w-8 text-center">{aiNodeCount}</span>
                          <span className="text-xs text-gray-500">คำถาม</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">3 = กระชับ, 7 = เจาะลึก, 10 = ละเอียดสุดๆ</p>
                      </div>

                      {/* Mood / Tone Slider */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <i className="fa-solid fa-masks-theater text-purple-400 mr-1" />
                          มู้ดโทนอารมณ์ของชุดคำถาม
                        </label>
                        <div className="relative">
                          <input 
                            type="range"
                            min="0"
                            max="7"
                            step="1"
                            value={aiToneLevel}
                            onChange={e => setAiToneLevel(Number(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-0.5">
                            {['😂','😎','📝','👔','🎓','🔬','⚛️','🔮'].map((emoji, i) => (
                              <span key={i} className={`cursor-pointer transition-all ${aiToneLevel === i ? 'text-base scale-125' : 'opacity-60'}`} onClick={() => setAiToneLevel(i)}>
                                {emoji}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            aiToneLevel <= 1 ? 'bg-yellow-100 text-yellow-700' :
                            aiToneLevel <= 3 ? 'bg-blue-100 text-blue-700' :
                            aiToneLevel <= 5 ? 'bg-indigo-100 text-indigo-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {['ขำๆ สนุกสนาน', 'ชิลๆ เป็นกันเอง', 'ปกติ เป็นกลาง', 'ทางการ สุภาพ', 'วิชาการ เข้มข้น', 'เชี่ยวชาญเจาะลึกขั้นสุด', 'ควอนตัม ข้ามมิติ', 'ดอทปริศนา ✨'][aiToneLevel]}
                          </span>
                        </div>
                      </div>

                      {/* Smart Choice Chips */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          <i className="fa-solid fa-brain text-purple-400 mr-1" />
                          Smart Choice — ความฉลาดเสริม
                        </label>
                        <p className="text-[10px] text-gray-400 mb-3">กดเลือกเพื่อเปิดใช้ ยิ่งเลือกเยอะ AI ยิ่งคิดรอบด้าน</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'branching', label: '🌿 แตกกิ่งก้าน', desc: 'สร้างเส้นทางหลายสาย ไม่เรียงเส้นตรง' },
                            { id: 'budget', label: '💰 วิเคราะห์งบ', desc: 'ถามเรื่องงบประมาณและต้นทุน' },
                            { id: 'skill', label: '🧠 ถามทักษะ', desc: 'เจาะลึกทักษะที่ต้องการ' },
                            { id: 'timeline', label: '📅 ไทม์ไลน์', desc: 'ถามเรื่องระยะเวลาและกำหนดส่ง' },
                            { id: 'risk', label: '⚠️ ประเมินความเสี่ยง', desc: 'สอดแทรกคำถามด้านความเสี่ยง' },
                            { id: 'sweat', label: '💪 Sweat Equity', desc: 'คำถามเรื่องการลงแรงแทนเงิน' },
                            { id: 'location', label: '📍 พื้นที่/ทำเล', desc: 'ถามเรื่องสถานที่และภูมิภาค' },
                            { id: 'collab', label: '🤝 หาพาร์ทเนอร์', desc: 'เน้นคำถามจับคู่ผู้ร่วมงาน' },
                          ].map(chip => {
                            const isActive = aiSmartChoices.includes(chip.id);
                            return (
                              <button
                                key={chip.id}
                                type="button"
                                onClick={() => {
                                  if (isActive) {
                                    setAiSmartChoices(aiSmartChoices.filter(c => c !== chip.id));
                                  } else {
                                    setAiSmartChoices([...aiSmartChoices, chip.id]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                  isActive 
                                    ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-200' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                                title={chip.desc}
                              >
                                {chip.label}
                              </button>
                            );
                          })}
                        </div>
                        {aiSmartChoices.length > 0 && (
                          <p className="text-[10px] text-purple-500 mt-2">
                            <i className="fa-solid fa-check-circle mr-1" />
                            เปิดใช้ {aiSmartChoices.length} ความฉลาดเสริม
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ALGORITHM' && (
              <AlgorithmTab 
                industryId={activeIndustryId!} 
                nodes={nodes as any} 
                onSaveOptionWeight={handleSaveOptionWeight} 
              />
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal (Dialog) */}
      {editModalOpen && (
        <EditModal 
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          questionText={editingNode?.question || ""}
          options={
            editingNode?.options.map(o => ({
              id: o.id,
              label: o.label,
              target: o.targetNodeId || "",
            })) || []
          }
          targetOptions={targetOptionsForModal as any}
          onSave={handleSaveNode}
          onDelete={() => {
            if (editingNode && confirm("คุณต้องการลบคำถามนี้ใช่หรือไม่?")) {
              setNodes(nodes.filter(n => n.id !== editingNode.id));
              setEditModalOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
