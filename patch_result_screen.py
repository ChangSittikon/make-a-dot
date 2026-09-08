import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Make universe dots fade out gracefully on isEnd
old_orbit = """          if (isEnd) {
            // ORBIT FORMATION (Elegant alignment around y:25)
            // Get index of active dots to distribute them evenly
            const activeIndex = activeDots.findIndex(d => d.id === dot.id);
            const totalActive = activeDots.length;
            const angle = (activeIndex / totalActive) * Math.PI * 2;
            const radiusX = 8;
            const radiusY = 6;
            
            return {
              ...dot,
              x: 50 + (radiusX * Math.cos(angle)),
              y: 25 + (radiusY * Math.sin(angle)),
              opacity: 0.8,
              color: '#FF1A1A',
              size: 5
            };
          }"""

new_fade = """          if (isEnd) {
            // FADE OUT UNIVERSE DOTS (Clean collapse)
            return {
              ...dot,
              opacity: 0,
              scale: 0,
            };
          }"""

content = content.replace(old_orbit, new_fade)

# 2. Add Nong Dot back to the Result Screen
old_result_title = """                <div className="mb-8 mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                    {displayedText}"""

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

new_result_title = """                <div className="mb-8 mt-4 text-center flex flex-col items-center">
                  <div className="h-8 mb-4">
                    <motion.div """ + nong_dot_transition + """
                      className="inline-flex items-center justify-center z-50"
                    >
                      <BreathingDot size={24} />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
                    {displayedText}"""

content = content.replace(old_result_title, new_result_title)

# 3. Add index to ResultCard map
old_result_card = """                      <ResultCard
                        key={i}
                        name={res.name}
                        tags={res.tags}
                        avatarUrl={res.avatarUrl}
                        verified={res.verified}
                      />"""

new_result_card = """                      <ResultCard
                        key={i}
                        index={i}
                        name={res.name}
                        tags={res.tags}
                        avatarUrl={res.avatarUrl}
                        verified={res.verified}
                      />"""

content = content.replace(old_result_card, new_result_card)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed Nong Dot missing and funny red dots!")
