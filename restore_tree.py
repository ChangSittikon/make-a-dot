import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace everything inside `activeTab === 'FLOW' ? ( ... ) : (`

start_marker = "            ) : activeTab === 'FLOW' ? ("
end_marker = "            ) : ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx + len(start_marker))

if start_idx != -1 and end_idx != -1:
    new_flow_content = """            ) : activeTab === 'FLOW' ? (
              <div className="relative max-w-3xl mx-auto pb-32">
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
                  
                  {/* 1. Manual */}
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

                  {/* 2. Default Preset (Music Industry) */}
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

                  {/* 3. AI (Nong Dot) */}
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
"""
    
    new_content = content[:start_idx] + new_flow_content + content[end_idx:]
    open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(new_content)
    print("Restored original tree rendering and buttons")
else:
    print("Could not find replacement block")
