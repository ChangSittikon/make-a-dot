"use client";

import { useState, useEffect } from "react";

interface Option {
  id: string;
  nodeId: string;
  label: string;
  vectorWeight?: string | null;
}

interface Node {
  id: string;
  type: string;
  question: string | null;
  options: Option[];
}

export function AlgorithmTab({ 
  industryId, 
  nodes,
  onSaveOptionWeight
}: { 
  industryId: string, 
  nodes: Node[],
  onSaveOptionWeight: (optionId: string, vectorWeight: string) => Promise<void>
}) {
  const [saving, setSaving] = useState<string | null>(null);
  
  // Local state to track edits before saving
  const [localWeights, setLocalWeights] = useState<Record<string, {
    budget: number,
    sweat: number,
    skill: number,
    timeline: number,
    risk: number
  }>>({});

  useEffect(() => {
    const weights: Record<string, any> = {};
    nodes.forEach(node => {
      node.options.forEach(opt => {
        let parsed = { budget: 0, sweat: 0, skill: 0, timeline: 0, risk: 0 };
        if (opt.vectorWeight) {
          try {
            parsed = { ...parsed, ...JSON.parse(opt.vectorWeight) };
          } catch {}
        }
        weights[opt.id] = parsed;
      });
    });
    setLocalWeights(weights);
  }, [nodes]);

  const handleSliderChange = (optionId: string, field: string, value: number) => {
    setLocalWeights(prev => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [field]: value
      }
    }));
  };

  const handleSave = async (optionId: string) => {
    setSaving(optionId);
    const weightJson = JSON.stringify(localWeights[optionId]);
    await onSaveOptionWeight(optionId, weightJson);
    setSaving(null);
  };

  return (
    <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="fa-solid fa-atom text-blue-500" />
            ตัวแปรสมการจับคู่ (Quantum Weights)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            กำหนดน้ำหนักเวกเตอร์ของแต่ละคำตอบ เพื่อใช้ในอัลกอริทึมจับคู่ผู้ใช้กับโปรเจกต์
          </p>
        </div>
      </div>

      <div className="p-0">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
            <tr>
              <th className="px-6 py-4">คำถาม & คำตอบ (Options)</th>
              <th className="px-4 py-4 w-32 text-center" title="💰 ทุน/งบประมาณ (-5 ถึง +5)">💰 Budget</th>
              <th className="px-4 py-4 w-32 text-center" title="💪 การลงแรง/หุ้นส่วน (-5 ถึง +5)">💪 Sweat Eq.</th>
              <th className="px-4 py-4 w-32 text-center" title="🧠 ทักษะ/ความเชี่ยวชาญ (-5 ถึง +5)">🧠 Skill</th>
              <th className="px-4 py-4 w-32 text-center" title="⏱️ ระยะเวลา/ความเร่งด่วน (-5 ถึง +5)">⏱️ Timeline</th>
              <th className="px-4 py-4 w-24 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {nodes.filter(n => n.type !== 'RESULT').map(node => (
              <optgroup key={node.id} className="contents">
                <tr>
                  <td colSpan={6} className="px-6 py-3 bg-gray-50 font-semibold text-gray-800 text-xs border-t border-gray-200">
                    Q: {node.question}
                  </td>
                </tr>
                {node.options.map(opt => {
                  const w = localWeights[opt.id] || { budget: 0, sweat: 0, skill: 0, timeline: 0, risk: 0 };
                  const isSaving = saving === opt.id;
                  
                  return (
                    <tr key={opt.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          {opt.icon && <i className={`${opt.icon} text-gray-400`} />}
                          {opt.label}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" min="-10" max="10" 
                          value={w.budget} onChange={e => handleSliderChange(opt.id, 'budget', parseInt(e.target.value) || 0)}
                          className="w-full text-center border border-gray-200 rounded p-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" min="-10" max="10" 
                          value={w.sweat} onChange={e => handleSliderChange(opt.id, 'sweat', parseInt(e.target.value) || 0)}
                          className="w-full text-center border border-gray-200 rounded p-1 text-xs focus:border-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" min="-10" max="10" 
                          value={w.skill} onChange={e => handleSliderChange(opt.id, 'skill', parseInt(e.target.value) || 0)}
                          className="w-full text-center border border-gray-200 rounded p-1 text-xs focus:border-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input 
                          type="number" min="-10" max="10" 
                          value={w.timeline} onChange={e => handleSliderChange(opt.id, 'timeline', parseInt(e.target.value) || 0)}
                          className="w-full text-center border border-gray-200 rounded p-1 text-xs focus:border-blue-500 outline-none"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => handleSave(opt.id)}
                          disabled={isSaving}
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition px-3 py-1.5 rounded-md font-semibold disabled:opacity-50"
                        >
                          {isSaving ? <i className="fa-solid fa-spinner fa-spin" /> : 'บันทึก'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </optgroup>
            ))}
            {nodes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  ไม่พบคำถามใน Flow กรุณาสร้างคำถามก่อน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
