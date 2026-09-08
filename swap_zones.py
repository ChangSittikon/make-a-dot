import re

content = open('src/components/admin/AgentHubClient.tsx', 'r', encoding='utf-8').read()

# I want to swap Zone 4 and Zone 3.
# The structure is currently:
# {/* Zone 4: Architecture */} ... </section>
# {/* Zone 3: Mystery Dots */} ... </section>

zone4_pattern = re.compile(r'(\{\/\* Zone 4\: Architecture \*\/\}[\s\S]*?<\/section>)')
zone3_pattern = re.compile(r'(\{\/\* Zone 3\: Mystery Dots \*\/\}[\s\S]*?<\/section>)')

z4_match = zone4_pattern.search(content)
z3_match = zone3_pattern.search(content)

if z4_match and z3_match:
    z4_text = z4_match.group(1)
    z3_text = z3_match.group(1)
    
    # We will replace the whole block containing both with Zone 3 first, then Zone 4
    # Find the bounds of both
    start_idx = min(z4_match.start(), z3_match.start())
    end_idx = max(z4_match.end(), z3_match.end())
    
    new_block = z3_text + "\n\n                " + z4_text
    
    new_content = content[:start_idx] + new_block + content[end_idx:]
    open('src/components/admin/AgentHubClient.tsx', 'w', encoding='utf-8').write(new_content)
    print("Swapped Zone 3 and 4")
else:
    print("Could not find zones")
