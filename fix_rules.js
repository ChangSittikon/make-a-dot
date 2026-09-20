const fs = require('fs');

const newContent = `
## [CORE RULE] SCHEMA STRICTNESS & DEFENSIVE CODING
**Trigger**: บังคับใช้กฎนี้เฉพาะเมื่อต้องเขียน/แก้ไข **API, Database (Prisma), Data Fetching** หรือ **State ที่ผูกกับ Database**

**1. ZERO GUESSING**
ห้ามเดาหรือสมมติชื่อ Field, Model, หรือ Relation **เด็ดขาด**
- ถ้าไม่แน่ใจ -> หยุด -> ไปอ่าน \`prisma/schema.prisma\` ก่อนเสมอ
- ห้ามพิมพ์ชื่อ field จากความจำ แม้จะใช้ชื่อนั้นมาก่อนในบทสนทนา

**2. ALWAYS VERIFY**
ต้องอ่านไฟล์ \`prisma/schema.prisma\` **ก่อนเสมอ** เพื่อดึงชื่อตัวแปร, Type, และโครงสร้าง Relation ที่ถูกต้อง 100%
- รวมถึง: ชื่อ Model, ชื่อ Field, @relation, Enum values
- ไม่มีข้อยกเว้น แม้แต่ field ที่ "ดูง่าย" ก็ต้องยืนยันจาก schema

**3. STRICT UI BINDING**
ห้ามใช้ Free-text input สำหรับข้อมูลที่มีค่าจำกัด (Enum / FK Relation)
- ต้องใช้ Dropdown / Select / Radio ที่ดึงค่ามาจาก Schema หรือ API โดยตรงเสมอ
- ฟิลด์ที่ห้ามใช้ Free-text เด็ดขาด: inputType, fieldName, entityType, primaryGap, urgencyState, bountyType

**4. ASK BEFORE BREAK**
หากคำสั่งของ User **ขัดแย้งกับ Schema ปัจจุบัน** -> ห้ามมั่วข้อมูลให้ตรงกัน -> ต้องถาม User ก่อนทันที
- สิ่งที่ต้องรายงาน: (1) Schema ตอนนี้มีอะไรบ้าง, (2) สิ่งที่คุณขอขัดแย้งยังไง, (3) เสนอทางเลือกให้ User ว่าจะแก้ Schema หรือแก้คำสั่ง
- ห้าม implement ท่าแปลกๆ เพื่อเลี่ยงการแก้ Schema

---

## [CORE RULE] SAFE DATABASE MUTATION & CONTEXT STRICTNESS
**Trigger**: บังคับใช้ทุกครั้งที่มีการเขียน Database Script, Migration, Seed หรือสร้าง UI ที่มีข้อมูลประกอบ

**1. NO DESTRUCTIVE DATA MUTATION**
- ห้ามใช้คำสั่ง \`deleteMany\`, \`drop\`, \`truncate\` หรือวิธีการล้างกระดานเพื่อสร้างใหม่เด็ดขาด
- การเขียนสคริปต์จัดการข้อมูลต้องใช้สถาปัตยกรรมแบบ \`Idempotent\` (รันซ้ำได้ไม่พัง) โดยใช้คำสั่ง \`upsert\` (Update or Insert) เสมอ

**2. SINGLE SOURCE OF TRUTH (TEXT OVER PIXELS)**
- ข้อความที่เป็น Text Requirements (ที่ User พิมพ์สั่ง) คือ "ความจริงสูงสุด (Absolute Truth)"

**3. PLAN BEFORE EXECUTION**
- ก่อนจะเขียนหรือรันสคริปต์ใดๆ ที่กระทบกับ Database คุณต้องสรุป "Execution Plan" (แผนการทำงาน) ให้ User อ่านก่อน
- ห้ามลงมือรันโค้ดจนกว่า User จะพิมพ์ยืนยันว่า "อนุมัติ" หรือ "ลุยเลย"

---

## [CORE RULE] AUTOMATION FIRST & ADMIN UI SCOPE
**Trigger**: เมื่อมีการอัปเดต Business Logic, โครงสร้างข้อมูลตั้งต้น (Core Structure), หรือแก้ไข Flow ขั้นตอนต่างๆ

**1. AUTOMATION OVER MANUAL ENTRY (ต้องอัตโนมัติเสมอ)**
- หาก User สั่งปรับเปลี่ยนโครงสร้างหลัก (เช่น ข้อความ 5 ขั้นตอน, หมวดหมู่หลัก) คุณมีหน้าที่ต้องเขียนสคริปต์ (Migration/Seed แบบ Upsert) เพื่อให้ระบบอัปเดตข้อมูลนั้นอย่างแม่นยำเสมอ
- โค้ดที่เขียนต้องพร้อมนำไปรันบน Server จริง (Production) เพื่อให้ระบบอัปเดตตัวเองได้อัตโนมัติ 
- ห้ามผลักภาระโดยการบอกให้ User "ไปพิมพ์แก้เองในหน้า Admin" เด็ดขาด

**2. DATA AS CODE (โครงสร้างหลักคือหน้าที่ของโค้ด)**
- Admin UI มีไว้สำหรับทีม Business ใช้แก้ไขคำผิดเล็กๆ น้อยๆ (Typos) หรือปรับจุกจิกหน้างานในอนาคตเท่านั้น
- การวางโครงสร้างหลัก (Initial Setup) และการเปลี่ยนแปลงระดับโครงสร้าง ถือเป็นความรับผิดชอบของโปรแกรมเมอร์ (คุณ) ที่ต้องจัดการให้เสร็จสมบูรณ์ผ่านสคริปต์และโค้ด 100%
`;

fs.writeFileSync('GEMINI.md', newContent.trim(), 'utf8');
console.log('Fixed markdown formatting for rule parser');
