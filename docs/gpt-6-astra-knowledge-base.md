---
category: dna
name: GPT-6 Astra Integration Guide
description: คู่มือการอัปเกรดระบบสู่ GPT-6 Astra สำหรับ AI ในทีมพัฒนา MAKE A DOT
---
# 🚀 Knowledge Base: การอัปเกรดระบบสู่ GPT-6 Astra

ผมได้ทำการศึกษารายละเอียดจากเอกสารอ้างอิงของ GPT-6 Astra ทุกบรรทัดตามที่คุณมอบหมาย และได้ดึงจุดเด่นทั้งฟีเจอร์ใหม่ การปรับพฤติกรรม (Behavior) ตลอดจนการย้ายระบบ (Migration) มาสร้างเป็น **"คลังความรู้ (Repo/Knowledge Base)"** ในรูปแบบของ **Rules** และ **Skills** เพื่อใช้สำหรับเทรน AI ทุกตัว (Subagents) ในทีมพัฒนาโปรเจกต์ MAKE A DOT ของเราเรียบร้อยแล้วครับ

ไฟล์เหล่านี้ถูกฝังไว้ในระบบ Agent Hub ของโปรเจกต์ เพื่อบังคับให้ AI ทุกตัวอ่านและทำตามโดยอัตโนมัติ:

---

## 📑 1. Rules: พฤติกรรมหลักของ AI (Core Behavior)
*ไฟล์: `.agents/rules/gpt-6-astra-behavior.md`*

กฏข้อนี้จะบังคับให้ AI มีความกล้าคิดกล้าทำ (Initiative) และไม่หยุดรอคำสั่งโดยไม่จำเป็น:
* **Bias towards action:** ให้ AI ลงมือทำทันที และทำให้จบงาน (Carry to completion)
* **Concrete Reviewable Results:** AI ต้องทำงานให้ออกมาเป็น "ชิ้นงานที่พร้อมรีวิว" ก่อนที่จะหยุดเพื่อตั้งคำถามกับผู้ใช้
* **Instruction Override:** คำสั่งสดของผู้ใช้ (User prompt) จะมีความสำคัญสูงกว่าคำสั่งที่เขียนไว้ในระบบเสมอ
* **Smart Delegation:** ถ้างานไหนทำขนานกันได้ ให้ AI แตกงานส่งให้ Subagents ตัวอื่นทำทันทีเพื่อประหยัดเวลา
* **No Unnecessary Tests:** ห้าม AI เขียนโค้ดทดสอบ (Test) สำหรับงานง่ายๆ หรือแค่งานสะท้อนโค้ดเดิม เพื่อลดการเปลืองทรัพยากร

## 🗣️ 2. Rules: สไตล์การสื่อสาร (Communication Style)
*ไฟล์: `.agents/rules/gpt-6-astra-communication.md`*

กฏข้อนี้ปรับปรุงให้คำพูดของ AI อ่านง่าย กระชับ และเป็นธรรมชาติแบบมนุษย์:
* **No Slop Words:** สั่งแบนคำฟุ่มเฟือยและคำประดิษฐ์ที่ AI ชอบใช้ เช่น *"Bottom Line:"*, *"delve"*, *"In short:"*, *"The simplest mental model is..."*
* **Direct Action:** บอกสิ่งที่จะทำตรงๆ ไม่ต้องสาธยายสิ่งที่จะ "ไม่ทำ"
* **Legible Inter-Agent Comms:** การสื่อสารกันเองระหว่าง AI (Root คุยกับ Subagent) ต้องเว้นวรรคให้ถูกต้อง เผื่อกรณีที่มนุษย์ต้องเข้าไปอ่าน Log

## ⚙️ 3. Skills: คู่มือทางเทคนิคสำหรับ AI นักพัฒนา (Technical Migration)
*ไฟล์: `.agents/skills/gpt-6-astra-migration/SKILL.md`*

สกิลนี้ทำหน้าที่เป็นคู่มือให้ AI สายเขียนโค้ด (Coder Agents) รู้วิธีเขียนโค้ดต่อ API กับ GPT-6 Astra ได้ถูกต้อง:
* **API Endpoints:** บังคับใช้ `Responses API` สำหรับฟีเจอร์ Tool Calling (เพราะ Chat Completions จะไม่รองรับ Tool Calling ใน Astra)
* **Async Tool Calling:** ใช้พารามิเตอร์ `async: true` เพื่อให้ Astra แตกทาสก์ไปคิดเรื่องอื่นได้ระหว่างรอ Tools ทำงาน
* **Mid-turn Steering:** รองรับการเชื่อมต่อผ่าน WebSocket เพื่อแทรกแซง/เปลี่ยนคำสั่งกลางคัน
* **Deprecated Parameters:** ถอดพารามิเตอร์ที่เลิกใช้แล้วทิ้งทั้งหมด เช่น `temperature`, `top_p`, และ `top_logprobs`
* **Prompt Caching:** เปลี่ยนพารามิเตอร์แคชเป็น `prompt_cache_options.ttl: "30m"` 
* **Reasoning Limits:** ระวังเรื่อง Astra จะไม่รองรับ Reasoning Effort แบบ `none` อีกต่อไป (แนะนำให้ขยับเป็น `low`) และ Fast Mode จะใช้ใน Data Center ยุโรปไม่ได้

---

> [!TIP]
> ตอนนี้สมองของ AI ทุกตัวในโปรเจกต์นี้ได้รับการติดปีกด้วย **GPT-6 Astra Best Practices** เรียบร้อยแล้วครับ! เราพร้อมลุยงานโค้ดหรือการวางระบบในขั้นต่อไปแบบเต็มประสิทธิภาพแล้วครับ
