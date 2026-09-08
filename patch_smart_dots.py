import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

idx_start = content.find('{/* Happy Bouncing Dots (At the bottom) */}')
idx_end = content.find('</div>', content.find('3 Friends on the right')) + 6  # Close the div

old_block = content[idx_start:idx_end]

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

new_block = """{/* The 3 Equal Founders (Smart & Minimal) */}
                    <div className="flex items-end justify-center gap-6 mt-10 mb-2 h-16 pointer-events-none">
                      
                      {/* Black Dot */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="inline-flex items-center justify-center z-40 mb-1"
                      >
                        <BreathingDot size={20} color="black" delay={0.15} />
                      </motion.div>
                      
                      {/* Nong Dot (Center - Red) */}
                      <motion.div """ + nong_dot_transition + """
                        className="inline-flex items-center justify-center z-50 mb-1"
                      >
                        <BreathingDot size={20} color="red" delay={0} />
                      </motion.div>

                      {/* Gray Dot */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className="inline-flex items-center justify-center z-40 mb-1"
                      >
                        <BreathingDot size={20} color="gray" delay={0.3} />
                      </motion.div>

                    </div>"""

content = content.replace(old_block, new_block)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Smart Dots!")
