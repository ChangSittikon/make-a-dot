const fs = require('fs');
const newRule = `
---

## [CORE RULE] SAFE DATABASE MUTATION & CONTEXT STRICTNESS
**Trigger**: บังคับใช้ทุกครั้งที่มีการเขียน Database Script, Migration, Seed หรือสร้าง UI ที่มีข้อมูลประกอบ

### 1. NO DESTRUCTIVE DATA MUTATION
- ห้ามใช้คำสั่ง \`deleteMany\`, \`drop\`, \`truncate\` หรือวิธีการล้างกระดานเพื่อสร้างใหม่เด็ดขาด
- การเขียนสคริปต์จัดการข้อมูลต้องใช้สถาปัตยกรรมแบบ \`Idempotent\` (รันซ้ำได้ไม่พัง) โดยใช้คำสั่ง \`upsert\` (Update or Insert) เสมอ

### 2. SINGLE SOURCE OF TRUTH (TEXT OVER PIXELS)
- ข้อความที่เป็น Text Requirements (ที่ User พิมพ์สั่ง) คือ "ความจริงสูงสุด (Absolute Truth)"

### 3. PLAN BEFORE EXECUTION
- ก่อนจะเขียนหรือรันสคริปต์ใดๆ ที่กระทบกับ Database คุณต้องสรุป "Execution Plan" (แผนการทำงาน) ให้ User อ่านก่อน
- ห้ามลงมือรันโค้ดจนกว่า User จะพิมพ์ยืนยันว่า "อนุมัติ" หรือ "ลุยเลย"
`;

fs.appendFileSync('GEMINI.md', newRule, 'utf8');
console.log('Rule appended successfully');
