---
name: 'Server-First & App Router Standards'
description: 'กฎการเขียนโค้ด Next.js App Router เน้น Server Components และจำกัดการใช้ Client Components เท่าที่จำเป็น'
---

# Server-First & App Router Standards

โปรเจคนี้ใช้ Next.js App Router (เวอร์ชันล่าสุด) ซึ่งรองรับ Server Components อย่างเต็มรูปแบบ เพื่อประสิทธิภาพสูงสุด เอเจนต์ต้องปฏิบัติตามกฎต่อไปนี้:

1. **Default to Server Components:** ไฟล์ใหม่ทุกไฟล์ที่สร้างขึ้นมาควรเป็น Server Component เป็นค่าเริ่มต้น (ไม่ต้องใส่ `"use client"`) และให้ทำการ Fetch Data ตรงจาก Database `prisma` บนเซิร์ฟเวอร์เลย
2. **ใช้ Client Component เฉพาะเจาะจง:** ใช้ `"use client"` เฉพาะกับคอมโพเนนต์ที่ต้องการ State (`useState`), Effects (`useEffect`), หรือ Browser API (`window`, `onClick`) เท่านั้น หากคอมโพเนนต์ไหนต้องการ interactivity ให้แยกส่วนนั้นออกไปเป็นคอมโพเนนต์เล็กๆ แทนที่จะทำทั้งหน้าเพจให้เป็น Client Component
3. **ห้ามเรียก Prisma ฝั่ง Client:** หากเป็น Client Component ห้ามดึงข้อมูลผ่าน Prisma ตรงๆ ต้องเรียกผ่าน API Route (`/api/...`) หรือส่งผ่าน Server Actions
