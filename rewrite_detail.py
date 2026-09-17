import os
import re

file_path = "src/app/profile/bounty/[id]/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the outer container
content = content.replace('  return (\n    <div className="p-6 max-w-4xl mx-auto">',
                          '  return (\n    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-prompt sm:py-10">\n      <div className="w-full h-screen sm:w-[430px] sm:h-[900px] sm:rounded-[48px] sm:border-[14px] sm:border-black bg-brand-gray-light relative flex flex-col overflow-hidden shadow-2xl">\n      {/* Header */}\n      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm px-5 py-4 flex items-center justify-between">\n          <div className="flex items-center gap-4">\n            <Link href="/profile/bounty" className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">\n              <i className="fa-solid fa-arrow-left text-gray-600"></i>\n            </Link>\n            <div>\n              <h1 className="text-xl font-bold text-gray-900">รายละเอียดงาน</h1>\n              <p className="text-xs text-gray-500">Quest Detail</p>\n            </div>\n          </div>\n        </div>\n      <main className="flex-1 overflow-y-auto hide-scrollbar p-5">\n        <div className="mx-auto">')

# Modify grid structure to be single column for mobile
content = content.replace('<div className="grid grid-cols-3 gap-6">', '<div className="flex flex-col gap-6">')
content = content.replace('<div className="col-span-2 space-y-6">', '<div className="space-y-6">')

# Replace closing divs
content = re.sub(r'</div>\s*\);\s*}\s*$', '</div>\n      </main>\n    </div>\n    </div>\n  );\n}', content)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
