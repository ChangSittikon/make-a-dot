import re
import os

filepath = 'src/app/profile/settings/flow-builder/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update state
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'FLOW' | 'SETTINGS'>('FLOW');",
    "const [activeTab, setActiveTab] = useState<'FLOW' | 'SETTINGS' | 'ALGORITHM'>('FLOW');"
)

# 2. Add Tab Button
tab_button_target = """                <button 
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Industry Settings
                </button>"""

algo_tab_button = """                <button 
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Industry Settings
                </button>
                <button 
                  onClick={() => setActiveTab('ALGORITHM')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'ALGORITHM' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fa-solid fa-atom mr-1" />
                  ตัวแปร & อัลกอริทึม
                </button>"""

content = content.replace(tab_button_target, algo_tab_button)

# 3. Add Tab Content
# Find the end of SETTINGS tab content:
# It's right before `</div>` and then `</main>` or similar.
# The structure is:
# {activeTab === 'FLOW' ? ( ... ) : ( ... SETTINGS CONTENT ... )}
# We'll change it to:
# {activeTab === 'FLOW' && ( ... )}
# {activeTab === 'SETTINGS' && ( ... )}
# {activeTab === 'ALGORITHM' && ( ... )}

# Wait, `content.replace` for the ternary is risky if nested.
# Let's see the structure first.
