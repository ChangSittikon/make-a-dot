const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const FLOW_INDUSTRY_NAME = "🔧 แจ้งปัญหา Flow";

async function main() {
  const industry = await prisma.industry.findFirst({ where: { name: FLOW_INDUSTRY_NAME } });
  if (!industry) { console.error("Industry not found"); process.exit(1); }
  console.log("Found:", industry.name, industry.id);

  const deleted = await prisma.node.deleteMany({ where: { industryId: industry.id } });
  console.log("Deleted old nodes:", deleted.count);

  // Step 1: OPTIONS - problemCategory
  await prisma.node.create({ data: {
    industryId: industry.id, type: "INPUT", order: 0,
    question: "คุณเจอปัญหาเกี่ยวกับอะไร?",
    inputType: "OPTIONS", fieldName: "problemCategory",
    options: { create: [
      { label: "💰 เงิน/ธุรกิจ", order: 0, vectorWeight: '{"value":"เงิน/ธุรกิจ"}', icon: "fa-solid fa-coins" },
      { label: "👔 งาน/อาชีพ", order: 1, vectorWeight: '{"value":"งาน/อาชีพ"}', icon: "fa-solid fa-briefcase" },
      { label: "🏥 สุขภาพ", order: 2, vectorWeight: '{"value":"สุขภาพ"}', icon: "fa-solid fa-heart-pulse" },
      { label: "💞 ความสัมพันธ์", order: 3, vectorWeight: '{"value":"ความสัมพันธ์"}', icon: "fa-solid fa-heart" },
      { label: "💡 โปรเจกต์/ไอเดีย", order: 4, vectorWeight: '{"value":"โปรเจกต์/ไอเดีย"}', icon: "fa-solid fa-lightbulb" },
      { label: "⚖️ กฎหมาย", order: 5, vectorWeight: '{"value":"กฎหมาย"}', icon: "fa-solid fa-scale-balanced" },
      { label: "✏️ อื่นๆ (ระบุเอง)", order: 6, vectorWeight: '{"value":"OTHER"}', icon: "fa-solid fa-ellipsis" }
    ]}
  }});
  console.log("Step 1 created");

  // Step 2: DYNAMIC_REWARD
  await prisma.node.create({ data: {
    industryId: industry.id, type: "INPUT", order: 1,
    question: "ถ้ามีคนแก้ปัญหาให้คุณได้... คุณยินดีให้ค่าตอบแทนเท่าไร?",
    inputType: "DYNAMIC_REWARD", fieldName: "bountyReward",
    suggestions: JSON.stringify(["100", "1000", "10000", "100000", "500000"])
  }});
  console.log("Step 2 created");

  // Step 3: CASCADING_OPTIONS
  await prisma.node.create({ data: {
    industryId: industry.id, type: "INPUT", order: 2,
    question: '"รู้เขา รู้เรา" ฉันคือนักแก้ปัญหา... เราคิดว่ามีความสามารถพอจะช่วยคุณได้นะ ... แล้วคุณละ ทำงานเกี่ยวกับอะไร?',
    inputType: "CASCADING_OPTIONS", fieldName: "requesterProfile"
  }});
  console.log("Step 3 created");

  // Step 4: TEXTAREA - rawDescription
  await prisma.node.create({ data: {
    industryId: industry.id, type: "INPUT", order: 3,
    question: "มีอะไรอยากบอกเรา... เล่ารายละเอียดปัญหา หรือผลลัพธ์ที่คุณอยากเห็นให้เราฟังหน่อย",
    inputType: "TEXTAREA", fieldName: "rawDescription",
    suggestions: JSON.stringify(["ปัญหา: \nสิ่งที่คาดหวัง: \nข้อจำกัด: "])
  }});
  console.log("Step 4 created");

  // Step 5: MAGIC_SEARCH
  await prisma.node.create({ data: {
    industryId: industry.id, type: "INPUT", order: 4,
    question: "คุณคิดว่าต้องใช้ผู้เชี่ยวชาญด้านไหนมาช่วย?",
    inputType: "MAGIC_SEARCH", fieldName: "magicSearch",
    suggestions: JSON.stringify(["โปรแกรมเมอร์", "นักบัญชี", "ทนายความ", "นักออกแบบ", "นักการตลาด"])
  }});
  console.log("Step 5 created");

  console.log("Visionary Funnel seeded OK");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => process.exit(0));
