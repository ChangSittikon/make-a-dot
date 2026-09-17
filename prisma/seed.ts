import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding WorkTypes...')
  const workTypes = [
    'รับจ้างทั่วไป',
    'พนักงานประจำ',
    'ข้าราชการ/นักการเมือง',
    'วิชาชีพเฉพาะ(ใบประกอบวิชาชีพ)',
    'ผู้ประกอบการ/ร้านค้า',
    'ฟรีแลนซ์/อาชีพอิสระ',
    'นักเรียน/นักศึกษา',
    'นักลงทุน'
  ]

  for (const wt of workTypes) {
    await prisma.workType.upsert({
      where: { name: wt },
      update: {},
      create: { name: wt }
    })
  }

  console.log('Seeding Industries, Occupations, and SkillTags...')
  
  const industriesData = [
    {
      name: 'ก่อสร้างและอสังหาริมทรัพย์',
      occupations: [
        { name: 'สถาปนิก', skills: ['AutoCAD', 'ออกแบบโครงสร้าง', '3D Modeling'] },
        { name: 'วิศวกรโยธา', skills: ['คำนวณโครงสร้าง', 'คุมงานก่อสร้าง', 'Survey'] },
        { name: 'นายหน้าอสังหาฯ', skills: ['ประเมินราคา', 'เจรจาต่อรอง', 'การตลาดอสังหา'] }
      ]
    },
    {
      name: 'การแพทย์และสาธารณสุข',
      occupations: [
        { name: 'แพทย์ทั่วไป', skills: ['วินิจฉัยโรค', 'จ่ายยา', 'การปฐมพยาบาล'] },
        { name: 'พยาบาลวิชาชีพ', skills: ['ดูแลผู้ป่วย', 'เจาะเลือด', 'บันทึกอาการ'] },
        { name: 'นักกายภาพบำบัด', skills: ['ประเมินร่างกาย', 'เครื่องมืออัลตราซาวนด์', 'จัดกระดูก'] }
      ]
    },
    {
      name: 'เทคโนโลยีและไอที',
      occupations: [
        { name: 'Software Engineer', skills: ['React.js', 'Node.js', 'System Architecture'] },
        { name: 'Data Scientist', skills: ['Python', 'Machine Learning', 'Data Visualization'] },
        { name: 'UX/UI Designer', skills: ['Figma', 'User Research', 'Prototyping'] }
      ]
    },
    {
      name: 'การศึกษา',
      occupations: [
        { name: 'ครู/อาจารย์', skills: ['จิตวิทยาการสอน', 'สร้างแผนการเรียน', 'ประเมินผล'] },
        { name: 'ติวเตอร์อิสระ', skills: ['คณิตศาสตร์', 'ภาษาอังกฤษ', 'สื่อการสอน'] }
      ]
    },
    {
      name: 'อาหารเครื่องดื่ม',
      occupations: [
        { name: 'เชฟ/พ่อครัว', skills: ['ประกอบอาหาร', 'คิดค้นเมนู', 'บริหารสต๊อกวัตถุดิบ'] },
        { name: 'บาริสต้า', skills: ['Latte Art', 'คั่วกาแฟ', 'บริการลูกค้า'] }
      ]
    },
    {
      name: 'เกษตรกรรม',
      occupations: [
        { name: 'นักวิชาการเกษตร', skills: ['พัฒนาสายพันธุ์', 'วิเคราะห์ดิน', 'ปุ๋ยอินทรีย์'] },
        { name: 'เกษตรกรสมาร์ทฟาร์ม', skills: ['IoT เพื่อการเกษตร', 'ระบบน้ำหยด', 'โดรนเกษตร'] }
      ]
    },
    {
      name: 'ขนส่ง',
      occupations: [
        { name: 'พนักงานขับรถบรรทุก', skills: ['ใบอนุญาต ท.4', 'ขับขี่ปลอดภัย', 'ดูแลเครื่องยนต์'] },
        { name: 'ผู้จัดการลอจิสติกส์', skills: ['วางแผนเส้นทาง', 'บริหารคลังสินค้า', 'Supply Chain'] }
      ]
    },
    {
      name: 'การเงิน/การธนาคาร/บัญชี',
      occupations: [
        { name: 'นักบัญชี', skills: ['ปิดงบ', 'ภาษีอากร', 'โปรแกรม Express'] },
        { name: 'นักวิเคราะห์การเงิน', skills: ['ประเมินมูลค่าหุ้น', 'การเงินองค์กร', 'Excel Modeling'] }
      ]
    },
    {
      name: 'การท่องเที่ยวและบริการ (โรงแรม)',
      occupations: [
        { name: 'มัคคุเทศก์ (ไกด์)', skills: ['ภาษาต่างประเทศ', 'ประวัติศาสตร์', 'แก้ปัญหาเฉพาะหน้า'] },
        { name: 'พนักงานต้อนรับ', skills: ['บริการลูกค้า', 'ระบบจองห้องพัก', 'สื่อสารข้ามวัฒนธรรม'] }
      ]
    },
    {
      name: 'โรงงานและการผลิต',
      occupations: [
        { name: 'ผู้ควบคุมเครื่องจักร', skills: ['CNC', 'บำรุงรักษาเครื่องจักร', 'ความปลอดภัยในโรงงาน'] },
        { name: 'วิศวกรการผลิต', skills: ['Lean Manufacturing', 'ควบคุมคุณภาพ (QC)', 'วางแผนการผลิต'] }
      ]
    },
    {
      name: 'สื่อ/ความบันเทิง/ศิลปะ',
      occupations: [
        { name: 'โปรดิวเซอร์เพลง', skills: ['Pro Tools', 'Sound Design', 'Mixing & Mastering'] },
        { name: 'ผู้กำกับวิดีโอ', skills: ['Storyboarding', 'มุมกล้อง', 'Premiere Pro'] }
      ]
    },
    {
      name: 'กฎหมาย',
      occupations: [
        { name: 'ทนายความ', skills: ['ว่าความ', 'ร่างสัญญา', 'กฎหมายธุรกิจ'] },
        { name: 'ที่ปรึกษากฎหมาย', skills: ['เจรจาไกล่เกลี่ย', 'กฎหมายทรัพย์สินทางปัญญา', 'ตรวจสอบเอกสาร (Due Diligence)'] }
      ]
    }
  ]

  for (const ind of industriesData) {
    let industry = await prisma.industry.findFirst({
      where: { name: ind.name }
    })
    
    if (!industry) {
      industry = await prisma.industry.create({
        data: { name: ind.name }
      })
    }

    for (const occ of ind.occupations) {
      let occupation = await prisma.occupation.findFirst({
        where: { name: occ.name, industryId: industry.id }
      })

      if (!occupation) {
        occupation = await prisma.occupation.create({
          data: {
            name: occ.name,
            industryId: industry.id
          }
        })
      }

      for (const skill of occ.skills) {
        const existingSkill = await prisma.skillTag.findFirst({
          where: { name: skill, occupationId: occupation.id }
        })

        if (!existingSkill) {
          await prisma.skillTag.create({
            data: {
              name: skill,
              occupationId: occupation.id
            }
          })
        }
      }
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })