# prisma/schema.prisma append
with open('prisma/schema.prisma', 'a', encoding='utf-8') as f:
    f.write('''
// ============================================================
// IDEA & CONCEPT SCRATCHPAD (กระดานจดดอท)
// ============================================================
model IdeaDot {
  id          String   @id @default(cuid())
  code        String   @unique // e.g., "DOT001"
  title       String   // e.g., "อาชีพ"
  description String   // Details
  status      String   @default("DRAFT") // "DRAFT", "IMPLEMENTED", "ARCHIVED"
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
''')
