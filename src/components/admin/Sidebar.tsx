"use client";

import { useState } from "react";

interface Industry {
  id: string;
  name: string;
  icon: string;
  nodeCount?: number;
}

const defaultIndustries: Industry[] = [
  { id: "1", name: "วงการดนตรี", icon: "fa-solid fa-music", nodeCount: 12 },
  { id: "2", name: "วิดีโอโปรดักชัน", icon: "fa-solid fa-clapperboard" },
  { id: "3", name: "เทคโนโลยี & IT", icon: "fa-solid fa-code" },
  { id: "4", name: "รับเหมาก่อสร้าง", icon: "fa-solid fa-helmet-safety" },
];

interface SidebarProps {
  industries?: Industry[];
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function Sidebar({ industries = defaultIndustries, activeId = "1", onSelect }: SidebarProps) {
  const [active, setActive] = useState(activeId);

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  const handleAddIndustry = async () => {
    const name = prompt("ชื่อวงการใหม่:");
    if (!name) return;
    try {
      const res = await fetch('/api/industries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, icon: "fa-solid fa-folder" })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("สร้างวงการไม่สำเร็จ");
      }
    } catch (e) {
      console.error(e);
    }
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
          กลับหน้าหลัก
        </a>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 shrink-0">
          หมวดหมู่วงการ (Industries)
        </p>
        <nav className="space-y-1 flex-1 overflow-y-auto scrollable-content pb-4">
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => handleSelect(ind.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                active === ind.id
                  ? "bg-brand-red-50 text-brand-red"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <i className={`${ind.icon} w-4 shrink-0`} />
                <span className="truncate">{ind.name}</span>
              </div>
              {ind.nodeCount !== undefined && active === ind.id && (
                <span className="bg-white text-gray-500 text-[9px] px-1.5 py-0.5 rounded border border-brand-red-100 shrink-0 ml-2">
                  {ind.nodeCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={handleAddIndustry} className="mt-2 shrink-0 w-full border border-dashed border-gray-300 text-gray-500 text-xs py-2 rounded-lg hover:bg-gray-50 hover:text-brand-black transition flex items-center justify-center gap-2">
          <i className="fa-solid fa-plus" /> เพิ่มวงการใหม่
        </button>
      </div>
    </aside>
  );
}
