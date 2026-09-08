import sys

with open('src/app/profile/settings/flow-builder/page.tsx.bak', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State
content = content.replace(
    'const [industryIcon, setIndustryIcon] = useState("");',
    'const [industryIcon, setIndustryIcon] = useState("");\n  const [viewMode, setViewMode] = useState<\'mobile\' | \'pc\'>(\'pc\');'
)

# Replace the entire return statement to be absolutely safe.
start_idx = content.find('  return (')
if start_idx == -1:
    print("Could not find return")
    sys.exit(1)

# We want everything before return
header_code = content[:start_idx]

# We will just write the entire return statement.
new_return = """  return ( 
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
          <header className="bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-black rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-brand-red rounded-full" />
                </div>
                <span className="font-bold text-sm">Flow Admin</span>
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
            
            <div className="px-4 pb-3 overflow-x-auto scrollable-content flex gap-2">
              {industries.map(ind => (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustryId(ind.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 ${
                    activeIndustryId === ind.id 
                      ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className={ind.icon}></i>
                  {ind.name}
                </button>
              ))}
            </div>
          </header>
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
                  <button 
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/ai/seed-flow');
                        const data = await res.json();
                        if (data.nodes) {
                          const newNodes = data.nodes.map((n: any, i: number) => ({ ...n, order: nodes.length + i }));
                          setNodes([...nodes, ...newNodes]);
                        }
                      } catch (e) {
                        alert("Error loading AI JSON");
                      }
                    }}
                    className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition shadow-sm flex items-center shrink-0"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-[10px] mr-1" /> AI สร้าง Flow
                  </button>
                  <a
                    href="/"
                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition shadow-sm flex items-center shrink-0"
                  >
                    <i className="fa-solid fa-play text-[10px] mr-1" /> พรีวิว Flow
                  </a>
                  {activeTab === 'FLOW' ? (
                    <button 
                      onClick={handleSave}
                      disabled={saving || !activeIndustryId}
                      className="px-4 py-1.5 bg-brand-red text-white rounded-lg text-xs font-medium hover:bg-red-600 transition shadow-sm disabled:opacity-50"
                    >
                      {saving ? 'กำลังบันทึก...' : 'บันทึก Flow'}
                    </button>
                  ) : (
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
              </div>
            </header>
          )}

          <div className="flex-1 overflow-auto p-8 relative">
            {activeTab === 'FLOW' ? (
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
                        const res = await fetch('/api/ai/seed-flow');
                        const data = await res.json();
                        
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
                      <span>{saving ? 'กำลังประมวลผล...' : 'ให้น้องดอทช่วยสร้าง (AI)'}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-brand-red/50 group-hover:text-white/80" />
                  </button>
                </div>
              </div>
            ) : (
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
                </div>
              </div>
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
"""

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(header_code + new_return)
print("Complete safe rewrite")
