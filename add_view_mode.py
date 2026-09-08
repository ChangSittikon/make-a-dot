import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add viewMode state
content = content.replace(
    'const [industryIcon, setIndustryIcon] = useState("");',
    'const [industryIcon, setIndustryIcon] = useState("");\n  const [viewMode, setViewMode] = useState<\'mobile\' | \'pc\'>(\'mobile\');'
)

# 2. Update wrapper
old_wrapper = """  return ( 
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 text-gray-800">
      <div className="w-full h-[100dvh] sm:h-[850px] sm:w-[430px] bg-brand-gray-light sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] sm:border-gray-900">"""

new_wrapper = """  return ( 
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 text-gray-800 transition-all duration-300">
      <div className={`bg-brand-gray-light overflow-hidden relative flex flex-col transition-all duration-300 ${
        viewMode === 'mobile' 
          ? 'w-full h-[100dvh] sm:h-[850px] sm:w-[430px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900' 
          : 'w-full h-[100dvh] sm:h-[90vh] sm:w-full sm:max-w-5xl sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-300'
      }`}>"""

content = content.replace(old_wrapper, new_wrapper)

# 3. Add toggle button
old_buttons = """            <a href="/" className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
              <i className="fa-solid fa-house text-xs"></i>
            </a>"""

new_buttons = """            <div className="flex gap-2">
              <button onClick={() => setViewMode(viewMode === 'mobile' ? 'pc' : 'mobile')} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
                <i className={`fa-solid ${viewMode === 'mobile' ? 'fa-desktop' : 'fa-mobile-screen'} text-xs`}></i>
              </button>
              <a href="/" className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors">
                <i className="fa-solid fa-house text-xs"></i>
              </a>
            </div>"""

content = content.replace(old_buttons, new_buttons)

# Also fix the grid behavior in PC mode (optional, but good for UX)
# The nodes list is currently space-y-4. In PC mode, it might be better as a grid, or just wider NodeCards.
# The NodeCard component already takes `gridCols` as a prop if we want it. But keeping it wide is fine.

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Updated viewMode")
