const fs = require('fs');
const newRule = `
---

## [CORE RULE] AUTOMATION FIRST & ADMIN UI SCOPE
**Trigger**: เมื่อมีการอัปเดต Business Logic, โครงสร้างข้อมูลตั้งต้น (Core Structure), หรือแก้ไข Flow ขั้นตอนต่างๆ

### 1. AUTOMATION OVER MANUAL ENTRY (ต้องอัตโนมัติเสมอ)
- หาก User สั่งปรับเปลี่ยนโครงสร้างหลัก (เช่น ข้อความ 5 ขั้นตอน, หมวดหมู่หลัก) คุณมีหน้าที่ต้องเขียนสคริปต์ (Migration/Seed แบบ Upsert) เพื่อให้ระบบอัปเดตข้อมูลนั้นอย่างแม่นยำเสมอ
- โค้ดที่เขียนต้องพร้อมนำไปรันบน Server จริง (Production) เพื่อให้ระบบอัปเดตตัวเองได้อัตโนมัติ 
- ห้ามผลักภาระโดยการบอกให้ User "ไปพิมพ์แก้เองในหน้า Admin" เด็ดขาด

### 2. DATA AS CODE (โครงสร้างหลักคือหน้าที่ของโค้ด)
- Admin UI มีไว้สำหรับทีม Business ใช้แก้ไขคำผิดเล็กๆ น้อยๆ (Typos) หรือปรับจุกจิกหน้างานในอนาคตเท่านั้น
- การวางโครงสร้างหลัก (Initial Setup) และการเปลี่ยนแปลงระดับโครงสร้าง ถือเป็นความรับผิดชอบของโปรแกรมเมอร์ (คุณ) ที่ต้องจัดการให้เสร็จสมบูรณ์ผ่านสคริปต์และโค้ด 100%
`;

fs.appendFileSync('GEMINI.md', newRule, 'utf8');
console.log('Automation rule appended successfully');
