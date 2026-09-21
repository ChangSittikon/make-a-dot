"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import { motion, AnimatePresence } from 'framer-motion';

interface IdeaDot {
  id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  parentId: string | null;
  createdAt: string;
}

interface IdeaTreeItem extends IdeaDot {
  children: IdeaTreeItem[];
}

export default function IdeaBoardPage() {
  const [dots, setDots] = useState<IdeaDot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [parentId, setParentId] = useState<string | null>(null);

  const fetchDots = async () => {
    try {
      const res = await fetch('/api/admin/idea-dots');
      if (res.ok) {
        const data = await res.json();
        setDots(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDots();
  }, []);

  // Build tree
  const buildTree = (allItems: IdeaDot[], parentId: string | null = null): IdeaTreeItem[] => {
    return allItems
      .filter(d => d.parentId === parentId)
      // Sort by creation or however you want
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(d => ({
        ...d,
        children: buildTree(allItems, d.id)
      }));
  };

  const tree = buildTree(dots);

  const openModal = (dot?: IdeaDot, newParentId?: string | null) => {
    if (dot) {
      setEditingId(dot.id);
      setCode(dot.code);
      setTitle(dot.title);
      setDescription(dot.description);
      setStatus(dot.status);
      setParentId(dot.parentId);
    } else {
      setEditingId(null);
      setCode('');
      setTitle('');
      setDescription('');
      setStatus('DRAFT');
      setParentId(newParentId || null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { code, title, description, status, parentId };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/admin/idea-dots/${editingId}` : '/api/admin/idea-dots';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchDots();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save dot", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบดอทนี้? (ดอทย่อยทั้งหมดจะถูกลบด้วย)')) return;
    try {
      const res = await fetch(`/api/admin/idea-dots/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDots();
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  // Tree Render Component
  const TreeNode = ({ node, level = 0, isLast = false }: { node: IdeaTreeItem, level?: number, isLast?: boolean }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children.length > 0;
    
    // UI mapping for tree lines
    const indentGuides = Array.from({ length: level }).map((_, i) => (
      <div key={i} className="w-5 h-full border-l border-gray-300 absolute left-0" style={{ transform: `translateX(${i * 20}px)` }}></div>
    ));

    return (
      <div className="relative font-mono text-[13px] text-gray-800 group">
        
        {/* Connection lines for the current item */}
        <div className="absolute left-0 top-0 h-full w-[20px] pointer-events-none" style={{ transform: `translateX(${level * 20}px)` }}>
           {level > 0 && (
             <>
               <div className={`absolute top-0 border-l border-gray-300 ${isLast ? 'h-[18px]' : 'h-full'}`}></div>
               <div className="absolute top-[18px] left-0 w-[12px] border-t border-gray-300"></div>
             </>
           )}
        </div>

        <div className="flex items-start py-1 relative z-10" style={{ paddingLeft: `${level * 20 + (level > 0 ? 16 : 0)}px` }}>
          <div className="flex items-center gap-2 cursor-pointer w-full group/item" onClick={() => setExpanded(!expanded)}>
            
            {/* Icon */}
            <span className="text-base select-none shrink-0" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
              {hasChildren ? (expanded ? '📂' : '📁') : '📄'}
            </span>
            
            {/* Content */}
            <div className="flex-1 flex flex-col justify-center min-h-[24px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`font-bold ${hasChildren ? 'text-gray-900' : 'text-gray-700'}`}>
                  {node.title}
                </span>
                
                {/* Meta Badges (Always visible) */}
                <div className="flex items-center gap-1">
                   <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                     {node.code}
                   </span>
                   
                   {/* Status Badge */}
                   <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                       node.status === 'IMPLEMENTED' ? 'bg-green-50 text-green-600 border-green-200' :
                       node.status === 'ARCHIVED' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                       'bg-amber-50 text-amber-600 border-amber-200'
                   }`}>
                     {node.status === 'IMPLEMENTED' && '🟢'}
                     {node.status === 'ARCHIVED' && '⚪'}
                     {node.status === 'DRAFT' && '🟠'}
                     {node.status}
                   </span>
                </div>

                {/* Actions (Visible on hover for desktop, but also easily tapped on mobile if we make it partially visible. Let's make it visible but faded) */}
                <div className="flex items-center gap-2 ml-auto opacity-30 group-hover/item:opacity-100 transition-opacity">
                   <button onClick={(e) => { e.stopPropagation(); openModal(node); }} className="text-gray-500 hover:text-blue-500"><i className="fa-solid fa-pen text-[11px]"></i></button>
                   <button onClick={(e) => { e.stopPropagation(); openModal(undefined, node.id); }} className="text-gray-500 hover:text-emerald-500"><i className="fa-solid fa-plus text-[11px]"></i></button>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} className="text-gray-500 hover:text-red-500"><i className="fa-solid fa-trash text-[11px]"></i></button>
                </div>
              </div>
              
              {/* Description (like strings in the screenshot) */}
              {node.description && (
                <div className="text-gray-500 text-[11px] italic mt-0.5">"{node.description}"</div>
              )}
            </div>
          </div>
        </div>

        {/* Children Render */}
        <AnimatePresence>
          {expanded && hasChildren && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
               {node.children.map((child, index) => (
                 <TreeNode key={child.id} node={child} level={level + 1} isLast={index === node.children.length - 1} />
               ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10 transition-colors">
      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-white relative flex flex-col overflow-hidden shadow-2xl">
        
        <header className="px-5 py-4 flex items-center justify-between z-20 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Link href="/profile/settings" className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className="text-base font-bold text-gray-900">กระดานจดดอท (Tree View)</h1>
              <p className="text-[10px] text-gray-500 font-mono">/root/ideas/</p>
            </div>
          </div>
          <button 
            onClick={() => openModal()}
            className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-900 hover:text-white transition flex items-center justify-center"
          >
            <i className="fa-solid fa-plus text-xs"></i>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto scrollable-content p-5 pb-32">
          {loading ? (
            <div className="text-center py-10 text-gray-400"><i className="fa-solid fa-circle-notch fa-spin"></i></div>
          ) : tree.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-gray-700 font-bold text-sm">โฟลเดอร์ว่างเปล่า</h3>
              <p className="text-xs text-gray-500 mt-2">กดปุ่ม + ด้านบนเพื่อเพิ่มไอเดียแรก (Root)</p>
            </div>
          ) : (
            <div className="flex flex-col relative pl-1">
              {/* Root guide line for aesthetic */}
              <div className="absolute left-2.5 top-2 bottom-4 border-l border-gray-200 pointer-events-none z-0"></div>
              {tree.map((node, i) => (
                <TreeNode key={node.id} node={node} isLast={i === tree.length - 1} />
              ))}
            </div>
          )}
        </main>
        
        {/* Dark Modal for Tree Theme */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-end bg-gray-50/40 sm:items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10">
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900">{editingId ? 'แก้ไขดอท' : 'สร้างดอทใหม่'}</h2>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {parentId && (
                  <div>
                    <label className="block text-[10px] font-mono text-gray-500 mb-1">Parent ID</label>
                    <div className="text-xs text-emerald-400 font-mono bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">{parentId}</div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">รหัส (Code)</label>
                    <input 
                      type="text" 
                      value={code} 
                      onChange={e => setCode(e.target.value)}
                      placeholder="e.g. DOT001" 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gray-500 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">ชื่อโฟลเดอร์/ไอเท็ม (Title)</label>
                  <input 
                    type="text" 
                    required
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Technical Analysis" 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">รายละเอียด (Details/String)</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder='e.g. "Top-down first"' 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 min-h-[80px] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">สถานะ</label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-gray-500"
                  >
                    <option value="DRAFT">🟠 DRAFT (กำลังคิด/แบบร่าง)</option>
                    <option value="IMPLEMENTED">🟢 IMPLEMENTED (ทำเสร็จแล้ว)</option>
                    <option value="ARCHIVED">⚪ ARCHIVED (เก็บไว้ก่อน)</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-brand-black text-white font-bold py-3 rounded-xl hover:bg-brand-red transition mt-2">
                  SAVE NODE
                </button>
              </form>
            </div>
          </div>
        )}

        <BottomTabBar />
      </div>
    </div>
  );
}
