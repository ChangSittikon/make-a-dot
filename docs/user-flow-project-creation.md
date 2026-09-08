---
name: Core User Flow (เส้นทางผู้ใช้งานหลัก)
description: แผนภาพ Flowchart แสดงเส้นทางการใช้งานระบบ ตั้งแต่เริ่มสร้างโปรเจกต์ จัดระเบียบ Dot จนถึงการค้นพบดอทปริศนา
category: architecture
trigger: model_decision
---

# Core User Flow (เส้นทางผู้ใช้งานหลัก)

## เหตุผลและความสำคัญ
หลังจากที่เราได้โครงสร้างฐานข้อมูล (ER Diagram) มาแล้ว ลำดับถัดมาคือการวาด "เส้นทางเดิน" ของผู้ใช้งาน (User Journey) เพื่อดูว่า User จะมีปฏิสัมพันธ์กับข้อมูลเหล่านั้นอย่างไร 
Flow นี้จะมุ่งเน้นไปที่ระบบ **Project Builder** ซึ่งเป็นหัวใจสำคัญในการเปลี่ยน "ไอเดียลอยๆ" ให้กลายเป็น "โปรเจกต์ที่จับต้องได้" พร้อมระบบแนะนำดอทปริศนาที่เราได้กำหนดไว้ใน DNA

## แผนภาพกระบวนการ (Flowchart)

```mermaid
flowchart TD
    %% การเข้าสู่ระบบและจุดเริ่มต้น
    Start([User ล็อกอินเข้าสู่ MAKE A DOT]) --> Dashboard[หน้า Dashboard หลัก]
    Dashboard --> Builder{มีไอเดียโปรเจกต์หรือยัง?}

    %% กรณีไม่มีไอเดีย (สายสำรวจ)
    Builder -- "ยังไม่มี" --> Explorer[เข้าสู่หมวด Explore / Idea Market]
    Explorer --> Serendipity[สุ่มพูดคุยกับคนแปลกหน้าข้ามสายอาชีพ (Serendipity Engine)]
    Serendipity --> Join[ขอร่วมทีมผ่านระบบ Sweat Equity]

    %% กรณีมีไอเดีย (สายสร้างสรรค์)
    Builder -- "มีไอเดียแล้ว" --> Draft[สร้าง Project Draft]
    Draft --> KnownDots[กรอก 'Known Dots' ที่ตัวเองมี (เช่น ทักษะ, เวลา, ทุน)]
    
    %% ระบบ AI ทำงาน
    KnownDots --> AI_Tree[AI ประมวลผล Dependency Tree]
    AI_Tree --> MissingDots[AI วิเคราะห์หา 'สิ่งที่ขาดหายไป' (Missing Dots)]
    MissingDots --> MysteryDots[AI เสนอแนะ 'ดอทปริศนา' เพื่อขยายศักยภาพ (The Blind Spot)]
    
    %% การจำลองอนาคต
    MysteryDots --> WhatIf{ใช้ 'What If' Simulator จำลองอนาคต}
    
    WhatIf -- "เลือกเส้นทาง A (สร้างโปรดักต์เทค)" --> RouteA[ระบบออกเควสต์ให้ตามหา Tech Partner]
    WhatIf -- "เลือกเส้นทาง B (สายเน้นคอมมูนิตี้)" --> RouteB[ระบบออกเควสต์ให้ตามหา Marketer]
    WhatIf -- "เลือกเส้นทาง C (ลุยเดี่ยว)" --> RouteC[ระบบเสนอ AI Tools ช่วยทำงาน]

    %% บทสรุป
    RouteA --> Match[เข้าสู่ระบบ Matchmaking]
    RouteB --> Match
    RouteC --> Active([โปรเจกต์เข้าสู่สถานะ Active])
    
    Match --> Contract[ทำสัญญา Sweat Equity Pledge]
    Contract --> Active
```

## คำอธิบายจุดเชื่อมต่อ (Data Interaction)
*   เมื่อผู้ใช้กรอก `Known Dots` ระบบจะยิงไปเขียนตาราง `DOT` ใน Database
*   การทำ `Sweat Equity Pledge` คือการสร้าง Record ใหม่ในตาราง `SWEAT_EQUITY_PLEDGE` เพื่อเป็นหลักประกันความเชื่อใจก่อนสถานะโปรเจกต์จะเปลี่ยนเป็น `Active`
*   ขั้นตอน "What If Simulator" คือหน้า UI เชิงโต้ตอบ (Interactive UI) ที่ทรงพลังที่สุด ที่จะทำให้ผู้ใช้รู้สึกเหมือนมีที่ปรึกษาธุรกิจส่วนตัว
