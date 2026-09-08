---
name: Core ER Diagram (โครงสร้างฐานข้อมูลหลัก)
description: แผนภาพ Entity-Relationship ของระบบ เพื่อแสดงความสัมพันธ์ระหว่าง User, Project, Dots และระบบหุ้น (Sweat Equity)
category: architecture
trigger: model_decision
---

# Core ER Diagram (โครงสร้างฐานข้อมูลหลัก)

## เหตุผลและความสำคัญ
นี่คือกระดูกสันหลังของระบบ (Data Foundation) ก่อนที่เราจะสร้างหน้าจอหรือเขียนตรรกะ AI เราต้องนิยามให้ชัดเจนก่อนว่าแอปพลิเคชันของเราเก็บข้อมูลอะไรบ้าง และแต่ละส่วนเชื่อมโยงกันอย่างไร โครงสร้างนี้จะเป็นตัวกำหนดขอบเขตความสามารถของ MAKE A DOT 

## แผนภาพความสัมพันธ์ (Entity-Relationship)

```mermaid
erDiagram
    USER {
        string id PK "รหัสผู้ใช้"
        string name "ชื่อ-นามสกุล"
        string email "อีเมล"
        string role "บทบาทเบื้องต้น"
        int synergy_score "คะแนนเคมี/ความน่าเชื่อถือ"
    }
    
    PROJECT {
        string id PK "รหัสโปรเจกต์"
        string title "ชื่อโปรเจกต์"
        string description "รายละเอียด"
        string status "สถานะ (Draft, Active, Completed)"
        string founder_id FK "ผู้ก่อตั้ง (เชื่อม User)"
    }
    
    DOT {
        string id PK "รหัส Dot"
        string type "ประเภท (Skill, Idea, Capital)"
        string name "ชื่อ Dot (เช่น ทักษะ React)"
        string status "สถานะ (มีแล้ว, กำลังตามหา, ปริศนา)"
        string project_id FK "เชื่อมโปรเจกต์"
        string owner_id FK "เจ้าของ Dot (เชื่อม User)"
    }
    
    SWEAT_EQUITY_PLEDGE {
        string id PK "รหัสสัญญา"
        string project_id FK "เชื่อมโปรเจกต์"
        string user_id FK "ผู้ร่วมลงแรง"
        float equity_percentage "สัดส่วนหุ้น (%)"
        string contribution_desc "รายละเอียดสิ่งที่ต้องลงแรง"
        string status "สถานะสัญญา (Pending, Approved)"
    }

    USER ||--o{ PROJECT : "เป็นผู้ก่อตั้ง"
    PROJECT ||--|{ DOT : "ต้องการ / ครอบครอง"
    USER ||--o{ DOT : "เป็นเจ้าของทรัพยากร"
    USER ||--o{ SWEAT_EQUITY_PLEDGE : "ทำข้อตกลงลงแรง"
    PROJECT ||--o{ SWEAT_EQUITY_PLEDGE : "แบ่งสัดส่วนหุ้นให้"
```

## คำอธิบาย Data Flow เบื้องต้น
1. **USER (ผู้คน):** ทุกคนเข้ามาในฐานะ User มีคะแนน `synergy_score` สำหรับระบบจับคู่
2. **PROJECT (โปรเจกต์):** User สามารถสร้างโปรเจกต์ได้
3. **DOT (จุดทรัพยากร):** โปรเจกต์หนึ่งๆ จะประกอบไปด้วยหลาย Dots บางดอทมีเจ้าของแล้ว (เช่น Founder มีไอเดีย) บางดอทเป็นของที่กำลังตามหา (Needed) และบางดอทอาจเป็น Mystery Dot ที่ AI แนะนำ
4. **SWEAT EQUITY PLEDGE (สัญญาหุ้น):** เมื่อคนแปลกหน้าเอา Dot (เช่น ทักษะ) มาเติมเต็มให้โปรเจกต์ ระบบจะสร้างข้อตกลงนี้ขึ้นมา เพื่อล็อก % หุ้นให้ตามผลงาน ถือเป็นหัวใจหลักในการป้องกันความขัดแย้ง
