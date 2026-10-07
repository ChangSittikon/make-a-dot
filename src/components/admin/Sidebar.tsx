"use client";

import { useState } from "react";
import Link from "next/link";

export interface Industry {
  id: string;
  name: string;
  icon: string;
  order?: number;
  nodeCount?: number;
  parentId?: string | null;
}

const defaultIndustries: Industry[] = [];

interface SidebarProps {
  industries?: Industry[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function Sidebar({ industries = defaultIndustries, activeId = "1", onSelect }: SidebarProps) {
  const [active, setActive] = useState(activeId);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedParents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddIndustry = async (parentId?: string) => {
    const name = prompt(parentId ? "เพิ่มหมวดหมู่ย่อย:" : "เพิ่มหมวดหมู่ใหม่:");
    if (!name) return;
    try {
      const res = await fetch('/api/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon: "fa-solid fa-folder", parentId: parentId || null })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Separate System Flows and DOT017 Industries
  const systemFlows = industries.filter(i => (i.order !== undefined && i.order < 0) || i.name.includes("หน้าหลัก") || i.name.includes("แจ้งปัญหา"));
  const dotIndustries = industries.filter(i => !systemFlows.some(sf => sf.id === i.id) && !i.parentId);
  
  // Sort dotIndustries strictly by order (1..12)
  dotIndustries.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const childrenMap = industries.reduce((acc, curr) => {
    if (curr.parentId) {
      if (!acc[curr.parentId]) acc[curr.parentId] = [];
      acc[curr.parentId].push(curr);
    }
    return acc;
  }, {} as Record<string, Industry[]>);

  // Initialize expanded state for parents that contain the active child
  if (activeId && Object.keys(expandedParents).length === 0) {
    const activeItem = industries.find(i => i.id === activeId);
    if (activeItem?.parentId) {
      setExpandedParents({ [activeItem.parentId]: true });
    }
  }

  const renderItem = (ind: Industry, indexNumber?: number, isChild = false) => {
    const isActive = active === ind.id;
    const hasChildren = !!childrenMap[ind.id]?.length;
    const isExpanded = !!expandedParents[ind.id];

    return (
      <div key={ind.id} className="w-full mb-1">
        <div className={`group flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
          isActive
            ? "bg-red-50/80 text-brand-red font-bold shadow-2xs border border-brand-red/20"
            : "text-gray-700 hover:bg-gray-100/70 border border-transparent"
        } ${isChild ? "pl-7" : ""}`}>
          <button
            onClick={() => handleSelect(ind.id)}
            className="flex-1 flex items-center gap-2 truncate text-left"
          >
            {/* Number badge separated from name */}
            {indexNumber !== undefined && (
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-colors ${
                isActive 
                  ? "bg-brand-red text-white" 
                  : "bg-gray-200/70 text-gray-500 group-hover:bg-gray-300 group-hover:text-gray-700"
              }`}>
                {String(indexNumber).padStart(2, '0')}
              </span>
            )}

            {hasChildren ? (
              <i 
                onClick={(e) => toggleExpand(ind.id, e)}
                className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'} w-4 text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer text-center shrink-0`} 
              />
            ) : (
              <i className={`${ind.icon || "fa-solid fa-folder"} w-4 shrink-0 text-center text-[11px] ${isActive ? 'text-brand-red' : 'text-gray-400'}`} />
            )}
            <span className="truncate text-xs">{ind.name}</span>
          </button>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isChild && (
              <button 
                onClick={() => handleAddIndustry(ind.id)}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-brand-red rounded hover:bg-white"
                title="เพิ่มหมวดย่อย"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
              </button>
            )}
            {ind.nodeCount !== undefined && isActive && (
              <span className="bg-white text-brand-red text-[9px] font-bold px-1.5 py-0.5 rounded border border-brand-red/20 shrink-0">
                {ind.nodeCount}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5 border-l-2 border-gray-100 ml-4 pl-1">
            {childrenMap[ind.id].map((child, cIdx) => renderItem(child, undefined, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-68 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 h-full">
      <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-black rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-red rounded-full" />
            </div>
            <span className="font-bold text-sm text-gray-900">Flow Admin</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-colors">
            <i className="fa-solid fa-house text-[10px]"></i>
            หน้าหลัก
          </Link>
          <Link href="/admin/taxonomy" className="flex items-center justify-center gap-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-brand-red rounded-lg text-[11px] font-bold transition-colors">
            <i className="fa-solid fa-tags text-[10px]"></i>
            Taxonomy
          </Link>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col min-h-0 overflow-y-auto scrollable-content">
        
        {/* Section 1: System Flows */}
        {systemFlows.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                โฟลว์ระบบ (System Flows)
              </span>
              <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.2 rounded">
                ระบบ
              </span>
            </div>
            <nav className="space-y-0.5">
              {systemFlows.map(sf => renderItem(sf))}
            </nav>
          </div>
        )}

        {/* Section 2: DOT017 12 Industries with Clean Sequential Numbering */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              12 สายงานมาตรฐาน (DOT017)
            </span>
            <span className="text-[9px] bg-red-50 text-brand-red font-bold px-1.5 py-0.2 rounded border border-red-100">
              12 ลำดับ
            </span>
          </div>
          <nav className="space-y-0.5">
            {dotIndustries.map((ind, idx) => {
              const num = ind.order && ind.order > 0 ? ind.order : idx + 1;
              return renderItem(ind, num);
            })}
          </nav>
        </div>

        <button onClick={() => handleAddIndustry()} className="mt-4 shrink-0 w-full border border-dashed border-gray-300 text-gray-500 text-xs py-2 rounded-xl hover:bg-gray-50 hover:text-brand-black transition flex items-center justify-center gap-2">
          <i className="fa-solid fa-plus text-[10px]" /> เพิ่มสายงานใหม่
        </button>
      </div>
    </aside>
  );
}
