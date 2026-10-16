import { prisma } from '@/lib/prisma';
import { ProductChain } from '@/components/ecosystem/production/types';
import { normalizeChain, normalizeName } from '@/components/ecosystem/production/schema';

export interface SemanticMatchResult {
  isMatch: boolean;
  canonicalChain: ProductChain | null;
  productChainRecordId?: string;
  matchedKeyword: string;
  matchType: 'EXACT' | 'DATABASE_SYNONYM' | 'HEURISTIC_CLUSTER' | 'AI_SEMANTIC' | 'NEW_CHAIN';
  confidence: number; // 0.0 - 1.0
  explanation: string;
  suggestedNodeOrder?: number; // e.g. for car perfume jump to node 4 or 5
  suggestedNodeTitle?: string;
}

export interface SemanticClusterDef {
  clusterKey: string;
  canonicalName: string;
  sectorOrder: number;
  synonyms: { keyword: string; targetNodeOrder?: number; hint?: string }[];
}

export const CANONICAL_CLUSTERS: SemanticClusterDef[] = [
  {
    clusterKey: 'cluster_aroma',
    canonicalName: 'ผลิตภัณฑ์เครื่องหอมและอโรมา (Aroma & Fragrance)',
    sectorOrder: 2,
    synonyms: [
      { keyword: 'น้ำหอมรถยนต์', targetNodeOrder: 4, hint: 'น้ำหอมปรับอากาศในรถยนต์แบบแขวน/เสียบช่องแอร์' },
      { keyword: 'ก้านไม้หอม', targetNodeOrder: 4, hint: 'ก้านไม้กระจายกลิ่น Reed Diffuser สำหรับห้องนอน/สปา' },
      { keyword: 'reed diffuser', targetNodeOrder: 4, hint: 'ก้านไม้หอมกระจายกลิ่นสไตล์มินิมอล' },
      { keyword: 'เทียนหอม', targetNodeOrder: 3, hint: 'เทียนหอมไขถั่วเหลือง Soy Wax อโรมาเธอราพี' },
      { keyword: 'เทียนหอมอโรมา', targetNodeOrder: 3, hint: 'เทียนหอมบำบัดกลิ่นผ่อนคลาย' },
      { keyword: 'น้ำมันหอมระเหย', targetNodeOrder: 1, hint: 'น้ำมันหอมระเหยสกัดธรรมชาติ 100%' },
      { keyword: 'essential oil', targetNodeOrder: 1, hint: 'Essential Oil หัวเชื้อน้ำมันสกัด' },
      { keyword: 'สเปรย์ปรับอากาศ', targetNodeOrder: 4, hint: 'สเปรย์ฉีดห้องและสเปรย์ดับกลิ่นอับ' },
      { keyword: 'diffuser', targetNodeOrder: 4, hint: 'เครื่องพ่นอโรมาและก้านกระจายกลิ่น' },
      { keyword: 'ก้านหอม', targetNodeOrder: 4, hint: 'ก้านหวายปรับอากาศ' },
      { keyword: 'น้ำหอมในรถ', targetNodeOrder: 4, hint: 'น้ำหอมรถยนต์ดีไซน์หรู' },
      { keyword: 'น้ำหอมปรับอากาศ', targetNodeOrder: 4, hint: 'น้ำหอมดับกลิ่นห้องและรถยนต์' },
      { keyword: 'เครื่องหอม', targetNodeOrder: 1, hint: 'ผลิตภัณฑ์เครื่องหอมครบวงจร' },
      { keyword: 'น้ำหอม', targetNodeOrder: 4, hint: 'น้ำหอมและกลิ่นสัมผัส' },
      { keyword: 'ของชำร่วยเครื่องหอม', targetNodeOrder: 5, hint: 'ก้านหอมและเทียนหอมของชำร่วยงานแต่ง' },
    ],
  },
  {
    clusterKey: 'cluster_coffee',
    canonicalName: 'กาแฟ (อาราบิก้า)',
    sectorOrder: 5,
    synonyms: [
      { keyword: 'กาแฟ', targetNodeOrder: 1, hint: 'ห่วงโซ่กาแฟครบวงจร' },
      { keyword: 'เมล็ดกาแฟ', targetNodeOrder: 2, hint: 'สารกาแฟและเมล็ดคั่ว' },
      { keyword: 'อาราบิก้า', targetNodeOrder: 1, hint: 'กาแฟอาราบิก้าพื้นที่สูง' },
      { keyword: 'โรบัสต้า', targetNodeOrder: 1, hint: 'กาแฟโรบัสต้า' },
      { keyword: 'คั่วกาแฟ', targetNodeOrder: 3, hint: 'โรงคั่วและไมโครโรสเตอร์' },
      { keyword: 'ร้านกาแฟ', targetNodeOrder: 4, hint: 'คาเฟ่และสปีดบาร์' },
      { keyword: 'ดริป', targetNodeOrder: 4, hint: 'กาแฟดริปแบบซองและเมล็ดพิเศษ' },
      { keyword: 'cold brew', targetNodeOrder: 4, hint: 'กาแฟสกัดเย็นพร้อมดื่ม' },
      { keyword: 'coffee', targetNodeOrder: 1, hint: 'Specialty Coffee Value Chain' },
    ],
  },
  {
    clusterKey: 'cluster_skincare',
    canonicalName: 'สกินแคร์/ครีมบำรุงผิว OEM',
    sectorOrder: 2,
    synonyms: [
      { keyword: 'สกินแคร์', targetNodeOrder: 1, hint: 'สกินแคร์และเวชสำอางครบวงจร' },
      { keyword: 'ครีม', targetNodeOrder: 3, hint: 'ครีมบำรุงผิวและครีมหน้าใส' },
      { keyword: 'เซรั่ม', targetNodeOrder: 3, hint: 'เซรั่มบำรุงผิวสูตรเข้มข้น' },
      { keyword: 'skincare', targetNodeOrder: 1, hint: 'Skincare OEM' },
      { keyword: 'มาสก์หน้า', targetNodeOrder: 3, hint: 'แผ่นมาสก์หน้าบำรุงล้ำลึก' },
      { keyword: 'มาร์กหน้า', targetNodeOrder: 3, hint: 'มาสก์หน้าและสลีปปิ้งมาสก์' },
      { keyword: 'ครีมกันแดด', targetNodeOrder: 3, hint: 'กันแดดเนื้อบางเบา' },
      { keyword: 'เวชสำอาง', targetNodeOrder: 2, hint: 'เวชสำอางสำหรับผิวแพ้ง่าย' },
      { keyword: 'oem ครีม', targetNodeOrder: 3, hint: 'สั่งผลิตครีมแบรนด์ตัวเอง' },
    ],
  },
  {
    clusterKey: 'cluster_solar',
    canonicalName: 'โซลาร์เซลล์และงานติดตั้ง',
    sectorOrder: 1,
    synonyms: [
      { keyword: 'โซลาร์เซลล์', targetNodeOrder: 1, hint: 'ระบบโซลาร์เซลล์ครบวงจร' },
      { keyword: 'โซล่าเซลล์', targetNodeOrder: 1, hint: 'แผงโซล่าเซลล์และอินเวอร์เตอร์' },
      { keyword: 'solar', targetNodeOrder: 1, hint: 'Solar Rooftop System' },
      { keyword: 'โซลาร์รูฟท็อป', targetNodeOrder: 4, hint: 'ติดตั้งโซลาร์บนหลังคาบ้าน' },
      { keyword: 'แผงโซลาร์', targetNodeOrder: 2, hint: 'จำหน่ายแผงโซลาร์ Tier-1' },
      { keyword: 'อินเวอร์เตอร์', targetNodeOrder: 2, hint: 'Inverter แปลงไฟระบบโซลาร์' },
      { keyword: 'พลังงานแสงอาทิตย์', targetNodeOrder: 1, hint: 'ระบบพลังงานแสงอาทิตย์' },
    ],
  },
  {
    clusterKey: 'cluster_durian',
    canonicalName: 'ทุเรียนและผลไม้เกรดพรีเมียม',
    sectorOrder: 6,
    synonyms: [
      { keyword: 'ทุเรียน', targetNodeOrder: 1, hint: 'ทุเรียนพรีเมียมหมอนทอง' },
      { keyword: 'durian', targetNodeOrder: 1, hint: 'Premium Fresh Durian' },
      { keyword: 'หมอนทอง', targetNodeOrder: 1, hint: 'ทุเรียนพันธุ์หมอนทอง' },
      { keyword: 'ทุเรียนฟรีซดราย', targetNodeOrder: 3, hint: 'ทุเรียนอบกรอบ Freeze Dried' },
      { keyword: 'ทุเรียนแช่แข็ง', targetNodeOrder: 3, hint: 'เนื้อทุเรียนแช่แข็งส่งออก' },
      { keyword: 'ทุเรียนกวน', targetNodeOrder: 3, hint: 'ทุเรียนกวนแปรรูป' },
      { keyword: 'แกะเนื้อทุเรียน', targetNodeOrder: 4, hint: 'ทุเรียนแกะเนื้อพร้อมทาน' },
    ],
  },
];

export function cleanSearchWord(text: string): string {
  return normalizeName(text).replace(/[#\-_/]/g, '').trim();
}

/**
 * Seed คำพ้องเริ่มต้นลงฐานข้อมูล Prisma เพื่อให้ค้นหาได้เร็วกว่า 5ms
 */
export async function seedSynonymsInDb() {
  try {
    for (const cluster of CANONICAL_CLUSTERS) {
      const chainRecord = await prisma.productChain.findFirst({
        where: {
          OR: [
            { productName: { contains: cluster.canonicalName.slice(0, 10) } },
            { slug: { contains: cluster.clusterKey.replace('cluster_', '') } },
          ],
        },
      });

      if (!chainRecord) continue;

      // Update clusterKey on ProductChain
      if (!chainRecord.clusterKey) {
        await prisma.productChain.update({
          where: { id: chainRecord.id },
          data: { clusterKey: cluster.clusterKey },
        });
      }

      for (const syn of cluster.synonyms) {
        const norm = cleanSearchWord(syn.keyword);
        if (!norm) continue;

        await prisma.productSynonym.upsert({
          where: {
            productChainId_normalized: {
              productChainId: chainRecord.id,
              normalized: norm,
            },
          },
          update: {
            keyword: syn.keyword,
            confidence: 1.0,
          },
          create: {
            productChainId: chainRecord.id,
            keyword: syn.keyword,
            normalized: norm,
            matchType: 'SYNONYM',
            confidence: 1.0,
            hitCount: 1,
          },
        }).catch(() => {});
      }
    }
  } catch (err) {
    console.warn('[seedSynonymsInDb] Warning:', err);
  }
}

/**
 * ค้นหาแบบ Semantic & Synonym Mapping
 * 1) ค้นตรงในฐานข้อมูล ProductSynonym (Exact & Normalized) -> < 5ms
 * 2) ค้นตาม Canonical Clusters Dictionary -> < 2ms (พร้อมเซฟลง DB อัตโนมัติ)
 * 3) Gemini AI Semantic Matcher -> ถ้ามี API key ให้ถาม AI ว่าคำนี้จัดเป็นคำพ้องของผังที่มีอยู่แล้วหรือไม่
 */
export async function resolveSemanticQuery(query: string): Promise<SemanticMatchResult> {
  const rawClean = query.trim();
  if (!rawClean) {
    return {
      isMatch: false,
      canonicalChain: null,
      matchedKeyword: '',
      matchType: 'NEW_CHAIN',
      confidence: 0,
      explanation: 'ไม่ได้ระบุคำค้นหา',
    };
  }

  const norm = cleanSearchWord(rawClean);

  // 1. ตรวจสอบในฐานข้อมูล ProductSynonym (Prisma)
  try {
    const dbSynonym = await prisma.productSynonym.findFirst({
      where: {
        OR: [
          { normalized: norm },
          { keyword: rawClean },
          { normalized: { contains: norm } },
        ],
      },
      include: {
        productChain: {
          include: {
            nodes: {
              orderBy: { nodeOrder: 'asc' },
            },
          },
        },
      },
      orderBy: { hitCount: 'desc' },
    });

    if (dbSynonym && dbSynonym.productChain) {
      // Increment hit count in background
      prisma.productSynonym
        .update({
          where: { id: dbSynonym.id },
          data: { hitCount: { increment: 1 } },
        })
        .catch(() => {});

      const chain = normalizeChain(JSON.parse(dbSynonym.productChain.fullChainJson));
      if (chain) {
        return {
          isMatch: true,
          canonicalChain: chain,
          productChainRecordId: dbSynonym.productChain.id,
          matchedKeyword: dbSynonym.keyword,
          matchType: 'DATABASE_SYNONYM',
          confidence: dbSynonym.confidence || 0.98,
          explanation: `คำค้นหา "${rawClean}" เป็นคำพ้องของ "${dbSynonym.productChain.productName}" ที่ถูกบันทึกในระบบ`,
        };
      }
    }
  } catch (err) {
    console.warn('[resolveSemanticQuery] DB synonym check skipped:', err);
  }

  // 2. ตรวจสอบใน Canonical Clusters Dictionary
  for (const cluster of CANONICAL_CLUSTERS) {
    const foundSyn = cluster.synonyms.find((s) => {
      const sNorm = cleanSearchWord(s.keyword);
      return (
        norm === sNorm ||
        norm.includes(sNorm) ||
        sNorm.includes(norm) ||
        rawClean.includes(s.keyword) ||
        s.keyword.includes(rawClean)
      );
    });

    if (foundSyn) {
      // ค้นหา ProductChain ของ Cluster นี้ใน Prisma DB
      const chainRecord = await prisma.productChain.findFirst({
        where: {
          OR: [
            { clusterKey: cluster.clusterKey },
            { productName: { contains: cluster.canonicalName.slice(0, 10) } },
          ],
        },
      });

      if (chainRecord) {
        // บันทึกคำนี้ลง ProductSynonym อัตโนมัติ เพื่อให้ครั้งต่อไปเจอใน Step 1 ทันที
        prisma.productSynonym
          .upsert({
            where: {
              productChainId_normalized: {
                productChainId: chainRecord.id,
                normalized: norm,
              },
            },
            update: { hitCount: { increment: 1 } },
            create: {
              productChainId: chainRecord.id,
              keyword: rawClean,
              normalized: norm,
              matchType: 'HEURISTIC_CLUSTER',
              confidence: 0.95,
              hitCount: 1,
            },
          })
          .catch(() => {});

        const chain = normalizeChain(JSON.parse(chainRecord.fullChainJson));
        if (chain) {
          const targetNode = foundSyn.targetNodeOrder
            ? chain.supply_chain_nodes.find((n) => n.node_order === foundSyn.targetNodeOrder)
            : undefined;

          return {
            isMatch: true,
            canonicalChain: chain,
            productChainRecordId: chainRecord.id,
            matchedKeyword: foundSyn.keyword,
            matchType: 'HEURISTIC_CLUSTER',
            confidence: 0.95,
            suggestedNodeOrder: foundSyn.targetNodeOrder,
            suggestedNodeTitle: targetNode?.node_title,
            explanation: `คำค้นหา "${rawClean}" จัดอยู่ในกลุ่ม "${cluster.canonicalName}" (พบคำพ้อง "${foundSyn.keyword}") จึงชี้เป้าไปยังผังเดียวกันเพื่อลดความซ้ำซ้อน`,
          };
        }
      }
    }
  }

  // 3. Fallback AI Semantic Classifier (ถ้ามี Gemini API key)
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    '';

  if (apiKey) {
    try {
      const activeChains = await prisma.productChain.findMany({
        select: { id: true, productName: true, subCategoryName: true },
        take: 20,
      });

      if (activeChains.length > 0) {
        const chainsListText = activeChains
          .map((c, i) => `${i + 1}. [ID:${c.id}] ${c.productName} (หมวด: ${c.subCategoryName})`)
          .join('\n');

        const prompt = `คุณคือ Semantic Search Engine สำหรับระบบห่วงโซ่อุปทาน (MAKE A DOT)
มีผู้ใช้พิมพ์คำค้นหาสินค้าว่า: "${rawClean}"

นี่คือรายชื่อผังสินค้าหลักที่มีอยู่ในฐานข้อมูลปัจจุบัน:
${chainsListText}

จงพิจารณาว่าคำว่า "${rawClean}" เป็น "คำพ้อง", "สินค้าชนิดย่อย", หรือ "สินค้าที่ใช้สายการผลิตร่วมกันอย่างชัดเจน" กับรายการใดในระบบหรือไม่?
เช่น:
- "น้ำหอมรถยนต์", "ก้านไม้หอม", "เทียนหอม" -> ควรจับคู่กับ "ผลิตภัณฑ์เครื่องหอมและอโรมา"
- "เมล็ดกาแฟดิบ", "กาแฟดริป" -> ควรจับคู่กับ "กาแฟ"
- "เซรั่มลดสิว" -> ควรจับคู่กับ "สกินแคร์"

หากใช่ ให้ตอบ JSON:
{
  "isMatch": true,
  "matchedChainId": "ID ของสินค้าที่ตรง",
  "confidence": 0.70 ถึง 0.99,
  "reason": "คำอธิบายสั้นๆ ภาษาไทย"
}

หากไม่ใช่สินค้ากลุ่มเดียวกันอย่างสิ้นเชิง ให้ตอบ:
{
  "isMatch": false,
  "reason": "เป็นสินค้าใหม่ที่ต้องผ่าตัดห่วงโซ่ใหม่"
}
ตอบ JSON เท่านั้น`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(text);

          if (parsed.isMatch && parsed.matchedChainId) {
            const matchedRecord = await prisma.productChain.findUnique({
              where: { id: parsed.matchedChainId },
            });

            if (matchedRecord) {
              // Cache into ProductSynonym table automatically!
              await prisma.productSynonym.upsert({
                where: {
                  productChainId_normalized: {
                    productChainId: matchedRecord.id,
                    normalized: norm,
                  },
                },
                update: { hitCount: { increment: 1 } },
                create: {
                  productChainId: matchedRecord.id,
                  keyword: rawClean,
                  normalized: norm,
                  matchType: 'AI_SEMANTIC',
                  confidence: parsed.confidence || 0.85,
                  hitCount: 1,
                },
              });

              const chain = normalizeChain(JSON.parse(matchedRecord.fullChainJson));
              if (chain) {
                return {
                  isMatch: true,
                  canonicalChain: chain,
                  productChainRecordId: matchedRecord.id,
                  matchedKeyword: rawClean,
                  matchType: 'AI_SEMANTIC',
                  confidence: parsed.confidence || 0.85,
                  explanation: `AI วิเคราะห์ว่า "${rawClean}" มีความหมายเป็นส่วนหนึ่งของผัง "${matchedRecord.productName}": ${parsed.reason}`,
                };
              }
            }
          }
        }
      }
    } catch (aiErr) {
      console.warn('[resolveSemanticQuery] AI Semantic Matcher failed:', aiErr);
    }
  }

  // Not matched to any existing chain
  return {
    isMatch: false,
    canonicalChain: null,
    matchedKeyword: rawClean,
    matchType: 'NEW_CHAIN',
    confidence: 1.0,
    explanation: `"${rawClean}" เป็นสินค้าใหม่ที่ยังไม่มีในฐานข้อมูล`,
  };
}

/**
 * ดึงคำแนะนำคำพ้องสำหรับ Search Autocomplete
 */
export async function getSynonymSuggestions(prefix: string): Promise<
  { keyword: string; canonicalName: string; hint?: string }[]
> {
  const norm = cleanSearchWord(prefix);
  if (!norm) return [];

  const list: { keyword: string; canonicalName: string; hint?: string }[] = [];

  for (const cluster of CANONICAL_CLUSTERS) {
    for (const syn of cluster.synonyms) {
      const sNorm = cleanSearchWord(syn.keyword);
      if (sNorm.includes(norm) || syn.keyword.includes(prefix)) {
        list.push({
          keyword: syn.keyword,
          canonicalName: cluster.canonicalName,
          hint: syn.hint,
        });
      }
    }
  }

  return list.slice(0, 8);
}
