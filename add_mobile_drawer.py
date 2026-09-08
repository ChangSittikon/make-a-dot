import re

with open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state for mobileMenuOpen
content = content.replace(
    "const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('pc');",
    "const [viewMode, setViewMode] = useState<'mobile' | 'pc'>('pc');\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"
)

# Also need to import AnimatePresence and motion if not imported.
# It seems EditModal imports them, but we need them in page.tsx if we use them.
# Wait, Sidebar is a separate component, I can just render Sidebar inside a fixed div! No need for fancy AnimatePresence if it's too risky.
# Let's use simple CSS transitions or just a static fixed div overlay.
# Actually, an absolute div is perfect.

# 2. Replace the mobile header block
mobile_header_regex = r'\{viewMode === \'mobile\' && \(\s*<header className="bg-white border-b border-gray-200 shrink-0">.*?</header>\s*\)\}'

new_mobile_header = """        {viewMode === 'mobile' && (
          <>
            <header className="bg-white border-b border-gray-200 shrink-0 z-20 relative">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <i className="fa-solid fa-bars text-sm"></i>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-black rounded-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-brand-red rounded-full" />
                    </div>
                    <span className="font-bold text-sm">Flow Admin</span>
                  </div>
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
            </header>

            {/* Mobile Sidebar Drawer */}
            {mobileMenuOpen && (
              <div className="absolute inset-0 z-50 flex">
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="relative w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                  <Sidebar 
                    industries={industries}  
                    activeId={activeIndustryId || undefined}  
                    onSelect={(id) => {
                      setActiveIndustryId(id);
                      setMobileMenuOpen(false);
                    }} 
                  />
                </div>
              </div>
            )}
          </>
        )}"""

content = re.sub(mobile_header_regex, new_mobile_header, content, flags=re.DOTALL)

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Mobile sidebar drawer added")
