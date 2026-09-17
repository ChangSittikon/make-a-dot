"use client";

import { useState } from "react";

export interface Industry {
  id: string;
  name: string;
  icon: string;
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
    const name = prompt(parentId ? "ตั้งชื่อหมวดหมู่ย่อย:" : "ตั้งชื่อหมวดหมู่ใหม่:");
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
        alert("เกิดข้อผิดพลาดในการสร้างหมวดหมู่");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Group industries
  const parents = industries.filter(i => !i.parentId);
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

  const renderItem = (ind: Industry, isChild = false) => {
    const isActive = active === ind.id;
    const hasChildren = !!childrenMap[ind.id]?.length;
    const isExpanded = !!expandedParents[ind.id];

    return (
      <div key={ind.id} className="w-full">
        <div className={`group flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isActive
            ? "bg-brand-red-50 text-brand-red"
            : "text-gray-600 hover:bg-gray-50"
        } ${isChild ? "pl-6" : ""}`}>
          <button
            onClick={() => handleSelect(ind.id)}
            className="flex-1 flex items-center gap-2 truncate text-left"
          >
            {hasChildren ? (
              <i 
                onClick={(e) => toggleExpand(ind.id, e)}
                className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'} w-4 text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer text-center`} 
              />
            ) : (
              <i className={`${ind.icon} w-4 shrink-0 text-center text-[10px]`} />
            )}
            <span className="truncate">{ind.name}</span>
          </button>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isChild && (
              <button 
                onClick={() => handleAddIndustry(ind.id)}
                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-brand-red rounded hover:bg-white"
                title="เพิ่มหมวดหมู่ย่อย"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
              </button>
            )}
            {ind.nodeCount !== undefined && isActive && (
              <span className="bg-white text-gray-500 text-[9px] px-1.5 py-0.5 rounded border border-brand-red-100 shrink-0">
                {ind.nodeCount}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5 border-l-2 border-gray-100 ml-4 pl-1">
            {childrenMap[ind.id].map(child => renderItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 h-full">
      <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-black rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-red rounded-full" />
            </div>
            <span className="font-bold text-sm">Flow Admin</span>
          </div>
        </div>
        <a href="/" className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors">
          <i className="fa-solid fa-house"></i>
          หน้าจอหลัก
        </a>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 shrink-0">
          หมวดหมู่วงการ (Industries)
        </p>
        <nav className="space-y-1 flex-1 overflow-y-auto scrollable-content pb-4">
          {parents.map(ind => renderItem(ind))}
        </nav>

        <button onClick={() => handleAddIndustry()} className="mt-2 shrink-0 w-full border border-dashed border-gray-300 text-gray-500 text-xs py-2 rounded-lg hover:bg-gray-50 hover:text-brand-black transition flex items-center justify-center gap-2">
          <i className="fa-solid fa-plus" /> เพิ่มวงการใหม่
        </button>
      </div>
    </aside>
  );
}
