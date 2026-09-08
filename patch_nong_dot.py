import re

filepath = 'src/components/flow/FlowApp.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
content = content.replace(
    "const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);",
    "const [universeDots, setUniverseDots] = useState<FloatingDot[]>([]);\n  const [dotPosition, setDotPosition] = useState<'center' | 'text'>('center');"
)

# 2. Update typeText
type_text_target = """        clearInterval(interval);
        setIsTyping(false);
        setShowOptions(true);"""
type_text_replacement = """        clearInterval(interval);
        setIsTyping(false);
        setShowOptions(true);
        setDotPosition('text');"""
content = content.replace(type_text_target, type_text_replacement)

# 3. Update resetFlow
reset_flow_target = """    setCurrentNodeId(startNode.id);
    setShowResults(false);
    setShowOptions(false);"""
reset_flow_replacement = """    setCurrentNodeId(startNode.id);
    setShowResults(false);
    setShowOptions(false);
    setDotPosition('center');"""
content = content.replace(reset_flow_target, reset_flow_replacement)

# 4. Central Dot replacement
central_dot_target = """          {/* Central User Dot */}
          <div className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <BreathingDot size={24} />
          </div>"""
central_dot_replacement = """          {/* Central User Dot */}
          {dotPosition === 'center' && (
            <motion.div 
              layoutId="nong-dot"
              className="absolute left-[50%] top-[25%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50"
            >
              <BreathingDot size={24} />
            </motion.div>
          )}"""
content = content.replace(central_dot_target, central_dot_replacement)

# 5. Text Dot replacement
text_dot_target = """                {/* Question */}
                <div className="mb-8 min-h-[80px]">
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                    {displayedText}"""
text_dot_replacement = """                {/* Question */}
                <div className="mb-8 min-h-[80px] relative">
                  <div className="h-8 mb-3 flex items-end">
                    {dotPosition === 'text' && (
                      <motion.div 
                        layoutId="nong-dot"
                        className="inline-flex items-center justify-center z-50"
                      >
                        <BreathingDot size={18} />
                      </motion.div>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                    {displayedText}"""
content = content.replace(text_dot_target, text_dot_replacement)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched Nong Dot animation layout!")
