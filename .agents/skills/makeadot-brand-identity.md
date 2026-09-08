---
name: 'Make-a-dot Brand Identity'
description: 'รวบรวมตัวแปรสี ฟอนต์ แอนิเมชัน และน้ำเสียงภาษาที่ใช้สำหรับการสร้างหน้า UI ของโปรเจค MAKE A DOT'
---

# Make-a-dot Brand Identity

เพื่อให้แอปพลิเคชัน "MAKE A DOT" มีความเป็นอันหนึ่งอันเดียวกัน (Consistency) สูงสุด ให้เอเจนต์นำ Guideline นี้ไปใช้ทุกครั้งที่มีการออกแบบหน้าตา UI ใหม่:

### 1. Colors (สีประจำแบรนด์)
โปรเจคนี้ใช้ CSS Variables ร่วมกับ Tailwind v4 โดยมีการกำหนดสีพิเศษที่สามารถเรียกใช้เป็นคลาส Tailwind ได้เลย:
- **`bg-brand-red` / `text-brand-red`**: สีแดงหลักของแบรนด์ (#FF1A1A) ใช้กับปุ่ม Call to action หรือไฮไลต์สำคัญ
- **`bg-brand-black` / `text-brand-black`**: สีดำ (#111111) ใช้กับตัวอักษรหัวข้อและปุ่มรอง
- **`bg-brand-gray`**: สีเทาอ่อน (#F5F5F7) ใช้สำหรับพื้นหลังของการ์ดหรืออินพุต

### 2. Fonts & Styling (ตัวอักษร)
- โปรเจคนี้ใช้ฟอนต์ **"Prompt"** (ผ่าน Google Fonts) เป็นค่าเริ่มต้น ไม่ต้องระบุคลาสฟอนต์เพิ่มถ้าไม่จำเป็น
- ควบคุมให้มีการใช้ `rounded-2xl` หรือ `rounded-3xl` กับการ์ดและปุ่มเพื่อให้ดีไซน์ดูเป็นมิตร (Friendly)

### 3. Animations (ลูกเล่น)
- **Breathing Dot (จุดสีแดงหายใจ):** เป็นสัญลักษณ์ของแบรนด์ หากต้องการใส่จุดแดงที่เต้นได้ ให้ใช้ `<div className="w-6 h-6 bg-brand-red rounded-full" style={{ animation: 'breathe 3s cubic-bezier(0.32, 0.72, 0, 1) infinite' }} />` (ใช้คีย์เวิร์ดแอนิเมชัน `breathe` ที่ฝังอยู่ใน globals.css)

### 4. Language & Tone (ภาษา)
- ระบบฝั่งผู้ใช้ (User-facing UI) จะต้องใช้ **ภาษาไทย** เสมอ
- น้ำเสียง: สุภาพ แต่เป็นมิตรและให้กำลังใจ (Encouraging tone) สะท้อนสโลแกน "พลังของคนตัวเล็ก"
