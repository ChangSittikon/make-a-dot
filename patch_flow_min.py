import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Number of dots (from 40 to 20 for minimalism)
content = content.replace("length: 40", "length: 20")

# 2. Central dot and Universe center: from 40% to 25% to give space for text
content = content.replace("top-[40%]", "top-[25%]")
content = content.replace("mt-[45%]", "mt-[35%]")

# 3. Collapse Animation Math & Default Text
old_collapse = """      // QUANTUM COLLAPSE ANIMATION
      setUniverseDots(prevDots => {
        const activeDots = prevDots.filter(d => d.active);
        const killCount = Math.floor(activeDots.length * 0.4); // Kill 40% of remaining dots each step
        let killed = 0;

        return prevDots.map(dot => {
          if (!dot.active) return dot;
          
          if (!isEnd && killed < killCount && Math.random() > 0.4) {
            killed++;
            return { ...dot, active: false, opacity: 0 };
          }
          
          if (isEnd) {
            // SNAP TO CENTER on Result
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 8 + 4; // Tight circle
            return {
              ...dot,
              x: 50 + (radius * Math.cos(angle)),
              y: 40 + (radius * Math.sin(angle) * 0.5), // Oval shape
              opacity: 1,
              color: '#FF1A1A'
            };
          } else {
            // MOVE CLOSER on step
            const dx = 50 - dot.x;
            const dy = 40 - dot.y;
            return {
              ...dot,
              x: dot.x + dx * 0.35,
              y: dot.y + dy * 0.35,
              opacity: Math.min(0.8, dot.opacity + 0.15),
              color: Math.random() > 0.85 ? '#FF1A1A' : dot.color
            };
          }
        });
      });

      if (isEnd) {
        setShowOptions(false);
        setTimeout(() => {
          setDisplayedText("");
          setShowResults(true);
          typeText(targetNode?.question || "สมการความน่าจะเป็นยุบตัวสมบูรณ์...");
        }, 600);"""

new_collapse = """      // QUANTUM COLLAPSE ANIMATION (Minimalist)
      setUniverseDots(prevDots => {
        const activeDots = prevDots.filter(d => d.active);
        const killCount = Math.floor(activeDots.length * 0.3); // Kill 30% smoothly
        let killed = 0;

        return prevDots.map((dot, index) => {
          if (!dot.active) return dot;
          
          if (!isEnd && killed < killCount && Math.random() > 0.5) {
            killed++;
            return { ...dot, active: false, opacity: 0 };
          }
          
          if (isEnd) {
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
          } else {
            // GENTLE MOVE CLOSER
            const dx = 50 - dot.x;
            const dy = 25 - dot.y;
            return {
              ...dot,
              x: dot.x + dx * 0.25,
              y: dot.y + dy * 0.25,
              opacity: Math.min(0.6, dot.opacity + 0.1),
              color: Math.random() > 0.9 ? '#FF1A1A' : dot.color
            };
          }
        });
      });

      if (isEnd) {
        setShowOptions(false);
        setTimeout(() => {
          setDisplayedText("");
          setShowResults(true);
          typeText(targetNode?.question || "เราพบ 2 โอกาสที่ตรงกับทิศทางของคุณที่สุด");
        }, 600);"""

content = content.replace(old_collapse, new_collapse)

# 4. Remove ugly red shadow box
shadow_target = "boxShadow: dot.color === '#FF1A1A' ? '0 0 10px rgba(255,26,26,0.4)' : 'none'"
shadow_replacement = "boxShadow: dot.color === '#FF1A1A' ? '0 0 12px rgba(255,26,26,0.15)' : 'none'"
content = content.replace(shadow_target, shadow_replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched FlowApp layout and algorithm to be minimalist!")
