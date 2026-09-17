import os
import re

file_path = "src/app/profile/bounty/create/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace closing divs correctly: 2 original </div> -> </div></main></div></div>
content = re.sub(r'</div>\s*</div>\s*\)\s*}\s*$', '</div>\n      </main>\n    </div>\n    </div>\n  );\n}', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
