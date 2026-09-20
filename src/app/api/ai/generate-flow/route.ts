import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const flowSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["START", "QUESTION", "RESULT"]),
      question: z.string(),
      order: z.number(),
      options: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          icon: z.string().optional(),
          targetNodeId: z.string().optional(),
          order: z.number()
        })
      )
    })
  )
});

// ============================================================
// FEW-SHOT BLUEPRINT: โครงสร้างแม่แบบที่ AI จะใช้เป็นต้นแบบ
// ============================================================
const FEW_SHOT_EXAMPLE = `
Here is an IDEAL example of a well-structured flow for the E-Sports industry:

{
  "nodes": [
    {
      "id": "start-001",
      "type": "START",
      "question": "เป้าหมายหลักของคุณในวงการ E-Sports คืออะไร?",
      "order": 0,
      "options": [
        { "id": "opt-001a", "label": "สร้างทีมแข่ง (Esports Team)", "icon": "fa-solid fa-users", "targetNodeId": "q-002", "order": 0 },
        { "id": "opt-001b", "label": "พัฒนาเกม (Game Dev)", "icon": "fa-solid fa-gamepad", "targetNodeId": "q-003", "order": 1 },
        { "id": "opt-001c", "label": "สตรีมมิ่ง / คอนเทนต์ครีเอเตอร์", "icon": "fa-solid fa-video", "targetNodeId": "q-004", "order": 2 }
      ]
    },
    {
      "id": "q-002",
      "type": "QUESTION",
      "question": "คุณกำลังตามหาตำแหน่งไหนมาร่วมทีมแข่ง?",
      "order": 1,
      "options": [
        { "id": "opt-002a", "label": "โค้ช / นักวิเคราะห์แผน", "icon": "fa-solid fa-chess", "targetNodeId": "q-005", "order": 0 },
        { "id": "opt-002b", "label": "ผู้จัดการทีม (หาทุน/สปอนเซอร์)", "icon": "fa-solid fa-briefcase", "targetNodeId": "q-005", "order": 1 },
        { "id": "opt-002c", "label": "ผู้เล่นโปรเพลเยอร์", "icon": "fa-solid fa-trophy", "targetNodeId": "q-005", "order": 2 }
      ]
    },
    {
      "id": "q-003",
      "type": "QUESTION",
      "question": "เกมที่คุณกำลังสร้าง ขาดคนทำส่วนไหน?",
      "order": 2,
      "options": [
        { "id": "opt-003a", "label": "Game Programmer (Unity/Unreal)", "icon": "fa-solid fa-code", "targetNodeId": "q-005", "order": 0 },
        { "id": "opt-003b", "label": "3D Artist / Animator", "icon": "fa-solid fa-palette", "targetNodeId": "q-005", "order": 1 },
        { "id": "opt-003c", "label": "Sound Designer", "icon": "fa-solid fa-music", "targetNodeId": "q-005", "order": 2 }
      ]
    },
    {
      "id": "q-004",
      "type": "QUESTION",
      "question": "คุณต้องการคนช่วยด้านไหนในการสตรีม?",
      "order": 3,
      "options": [
        { "id": "opt-004a", "label": "ตัดต่อวิดีโอ / กราฟิก", "icon": "fa-solid fa-film", "targetNodeId": "q-005", "order": 0 },
        { "id": "opt-004b", "label": "ผู้จัดการช่อง / หาสปอนเซอร์", "icon": "fa-solid fa-handshake", "targetNodeId": "q-005", "order": 1 }
      ]
    },
    {
      "id": "q-005",
      "type": "QUESTION",
      "question": "งบประมาณที่คุณพร้อมลงทุนในระยะแรก?",
      "order": 4,
      "options": [
        { "id": "opt-005a", "label": "ยังไม่มีงบ เน้นแลกแรงงาน (Sweat Share)", "icon": "fa-solid fa-hand-sparkles", "targetNodeId": "result-001", "order": 0 },
        { "id": "opt-005b", "label": "มีงบ 10,000 - 50,000 บาท", "icon": "fa-solid fa-wallet", "targetNodeId": "result-001", "order": 1 },
        { "id": "opt-005c", "label": "พร้อมลงทุนมากกว่า 50,000 บาท", "icon": "fa-solid fa-sack-dollar", "targetNodeId": "result-001", "order": 2 }
      ]
    },
    {
      "id": "result-001",
      "type": "RESULT",
      "question": "ระบบจะจับคู่คุณกับพาร์ทเนอร์ที่เหมาะสม",
      "order": 5,
      "options": []
    }
  ]
}

KEY PATTERNS TO FOLLOW:
1. The START node branches into 2-3 different PATHS based on the user's main goal
2. Each path leads to a deeper QUESTION specific to that path (this is BRANCHING)
3. Multiple paths can converge back to a shared question (e.g. budget question)
4. The final node is always a RESULT type with empty options
5. IDs follow a clear pattern: "start-001", "q-002", "q-003", "result-001"
6. Each option has a relevant FontAwesome 6 icon
7. targetNodeId MUST reference an existing node id - no broken links!
8. All questions are in Thai language
`;

export async function POST(request: Request) {
  try {
    const { industryName, industryId } = await request.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({ 
        error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY in .env' 
      }, { status: 500 });
    }

    // Get system config from DB
    const sysConfig = await prisma.systemConfig.findUnique({ where: { id: "GLOBAL" } });
    
    if (sysConfig && !sysConfig.aiEnabled) {
      return NextResponse.json({ error: 'AI generation is currently disabled by Admin.' }, { status: 403 });
    }

    // Get industry-specific AI directives
    let aiDirective = '';
    let aiNodeCount = 5;
    let aiToneLevel = 2;
    let aiSmartChoices: string[] = [];
    
    if (industryId) {
      const industry = await prisma.industry.findUnique({ where: { id: industryId } });
      if (industry) {
        if (industry.aiPromptDirective) {
          aiDirective = industry.aiPromptDirective;
        }
        if (industry.aiNodeCount) {
          aiNodeCount = industry.aiNodeCount;
        }
        if (industry.aiToneLevel !== null && industry.aiToneLevel !== undefined) {
          aiToneLevel = industry.aiToneLevel;
        }
        if (industry.aiSmartChoices) {
          try { aiSmartChoices = JSON.parse(industry.aiSmartChoices); } catch {}
        }
      }
    }

    // Tone mapping
    const toneMap: Record<number, string> = {
      0: 'ใช้ภาษาขำๆ สนุกสนาน ตลกหน่อย มีอิโมจิประกอบ เหมือนคุยกับเพื่อนสนิท',
      1: 'ใช้ภาษาชิลๆ เป็นกันเอง ไม่เป็นทางการ พูดง่ายๆ เข้าใจง่าย',
      2: 'ใช้ภาษาปกติ เป็นกลาง สุภาพ อ่านแล้วเข้าใจง่าย',
      3: 'ใช้ภาษาทางการ สุภาพเรียบร้อย เหมาะกับองค์กร',
      4: 'ใช้ภาษาวิชาการ เข้มข้น มีศัพท์เทคนิคประกอบ เหมาะกับผู้เชี่ยวชาญ',
      5: 'ใช้ภาษาเชี่ยวชาญระดับสูงสุด เจาะลึกทุกมิติ วิเคราะห์ทุกมุม แบบที่ปรึกษาธุรกิจระดับโลก',
      6: 'ใช้ภาษาข้ามมิติ ระดับควอนตัม ถามคำถามที่เปิดมุมมองใหม่ กระตุ้นความคิดสร้างสรรค์ระดับสูง คำถามที่คนปกติไม่คิดจะถาม',
      7: 'ใช้ภาษาลึกลับ ปริศนา ชวนให้คิด เหมือนปราชญ์ผู้รู้ที่ตั้งคำถามเพื่อนำไปสู่การค้นพบ คำถามแต่ละข้อต้องกระตุ้นให้ผู้ตอบ "ตาสว่าง" เห็นสิ่งที่มองข้าม',
    };

    // Smart choice mapping
    const smartChoiceMap: Record<string, string> = {
      branching: 'สร้างเส้นทางแยก (Branching) อย่างน้อย 3 เส้นทาง ไม่ใช่เรียงเส้นตรง ตัวเลือกต่างกันต้องพาไปคำถามต่างกัน',
      budget: 'ต้องมีคำถามเกี่ยวกับงบประมาณ ต้นทุน หรือการเงินอย่างน้อย 1 ข้อ',
      skill: 'ต้องมีคำถามเจาะลึกทักษะ ความสามารถ หรือประสบการณ์ที่ต้องการ',
      timeline: 'ต้องมีคำถามเกี่ยวกับระยะเวลา กำหนดส่ง หรือไทม์ไลน์ของโปรเจกต์',
      risk: 'ต้องสอดแทรกคำถามประเมินความเสี่ยง อุปสรรค หรือข้อจำกัดที่อาจเกิดขึ้น',
      sweat: 'ต้องมีคำถามเกี่ยวกับ Sweat Share (การลงแรงแทนเงิน) เช่น ทักษะอะไรที่พร้อมลงแรง',
      location: 'ต้องมีคำถามเกี่ยวกับพื้นที่ ทำเล ภูมิภาค หรือสถานที่ทำงาน',
      collab: 'ต้องเน้นคำถามเกี่ยวกับการจับคู่ผู้ร่วมงาน ทีม หรือพาร์ทเนอร์ที่ต้องการ',
    };

    const toneInstruction = toneMap[aiToneLevel] || toneMap[2];
    const smartInstructions = aiSmartChoices
      .filter(c => smartChoiceMap[c])
      .map(c => `- ${smartChoiceMap[c]}`)
      .join('\n');

    let modelsToTry = [
      'gemini-3.6-flash',
    ];

    if (sysConfig) {
      modelsToTry = [sysConfig.primaryModel];
      if (sysConfig.autoFallback && sysConfig.fallbackModels) {
        const fallbacks = sysConfig.fallbackModels.split(',').map(s => s.trim()).filter(Boolean);
        modelsToTry = [...modelsToTry, ...fallbacks];
      }
    }

    modelsToTry = modelsToTry.map(m => m.replace('models/', ''));

    // Build the enhanced prompt
    const enhancedPrompt = `
You are an expert business flow designer for the MAKE A DOT platform.
Your task is to generate a project/partner evaluation flow for the industry: "${industryName}".

## STRUCTURAL BLUEPRINT (Few-Shot Example)
${FEW_SHOT_EXAMPLE}

## TONE & MOOD
${toneInstruction}

## REQUIREMENTS
- Generate exactly ${aiNodeCount} question nodes + 1 RESULT node (${aiNodeCount + 1} total)
- The first node MUST be type "START" (order 0)
- The last node MUST be type "RESULT" with empty options
- Questions MUST branch (different options lead to different next questions)
- At least 2 different branching paths from the START node
- Each question should have 2-3 options with FontAwesome 6 icons
- All targetNodeId values MUST reference valid node IDs
- All text MUST be in Thai language
- Questions should be deeply relevant to "${industryName}" specifically

${smartInstructions ? `## SMART CHOICE REQUIREMENTS (ความฉลาดเสริม)\n${smartInstructions}` : ''}

${aiDirective ? `## ADMIN SPECIAL DIRECTIVES (HIGHEST PRIORITY)
The admin has provided these specific instructions for this industry. Follow them carefully:
${aiDirective}` : ''}

Generate the flow now.
`;

    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const { object } = await generateObject({
          model: google(modelName),
          schema: flowSchema,
          prompt: enhancedPrompt
        });
        
        return NextResponse.json(object);
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message);
        lastError = err;
      }
    }

    throw lastError;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate flow: ' + error?.message }, { status: 500 });
  }
}
