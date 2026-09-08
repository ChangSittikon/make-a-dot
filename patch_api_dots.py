import re

filepath = 'src/app/api/admin/idea-dots/route.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'const { code, title, description, status } = await req.json();', 
    'const { code, title, description, status, parentId } = await req.json();'
)

content = content.replace(
    "status: status || 'DRAFT'",
    "status: status || 'DRAFT',\n        parentId: parentId || null"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# Also update the PUT route
filepath_put = 'src/app/api/admin/idea-dots/[id]/route.ts'
with open(filepath_put, 'r', encoding='utf-8') as f:
    content_put = f.read()

content_put = content_put.replace(
    'const { title, description, status } = await req.json();',
    'const { title, description, status, parentId } = await req.json();'
)
content_put = content_put.replace(
    'data: { title, description, status }',
    'data: { title, description, status, parentId }'
)

with open(filepath_put, 'w', encoding='utf-8') as f:
    f.write(content_put)

print("Updated API routes for parentId")
