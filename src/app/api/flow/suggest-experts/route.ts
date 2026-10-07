import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { prisma } from "@/lib/prisma";
import { VALID_IMPACT_SCALES } from "@/config/taxonomy";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Fallback dictionary mapping keywords to relevant occupations
const KEYWORD_OCCUPATION_MAP: Record<string, string[]> = {
  // สายก่อสร้างและช่าง
  "หลังคา": ["ช่างซ่อมหลังคา", "ผู้รับเหมาต่อเติม", "สถาปนิก", "วิศวกรโยธา"],
  "รั่ว": ["ช่างประปา", "ช่างซ่อมหลังคา", "ช่างเทคนิค"],
  "ซ่อม": ["ช่างซ่อมบำรุง", "ช่างเทคนิค", "ช่างเครื่องกล", "ผู้รับเหมา"],
  "บ้าน": ["สถาปนิก", "วิศวกรโยธา", "ผู้รับเหมาก่อสร้าง", "มัณฑนากร (Interior)"],
  "ไฟ": ["ช่างไฟฟ้า", "วิศวกรไฟฟ้า", "ช่างเทคนิค"],
  "แอร์": ["ช่างแอร์", "ช่างเทคนิคเครื่องทำความเย็น", "ช่างซ่อมบำรุง"],
  "ท่อ": ["ช่างประปา", "ช่างสุขาภิบาล", "ผู้รับเหมา"],

  // สายรถ/ยานยนต์/ขนส่ง
  "รถ": ["ช่างยนต์", "ช่างซ่อมรถยนต์", "คนขับรถมืออาชีพ", "ผู้จัดการโลจิสติกส์"],
  "ส่งของ": ["พนักงานขับรถขนส่ง", "ผู้จัดการโลจิสติกส์", "ไรเดอร์ส่งของ"],

  // สายอาหาร/เครื่องดื่ม
  "อาหาร": ["เชฟ/พ่อครัว", "ที่ปรึกษาร้านอาหาร", "นักโภชนาการ", "บาริสต้า"],
  "กาแฟ": ["บาริสต้า", "ผู้เชี่ยวชาญเมล็ดกาแฟ", "ที่ปรึกษาเปิดร้าน"],
  "ร้านอาหาร": ["ผู้จัดการร้านอาหาร", "เชฟ", "นักการตลาดร้านอาหาร"],

  // สายสุขภาพ/ร่างกาย
  "ปวด": ["นักกายภาพบำบัด", "แพทย์เวชศาสตร์ฟื้นฟู", "เทรนเนอร์"],
  "ป่วย": ["แพทย์ทั่วไป", "พยาบาลวิชาชีพ", "เภสัชกร"],
  "ยา": ["เภสัชกร", "แพทย์ทั่วไป"],
  "จิต": ["จิตแพทย์", "นักจิตวิทยาการปรึกษา", "ไลฟ์โค้ช"],

  // สายธุรกิจ/บัญชี/กฎหมาย
  "ภาษี": ["นักบัญชี", "ผู้ตรวจสอบบัญชี", "ที่ปรึกษาภาษี"],
  "บัญชี": ["นักบัญชี", "สมุห์บัญชี", "นักวิเคราะห์การเงิน"],
  "สัญญา": ["ทนายความ", "ที่ปรึกษากฎหมาย", "นิติกร"],
  "คดี": ["ทนายความว่าความ", "ที่ปรึกษากฎหมาย"],
  "ขาย": ["นักการตลาด", "ผู้เชี่ยวชาญการยิงแอด", "พนักงานขาย"],
  "ลูกค้าน้อย": ["นักการตลาดออนไลน์", "ที่ปรึกษาพัฒนาธุรกิจ", "คอนเทนต์ครีเอเตอร์"],

  // สายเทค/ดิจิทัล
  "เว็บ": ["Software Engineer", "Web Developer", "UX/UI Designer"],
  "แอพ": ["Mobile Developer", "Software Engineer", "Product Manager"],
  "ระบบ": ["System Analyst", "DevOps Engineer", "Software Engineer"],
  "โลโก้": ["Graphic Designer", "Brand Designer", "นักออกแบบ"],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rawDescription, problemCategory, requesterIndustryName, requesterWorkTypeName } = body;

    const desc = typeof rawDescription === "string" ? rawDescription.trim() : "";
    const category = typeof problemCategory === "string" ? problemCategory.trim() : "";
    const industry = typeof requesterIndustryName === "string" ? requesterIndustryName.trim() : "";

    // 1. If Gemini API key is configured and description has substantive length, run AI
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && desc.length >= 5) {
      try {
        const prompt = `คุณคือน้องดอท AI ผู้ช่วยวิเคราะห์ความต้องการเพื่อแนะนำกลุ่มอาชีพหรือทักษะที่สามารถช่วยแก้ไขปัญหานี้ได้ตรงจุดที่สุด

ข้อมูลปัญหาของผู้ใช้:
- รายละเอียดปัญหา: "${desc}"
${category ? `- หมวดหมู่ปัญหาเบื้องต้น: "${category}"` : ""}
${industry ? `- สายงานของผู้ส่ง: "${industry}"` : ""}
${requesterWorkTypeName ? `- รูปแบบงานของผู้ส่ง: "${requesterWorkTypeName}"` : ""}

หน้าที่ของคุณ (2 อย่าง):

1. แนะนำอาชีพหรือทักษะ 4 ถึง 6 รายการ ที่ตรงและเหมาะสมในการแก้ไขปัญหานี้ที่สุด

2. ประเมินขนาดผลกระทบ (Impact Scale) ของปัญหานี้ เลือก 1 จาก 6 ระดับ:
  - MICRO = ปัญหาส่วนตัว/ครอบครัว (เช่น ซ่อมหลังคาบ้าน, ปวดหลัง)
  - LOCAL = ปัญหาชุมชน/ธุรกิจท้องถิ่น (เช่น ร้านค้าลูกค้าน้อย, หมู่บ้านขาดน้ำ)
  - MACRO = ปัญหาระดับอุตสาหกรรม/ประเทศ (เช่น ปฏิรูปการศึกษา, ปัญหาขนส่งสาธารณะ)
  - STRUCTURAL = ปัญหาเชิงโครงสร้างระบบ (เช่น ความเหลื่อมล้ำทางเศรษฐกิจ, ระบบสาธารณสุข)
  - GLOBAL = ปัญหาระดับโลก (เช่น Climate Change, อาหารโลก)
  - MOONSHOT = ภารกิจอนาคตมนุษยชาติ (เช่น ตั้งอาณานิคมดาวอังคาร, AGI, ยืดอายุขัย 200 ปี)

ข้อกำหนดสำคัญมาก:
1. ชื่ออาชีพต้องสั้น กระชับ กะทัดรัด (ความยาวไม่เกิน 2 ถึง 4 คำ เช่น "ช่างซ่อมหลังคา", "นักยิงแอด", "สถาปนิก", "ผู้รับเหมา", "Growth Hacker")
2. ห้ามใส่วงเล็บคำแปลภาษาอังกฤษยาวๆ เช่น ห้ามตอบ "นักการตลาดสายเติบโต (Growth Hacker)" ให้ตอบสั้นๆ ว่า "นักการตลาด" หรือ "Growth Hacker" เพื่อให้แสดงเป็นป้ายชิปที่กะทัดรัด
3. เน้นอาชีพที่ปฏิบัติงานจริงและแก้ปัญหานี้ได้ตรงจุดที่สุด

ตอบกลับเฉพาะ JSON object เท่านั้น (ห้ามมี markdown codeblock หรือคำอธิบายอื่น):
{"suggestions": ["อาชีพที่ 1", "อาชีพที่ 2", "อาชีพที่ 3", "อาชีพที่ 4"], "impactScale": "LOCAL"}`;

        const aiResponse = await generateText({
          model: google("gemini-3.6-flash"),
          prompt,
          temperature: 0.3,
        });

        const cleanJson = aiResponse.text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        // Support both new object format {suggestions: [...], impactScale: "..."} and legacy array format
        let suggestionsArr: string[] = [];
        let aiImpactScale = "LOCAL";

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Array.isArray(parsed.suggestions)) {
          suggestionsArr = parsed.suggestions;
          if (typeof parsed.impactScale === "string" && VALID_IMPACT_SCALES.includes(parsed.impactScale.toUpperCase() as any)) {
            aiImpactScale = parsed.impactScale.toUpperCase();
          }
        } else if (Array.isArray(parsed)) {
          suggestionsArr = parsed;
        }

        if (suggestionsArr.length > 0) {
          const sanitized = suggestionsArr
            .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
            .map((s) => s.trim())
            .slice(0, 6);

          if (sanitized.length > 0) {
            return NextResponse.json({
              success: true,
              suggestions: sanitized,
              impactScale: aiImpactScale,
              source: "AI",
            });
          }
        }
      } catch (aiErr) {
        console.warn("[suggest-experts] Gemini AI error, falling back to heuristic:", aiErr);
      }
    }

    // 2. Local heuristic fallback: Match keywords in description
    const foundOccs = new Set<string>();
    for (const [kw, occs] of Object.entries(KEYWORD_OCCUPATION_MAP)) {
      if (desc.includes(kw)) {
        occs.forEach((o) => foundOccs.add(o));
      }
    }

    // 3. If keyword matched, return top 5
    if (foundOccs.size >= 3) {
      return NextResponse.json({
        success: true,
        suggestions: Array.from(foundOccs).slice(0, 6),
        impactScale: "LOCAL",
        source: "KEYWORD",
      });
    }

    // 4. Query DB for occupations in the selected industry or general fallback
    let dbOccupations: string[] = [];
    if (industry) {
      const matchedInd = await prisma.industry.findFirst({
        where: { name: { contains: industry } },
        include: { occupations: { take: 6, select: { name: true } } },
      });
      if (matchedInd && matchedInd.occupations.length > 0) {
        dbOccupations = matchedInd.occupations.map((o) => o.name);
      }
    }

    if (dbOccupations.length === 0) {
      dbOccupations = ["ช่างเทคนิค/ซ่อมบำรุง", "ที่ปรึกษาธุรกิจ", "นักบัญชี", "ทนายความ", "Software Engineer", "นักการตลาด"];
    }

    // Merge any found keywords with DB occupations
    const finalSuggestions = Array.from(new Set([...foundOccs, ...dbOccupations])).slice(0, 6);

    return NextResponse.json({
      success: true,
      suggestions: finalSuggestions,
      impactScale: "LOCAL",
      source: "FALLBACK",
    });
  } catch (error) {
    console.error("[suggest-experts] Error:", error);
    return NextResponse.json({
      success: true,
      suggestions: ["ช่างเทคนิค/ซ่อมบำรุง", "ที่ปรึกษาธุรกิจ", "นักบัญชี", "ทนายความ", "Software Engineer", "นักการตลาด"],
      impactScale: "LOCAL",
      source: "DEFAULT",
    });
  }
}
