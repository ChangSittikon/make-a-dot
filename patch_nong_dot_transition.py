import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the transition
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

# 1. Patch center dot
center_dot_target = """              layoutId="nong-dot"
              className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50" """

center_dot_replacement = nong_dot_transition + """\n              className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50" """

content = content.replace(center_dot_target, center_dot_replacement)

# 2. Patch text dot
text_dot_target = """                      <motion.div 
                        layoutId="nong-dot"
                        className="inline-flex items-center justify-center z-50"
                      >"""

text_dot_replacement = """                      <motion.div """ + nong_dot_transition + """\n                        className="inline-flex items-center justify-center z-50"\n                      >"""

content = content.replace(text_dot_target, text_dot_replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Nong Dot jump transition!")
