import { prisma } from '@/lib/prisma';
import { ProductChain, ChainSource } from '@/components/ecosystem/production/types';
import { SEED_CHAINS } from '@/components/ecosystem/production/seed';
import { normalizeChain, normalizeName } from '@/components/ecosystem/production/schema';
import { TAXONOMY } from '@/components/ecosystem/production/taxonomy';

const OFFICIAL_12_INDUSTRIES: Record<number, { name: string; icon: string }> = {
  1: { name: 'ก่อสร้างและอสังหาริมทรัพย์', icon: 'fa-solid fa-Wall-brick' },
  2: { name: 'การแพทย์และสาธารณสุข', icon: 'fa-solid fa-stethoscope' },
  3: { name: 'เทคโนโลยีและไอที', icon: 'fa-solid fa-microchip' },
  4: { name: 'การศึกษา', icon: 'fa-solid fa-graduation-cap' },
  5: { name: 'อาหารเครื่องดื่ม', icon: 'fa-solid fa-utensils' },
  6: { name: 'เกษตรกรรม', icon: 'fa-solid fa-seedling' },
  7: { name: 'ขนส่ง', icon: 'fa-solid fa-truck-fast' },
  8: { name: 'การเงิน/การธนาคาร/บัญชี', icon: 'fa-solid fa-coins' },
  9: { name: 'การท่องเที่ยวและบริการ (โรงแรม)', icon: 'fa-solid fa-umbrella-beach' },
  10: { name: 'โรงงานและการผลิต', icon: 'fa-solid fa-industry' },
  11: { name: 'สื่อ/ความบันเทิง/ศิลปะ', icon: 'fa-solid fa-film' },
  12: { name: 'กฎหมาย', icon: 'fa-solid fa-scale-balanced' },
};

let isSeededCache = false;

export function parseSectorOrder(sectorId?: string | number): number {
  if (typeof sectorId === 'number' && sectorId >= 1 && sectorId <= 12) {
    return sectorId;
  }
  const raw = String(sectorId || '').replace(/\D/g, '');
  const n = parseInt(raw, 10);
  if (n >= 1 && n <= 12) return n;
  return 5; // Default to Food & Beverage if unspecified
}

export function buildSlug(text: string): string {
  const norm = normalizeName(text);
  const hash = Array.from(text).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
  const cleanAscii = text
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return cleanAscii || `chain-${Math.abs(hash)}`;
}

/**
 * ค้นหาหรือสร้าง Industry จากตาราง Industry เดิม (Single Source of Truth 1..12)
 */
export async function resolveIndustryByOrder(sectorOrder: number) {
  const order = Math.min(Math.max(sectorOrder || 5, 1), 12);
  let ind = await prisma.industry.findFirst({
    where: { order },
  });

  if (!ind) {
    const meta = OFFICIAL_12_INDUSTRIES[order] || OFFICIAL_12_INDUSTRIES[5];
    ind = await prisma.industry.create({
      data: {
        name: meta.name,
        icon: meta.icon,
        order,
      },
    });
  }
  return ind;
}

/**
 * จับคู่ WorkType (Layer 1) และ Occupation (Layer 3) จากฐานข้อมูล DOT017
 */
async function resolveTaxonomyLinks(
  industryId: string,
  modelName: string,
  personaTags: string[]
): Promise<{ workTypeId: string | null; occupationId: string | null }> {
  const tagsJoined = (personaTags || []).join(' ');
  let targetWorkTypeName = 'ผู้ประกอบการ/ร้านค้า';
  if (tagsJoined.includes('งบ 0 บาท') || tagsJoined.includes('ทำที่บ้าน') || tagsJoined.includes('สายขาย')) {
    targetWorkTypeName = 'ฟรีแลนซ์/อาชีพอิสระ';
  } else if (tagsJoined.includes('รับจ้าง')) {
    targetWorkTypeName = 'รับจ้างทั่วไป';
  }

  const [workType, occupations] = await Promise.all([
    prisma.workType.findFirst({
      where: { name: { contains: targetWorkTypeName.split('/')[0] } },
      select: { id: true },
    }),
    prisma.occupation.findMany({
      where: { industryId },
      select: { id: true, name: true },
    }),
  ]);

  let matchedOccId: string | null = null;
  const cleanModel = modelName.toLowerCase();
  for (const occ of occupations) {
    const occLower = occ.name.toLowerCase();
    if (cleanModel.includes(occLower) || occLower.includes(cleanModel.slice(0, 8))) {
      matchedOccId = occ.id;
      break;
    }
  }
  if (!matchedOccId && occupations.length > 0) {
    matchedOccId = occupations[0].id;
  }

  return {
    workTypeId: workType?.id ?? null,
    occupationId: matchedOccId,
  };
}

/**
 * บันทึกหรืออัปเดต ProductChain ลงฐานข้อมูล Prisma พร้อมเชื่อม Industry, Archetype, 5 Nodes และ Micro-Opportunities
 */
export async function upsertProductChainToDb(
  chain: ProductChain,
  source: ChainSource = 'GEMINI',
  statusOverride?: 'VERIFIED' | 'PENDING_REVIEW'
) {
  const sectorOrder = parseSectorOrder(chain.taxonomy.sector_id);
  const industry = await resolveIndustryByOrder(sectorOrder);

  // 1. Upsert SupplyChainArchetype
  const archetypeCode = `ARCH_${String(sectorOrder).padStart(2, '0')}_${buildSlug(chain.taxonomy.archetype_name || chain.taxonomy.sub_category_name).slice(0, 20).toUpperCase()}`;
  const archetype = await prisma.supplyChainArchetype.upsert({
    where: { code: archetypeCode },
    update: {
      name: chain.taxonomy.archetype_name || `แม่พิมพ์มาตรฐาน ${industry.name}`,
      industryId: industry.id,
    },
    create: {
      code: archetypeCode,
      name: chain.taxonomy.archetype_name || `แม่พิมพ์มาตรฐาน ${industry.name}`,
      industryId: industry.id,
      description: `แม่พิมพ์ห่วงโซ่อุปทาน 5 ขั้นตอนในกลุ่ม ${chain.taxonomy.sub_category_name}`,
    },
  });

  const slug = buildSlug(chain.product.product_id || chain.product.product_name);
  const status = statusOverride || (source === 'SEED' ? 'VERIFIED' : 'PENDING_REVIEW');

  // 2. Upsert ProductChain
  const existing = await prisma.productChain.findFirst({
    where: {
      OR: [
        { slug },
        { productName: chain.product.product_name },
      ],
    },
  });

  let productChainRecord;
  if (existing) {
    productChainRecord = await prisma.productChain.update({
      where: { id: existing.id },
      data: {
        productName: chain.product.product_name,
        subCategoryName: chain.taxonomy.sub_category_name,
        archetypeName: chain.taxonomy.archetype_name,
        industryId: industry.id,
        sectorOrder,
        archetypeId: archetype.id,
        baseUnitReference: chain.product.base_unit_reference,
        conversionSummary: chain.product.conversion_summary,
        originCostThb: chain.product.total_value_spread.origin_cost_thb,
        finalRetailValueThb: chain.product.total_value_spread.final_retail_value_thb,
        totalMarkupPercent: chain.product.total_value_spread.total_markup_percent,
        searchKeywordsJson: JSON.stringify(chain.product.search_keywords || []),
        fullChainJson: JSON.stringify(chain),
        source,
        status: existing.status === 'VERIFIED' ? 'VERIFIED' : status,
        searchCount: { increment: 1 },
      },
    });

    // Clear old nodes to replace cleanly
    await prisma.supplyChainNodeRecord.deleteMany({
      where: { productChainId: existing.id },
    });
  } else {
    productChainRecord = await prisma.productChain.create({
      data: {
        slug,
        productName: chain.product.product_name,
        subCategoryName: chain.taxonomy.sub_category_name,
        archetypeName: chain.taxonomy.archetype_name,
        industryId: industry.id,
        sectorOrder,
        archetypeId: archetype.id,
        baseUnitReference: chain.product.base_unit_reference,
        conversionSummary: chain.product.conversion_summary,
        originCostThb: chain.product.total_value_spread.origin_cost_thb,
        finalRetailValueThb: chain.product.total_value_spread.final_retail_value_thb,
        totalMarkupPercent: chain.product.total_value_spread.total_markup_percent,
        searchKeywordsJson: JSON.stringify(chain.product.search_keywords || []),
        fullChainJson: JSON.stringify(chain),
        source,
        status,
        searchCount: 1,
      },
    });
  }

  // 3. Create 5 SupplyChainNodeRecords + MicroOpportunityRecords
  for (const node of chain.supply_chain_nodes) {
    const createdNode = await prisma.supplyChainNodeRecord.create({
      data: {
        productChainId: productChainRecord.id,
        nodeOrder: node.node_order,
        stageType: node.stage_type,
        nodeTitle: node.node_title,
        equivalentQuantity: node.equivalent_quantity,
        whatHow: node.five_w_two_h.what_how,
        whoIncumbent: node.five_w_two_h.who_incumbent,
        whereLocation: node.five_w_two_h.where,
        whenCycleTime: node.five_w_two_h.when_cycle_time,
        whenWaitTime: node.five_w_two_h.when_wait_time,
        costThb: node.five_w_two_h.how_much_cost_thb,
        sellingThb: node.five_w_two_h.how_much_selling_thb,
        painPoint: node.five_w_two_h.pain_point,
        marginJumpPercent: node.margin_jump_to_next_node_percent,
        isHighMarginBottleneck: node.is_high_margin_bottleneck,
        trafficLight: node.traffic_light,
      },
    });

    for (const opp of node.micro_opportunities) {
      const { workTypeId, occupationId } = await resolveTaxonomyLinks(
        industry.id,
        opp.model_name,
        opp.target_persona_tags
      );

      await prisma.microOpportunityRecord.create({
        data: {
          nodeId: createdNode.id,
          strategyType: opp.strategy_type,
          modelName: opp.model_name,
          howToStart: opp.how_to_start,
          capitalRequiredThb: opp.capital_required_thb,
          expectedMarginPercent: opp.expected_margin_percent,
          personaTagsJson: JSON.stringify(opp.target_persona_tags || []),
          feasibilityScoreJson: JSON.stringify(opp.feasibility_score || {}),
          toolsAndEquipment: opp.required_weapons.tools_and_equipment,
          skillsNeeded: opp.required_weapons.skills_needed,
          legalAndPermits: opp.required_weapons.legal_and_permits,
          actionLinksJson: JSON.stringify(opp.action_links || {}),
          workTypeId,
          occupationId,
        },
      });
    }
  }

  return productChainRecord;
}

/**
 * Seed ข้อมูลเริ่มต้น (5 Flagship Chains + Default Pooling Rooms + Synonyms) เข้าสู่ Prisma DB อัตโนมัติ
 */
export async function ensureProductionSeeded() {
  if (isSeededCache) return;
  try {
    const count = await prisma.productChain.count();
    if (count < 5) {
      for (const chain of Object.values(SEED_CHAINS)) {
        await upsertProductChainToDb(chain, 'SEED', 'VERIFIED');
      }

      // Seed default GroupPoolingRooms
      const roomCount = await prisma.groupPoolingRoom.count();
      if (roomCount === 0) {
        const coffeeRecord = await prisma.productChain.findFirst({
          where: { productName: { contains: 'กาแฟ' } },
        });
        const skincareRecord = await prisma.productChain.findFirst({
          where: { productName: { contains: 'สกินแคร์' } },
        });
        const aromaRecord = await prisma.productChain.findFirst({
          where: { productName: { contains: 'เครื่องหอม' } },
        });

        await prisma.groupPoolingRoom.createMany({
          data: [
            {
              productChainId: coffeeRecord?.id ?? null,
              productName: 'กาแฟ (อาราบิก้า)',
              modelName: 'รวมกลุ่มสั่งคั่วเมล็ดกาแฟ Specialty ล็อต 100 กก.',
              mode: 'รวมกลุ่มสั่งจ้างโรงงานผลิต (OEM)',
              members: 6,
              targetMembers: 10,
              lotCost: 25000,
              status: 'OPEN',
            },
            {
              productChainId: skincareRecord?.id ?? null,
              productName: 'สกินแคร์/ครีมบำรุงผิว OEM',
              modelName: 'หารขั้นต่ำสั่งผลิตเซรั่มสูตรพรีเมียม + จด อย.',
              mode: 'รวมกลุ่มสั่งจ้างโรงงานผลิต (OEM)',
              members: 8,
              targetMembers: 10,
              lotCost: 50000,
              status: 'OPEN',
            },
            {
              productChainId: aromaRecord?.id ?? null,
              productName: 'ผลิตภัณฑ์เครื่องหอมและอโรมา (Aroma & Fragrance)',
              modelName: 'รวมกลุ่มสั่งขวดแก้วมินิมอล + ก้านหวายไฟเบอร์ล็อต 5,000 ชุด',
              mode: 'รวมล็อตสั่งซื้อขั้นต่ำ (MOQ Group Buy)',
              members: 5,
              targetMembers: 10,
              lotCost: 28000,
              status: 'OPEN',
            },
          ],
        });
      }
    }

    // Seed Synonym Knowledge Graph & Semantic Dictionary
    const { seedSynonymsInDb } = await import('@/lib/semanticSearch');
    await seedSynonymsInDb();

    isSeededCache = true;
  } catch (err) {
    console.error('[ensureProductionSeeded] Error:', err);
  }
}

/**
 * ค้นหา ProductChain จากฐานข้อมูล Prisma ด้วยระบบ Semantic Search & Synonym Mapping (Phase 3)
 */
export async function findProductChainInDb(query: string): Promise<{
  chain: ProductChain;
  recordId: string;
  source: ChainSource;
  status: string;
  searchCount: number;
  semanticInfo?: {
    matchedKeyword: string;
    matchType: string;
    confidence: number;
    explanation: string;
    suggestedNodeOrder?: number;
    suggestedNodeTitle?: string;
  };
} | null> {
  await ensureProductionSeeded();
  const clean = query.trim();
  if (!clean) return null;

  // 1. ลองใช้ Semantic Search & Synonym Engine ก่อนเสมอ (ชี้เป้าคำพ้อง เช่น "น้ำหอมรถยนต์" -> "เครื่องหอม")
  try {
    const { resolveSemanticQuery } = await import('@/lib/semanticSearch');
    const semantic = await resolveSemanticQuery(clean);
    if (semantic.isMatch && semantic.canonicalChain && semantic.productChainRecordId) {
      const rec = await prisma.productChain.findUnique({
        where: { id: semantic.productChainRecordId },
        select: { source: true, status: true, searchCount: true },
      });

      return {
        chain: semantic.canonicalChain,
        recordId: semantic.productChainRecordId,
        source: (rec?.source as ChainSource) || 'SEED',
        status: rec?.status || 'VERIFIED',
        searchCount: (rec?.searchCount || 0) + 1,
        semanticInfo: {
          matchedKeyword: semantic.matchedKeyword,
          matchType: semantic.matchType,
          confidence: semantic.confidence,
          explanation: semantic.explanation,
          suggestedNodeOrder: semantic.suggestedNodeOrder,
          suggestedNodeTitle: semantic.suggestedNodeTitle,
        },
      };
    }
  } catch (semErr) {
    console.warn('[findProductChainInDb] Semantic search fallback:', semErr);
  }

  // 2. Direct string / keyword match fallback
  const slug = buildSlug(clean);
  const candidates = await prisma.productChain.findMany({
    where: {
      OR: [
        { slug },
        { productName: clean },
        { productName: { contains: clean } },
        { searchKeywordsJson: { contains: clean } },
      ],
    },
    orderBy: [{ status: 'desc' }, { searchCount: 'desc' }],
    take: 5,
  });

  if (candidates.length === 0) return null;

  const normQuery = normalizeName(clean);
  const best =
    candidates.find((c) => normalizeName(c.productName) === normQuery) || candidates[0];

  await prisma.productChain
    .update({
      where: { id: best.id },
      data: { searchCount: { increment: 1 } },
    })
    .catch(() => {});

  try {
    const parsed = JSON.parse(best.fullChainJson);
    const normalized = normalizeChain(parsed);
    if (normalized) {
      return {
        chain: normalized,
        recordId: best.id,
        source: (best.source as ChainSource) || 'SEED',
        status: best.status,
        searchCount: best.searchCount + 1,
      };
    }
  } catch {
    /* ignore malformed JSON */
  }
  return null;
}

/**
 * เพิ่มคำพ้องใหม่ให้ ProductChain (Admin Taxonomy Center)
 */
export async function addProductSynonym(
  productChainId: string,
  keyword: string,
  matchType: string = 'SYNONYM'
) {
  const { cleanSearchWord } = await import('@/lib/semanticSearch');
  const norm = cleanSearchWord(keyword);
  if (!norm) throw new Error('Invalid keyword');

  return prisma.productSynonym.upsert({
    where: {
      productChainId_normalized: {
        productChainId,
        normalized: norm,
      },
    },
    update: {
      keyword: keyword.trim(),
      matchType,
      hitCount: { increment: 1 },
    },
    create: {
      productChainId,
      keyword: keyword.trim(),
      normalized: norm,
      matchType,
      confidence: 1.0,
      hitCount: 1,
    },
  });
}

/**
 * ลบคำพ้อง
 */
export async function deleteProductSynonym(synonymId: string) {
  return prisma.productSynonym.delete({
    where: { id: synonymId },
  });
}

/**
 * อนุมัติ ProductChain ในหน้า DOT017 Taxonomy Center พร้อมซิงก์อาชีพ (Occupation) และทักษะ (SkillTag) เข้าสู่ Layer 3
 */
export async function verifyAndSyncChainToTaxonomy(productChainId: string) {
  const chainRecord = await prisma.productChain.findUnique({
    where: { id: productChainId },
    include: {
      industry: true,
      nodes: {
        include: {
          opportunities: true,
        },
      },
    },
  });

  if (!chainRecord) {
    throw new Error('ProductChain not found');
  }

  let syncedOccupations = 0;
  let syncedSkills = 0;

  for (const node of chainRecord.nodes) {
    for (const opp of node.opportunities) {
      const cleanRoleName = opp.modelName.trim().slice(0, 80);
      if (!cleanRoleName) continue;

      let occupation = await prisma.occupation.findFirst({
        where: {
          industryId: chainRecord.industryId,
          name: cleanRoleName,
        },
      });

      if (!occupation) {
        occupation = await prisma.occupation.create({
          data: {
            industryId: chainRecord.industryId,
            name: cleanRoleName,
            description: `[แท็บทำผลิต - ${chainRecord.productName}] ${opp.howToStart.slice(0, 160)}`,
            icon: 'fa-solid fa-industry',
          },
        });
        syncedOccupations++;
      }

      // Link MicroOpportunityRecord to this official Occupation
      await prisma.microOpportunityRecord.update({
        where: { id: opp.id },
        data: { occupationId: occupation.id },
      });

      // Extract skills from opp.skillsNeeded and upsert into SkillTag
      const rawSkills = opp.skillsNeeded
        .split(/[,/•+และ]+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 3 && s.length <= 60)
        .slice(0, 4);

      for (const skillName of rawSkills) {
        const existingSkill = await prisma.skillTag.findFirst({
          where: {
            occupationId: occupation.id,
            name: skillName,
          },
        });
        if (!existingSkill) {
          await prisma.skillTag.create({
            data: {
              occupationId: occupation.id,
              name: skillName,
              level: 'INTERMEDIATE',
            },
          });
          syncedSkills++;
        }
      }
    }
  }

  const updated = await prisma.productChain.update({
    where: { id: productChainId },
    data: { status: 'VERIFIED' },
  });

  return {
    updated,
    syncedOccupations,
    syncedSkills,
  };
}

/**
 * เปิดภารกิจแก้ปัญหา (ProblemNode Bounty) จากคอขวดการผลิต (SupplyChainNodeRecord.painPoint)
 */
export async function createBountyFromSupplyChainNode(nodeRecordId: string) {
  const node = await prisma.supplyChainNodeRecord.findUnique({
    where: { id: nodeRecordId },
    include: {
      productChain: {
        include: {
          industry: true,
          nodes: {
            include: { opportunities: true },
          },
        },
      },
      opportunities: true,
    },
  });

  if (!node) throw new Error('SupplyChainNodeRecord not found');

  // Find any existing user to act as requester (or create system requester)
  let requester = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' },
  });
  if (!requester) {
    requester = await prisma.user.create({
      data: {
        email: 'production-radar@makeadot.com',
        name: 'ศูนย์ห่วงโซ่การผลิต (MAKE A DOT)',
        role: 'ADMIN',
      },
    });
  }

  const firstOccId = node.opportunities.find((o) => o.occupationId)?.occupationId ?? null;
  const firstWorkTypeId = node.opportunities.find((o) => o.workTypeId)?.workTypeId ?? null;

  const problem = await prisma.problemNode.create({
    data: {
      rawDescription: `[คอขวดห่วงโซ่การผลิต: ${node.productChain.productName} - ขั้นที่ ${node.nodeOrder} ${node.nodeTitle}] ปัญหาที่พบ: ${node.painPoint}`,
      entityType: 'SME',
      primaryGap: 'SKILL_GAP',
      urgencyState: node.isHighMarginBottleneck ? 'URGENT' : 'NORMAL',
      impactScale: 'MACRO',
      bountyType: 'HYBRID',
      bountyPrizeSatang: 1500000, // 15,000 THB default reference bounty
      bountyDescription: `ภารกิจปลดล็อกคอขวดการผลิตในวงการ ${node.productChain.industry.name}`,
      status: 'OPEN',
      originDotCode: 'DOT017',
      occupationId: firstOccId,
      workTypeId: firstWorkTypeId,
      requesterIndustryId: node.productChain.industryId,
      requesterId: requester.id,
      supplyChainNodeId: node.id,
      publishedAt: new Date(),
      deepAttributes: JSON.stringify({
        sourceModule: 'PRODUCTION_SUPPLY_CHAIN',
        productName: node.productChain.productName,
        nodeTitle: node.nodeTitle,
        stageType: node.stageType,
        customTags: [node.productChain.subCategoryName, node.nodeTitle],
      }),
    },
  });

  return problem;
}

export { TAXONOMY };
