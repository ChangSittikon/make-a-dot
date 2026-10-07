export type MainTabType = 'PROCESS' | 'CAPITAL' | 'SOLVER' | 'ECOSYSTEM';

export interface IndustryItem {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
  activeBounties: number;
}

export interface BackOfficeEngineItem {
  id: string;
  name: string;
  thName: string;
  icon: string;
  description: string;
  tierResponsible: number;
}

export interface SynergyRoleNode {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5;
  roleCode: 'USER' | 'PROFESSIONAL' | 'GUARANTOR' | 'DIRECTOR' | 'ADMIN';
  title: string;
  category: 'FIELD' | 'BACK_OFFICE' | 'SAFETY' | 'GOVERNANCE';
  originIndustry: string;
  summary: string;
  deliverables: { targetId: string; label: string }[];
  dependsOn: { sourceId: string; label: string }[];
  kpiMetrics: string;
}

export interface ProblemToolItem {
  id: string;
  category: 'DISPUTE' | 'BUDGET' | 'WORKFORCE' | 'QUALITY';
  categoryLabel: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  tierSupport: number;
  slaTime: string;
  steps: string[];
}

export interface CapTableItem {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface IndustryCapPreset {
  cash: { val: number; hint: string };
  sweat: { val: number; hint: string };
  equip: { val: number; hint: string };
  venue: { val: number; hint: string };
  ip: { val: number; hint: string };
}

export interface ProjectSegmentItem {
  id: string;
  name: string;
  preset: IndustryCapPreset;
}

export interface SubIndustryItem {
  id: string;
  code: string;
  name: string;
  description: string;
  preset: IndustryCapPreset;
  segments?: ProjectSegmentItem[];
}
