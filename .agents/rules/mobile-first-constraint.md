---
name: 'Mobile-First & Phone Frame Constraint'
description: 'บังคับให้ AI เคารพขอบเขตของ Phone Frame เสมอเมื่อเขียน Tailwind CSS ห้ามทำให้ Layout ล้นออกนอกกรอบ'
---

# Mobile-First & Phone Frame Constraint

โปรเจค MAKE A DOT ถูกออกแบบมาให้แสดงผลเป็นแอปพลิเคชันมือถือ (Mobile-first) แต่เมื่อถูกเปิดบน Desktop มันจะแสดงผลอยู่ภายใน "กรอบจำลองมือถือ (Phone Frame)" ที่มีความกว้างคงที่

เอเจนต์จะต้องปฏิบัติตามกฎเหล่านี้เสมอเมื่อเขียนและแก้ไขโค้ด UI:

1. **ห้ามทำลาย Phone Frame:** ห้ามใช้ Class Tailwind ที่จะไปขยายขนาดหน้าจอจนล้นกรอบ เช่น `w-screen`, `h-screen` (ให้ใช้ `w-full`, `h-full` แทนเพื่อให้พอดีกับ Parent)
2. **ห้ามใช้ Responsive Breakpoint ที่ขัดแย้ง:** กรอบโทรศัพท์ถูกล็อคความกว้างไว้ที่ `sm:w-[430px]` ดังนั้นการใช้ Class อย่าง `md:flex-row`, `lg:w-1/2` สำหรับหน้าจอใหญ่มักจะทำให้ Layout เพี้ยน ให้ถือว่า Container ปัจจุบันคือหน้าจอมือถือเสมอ
3. **การออกแบบให้เน้นแนวตั้ง:** UI ทุกหน้าต้องถูกจัดเรียงเป็นแนวตั้ง (Column-flex) และ Scroll ได้เมื่อเนื้อหายาวเกินหน้าจอ `overflow-y-auto`
