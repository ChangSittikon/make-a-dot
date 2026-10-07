import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export interface ClassificationResult {
  industryOrder: number;
  industryName: string;
  suggestedOccupation: string;
  tagType: "OCCUPATION" | "SKILL";
  confidence: number;
  reason: string;
}

const DOT017_INDUSTRIES = [
  { order: 1, name: "ก่อสร้างและอสังหาริมทรัพย์" },
  { order: 2, name: "การแพทย์และสาธารณสุข" },
  { order: 3, name: "เทคโนโลยีและไอที" },
  { order: 4, name: "การศึกษา" },
  { order: 5, name: "อาหารเครื่องดื่ม" },
  { order: 6, name: "เกษตรกรรม" },
  { order: 7, name: "ขนส่ง" },
  { order: 8, name: "การเงิน/การธนาคาร/บัญชี" },
  { order: 9, name: "การท่องเที่ยวและบริการ (โรงแรม)" },
  { order: 10, name: "โรงงานและการผลิต" },
  { order: 11, name: "สื่อ/ความบันเทิง/ศิลปะ" },
  { order: 12, name: "กฎหมาย" },
];

export async function classifyCustomTag(
  tagName: string,
  contextDesc?: string
): Promise<ClassificationResult> {
  const cleanTag = tagName.trim();
  if (!cleanTag) {
    return fallbackClassify("ทั่วไป");
  }

  try {
    const prompt = `คุณคือ "น้องดอท" AI ผู้เชี่ยวชาญด้านการจัดหมวดหมู่อาชีพและทักษะของแพลตฟอร์ม MAKE A DOT ตามโครงสร้างมาตรฐาน DOT017

มีผู้ใช้สร้างแท็กใหม่หรือพิมพ์คำค้นหาว่า: "${cleanTag}"
${contextDesc ? `บริบทของปัญหา/เควสต์: "${contextDesc}"` : ""}

จงวิเคราะห์ความหมายของคำนี้ และจัดเข้ากลุ่ม 12 สายงานมาตรฐานของ DOT017 ดังต่อไปนี้:
1. ก่อสร้างและอสังหาริมทรัพย์
2. การแพทย์และสาธารณสุข
3. เทคโนโลยีและไอที
4. การศึกษา
5. อาหารเครื่องดื่ม
6. เกษตรกรรม
7. ขนส่ง
8. การเงิน/การธนาคาร/บัญชี
9. การท่องเที่ยวและบริการ (โรงแรม)
10. โรงงานและการผลิต
11. สื่อ/ความบันเทิง/ศิลปะ
12. กฎหมาย

ตอบกลับเป็น JSON เท่านั้นในรูปแบบต่อไปนี้ (ห้ามมี markdown codeblock ครอบ ให้ตอบ JSON เพียวๆ):
{
  "industryOrder": 1 ถึง 12,
  "industryName": "ชื่อสายงานที่ตรงกับหมายเลข",
  "suggestedOccupation": "ชื่ออาชีพหลักที่เหมาะสมกับแท็กนี้ เช่น ช่างไฟฟ้า, นักดนตรี, นักพัฒนาซอฟต์แวร์",
  "tagType": "OCCUPATION หรือ SKILL (เลือกอันใดอันหนึ่ง)",
  "confidence": ตัวเลข 70 ถึง 99,
  "reason": "คำอธิบายสั้นๆ ภาษาไทย 1 ประโยคว่าทำไมถึงจัดเข้ากลุ่มนี้"
}`;

    const response = await generateText({
      model: google("gemini-3.6-flash"),
      prompt,
      temperature: 0.2,
    });

    const rawText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(rawText);

    // Validate industryOrder
    const matchedInd = DOT017_INDUSTRIES.find(
      (ind) => ind.order === Number(parsed.industryOrder)
    ) || DOT017_INDUSTRIES.find(
      (ind) => ind.name.includes(parsed.industryName)
    ) || DOT017_INDUSTRIES[2]; // default Tech

    return {
      industryOrder: matchedInd.order,
      industryName: matchedInd.name,
      suggestedOccupation: parsed.suggestedOccupation || cleanTag,
      tagType: parsed.tagType === "OCCUPATION" ? "OCCUPATION" : "SKILL",
      confidence: Math.min(Math.max(Number(parsed.confidence) || 85, 60), 99),
      reason: parsed.reason || `มีความหมายเกี่ยวข้องกับสายงาน${matchedInd.name}`,
    };
  } catch (error) {
    console.warn(`[AI Classifier] Gemini fallback for "${cleanTag}":`, error);
    return fallbackClassify(cleanTag);
  }
}

// Heuristic Fallback Engine
function fallbackClassify(tag: string): ClassificationResult {
  const lower = tag.toLowerCase();

  // Keyword mappings
  if (lower.match(/เพลง|ร้อง|ดนตรี|เสียง|กีตาร์|เบส|กลอง|ถ่าย|กล้อง|แสดง|ละคร|เขียน|คอนเทนต์|กราฟิก|ดีไซน์/)) {
    return {
      industryOrder: 11,
      industryName: "สื่อ/ความบันเทิง/ศิลปะ",
      suggestedOccupation: "นักดนตรี/ครีเอทีฟ",
      tagType: "OCCUPATION",
      confidence: 90,
      reason: "คำนี้เกี่ยวข้องกับดนตรี ศิลปะ หรือสื่อบันเทิง",
    };
  }
  if (lower.match(/โค้ด|โปรแกรม|เว็บ|แอป|ไอที|python|react|node|ai|bot|ระบบ|คอมพิวเตอร์|เน็ตเวิร์ก/)) {
    return {
      industryOrder: 3,
      industryName: "เทคโนโลยีและไอที",
      suggestedOccupation: "นักพัฒนาซอฟต์แวร์",
      tagType: "SKILL",
      confidence: 95,
      reason: "คำนี้เป็นคำเฉพาะทางด้านเทคโนโลยี ซอฟต์แวร์ หรือไอที",
    };
  }
  if (lower.match(/เงิน|หุ้น|คริปโต|เทรด|บัญชี|ภาษี|การเงิน|สินเชื่อ|ธนาคาร|งบ/)) {
    return {
      industryOrder: 8,
      industryName: "การเงิน/การธนาคาร/บัญชี",
      suggestedOccupation: "นักบัญชี/ผู้เชี่ยวชาญการเงิน",
      tagType: "OCCUPATION",
      confidence: 92,
      reason: "คำนี้เกี่ยวข้องกับระบบการเงิน บัญชี หรือการลงทุน",
    };
  }
  if (lower.match(/บ้าน|สร้าง|ช่าง|ซ่อม|แอร์|ท่อ|ไฟ|กระเบื้อง|ออกแบบ|ภายใน|คอนโด|ที่ดิน/)) {
    return {
      industryOrder: 1,
      industryName: "ก่อสร้างและอสังหาริมทรัพย์",
      suggestedOccupation: "ช่างเทคนิค/วิศวกร",
      tagType: "OCCUPATION",
      confidence: 88,
      reason: "คำนี้เกี่ยวข้องกับงานช่าง โครงสร้าง หรืออสังหาริมทรัพย์",
    };
  }
  if (lower.match(/หมอ|ยา|พยาบาล|ฟัน|กายภาพ|สุขภาพ|การแพทย์|คลินิก|บำบัด/)) {
    return {
      industryOrder: 2,
      industryName: "การแพทย์และสาธารณสุข",
      suggestedOccupation: "บุคลากรทางการแพทย์",
      tagType: "OCCUPATION",
      confidence: 93,
      reason: "คำนี้เกี่ยวข้องกับการดูแลสุขภาพหรือการแพทย์",
    };
  }
  if (lower.match(/กฎหมาย|สัญญา|ทนาย|ศาล|คดี|ว่าความ|ลิขสิทธิ์|ทรัพย์สินทางปัญญา/)) {
    return {
      industryOrder: 12,
      industryName: "กฎหมาย",
      suggestedOccupation: "ทนายความ/ที่ปรึกษากฎหมาย",
      tagType: "OCCUPATION",
      confidence: 96,
      reason: "คำนี้เป็นศัพท์ทางกฎหมาย นิติกรรม หรือการว่าความ",
    };
  }
  if (lower.match(/สอน|ติว|เรียน|ครู|อาจารย์|คณิต|ภาษา|อังกฤษ|สอบ/)) {
    return {
      industryOrder: 4,
      industryName: "การศึกษา",
      suggestedOccupation: "ครู/ติวเตอร์",
      tagType: "OCCUPATION",
      confidence: 91,
      reason: "คำนี้เกี่ยวข้องกับการเรียนการสอนและการศึกษา",
    };
  }
  if (lower.match(/อาหาร|เครื่องดื่ม|เบเกอรี่|เชฟ|ทำอาหาร|กาแฟ|บาริสต้า|ร้านอาหาร/)) {
    return {
      industryOrder: 5,
      industryName: "อาหารเครื่องดื่ม",
      suggestedOccupation: "เชฟ/ผู้ประกอบการอาหาร",
      tagType: "OCCUPATION",
      confidence: 90,
      reason: "คำนี้เกี่ยวข้องกับการปรุงอาหารและเครื่องดื่ม",
    };
  }
  if (lower.match(/เกษตร|พืช|ดิน|ปุ๋ย|ฟาร์ม|ปลูก|สัตว์เลี้ยง|วัว|ไก่|สวน/)) {
    return {
      industryOrder: 6,
      industryName: "เกษตรกรรม",
      suggestedOccupation: "เกษตรกร/ผู้เชี่ยวชาญการเกษตร",
      tagType: "OCCUPATION",
      confidence: 89,
      reason: "คำนี้เกี่ยวข้องกับภาคการเกษตรและการเพาะปลูก",
    };
  }
  if (lower.match(/ขับรถ|ขนส่ง|ไรเดอร์|โลจิสติกส์|ส่งของ|คลังสินค้า|เดลิเวอรี่/)) {
    return {
      industryOrder: 7,
      industryName: "ขนส่ง",
      suggestedOccupation: "พนักงานขนส่ง/โลจิสติกส์",
      tagType: "OCCUPATION",
      confidence: 90,
      reason: "คำนี้เกี่ยวข้องกับการขนส่งและโลจิสติกส์",
    };
  }
  if (lower.match(/เที่ยว|โรงแรม|ทัวร์|ไกด์|ต้อนรับ|รีสอร์ท|การบิน/)) {
    return {
      industryOrder: 9,
      industryName: "การท่องเที่ยวและบริการ (โรงแรม)",
      suggestedOccupation: "มัคคุเทศก์/พนักงานบริการ",
      tagType: "OCCUPATION",
      confidence: 90,
      reason: "คำนี้เกี่ยวข้องกับการท่องเที่ยวและการบริการ",
    };
  }
  if (lower.match(/โรงงาน|ผลิต|เครื่องจักร|ฝ่ายผลิต|คิวซี|แพ็ค/)) {
    return {
      industryOrder: 10,
      industryName: "โรงงานและการผลิต",
      suggestedOccupation: "ช่างโรงงาน/เจ้าหน้าที่ฝ่ายผลิต",
      tagType: "OCCUPATION",
      confidence: 88,
      reason: "คำนี้เกี่ยวข้องกับกระบวนการผลิตในโรงงานอุตสาหกรรม",
    };
  }

  // Default General Tech/Service
  return {
    industryOrder: 3,
    industryName: "เทคโนโลยีและไอที",
    suggestedOccupation: "ผู้เชี่ยวชาญเฉพาะทาง",
    tagType: "SKILL",
    confidence: 75,
    reason: "จัดเข้ากลุ่มเทคโนโลยีและบริการเฉพาะทางเบื้องต้น",
  };
}
