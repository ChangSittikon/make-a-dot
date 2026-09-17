import os
import re

file_path = "src/app/profile/bounty/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the outer container
content = content.replace('<div className="min-h-screen bg-brand-gray-light font-prompt">',
                          '<div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">\n      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-brand-gray-light relative flex flex-col overflow-hidden shadow-2xl">')

# Replace Header container
content = content.replace('<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">',
                          '<div className="px-5 py-4 flex items-center justify-between">')
content = content.replace('<div className="bg-white border-b border-gray-200 sticky top-0 z-10">',
                          '<div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">')

# Header button
content = content.replace('<Link href="/profile/bounty/create" className="bg-brand-red text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-700 transition flex items-center gap-2 shadow-sm text-sm">',
                          '<Link href="/profile/bounty/create" className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-full hover:bg-red-700 transition shadow-sm">')
content = content.replace('<i className="fa-solid fa-plus"></i> แจ้งปัญหา',
                          '<i className="fa-solid fa-plus"></i>')

# Replace Main container
content = content.replace('      {/* Main Content */}\n      <div className="max-w-5xl mx-auto px-4 py-8">',
                          '      {/* Main Content */}\n      <main className="flex-1 overflow-y-auto hide-scrollbar p-5">\n        <div className="mx-auto">')

# Close the wrapper properly
# We replaced 1 wrapper with 2 `<div className="flex..."><div className="w-full...">`
# The main content was `<div class="max-w-5xl..">`, now it is `<main><div class="mx-auto">`.
# So we need to change the last `</div>\n    </div>` to `</div>\n      </main>\n    </div>\n    </div>`
content = re.sub(r'</div>\s*</div>\s*\);\s*}\s*$', '</div>\n      </main>\n    </div>\n    </div>\n  );\n}', content)

# Also remove md:grid-cols-2 to force 1 column for mobile view
content = content.replace('md:grid-cols-2', 'grid-cols-1')
content = content.replace('text-2xl font-bold', 'text-xl font-bold')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
