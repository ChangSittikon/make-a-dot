import re

filepath = 'src/app/profile/settings/flow-builder/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Import AlgorithmTab
if "import { AlgorithmTab }" not in content:
    content = content.replace(
        'import { EditModal } from "@/components/admin/EditModal";',
        'import { EditModal } from "@/components/admin/EditModal";\nimport { AlgorithmTab } from "@/components/admin/AlgorithmTab";'
    )

# 2. Add handleSaveOptionWeight
handle_save_node_str = "  const handleSaveNode = async "
handler = """  const handleSaveOptionWeight = async (optionId: string, weightJson: string) => {
    try {
      const res = await fetch(`/api/options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectorWeight: weightJson })
      });
      if (res.ok) {
        setNodes(prev => prev.map(n => ({
          ...n,
          options: n.options.map(o => o.id === optionId ? { ...o, vectorWeight: weightJson } : o)
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNode = async """

if "handleSaveOptionWeight" not in content:
    content = content.replace(handle_save_node_str, handler)

# 3. Patch state
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'FLOW' | 'SETTINGS'>('FLOW');",
    "const [activeTab, setActiveTab] = useState<'FLOW' | 'SETTINGS' | 'ALGORITHM'>('FLOW');"
)

# 4. Patch Tab Headers
old_header = """<button 
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`pb-2 text-xs font-bold border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-brand-red text-brand-red' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Industry Settings
                </button>"""
new_header = """<button 
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
                  ตัวแปรอัลกอริทึม
                </button>"""
content = content.replace(old_header, new_header)

# 5. Replace TERNARY with CONDITIONS
# First part: {activeTab === 'FLOW' ? ( -> {activeTab === 'FLOW' && (
content = content.replace("{activeTab === 'FLOW' ? (", "{activeTab === 'FLOW' && (")

# Second part: find the ) : ( that separates FLOW and SETTINGS body
# We know it's right before <div className="max-w-2xl bg-white
old_split = """              </div>
            ) : (
              <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">"""

new_split = """              </div>
            )}
            
            {activeTab === 'SETTINGS' && (
              <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 p-6">"""
content = content.replace(old_split, new_split)

# Third part: closing of SETTINGS and adding ALGORITHM
old_end = """                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>"""

new_end = """                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ALGORITHM' && (
              <AlgorithmTab 
                industryId={activeIndustryId!} 
                nodes={nodes as any} 
                onSaveOptionWeight={handleSaveOptionWeight} 
              />
            )}
          </div>
        </main>
      </div>"""
content = content.replace(old_end, new_end)


with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Flow Builder with Algorithm Tab!")
