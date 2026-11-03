export type MonetizationAxisId =
  | 'vertical'
  | 'horizontal'
  | 'universal'
  | 'local'
  | 'digital'
  | 'friction';

export interface MonetizationAxisMeta {
  id: MonetizationAxisId;
  axisNumber: number;
  labelTh: string;
  subLabelTh: string;
  emoji: string;
  tagColor: string;
  themeGradient: string;
  coreConcept: string;
}

export type HiddenNodeCategoryId =
  | 'location'
  | 'people'
  | 'assets'
  | 'time'
  | 'grit';

export interface HiddenNodeItem {
  id: string;
  category: HiddenNodeCategoryId;
  label: string;
  subLabel: string;
  emoji: string;
  baseEstimatedValuationThb: number;
  equityType: 'sweat' | 'equip' | 'venue' | 'ip';
  promptQuestion: string;
  suggestedAction: string;
}

export interface ScriptOption {
  tone: 'polite' | 'aggressive' | 'emergency';
  toneLabel: string;
  scriptText: string;
}

export interface AxisPlanData {
  axisId: MonetizationAxisId;
  title: string;
  estimatedEarningLabel: string;
  estimatedDailyThb: number;
  actionSummary: string;
  timeline24h: {
    hours: string;
    task: string;
  }[];
  scripts: ScriptOption[];
  relatedUniversalModuleId?: string;
}

export interface UniversalModuleItem {
  id: string;
  coordinateId: string;
  title: string;
  shortName: string;
  icon: string;
  philosophy: string;
  coreFragments: string[];
  hiddenNodesChecklist: string[];
  actionSop: string;
  sampleScript: string;
}

export interface SpecializedRoleItem {
  id: string;
  coordinateId: string;
  roleName: string;
  industry: string;
  philosophy: string;
  competencyFragments: string[];
  sixAxesMonetization: Record<MonetizationAxisId, string>;
  sop: string;
  script: string;
}
