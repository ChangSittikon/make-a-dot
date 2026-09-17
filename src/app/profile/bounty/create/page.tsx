"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types based on Prisma models
type WorkType = { id: string; name: string };
type SkillTag = { id: string; name: string };
type Occupation = { id: string; name: string; skillTags: SkillTag[] };
type Industry = { id: string; name: string; occupations: Occupation[] };

export default function CreateBountyPage() {
  const router = useRouter();
  
  // Data State
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedWorkType, setSelectedWorkType] = useState<string | null>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<Occupation | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<{skill: SkillTag, occ: Occupation}[]>([]);
  
  // Prize & Resources
  const [bountyPrize, setBountyPrize] = useState('');
  const [resourceType, setResourceType] = useState('CASH');
  const [resourceAmount, setResourceAmount] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/taxonomy')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWorkTypes(data.workTypes);
          setIndustries(data.industries);
        }
      });
  }, []);

  const toggleWorkType = (id: string) => {
    setSelectedWorkType(prev => prev === id ? null : id);
  };

  const removeSkill = (id: string) => setSelectedSkills(prev => prev.filter(s => s.skill.id !== id));

  const filteredResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results: any[] = [];
    const term = searchTerm.toLowerCase();

    industries.forEach(ind => {
      ind.occupations.forEach(occ => {
        if (occ.name.toLowerCase().includes(term)) {
          results.push({ type: 'occupation', item: occ, parent: ind });
        }
        occ.skillTags.forEach(skill => {
          if (skill.name.toLowerCase().includes(term)) {
            results.push({ type: 'skill', item: skill, parent: occ });
          }
        });
      });
    });

    return results.slice(0, 10);
  }, [searchTerm, industries]);

  const selectResult = (result: any) => {
    if (result.type === 'occupation') {
      setSelectedOccupation(result.item);
    } else {
      if (!selectedSkills.find(s => s.skill.id === result.item.id)) {
        setSelectedSkills([...selectedSkills, { skill: result.item, occ: result.parent }]);
      }
      // Auto select occupation if not set
      if (!selectedOccupation) {
        setSelectedOccupation(result.parent);
      }
    }
    setSearchTerm('');
  };

  const handlePublish = async () => {
    if (!title) {
      alert("กรุณากรอกหัวข้อปัญหา");
      return;
    }
    
    setIsSubmitting(true);
    
    const payload = {
      title,
      description,
      bountyPrize,
      workTypeId: selectedWorkType,
      occupationId: selectedOccupation?.id,
      skillTags: selectedSkills.map(s => s.skill.id),
      resourceType,
      resourceAmount
    };

    try {
      const res = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("บันทึกค่าหัวสำเร็จ!");
        router.push('/profile/bounty');
      } else {
        alert("เกิดข้อผิดพลาด: " + data.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      alert("Network Error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create Bounty Quest</h1>
      <p className="text-gray-500 mb-8">ตั้งค่าหัวปัญหาของคุณเพื่อหาผู้แก้ที่เหมาะสม</p>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 1: Core Problem & Taxonomy</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อปัญหา (Quest Title)</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="เช่น: ต้องการทีมพัฒนา MVP ภายใน 1 เดือน"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดปัญหา</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-4 min-h-[100px]"
              placeholder="อธิบายปัญหาของคุณอย่างละเอียด..."
            ></textarea>
          </div>

          {/* MAGIC SEARCH BOX */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Magic Search (Occupation & Skills)</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="พิมพ์ค้นหาอาชีพ หรือทักษะที่ต้องการ (เช่น สถาปนิก, React)..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {filteredResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredResults.map((res, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => selectResult(res)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b last:border-b-0"
                    >
                      <div>
                        <span className="font-medium">{res.item.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({res.type === 'occupation' ? res.parent.name : res.parent.name})
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${res.type === 'occupation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {res.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SELECTED CHIPS */}
          {(selectedOccupation || selectedSkills.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedOccupation && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <i className="fas fa-briefcase mr-2"></i> {selectedOccupation.name}
                  <button onClick={() => setSelectedOccupation(null)} className="ml-2 text-blue-500 hover:text-blue-700"><i className="fas fa-times"></i></button>
                </span>
              )}
              {selectedSkills.map(ss => (
                <span key={ss.skill.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <i className="fas fa-bolt mr-2"></i> {ss.skill.name}
                  <button onClick={() => removeSkill(ss.skill.id)} className="ml-2 text-green-500 hover:text-green-700"><i className="fas fa-times"></i></button>
                </span>
              ))}
            </div>
          )}

          {/* WORK TYPES PILLS */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">รูปแบบการทำงาน (Quick Filters)</label>
            <div className="flex flex-wrap gap-2">
              {workTypes.map(wt => {
                const isSelected = selectedWorkType === wt.id;
                return (
                  <button
                    key={wt.id}
                    onClick={() => toggleWorkType(wt.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition border ${
                      isSelected 
                        ? 'bg-gray-800 text-white border-gray-800' 
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {wt.name}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* STEP 2: Bounty & Escrow */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 2: ค่าหัว (Bounty Prize)</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">เงินรางวัลค่าหัว (THB)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-bold text-lg">฿</span>
              <input 
                type="number" 
                value={bountyPrize}
                onChange={e => setBountyPrize(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-red-500" 
                placeholder="50000"
              />
            </div>
          </div>
        </div>

        {/* STEP 3: Resource Pledge */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 3: ทรัพยากรค้ำประกัน (Resource Pledge)</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภททรัพยากร</label>
              <select 
                value={resourceType}
                onChange={e => setResourceType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="CASH">CASH (เงินสด)</option>
                <option value="LABOR">LABOR (แรงงาน)</option>
                <option value="MATERIAL">MATERIAL (วัตถุดิบ/สินค้า)</option>
                <option value="TOOL_SOFTWARE">TOOL_SOFTWARE (เครื่องมือ/ซอฟต์แวร์)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">มูลค่าประเมิน (THB)</label>
              <input 
                type="number" 
                value={resourceAmount}
                onChange={e => setResourceAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="มูลค่าที่ค้ำประกัน..."
              />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
            <i className="fas fa-lock text-red-600 mt-1 mr-3"></i>
            <div>
              <p className="text-sm text-red-800 font-medium">Smart Escrow Lock</p>
              <p className="text-xs text-red-700 mt-1">
                ระบบจะทำการล็อกเงินหรือทรัพยากรจำนวนนี้ไว้ใน Escrow Vault ทันทีที่ผู้แก้ปัญหารับมอบงาน เพื่อเป็นหลักประกันความน่าเชื่อถือ
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handlePublish}
            disabled={isSubmitting}
            className="bg-[#FF1A1A] text-white px-8 py-3 rounded-md hover:bg-red-700 transition font-bold text-lg disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังประกาศ...' : 'ประกาศค่าหัวปัญหา (Publish Bounty)'}
          </button>
        </div>
      </div>
    </div>
  )
}
