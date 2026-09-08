import re

filepath = 'src/app/profile/settings/idea-board/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the TreeNode to show Code, Status, and Buttons clearly
old_content_block = """            {/* Content */}
            <div className="flex-1 flex flex-col justify-center min-h-[24px]">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${hasChildren ? 'text-gray-900' : 'text-gray-700'}`}>
                  {node.title}
                </span>
                
                {/* Meta badges hidden until hover (for clean look) */}
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                   <span className="text-[9px] text-gray-500 bg-gray-100 px-1 rounded">{node.code}</span>
                   <button onClick={(e) => { e.stopPropagation(); openModal(node); }} className="text-gray-500 hover:text-gray-900 px-1"><i className="fa-solid fa-pen text-[10px]"></i></button>
                   <button onClick={(e) => { e.stopPropagation(); openModal(undefined, node.id); }} className="text-gray-500 hover:text-emerald-400 px-1"><i className="fa-solid fa-plus text-[10px]"></i></button>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(node.id); }} className="text-gray-500 hover:text-red-400 px-1"><i className="fa-solid fa-trash text-[10px]"></i></button>
                </div>
              </div>
              
              {/* Description (like strings in the screenshot) */}
              {node.description && (
                <div className="text-gray-500 text-[11px] italic mt-0.5">"{node.description}"</div>
              )}
            </div>"""

new_content_block = """            {/* Content */}
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
            </div>"""

content = content.replace(old_content_block, new_content_block)

# 2. Add Status back to the Modal Form
old_modal_textarea_block = """                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">รายละเอียด (Details/String)</label>
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder='e.g. "Top-down first"' 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 min-h-[80px] font-mono"
                  />
                </div>
                <button type="submit" className="w-full bg-brand-black text-white font-bold py-3 rounded-xl hover:bg-brand-red transition mt-2">
                  SAVE NODE
                </button>"""

new_modal_textarea_block = """                <div>
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
                </button>"""

content = content.replace(old_modal_textarea_block, new_modal_textarea_block)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored badges and modal status!")
