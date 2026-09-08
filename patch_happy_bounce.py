import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old middle connection block
idx_start = content.find('{/* The Dot Connection (Nong Dot + Friends) */}')
idx_end = content.find('{dummyResults.map(')
middle_block = content[idx_start:idx_end]
content = content.replace(middle_block, "")

# 2. Add the happy jumping dots below the reset button
nong_dot_transition = """
              layoutId="nong-dot"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 60,
                  damping: 11,
                  mass: 1.2
                }
              }}"""

old_button_block = """                    <button 
                      onClick={resetFlow}
                      className="mt-6 text-sm text-gray-500 font-medium hover:text-brand-red transition flex justify-center w-full"
                    >
                      เริ่มค้นหาใหม่
                    </button>"""

new_button_block = old_button_block + """
                    
                    {/* Happy Bouncing Dots (At the bottom) */}
                    <div className="flex items-end justify-center gap-3 mt-12 mb-4 h-16 pointer-events-none">
                      {/* 2 Friends on the left */}
                      {[0, 1].map((i) => (
                        <motion.div
                          key={`friend-l-${i}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: [0, -15, 0] 
                          }}
                          transition={{ 
                            opacity: { delay: 0.8 + (i * 0.1) },
                            scale: { delay: 0.8 + (i * 0.1) },
                            y: { repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 1.5 + (i * 0.1) } 
                          }}
                          className={`w-4 h-4 rounded-full shadow-sm ${['bg-blue-400', 'bg-indigo-400'][i]}`}
                        />
                      ))}
                      
                      {/* Nong Dot (Center) */}
                      <motion.div """ + nong_dot_transition + """
                        className="inline-flex items-center justify-center z-50 mb-1"
                      >
                        <motion.div
                          animate={{ y: [0, -20, 0] }}
                          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 1.7 }}
                        >
                          <BreathingDot size={22} />
                        </motion.div>
                      </motion.div>

                      {/* 3 Friends on the right */}
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={`friend-r-${i}`}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -15, 0] 
                          }}
                          transition={{ 
                            opacity: { delay: 1.0 + (i * 0.1) },
                            scale: { delay: 1.0 + (i * 0.1) },
                            y: { repeat: Infinity, duration: 0.5, ease: "easeInOut", delay: 1.8 + (i * 0.1) } 
                          }}
                          className={`w-4 h-4 rounded-full shadow-sm ${['bg-purple-400', 'bg-pink-400', 'bg-emerald-400'][i]}`}
                        />
                      ))}
                    </div>"""

content = content.replace(old_button_block, new_button_block)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved Nong Dot to the bottom and made them bounce happily!")
