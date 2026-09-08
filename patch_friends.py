import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Nong Dot from top
old_top_dot = """                <div className="mb-8 mt-4 text-center flex flex-col items-center">
                  <div className="h-8 mb-4">
                    <motion.div 
              layoutId="nong-dot"
              transition={{
                layout: {
                  type: "spring",
                  stiffness: 60,
                  damping: 11,
                  mass: 1.2
                }
              }}
                      className="inline-flex items-center justify-center z-50"
                    >
                      <BreathingDot size={24} />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">"""

new_top_dot = """                <div className="mb-6 mt-8 text-center flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">"""

content = content.replace(old_top_dot, new_top_dot)

# 2. Add Nong Dot + Friends between text and cards
old_cards_container = """                {!isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4"
                  >"""

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

new_cards_container = """                {!isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    
                    {/* The Dot Connection (Nong Dot + Friends) */}
                    <div className="flex items-center justify-center gap-3 mb-2 h-10">
                      {/* Friend Dot 1 */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-4 h-4 rounded-full bg-indigo-500 shadow-md"
                      />
                      
                      {/* Connecting Line 1 */}
                      <motion.div 
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                        className="w-4 h-[2px] bg-gray-200 origin-right"
                      />

                      {/* Nong Dot (Center) */}
                      <motion.div """ + nong_dot_transition + """
                        className="inline-flex items-center justify-center z-50"
                      >
                        <BreathingDot size={20} />
                      </motion.div>

                      {/* Connecting Line 2 */}
                      <motion.div 
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                        className="w-4 h-[2px] bg-gray-200 origin-left"
                      />

                      {/* Friend Dot 2 */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, x: 20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-4 h-4 rounded-full bg-emerald-500 shadow-md"
                      />
                    </div>
"""

content = content.replace(old_cards_container, new_cards_container)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Moved Nong Dot down and added friends!")
