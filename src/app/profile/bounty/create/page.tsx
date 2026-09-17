"use client";

import React, { useState, useEffect } from 'react';

// Types based on Prisma models
type WorkType = { id: string; name: string };
type SkillTag = { id: string; name: string };
type Occupation = { id: string; name: string; skillTags: SkillTag[] };
type Industry = { id: string; name: string; occupations: Occupation[] };

export default function CreateBountyPage() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selections
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedOccupations, setSelectedOccupations] = useState<{occ: Occupation, ind: Industry}[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<{skill: SkillTag, occ: Occupation}[]>([]);

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
    setSelectedWorkTypes(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const removeOcc = (id: string) => setSelectedOccupations(prev => prev.filter(o => o.occ.id !== id));
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
      if (!selectedOccupations.find(o => o.occ.id === result.item.id)) {
        setSelectedOccupations([...selectedOccupations, { occ: result.item, ind: result.parent }]);
      }
    } else {
      if (!selectedSkills.find(s => s.skill.id === result.item.id)) {
        setSelectedSkills([...selectedSkills, { skill: result.item, occ: result.parent }]);
      }
    }
    setSearchTerm('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Create Bounty Quest</h1>
      <p className="text-gray-500 mb-8">ตั้งค่าหัวปัญหาของคุณเพื่อหาผู้แก้ที่เหมาะสม</p>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Step 1: Core Problem & Taxonomy</h2>
          
          <textarea 
            className="w-full border border-gray-300 rounded-md p-4 min-h-[120px] mb-4"
            placeholder="อธิบายปัญหาของคุณอย่างละเอียด..."
          ></textarea>

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
          {(selectedOccupations.length > 0 || selectedSkills.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedOccupations.map(so => (
                <span key={so.occ.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  <i className="fas fa-briefcase mr-2"></i> {so.occ.name}
                  <button onClick={() => removeOcc(so.occ.id)} className="ml-2 text-blue-500 hover:text-blue-700"><i className="fas fa-times"></i></button>
                </span>
              ))}
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
                const isSelected = selectedWorkTypes.includes(wt.id);
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
          <h2 className="text-lg font-semibold mb-4">Step 2: Bounty & Escrow</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">เงินรางวัลค่าหัว (THB)</label>
              <input type="number" className="w-full border border-gray-300 rounded-md px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">รูปแบบผลตอบแทน</label>
              <select className="w-full border border-gray-300 rounded-md px-4 py-2">
                <option>CASH</option>
                <option>EQUITY</option>
                <option>RESOURCE_SWAP</option>
              </select>
            </div>
          </div>
          <div className="mt-4 bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-sm text-red-800 font-medium">
              <i className="fas fa-lock mr-2"></i>
              ระบบจะทำการล็อกเงินจำนวนนี้ไว้ใน Escrow ทันทีที่ผู้ให้รับมอบงาน เพื่อเป็นหลักประกัน
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#FF1A1A] text-white px-6 py-3 rounded-md hover:bg-red-700 transition font-medium">
            Publish Bounty
          </button>
        </div>
      </div>
    </div>
  )
}
