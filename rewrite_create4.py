import os
import re

file_path = "src/app/profile/bounty/create/page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the last `</div>\n      </main>\n    </div>\n    </div>\n  );\n}` with one more div
content = content.replace('</div>\n      </main>\n    </div>\n    </div>\n  );\n}', '</div>\n</div>\n      </main>\n    </div>\n    </div>\n  );\n}')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
