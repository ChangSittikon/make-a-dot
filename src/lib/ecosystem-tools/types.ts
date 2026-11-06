export interface SubD1Node {
  code: string;
  title: string;
  description: string;
  note?: string;
}

export interface D1State {
  code: string;
  label: string;
  role: string;
  subNodes: SubD1Node[];
}

export interface HumanStateContext {
  activeD1: string;
  activeSubD1: string;
  isStressAlert: boolean;
}

export interface EcosystemTool {
  id: string;
  code: string;
  title: string;
  name?: string;
  category: 'HIGHLIGHT' | 'UNIVERSAL' | 'CONSTRUCTION' | 'INDUSTRY';
  categoryLabel: string;
  iconName: string;
  description: string;
  tags: string[];
  status: string;
  version: string;
  verifiedBy: string;
  adaptationD1: Record<string, string>;
  stressAdvice: string;
  actionChecklist: string[];
  monetization6Axis?: string;
  calculatorType?: string;
}
