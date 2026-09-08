import re

content = open('src/app/profile/settings/flow-builder/page.tsx', 'r', encoding='utf-8').read()

button_html = """
              <button 
                onClick={() => alert('ฟีเจอร์ AI Auto-Generate กำลังเชื่อมต่อกับไฟล์ JSON ที่สร้างไว้')}
                className="px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition shadow-sm flex items-center mr-2"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-[10px] mr-1" /> ใช้ AI สร้าง Flow ของวงการนี้
              </button>
              <a 
"""

content = content.replace('<a \n                href={`/flow?industryId=${activeIndustryId}`}', button_html + '<a \n                href={`/flow?industryId=${activeIndustryId}`}')

open('src/app/profile/settings/flow-builder/page.tsx', 'w', encoding='utf-8').write(content)
print("Button added")
