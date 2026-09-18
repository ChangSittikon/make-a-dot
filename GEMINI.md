# MAKE A DOT — Engineering Core Rules (Senior Tech Lead Standard)

> These rules are **non-negotiable** and must be followed for **every task** in this project.
> Violating any of these rules is considered a critical failure, not just a minor issue.

---

## [CORE RULE] SCHEMA STRICTNESS & DEFENSIVE CODING

> **Trigger**: บังคับใช้กฎนี้เฉพาะเมื่อต้องเขียน/แก้ไข **API, Database (Prisma), Data Fetching** หรือ **State ที่ผูกกับ Database**

### 1. ZERO GUESSING
ห้ามเดาหรือสมมติชื่อ Field, Model, หรือ Relation **เด็ดขาด**
- ถ้าไม่แน่ใจ -> หยุด -> ไปอ่าน `prisma/schema.prisma` ก่อนเสมอ
- ห้ามพิมพ์ชื่อ field จากความจำ แม้จะใช้ชื่อนั้นมาก่อนในบทสนทนา

### 2. ALWAYS VERIFY
ต้องอ่านไฟล์ `prisma/schema.prisma` **ก่อนเสมอ** เพื่อดึงชื่อตัวแปร, Type, และโครงสร้าง Relation ที่ถูกต้อง 100%
- รวมถึง: ชื่อ Model, ชื่อ Field, @relation, Enum values
- ไม่มีข้อยกเว้น แม้แต่ field ที่ "ดูง่าย" ก็ต้องยืนยันจาก schema

### 3. STRICT UI BINDING
ห้ามใช้ Free-text input สำหรับข้อมูลที่มีค่าจำกัด (Enum / FK Relation)
- ต้องใช้ Dropdown / Select / Radio ที่ดึงค่ามาจาก Schema หรือ API เท่านั้น
- ตัวอย่างที่ต้องเป็น Dropdown: inputType, fieldName, entityType, primaryGap, urgencyState, bountyType

### 4. ASK BEFORE BREAK
หากคำสั่งของ User **ขัดแย้งกับ Schema ปัจจุบัน** -> หยุดทำงานทันที -> แจ้ง User ก่อนทุกครั้ง
- ต้องอธิบายว่า: (1) Schema ปัจจุบันเป็นอย่างไร, (2) คำสั่งขัดแย้งตรงไหน, (3) ตัวเลือกที่ถูกต้องคืออะไร
- ห้าม implement แล้วค่อยบอกทีหลัง

---

## RULE 1 — NO FREE-TEXT GUESSING (Schema-Driven Inputs)

Never use a free-text input field for any value that maps to a database field name, Prisma enum, or a finite set of known options.

- **DB Field Names**: Always derive field names directly from `prisma/schema.prisma`. Never let the user type a field name freely.
- **Enum Values**: Always generate a Select / Radio / Checkbox from the actual Prisma enum definition. Never hardcode display strings that differ from the schema.
- **Limited Options**: For any field with a fixed set of valid values (status, type, category), always provide a dropdown or radio group, not a free-text box.

**Why**: Free-text for DB-mapped values -> typos -> Error 500 in production. This was the root cause of the fieldName bug in the Flow Admin.

**Before building any form, you MUST read schema.prisma first:**
```
ก่อนออกแบบฟอร์มนี้ ให้ไปอ่านไฟล์ schema.prisma เพื่อดึงชื่อ Field และ Type มาทำฟอร์มให้ตรงกัน 100% ห้ามตั้งชื่อ Field เอง
```

---

## RULE 2 — DYNAMIC & TYPE-SAFE FIRST

Every piece of code must be type-safe and defensive by default.

- **No `any`**: Never use TypeScript `any` type. Use proper types, interfaces, or `unknown` with narrowing.
- **Handle null / undefined**: Every value from the DB, API, or user input must be checked before use. Always provide a fallback.
- **Fallback UI**: Every component that fetches async data must have: Loading state -> Error state -> Empty state -> Data state.
- **Required Prisma Fields**: Fields like rawDescription, entityType, primaryGap, requesterId in ProblemNode are non-nullable. Always guard them.

Key non-nullable fields to always guard:
```typescript
rawDescription: rawDescription ?? 'ไม่ระบุรายละเอียด',
entityType: entityType ?? 'ENTERPRISE',
primaryGap: primaryGap ?? 'SKILL_GAP',
requesterId: requesterId  // must always be a real user ID — no fallback allowed
```

---

## RULE 3 — ARCHITECTURE BEFORE EXECUTION

Never write code for a new feature without a plan first.

Before writing any code, you MUST:
1. Read `prisma/schema.prisma` — Identify the exact models, field names, types, and relations involved.
2. Identify Edge Cases — What happens if the data is null? Empty? Malformed? Unauthorized?
3. State the Execution Plan — Which files change, what API routes are needed, what the UI flow is.

Ask this question before every feature:
```
ช่วยวิเคราะห์จุดอ่อน (Edge Cases) ของฟีเจอร์นี้ให้หน่อย ก่อนที่เราจะเริ่มเขียนโค้ด
```

---

## RULE 4 — SCALABLE MINDSET (No Magic Strings/Numbers)

Never hardcode values that will change over time.

- **No hardcoded strings for enums**: Use constants or pull from DB/API.
- **No hardcoded IDs**: Never hardcode user IDs, industry IDs, or record IDs. Always query or pass as config.
- **No hardcoded flow steps**: The Flow Builder exists so steps are controlled from DB, not from the code.
- **No magic numbers**: Extract to named constants.
- **Config > Code**: If a value might change, it belongs in environment variables or a config table in the DB.

---

## Project Architecture Reference

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
- **ORM**: Prisma with SQLite (`prisma/dev.db`)
- **Font**: Prompt (Thai-friendly Google Font)
- **Brand**: Red #FF1A1A, Black #111111, Gray #F5F5F7

### Key Files to Always Check First
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Source of truth for ALL field names, types, enums |
| `src/app/api/bounties/route.ts` | Main bounty creation API — guard non-nullable fields here |
| `src/app/api/bounty-flow/route.ts` | Dynamic flow steps from DB |
| `src/components/flow/BountyFlowApp.tsx` | Main user-facing flow UI |
| `src/app/profile/settings/flow-builder/page.tsx` | Admin flow builder |
| `src/components/admin/EditModal.tsx` | Node editing modal — use dropdowns, not free-text |

### Key Non-Nullable ProblemNode Fields
```
rawDescription  (String!)  — always provide fallback
entityType      (String!)  — default: 'ENTERPRISE'
primaryGap      (String!)  — default: 'SKILL_GAP'
requesterId     (String!)  — must be a real authenticated user ID
```

---

## Anti-Patterns — Never Do These

| Bad Pattern | Correct Pattern |
|---|---|
| Free-text input for a DB field name | Dropdown with options from schema |
| `const data: any = await fetch(...)` | `const data: ApiResponse = await fetch(...)` |
| Prisma create without null check on required fields | Always guard: `rawDescription: input ?? 'ไม่ระบุ'` |
| Hardcoded `industryId: 'abc123'` in code | Query by name from DB at runtime |
| Building UI without checking schema first | Read schema.prisma -> identify fields -> design form |
| Silently failing async operations | Always .catch() and show error state in UI |
| Implementing when user request conflicts with schema | Stop and ask user first (ASK BEFORE BREAK) |

---

*This file is automatically loaded by Antigravity as a workspace rule for every session in this project.*
*Last updated: 2026-09-18*
