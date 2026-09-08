import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const synthesizeSchema = z.object({
  analysis: z.string().describe("บทวิเคราะห์สิ่งที่แอดมินกำลังคิด หรือปัญหาที่กำลังเผชิญ สั้นๆ"),
  smartChoices: z.array(
    z.object({
      id: z.string(),
      title: z.string().describe("ชื่อตัวเลือก (สั้นๆ กระชับ)"),
      description: z.string().describe("คำอธิบายว่าถ้าเลือกทางนี้ จะเกิดอะไรขึ้น"),
      feasibility: z.enum(['HIGH', 'MEDIUM', 'LOW']).describe("ความเป็นไปได้ในทางเทคนิค"),
      impact: z.string().describe("ผลกระทบต่อระบบเดิม (เช่น ต้องแก้ DB, ต้องเพิ่ม API)")
    })
  ).describe("ตัวเลือกที่ฉลาดๆ ให้แอดมินเลือกเพื่อต่อยอด"),
  pathways: z.array(
    z.object({
      step: z.number(),
      action: z.string().describe("สิ่งที่ต้องทำในขั้นตอนนั้น"),
      details: z.string().describe("รายละเอียดเชิงลึก (เช่น โค้ดที่ต้องเขียน, เครื่องมือที่ต้องใช้)")
    })
  ).describe("ขั้นตอนหากต้องการลงมือทำจริง (ถ้าความคิดเริ่มเป็นรูปเป็นร่างแล้ว)")
});

export async function POST(request: Request) {
  try {
    const { history, currentThought } = await request.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
    }

    // Load contextual data
    let dbSchema = "";
    let devActivity = "";
    
    try {
      dbSchema = fs.readFileSync(path.join(process.cwd(), 'prisma', 'schema.prisma'), 'utf8');
    } catch (e) {
      console.warn("Could not read schema.prisma");
    }

    try {
      devActivity = fs.readFileSync(path.join(process.cwd(), 'dev-activity.json'), 'utf8');
    } catch (e) {
      console.warn("Could not read dev-activity.json");
    }

    // Get config from DB
    const sysConfig = await prisma.systemConfig.findUnique({ where: { id: "GLOBAL" } });
    if (sysConfig && !sysConfig.aiEnabled) {
      return NextResponse.json({ error: 'AI generation disabled' }, { status: 403 });
    }

    let modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    if (sysConfig) {
      modelsToTry = [sysConfig.primaryModel];
      if (sysConfig.autoFallback && sysConfig.fallbackModels) {
        const fallbacks = sysConfig.fallbackModels.split(',').map(s => s.trim()).filter(Boolean);
        modelsToTry = [...modelsToTry, ...fallbacks];
      }
    }

    modelsToTry = modelsToTry.map(m => m.replace('models/', ''));

    const promptText = `
คุณคือ "ผู้ผสานดอท" (Dot Synthesizer) เครื่องมือช่วยแอดมินคิดและรวบรวมไอเดียที่กระจัดกระจายให้ออกมาเป็นโครงสร้าง
แอดมินจะพิมพ์ความขิดแบบไม่มีตรรกะ หน้าที่ของคุณคือตีความ คาดเดาสิ่งที่แอดมินต้องการ และเสนอ "Smart Choices" ให้เลือกต่อยอด

ข้อมูลแวดล้อมของโปรเจกต์ปัจจุบัน (ใช้เพื่อประมวลผลให้สมจริง ไม่ใช่มโนขึ้นมาลอยๆ):
=== DATABASE SCHEMA ===
${dbSchema}

=== DEV ACTIVITY (สิ่งที่ทำไปแล้ว) ===
${devActivity}

=== HISTORY (ประวัติการต่อยอดไอเดียครั้งนี้) ===
${history.map((h: any) => `[${h.role.toUpperCase()}]: ${h.content}`).join('\n')}

=== CURRENT THOUGHT (ไอเดียล่าสุดที่แอดมินเพิ่งพิมพ์) ===
${currentThought}

=== INSTRUCTIONS ===
1. อ่าน Current Thought และ History อย่างละเอียด
2. วิเคราะห์เชื่อมโยงกับ Database Schema และระบบที่เรามีอยู่ตอนนี้
3. เสนอ Smart Choices 2-4 ข้อ ที่เป็นแนวทางที่สามารถสร้างขึ้นมาได้จริงบนระบบปัจจุบัน
4. เสนอ Pathways เป็นขั้นตอนคร่าวๆ ว่าถ้าจะทำฟีเจอร์นี้ต้องไปแก้ไฟล์ไหน หรือสร้างหน้าไหนบ้าง
`;

    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const { object } = await generateObject({
          model: google(modelName),
          schema: synthesizeSchema,
          prompt: promptText,
          maxRetries: 0
        });
        
        return NextResponse.json(object);
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message);
        lastError = err;
        // Try next model
      }
    }
    
    // If all failed
    if (lastError) {
      const errMsg = lastError.message || '';
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('high demand') || errMsg.includes('Rate limit')) {
        throw new Error('โควต้า AI ของ Google เต็ม (Rate Limit) กรุณารอสักครู่ (1-2 นาที) แล้วกดส่งใหม่อีกครั้งครับ');
      }
      throw lastError;
    }
  } catch (error: any) {
    console.error("Synthesize Error:", error);
    return NextResponse.json({ error: error?.message || 'Failed to synthesize' }, { status: 500 });
  }
}
