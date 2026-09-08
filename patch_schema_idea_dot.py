import re

filepath = 'prisma/schema.prisma'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_model = """model IdeaDot {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "DOT001"
  title       String   // e.g., "อาชีพ"
  description String   // Details
  status      String   @default("DRAFT") // "DRAFT", "IMPLEMENTED", "ARCHIVED"
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}"""

new_model = """model IdeaDot {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "DOT001"
  title       String   // e.g., "อาชีพ"
  description String   // Details
  status      String   @default("DRAFT") // "DRAFT", "IMPLEMENTED", "ARCHIVED"
  
  // Hierarchy (Folder/Sub-folder) support
  parentId    String?
  parent      IdeaDot?  @relation("DotHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    IdeaDot[] @relation("DotHierarchy")

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}"""

content = content.replace(old_model, new_model)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Prisma Schema for IdeaDot hierarchy")
