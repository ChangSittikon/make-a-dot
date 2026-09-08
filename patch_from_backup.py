import re

with open('src/app/profile/settings/flow-builder/page.tsx.bak', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add viewMode state
content = content.replace(
    'const [industryIcon, setIndustryIcon] = useState("");',
    'const [industryIcon, setIndustryIcon] = useState("");\n  const [viewMode, setViewMode] = useState<\'mobile\' | \'pc\'>(\'pc\');'
)

# 2. Replace the main wrapper and Sidebar to support viewMode
old_wrapper = """  return ( 
    <div className="flex h-screen overflow-hidden text-gray-800" style={{ backgroundColor: '#F3F4F6' }}> 
      {/* Sidebar */} 
      <Sidebar  
        industries={industries}  
        activeId={activeIndustryId || undefined}  
        onSelect={setActiveIndustryId}  
      /> 
 
      {/* Main Canvas */} 
      <main className="flex-1 flex flex-col bg-brand-gray-light relative">"""

new_wrapper = """  return ( 
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
        <main className="flex-1 flex flex-col relative overflow-hidden">"""

content = content.replace(old_wrapper, new_wrapper)

# 3. Add toggle button in PC mode header (the original header)
old_pc_header = """            <div className="flex gap-2"> 
              <a 
                href="/" 
                className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition shadow-sm flex items-center" 
              > 
                <i className="fa-solid fa-play text-[10px] mr-1" /> พรีวิว Flow 
              </a>"""

new_pc_header = """            <div className="flex gap-2"> 
              {viewMode === 'pc' && (
                <button onClick={() => setViewMode('mobile')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center shrink-0">
                  <i className="fa-solid fa-mobile-screen text-xs mr-1"></i> โหมดมือถือ
                </button>
              )}
              
              {/* Inject the AI Fetch Seed Button for user to easily test AI generated JSON */}
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
              </a>"""

# Handle encoding issues where the original file has weird thai chars in powershell output. I will use regex to find the right spot.
# Actually, I can just use string replace since I'm in python reading utf-8.
import sys

# Replace the "พรีวิว Flow" block safely
a_tag_regex = r'<a\s+href="\/"\s+className="[^"]*"\s*>\s*<i className="fa-solid fa-play text-\[10px\] mr-1" /> พรีวิว Flow\s*</a>'
match = re.search(a_tag_regex, content)
if match:
    original_a_tag = match.group(0)
    injected_buttons = """              {viewMode === 'pc' && (
                <button onClick={() => setViewMode('mobile')} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center shrink-0">
                  <i className="fa-solid fa-mobile-screen text-xs mr-1"></i> โหมดมือถือ
                </button>
              )}
              
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
              """
    content = content.replace(original_a_tag, injected_buttons + original_a_tag)
else:
    print("Could not find the a tag for preview")

# 4. Hide PC header in mobile mode
header_start_regex = r'<header className="bg-white border-b border-gray-200 px-6 pt-4 shadow-sm z-10 flex flex-col">'
content = re.sub(header_start_regex, r'{viewMode === "pc" && (<header className="bg-white border-b border-gray-200 px-6 pt-4 shadow-sm z-10 flex flex-col">', content)

header_end_regex = r'</header>'
# Only replace the first </header> which corresponds to the PC header
content = content.replace('</header>', '</header>)}', 1)

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Restored from backup and applied viewMode patches")
