import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'  return \(\s*<div.*?<main className="flex-1 flex flex-col bg-brand-gray-light relative">', re.DOTALL)

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

content = pattern.sub(new_wrapper, content)
open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print('Wrapper fixed')
