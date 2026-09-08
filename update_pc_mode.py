import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Change default state
content = content.replace(
    "const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('mobile');",
    "const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('pc');"
)

# 2. Change wrapper
old_wrapper = """  return ( 
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4 text-gray-800 transition-all duration-300">
      <div className={`bg-brand-gray-light overflow-hidden relative flex transition-all duration-300 ${
        viewMode === 'mobile' 
          ? 'flex-col w-full h-[100dvh] sm:h-[850px] sm:w-[430px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900' 
          : 'flex-row w-full h-[100dvh] sm:h-[90vh] sm:w-full sm:max-w-6xl sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-300'
      }`}>"""

new_wrapper = """  return ( 
    <div className={`min-h-screen bg-slate-100 flex items-center justify-center transition-all duration-300 text-gray-800 ${viewMode === 'mobile' ? 'p-0 sm:p-4' : 'p-0'}`}>
      <div className={`bg-brand-gray-light overflow-hidden relative flex transition-all duration-300 ${
        viewMode === 'mobile' 
          ? 'flex-col w-full h-[100dvh] sm:h-[850px] sm:w-[430px] sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-gray-900' 
          : 'flex-row w-full h-[100dvh]'
      }`}>"""

content = content.replace(old_wrapper, new_wrapper)

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Updated full screen PC mode")
