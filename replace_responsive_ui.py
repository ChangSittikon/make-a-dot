import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will rewrite the entire return statement.
parts = content.split('  return (', 1)
if len(parts) == 2:
    new_return = """  return ( 
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 text-gray-800 transition-all duration-300">
      <div className={`bg-brand-gray-light overflow-hidden relative flex transition-all duration-300 ${
        viewMode === 'mobile' 
          ? 'flex-col w-full h-[100dvh] sm:h-[850px] sm:w-[430px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900' 
          : 'flex-row w-full h-[100dvh] sm:h-[90vh] sm:w-full sm:max-w-6xl sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-300'
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
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm z-10 shrink-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className="font-bold text-sm text-gray-900">{activeIndustry?.name || "Loading..."}</h1>
                <p className="text-[10px] text-gray-500">จัดการโครงสร้างและตั้งค่าวงการ</p>
              </div>
              {viewMode === 'pc' && (
                <button onClick={() => setViewMode('mobile')} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors shrink-0">
                  <i className="fa-solid fa-mobile-screen text-xs"></i>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
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
                className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition shadow-sm flex items-center flex-1 justify-center"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-[10px] mr-1" /> AI สร้าง Flow
              </button>
              <a
                href="/"
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition shadow-sm flex items-center justify-center w-10"
              >
                <i className="fa-solid fa-play text-[10px]" />
              </a>
              {activeTab === 'FLOW' && (
                <button 
                  onClick={handleSave}
                  disabled={saving || !activeIndustryId}
                  className="px-3 py-1.5 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition shadow-sm shadow-brand-red/20 flex items-center flex-1 justify-center"
                >
                  {saving ? <i className="fa-solid fa-spinner fa-spin text-[10px] mr-1" /> : <i className="fa-solid fa-floppy-disk text-[10px] mr-1" />}
                  บันทึก
                </button>
              )}
            </div>

            <div className="flex mt-4 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('FLOW')}
                className={`pb-2 text-xs font-bold px-2 flex-1 text-center transition-colors relative ${activeTab === 'FLOW' ? 'text-brand-red' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Logic Map
                {activeTab === 'FLOW' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('SETTINGS')}
                className={`pb-2 text-xs font-bold px-2 flex-1 text-center transition-colors relative ${activeTab === 'SETTINGS' ? 'text-brand-red' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Settings
                {activeTab === 'SETTINGS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-t-full" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollable-content p-4 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl" />
                <span className="text-xs font-bold">กำลังโหลดข้อมูล...</span>
              </div>
            ) : activeTab === 'FLOW' ? (
              nodes.length > 0 ? (
                <div className={`space-y-4 pb-20 relative z-0 ${viewMode === 'pc' ? 'grid grid-cols-2 gap-4 space-y-0 items-start' : ''}`}>
                  <div className={`absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200 -z-10 ${viewMode === 'pc' ? 'hidden' : ''}`} />
                  {nodes.map((node, index) => (
                    <NodeCard 
                      key={node.id} 
                      number={index + 1}
                      label={`คำถามที่ ${index + 1}`}
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
                      dotColor={node.type === 'START' ? 'bg-brand-red' : 'bg-blue-500'}
                      onEdit={() => handleEdit(node)} 
                    />
                  ))}
                  
                  <div className={`pt-4 ${viewMode === 'mobile' ? 'pl-12' : 'col-span-2 mt-4'}`}>
                    <button 
                      onClick={() => {
                        const newNode: Node = {
                          id: crypto.randomUUID(),
                          type: 'QUESTION',
                          question: 'คำถามใหม่',
                          order: nodes.length,
                          options: []
                        };
                        setNodes([...nodes, newNode]);
                        setEditModalOpen(true);
                        setEditingNode(newNode);
                      }}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 text-xs font-bold hover:bg-white hover:border-brand-red hover:text-brand-red transition flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-plus" /> เพิ่มโหนดใหม่
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <i className="fa-solid fa-diagram-project text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-700">ยังไม่มี Flow ในวงการนี้</h3>
                  <p className="text-xs text-gray-500 mb-4">เริ่มต้นสร้างคำถามแรกของคุณ หรือให้ AI ช่วยสร้างโครงร่างให้</p>
                  
                  <button 
                    onClick={() => {
                      const newNode: Node = {
                        id: crypto.randomUUID(),
                        type: 'QUESTION',
                        question: 'คำถามเริ่มต้น',
                        order: 0,
                        options: []
                      };
                      setNodes([newNode]);
                      setEditModalOpen(true);
                      setEditingNode(newNode);
                    }}
                    className="w-full max-w-sm mx-auto bg-white border border-gray-200 text-gray-700 rounded-xl py-3 px-4 text-xs font-semibold shadow-sm hover:border-gray-300 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-pen-to-square text-gray-400" />
                      <span>สร้างคำถามด้วยตัวเอง</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-gray-500" />
                  </button>

                  <button 
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await fetch('/api/ai/seed-flow');
                        const data = await res.json();
                        if (data.nodes) {
                          setNodes(data.nodes.map((n: any, i: number) => ({ ...n, order: i })));
                        }
                      } catch (e) {
                        alert("Error loading AI JSON");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="w-full max-w-sm mx-auto bg-brand-red-50 border border-brand-red/20 text-brand-red rounded-xl py-3 px-4 text-xs font-semibold shadow-sm hover:bg-brand-red hover:text-white transition flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <i className={saving ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-wand-magic-sparkles"} />
                      <span>{saving ? 'กำลังประมวลผล...' : 'ให้น้องดอทช่วยสร้าง (AI)'}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-brand-red/50 group-hover:text-white/80" />
                  </button>
                </div>
              )
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-w-xl mx-auto">
                <h2 className="text-sm font-bold text-gray-900 mb-4">ตั้งค่าวงการ: {activeIndustry?.name}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ชื่อวงการ (Industry Name)
                    </label>
                    <input 
                      type="text" 
                      value={industryName}
                      onChange={e => setIndustryName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ไอคอน (FontAwesome Class)
                    </label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                        <i className={`${industryIcon} text-gray-600`} />
                      </div>
                      <input 
                        type="text" 
                        value={industryIcon}
                        onChange={e => setIndustryIcon(e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-red transition"
                        placeholder="fa-solid fa-music"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      หักส่วนแบ่ง Macro Fee (%)
                    </label>
                    <input 
                      type="number" 
                      value={macroFee}
                      onChange={e => setMacroFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-red transition"
                    />
                  </div>
                  
                  <button 
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="w-full mt-2 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าวงการ'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {editModalOpen && editingNode && (
        <EditModal 
          isOpen={editModalOpen} 
          onClose={() => { setEditModalOpen(false); setEditingNode(null); }}
          node={editingNode}
          targetOptions={targetOptionsForModal}
          onSave={handleSaveNode}
        />
      )}
    </div>
  );
}
"""
    new_content = parts[0] + new_return
    open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(new_content)
    print("Replaced UI with responsive Sidebar")
