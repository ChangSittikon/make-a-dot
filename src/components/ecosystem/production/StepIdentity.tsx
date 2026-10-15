'use client';

import React, { useMemo, useState } from 'react';
import { TypewriterPrompt } from '../pipeline/StepScopeView';
import { INDUSTRIES_LIST } from '../constants';
import {
  TAXONOMY,
  ALL_TAX_PRODUCTS,
  TRENDING_CHIPS,
  BUDGET_FILTERS,
  STYLE_FILTERS,
  BudgetFilter,
  StyleFilter,
  TaxProduct,
  TaxSector,
} from './taxonomy';
import { SEED_CHAINS, SEED_LIST } from './seed';
import { loadApiKey, saveApiKey } from './storage';
import { MicroOpportunity } from './types';
import { normalizeName } from './schema';

export interface PickContext {
  sectorId?: string;
  subName?: string;
  seedId?: string;
}

interface Props {
  onPick: (name: string, ctx: PickContext) => void;
}

const TILE_LABELS: Record<string, string> = {
  '01': 'ก่อสร้างและ อสังหาฯ',
  '02': 'การแพทย์และ สาธารณสุข',
  '03': 'เทคโนโลยี และไอที',
  '04': 'การศึกษา',
  '05': 'อาหารและ เครื่องดื่ม',
  '06': 'เกษตรกรรม',
  '07': 'ขนส่งและ โลจิสติกส์',
  '08': 'การเงินและ บัญชี',
  '09': 'ท่องเที่ยว และโรงแรม',
  '10': 'โรงงานและ การผลิต',
  '11': 'สื่อและ ความบันเทิง',
  '12': 'กฎหมาย',
};

const oppLevel = (o: MicroOpportunity): number =>
  o.target_persona_tags.includes('งบ 0 บาท') ? 0 : o.target_persona_tags.includes('งบหลักพัน') ? 1 : 2;
const oppStyles = (o: MicroOpportunity): string[] =>
  STYLE_FILTERS.filter((f) => o.target_persona_tags.includes(f.tag)).map((f) => f.id);

const chunk = <T,>(arr: T[], n: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

export const StepIdentity: React.FC<Props> = ({ onPick }) => {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [budget, setBudget] = useState<BudgetFilter>('ALL');
  const [styles, setStyles] = useState<StyleFilter[]>([]);
  const [openSector, setOpenSector] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [brokenImgs, setBrokenImgs] = useState<Record<string, boolean>>({});
  const [keyOpen, setKeyOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const [keySaved, setKeySaved] = useState(false);

  const filterActive = budget !== 'ALL' || styles.length > 0;
  const budgetLevel = BUDGET_FILTERS.find((b) => b.id === budget)?.level ?? 99;

  /* ---------- Reverse Lookup: คำนวณจุดแทรกตัวที่ตรงกับตัวกรอง ---------- */
  const { sectorCounts, recommended } = useMemo(() => {
    const counts: Record<string, number> = {};
    const rec: { name: string; sector: TaxSector; sub: string; seedId?: string; score: number; hint: string }[] = [];
    if (!filterActive) return { sectorCounts: counts, recommended: rec };

    const okBudget = (lvl: number) => budget === 'ALL' || lvl <= budgetLevel;
    const okStyle = (st: string[]) => styles.length === 0 || styles.some((s) => st.includes(s));
    const levelText = ['งบ 0 บาท', 'งบหลักพัน', 'งบหลักหมื่น'];

    for (const { sector, sub, product } of ALL_TAX_PRODUCTS) {
      let n = 0;
      let score = 10;
      let hint = levelText[product.level];
      if (product.seedId && SEED_CHAINS[product.seedId]) {
        const flat = SEED_CHAINS[product.seedId].supply_chain_nodes.flatMap((x) => x.micro_opportunities);
        const hit = flat.filter((o) => okBudget(oppLevel(o)) && okStyle(oppStyles(o)));
        n = hit.length;
        if (hit.length) {
          score = Math.max(...hit.map((o) => o.feasibility_score.total_score));
          hint = `${hit.length} โมเดล · คะแนนสูงสุด ${score}/20`;
        }
      } else if (okBudget(product.level) && okStyle(product.styles)) {
        n = 1;
        score = 12 - product.level * 2;
      }
      if (n > 0) {
        counts[sector.id] = (counts[sector.id] || 0) + n;
        rec.push({ name: product.name, sector, sub: sub.name, seedId: product.seedId, score, hint });
      }
    }
    rec.sort((a, b) => b.score - a.score);
    return { sectorCounts: counts, recommended: rec.slice(0, 6) };
  }, [filterActive, budget, budgetLevel, styles]);

  /* ---------- Smart Search ---------- */
  const q = query.trim();
  const suggestions = useMemo(() => {
    if (!q) return [];
    const nq = normalizeName(q);
    const seen = new Set<string>();
    const out: { name: string; sectorId: string; sub: string; seedId?: string }[] = [];
    const push = (name: string, sectorId: string, sub: string, seedId?: string) => {
      if (seen.has(name)) return;
      seen.add(name);
      out.push({ name, sectorId, sub, seedId });
    };
    for (const { sector, sub, product } of ALL_TAX_PRODUCTS) {
      const hitKeyword =
        product.seedId &&
        SEED_CHAINS[product.seedId].product.search_keywords.some((k) => normalizeName(k).includes(nq) || nq.includes(normalizeName(k)));
      if (normalizeName(product.name).includes(nq) || hitKeyword) push(product.name, sector.id, sub.name, product.seedId);
    }
    for (const sub of TAXONOMY.flatMap((s) => s.subs.map((x) => ({ s, x })))) {
      if (normalizeName(sub.x.name).includes(nq)) {
        sub.x.products.slice(0, 2).forEach((p) => push(p.name, sub.s.id, sub.x.name, p.seedId));
      }
    }
    return out.slice(0, 6);
  }, [q]);

  const exactMatch = useMemo(
    () => !!q && ALL_TAX_PRODUCTS.some((x) => normalizeName(x.product.name) === normalizeName(q)),
    [q]
  );

  const submitSearch = () => {
    if (!q) return;
    if (suggestions[0] && exactMatch) {
      const s = suggestions.find((x) => normalizeName(x.name) === normalizeName(q)) || suggestions[0];
      onPick(s.name, { sectorId: s.sectorId, subName: s.sub, seedId: s.seedId });
    } else if (suggestions[0] && suggestions[0].seedId) {
      const s = suggestions[0];
      onPick(s.name, { sectorId: s.sectorId, subName: s.sub, seedId: s.seedId });
    } else {
      onPick(q, {});
    }
  };

  const toggleStyle = (s: StyleFilter) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const clickSector = (id: string) => {
    setOpenSector((cur) => (cur === id ? null : id));
    setOpenSub(null);
    setShowCustom(false);
    setCustomName('');
  };

  const pickProduct = (sector: TaxSector, subName: string, p: TaxProduct) =>
    onPick(p.name, { sectorId: sector.id, subName, seedId: p.seedId });

  const sectorRows = chunk(TAXONOMY, 3);

  return (
    <div className="p-3 sm:p-4 space-y-3 font-prompt">
      <TypewriterPrompt
        line1="ต้นน้ำ-ปลายน้ำ คุณเป็นใครได้บ้าง ฉันจะแสดงให้คุณดู"
        line2="คุณสนใจทำสินค้าในกลุ่มวงการไหน?"
      />

      {/* ---------- Smart Search ---------- */}
      <div className="space-y-2">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400"></i>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
            placeholder="พิมพ์ชื่อสินค้า อาชีพ หรือสิ่งที่สนใจ เช่น กาแฟ, โซลาร์เซลล์, ครีม, ข้าวสาร..."
            className="w-full pl-8 pr-3 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181a20] text-[11.5px] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30"
          />
        </div>

        {q && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s.name}
                onClick={() => onPick(s.name, { sectorId: s.sectorId, subName: s.sub, seedId: s.seedId })}
                className="px-2.5 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-[10.5px] font-bold text-gray-700 dark:text-gray-200 hover:border-[#E53935] hover:text-[#E53935]"
              >
                {s.seedId ? '⭐ ' : ''}{s.name}
              </button>
            ))}
          </div>
        )}

        {q && !exactMatch && (
          <button
            onClick={() => onPick(q, {})}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white text-[11.5px] font-black text-left shadow-md shadow-red-500/20 active:scale-[0.99]"
          >
            ✨ ให้ AI ผ่าตัดห่วงโซ่และหาจุดแทรกตัวของ: &apos;{q}&apos;
          </button>
        )}

        <div className="flex flex-wrap gap-1.5">
          {TRENDING_CHIPS.map((c) => (
            <button
              key={c.label}
              onClick={() => onPick(c.query, { sectorId: c.sectorId, seedId: c.seedId })}
              className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#20232b] text-[10.5px] font-bold text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-[#D32F2F]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Persona & Resource Quick-Match ---------- */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-[#15171c]">
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-gray-700 dark:text-gray-200"
        >
          <span>
            🧭 เข็มทิศตามทุนและจุดแข็ง
            {filterActive && <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#E53935] text-white text-[9px]">กำลังกรอง</span>}
          </span>
          <span className="text-gray-400">{filterOpen ? '▲' : '▼'}</span>
        </button>
        {filterOpen && (
          <div className="px-3 pb-3 space-y-2 animate-fadeIn">
            <div>
              <div className="text-[9.5px] text-gray-400 mb-1">งบตั้งต้น</div>
              <div className="flex flex-wrap gap-1.5">
                {BUDGET_FILTERS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                      budget === b.id
                        ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                        : 'bg-white dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9.5px] text-gray-400 mb-1">สไตล์ที่ถนัด (เลือกได้หลายอัน)</div>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_FILTERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleStyle(s.id)}
                    className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border ${
                      styles.includes(s.id)
                        ? 'bg-[#E53935] text-white border-[#E53935]'
                        : 'bg-white dark:bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            {filterActive && (
              <button
                onClick={() => {
                  setBudget('ALL');
                  setStyles([]);
                }}
                className="text-[10px] text-gray-400 underline"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        )}
      </div>

      {filterActive && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-black text-gray-800 dark:text-gray-100">
            ⚡ จุดแทรกตัวแนะนำด่วน {recommended.length === 0 && <span className="font-normal text-gray-400">— ยังไม่พบที่ตรงกับตัวกรองนี้</span>}
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {recommended.map((r) => (
              <button
                key={r.name}
                onClick={() => onPick(r.name, { sectorId: r.sector.id, subName: r.sub, seedId: r.seedId })}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 text-left"
              >
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-gray-900 dark:text-white truncate">
                    {r.seedId ? '⭐ ' : ''}{r.name}
                  </div>
                  <div className="text-[9.5px] text-gray-500 truncate">
                    {r.sector.id} {r.sector.name} · {r.sub} · {r.hint}
                  </div>
                </div>
                <span className="text-[#E53935] text-xs">ดูผัง ▶</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- 12 วงการ + 3-Click Drill-Down ---------- */}
      <div className="space-y-2">
        {sectorRows.map((row) => {
          const rowOpen = row.find((s) => s.id === openSector);
          return (
            <React.Fragment key={row[0].id}>
              <div className="grid grid-cols-3 gap-2">
                {row.map((sector) => {
                  const ind = INDUSTRIES_LIST.find((i) => i.id === sector.industryId);
                  const isOpen = openSector === sector.id;
                  const imgOk = !brokenImgs[sector.id];
                  const cnt = sectorCounts[sector.id] || 0;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => clickSector(sector.id)}
                      className={`relative group p-2 rounded-2xl bg-white dark:bg-[#181a20] border-[1.5px] text-left min-h-[118px] flex flex-col justify-between transition-all active:scale-[0.98] ${
                        isOpen
                          ? 'border-[#E53935] shadow-md shadow-red-500/15 bg-red-50/40 dark:bg-red-950/20'
                          : 'border-gray-900 dark:border-gray-600 hover:border-[#E53935]'
                      } ${filterActive && cnt === 0 ? 'opacity-40' : ''}`}
                    >
                      {filterActive && cnt > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#E53935] text-white text-[9px] font-black shadow">
                          {cnt} จุด
                        </span>
                      )}
                      <span className="text-[11px] font-extrabold text-gray-900 dark:text-white leading-tight break-words">
                        {TILE_LABELS[sector.id]}
                      </span>
                      <div className="h-[62px] flex items-center justify-center">
                        {imgOk && ind ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/images/industries/${ind.id}.jpg`}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                            onError={() => setBrokenImgs((p) => ({ ...p, [sector.id]: true }))}
                          />
                        ) : (
                          <i className={`${ind?.icon || 'fa-solid fa-cube'} text-2xl text-gray-400`}></i>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {rowOpen && (
                <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20 p-3 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="text-[11.5px] font-black text-gray-900 dark:text-white">
                      {rowOpen.id} {rowOpen.name}
                    </div>
                    <button onClick={() => setOpenSector(null)} className="text-[10px] text-gray-400">ปิด ✕</button>
                  </div>

                  <div>
                    <div className="text-[9.5px] text-gray-500 mb-1">คลิกที่ 1 · เลือกหมวดหมู่ย่อย</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {rowOpen.subs.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setOpenSub(sub.name);
                            setShowCustom(false);
                          }}
                          className={`px-2 py-2 rounded-xl text-[10.5px] font-bold border text-left leading-snug ${
                            openSub === sub.name
                              ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                              : 'bg-white dark:bg-[#181a20] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {openSub && (
                    <div className="animate-fadeIn">
                      <div className="text-[9.5px] text-gray-500 mb-1">คลิกที่ 2 · เลือกสินค้าตัวแทนยอดฮิต</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rowOpen.subs
                          .find((s) => s.name === openSub)
                          ?.products.map((p) => (
                            <button
                              key={p.name}
                              onClick={() => pickProduct(rowOpen, openSub, p)}
                              className="px-2.5 py-1.5 rounded-full bg-white dark:bg-[#181a20] border border-gray-300 dark:border-gray-600 text-[10.5px] font-bold text-gray-800 dark:text-gray-100 hover:border-[#E53935] hover:text-[#E53935]"
                            >
                              {p.seedId ? '⭐ ' : ''}{p.name}
                            </button>
                          ))}
                        <button
                          onClick={() => setShowCustom((v) => !v)}
                          className="px-2.5 py-1.5 rounded-full border border-dashed border-[#E53935] text-[10.5px] font-bold text-[#E53935]"
                        >
                          + พิมพ์ชื่อสินค้าอื่นในหมวดนี้เพื่อให้ AI สร้างผัง
                        </button>
                      </div>
                      {showCustom && (
                        <div className="mt-2 flex gap-1.5">
                          <input
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && customName.trim() && onPick(customName.trim(), { sectorId: rowOpen.id, subName: openSub })
                            }
                            placeholder={`ชื่อสินค้าในหมวด ${openSub}`}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#181a20] text-[11px] text-gray-900 dark:text-white focus:outline-none focus:border-[#E53935]"
                          />
                          <button
                            disabled={!customName.trim()}
                            onClick={() => onPick(customName.trim(), { sectorId: rowOpen.id, subName: openSub })}
                            className="px-3 py-2 rounded-xl bg-[#E53935] text-white text-[10.5px] font-black disabled:opacity-40"
                          >
                            ✨ สร้างผัง
                          </button>
                        </div>
                      )}
                      <p className="mt-2 text-[9.5px] text-gray-400">คลิกที่ 3 · แตะสินค้า → ไปขั้น 02 ผ่าสายพานทันที</p>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Seed shortcuts */}
      <div className="text-[9.5px] text-gray-400">
        ⭐ = มีผังฉบับเต็มพร้อมใช้ทันที ({SEED_LIST.map((s) => s.chain.product.product_name).join(' · ')}) — สินค้าอื่น AI จะสร้างผังให้และจำไว้ในเครื่อง
      </div>

      {/* AI settings */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setKeyOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-[10.5px] font-bold text-gray-600 dark:text-gray-300"
        >
          <span>⚙️ ตั้งค่า AI (Gemini API Key)</span>
          <span className="text-gray-400">{keyOpen ? '▲' : '▼'}</span>
        </button>
        {keyOpen && (
          <div className="px-3 pb-3 space-y-1.5 animate-fadeIn">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setKeySaved(false);
              }}
              placeholder="วาง Gemini API Key (ไม่บังคับ)"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#181a20] text-[11px] text-gray-900 dark:text-white focus:outline-none focus:border-[#E53935]"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  saveApiKey(apiKey);
                  setKeySaved(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-[10.5px] font-bold"
              >
                บันทึกในเครื่องนี้
              </button>
              {keySaved && <span className="text-[10px] text-emerald-600">✓ บันทึกแล้ว</span>}
            </div>
            <p className="text-[9.5px] text-gray-400 leading-relaxed">
              ไม่ใส่ Key ก็ใช้งานได้ทันที (ระบบใช้แม่แบบห่วงโซ่อัจฉริยะแทน) · หากตั้งค่า GEMINI_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY ในเซิร์ฟเวอร์ ระบบจะเรียก Gemini ให้อัตโนมัติ
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
