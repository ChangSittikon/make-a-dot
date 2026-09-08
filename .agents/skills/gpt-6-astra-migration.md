---
name: GPT-6 Astra Technical Migration Guide
description: คู่มือทางเทคนิคสำหรับการอัปเดต API และ Model Parameters เพื่อรองรับ GPT-6 Astra อย่างเต็มรูปแบบ
---

# GPT-6 Astra Migration Quickstart

หาก AI ตัวใดในโปรเจกต์นี้จำเป็นต้องเขียนโค้ดเพื่อเชื่อมต่อกับ OpenAI API ให้ปฏิบัติตามคู่มือการ Migration ไปยัง `gpt-6-astra` ดังต่อไปนี้:

## 1. Update API and Model Parameters (พารามิเตอร์พื้นฐาน)
- เปลี่ยนค่า `model` เป็น `gpt-6-astra`
- **Tool Calling:** ต้องใช้ผ่าน **Responses API** เท่านั้น (Chat Completions รองรับแค่แชทปกติ ไม่รองรับ tool calling สำหรับ Astra)
- **Unsupported Parameters (ห้ามใส่พารามิเตอร์เหล่านี้):** ให้ลบ `temperature`, `top_p`, และ `top_logprobs` ออกจากการเรียกใช้ Chat Completions ทั้งหมด และสำหรับ Responses API ให้ลบ `message.output_text.logprobs` ออกจาก `include`

## 2. Reasoning Effort (การกำหนดความพยายามในการคิด)
- หากโค้ดเดิมใช้ `none` หรือ `minimal` ให้เริ่มเปลี่ยนเป็น `low` แล้วทดสอบผลลัพธ์ (เนื่องจาก Astra ไม่รองรับโหมด `none`)
- นอกนั้นให้คงค่า `reasoning_effort` เดิมไว้ โดยใช้ field `reasoning_effort` ใน Responses API หรือ `reasoning_effort` ใน Chat Completions
- **Mid-Conversation Change:** หากแอปพลิเคชันต้องการปรับความพยายาม (Reasoning effort) ระหว่างกำลังคุย ให้ใช้ `configuration_update` ใน single-agent requests การใช้วิธีนี้จะทำให้ค่า `reasoning_effort` ที่ระดับ request คงที่ เพื่อรักษาสิทธิในการทำ Prompt Caching เอาไว้

## 3. Asynchronous Workflow & Steering (ฟีเจอร์ใหม่)
- **Async tool calling:** `gpt-6-astra` สามารถคิดต่อ หรือเรียกเครื่องมืออื่นระหว่างรอเครื่องมือแรกทำงานเสร็จได้ โดยตั้งค่า `async: true` ที่ function/tool แล้วส่งผลลัพธ์กลับมาเมื่อพร้อมด้วย `call_id`
- **Mid-turn steering:** สามารถรับคำสั่งแทรกแซงจากผู้ใช้งานระหว่างที่กำลังทำงาน (เช่น เปลี่ยนแปลง requirement กะทันหัน) ผ่านการเชื่อมต่อแบบ WebSocket (Responses API) 
- **Misalignment monitoring:** ระบบมี Safeguard คอยตรวจสอบความผิดเพี้ยนของการทำงานอยู่เบื้องหลังเสมอ

## 4. Prompt Caching & Latency (การจัดการแคชและความเร็ว)
- สำหรับโปรเจกต์ที่ใช้ EU data residency (ยุโรป) **จะไม่สามารถเปิดใช้งาน Fast mode ได้** ให้ใช้ Standard processing แทน
- **Prompt Caching:** หากทำการ Migrate จาก GPT-5.5 หรือเก่ากว่า ให้เปลี่ยนพารามิเตอร์จาก `prompt_cache_retention` ไปเป็น `prompt_cache_options.ttl` แล้วตั้งค่าเป็น `"30m"`

## 5. Unnecessary approval pauses (การแก้ปัญหา AI หยุดถามบ่อย)
- หากพบปัญหา AI หยุดเพื่อขออนุญาตผู้ใช้งานบ่อยเกินไปก่อนจะทำงานต่อ ให้กลับไปอ้างอิงและตั้งค่า Prompt จาก `gpt-6-astra-behavior.md` (หมวด Initiative and follow-through)
