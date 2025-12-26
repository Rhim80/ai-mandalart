// Archetype types
export type ArchetypeType = 'BUSINESS' | 'GROWTH' | 'RELATION' | 'ROUTINE';

// Project info
export interface ProjectInfo {
  name: string;
  archetype: ArchetypeType;
  createdAt: string;
}

// Interview answer
export interface InterviewAnswer {
  question: string;
  answer: string;
}

// Quick Context (collected before goal input)
export interface QuickContext {
  lifeAreas: string[];      // 복수 선택: 커리어, 건강, 관계, 재정, 자기계발, 취미
  currentStatus: string;    // 단일: 학생, 직장인, 창업자, 프리랜서, 구직중, 기타
  goalStyle: string;        // 단일: 도전적, 안정적, 실험적, 회복/재충전
  yearKeyword: string;      // 단일: 성장, 변화, 안정, 도전, 균형, 회복
}

// Quick Context options
export const QUICK_CONTEXT_OPTIONS = {
  lifeAreas: ['커리어', '건강', '관계', '재정', '자기계발', '취미'],
  currentStatus: ['학생', '직장인', '창업자', '프리랜서', '구직중', '기타'],
  goalStyle: ['도전적', '안정적', '실험적', '회복/재충전'],
  yearKeyword: ['성장', '변화', '안정', '도전', '균형', '회복'],
};

// User context from interview
export interface UserContext {
  goal: string;
  persona: {
    identityAnswers: InterviewAnswer[];
    vibeSummary: string;
  };
}

// Pillar (strategy category)
export interface Pillar {
  id: string;
  title: string;
  description: string;
  selected?: boolean;
  colorIndex?: number; // 1-8, assigned when selected (selection order)
}

// SubGrid (one of 8 surrounding grids)
export interface SubGrid {
  id: string;
  title: string;
  opacityLevel: number; // 1-8 for grid-bg-1 to grid-bg-8 (legacy)
  colorIndex: number; // 1-8 for pastel-bg-1 to pastel-bg-8
  actions: string[]; // 8 action items
}

// Complete Mandalart data
export interface MandalartData {
  core: string;
  subGrids: SubGrid[];
}

// Session state
export interface MandalartSession {
  projectInfo: ProjectInfo | null;
  quickContext: QuickContext | null;
  userContext: UserContext | null;
  suggestedPillars: Pillar[];
  selectedPillars: Pillar[];
  mandalart: MandalartData | null;
  currentStep: SessionStep;
  isDiscoveryMode: boolean;
  discoveryAnswers: InterviewAnswer[];
  suggestedGoals: string[];
}

// Session steps
export type SessionStep =
  | 'QUICK_CONTEXT'
  | 'GOAL_INPUT'
  | 'DISCOVERY'
  | 'ARCHETYPE_RESULT'
  | 'INTERVIEW'
  | 'PILLAR_SELECTION'
  | 'ACTION_SELECTION'
  | 'GENERATING'
  | 'RESULT';

// Step metadata
export const STEP_INFO: Record<SessionStep, { name: string; description: string }> = {
  QUICK_CONTEXT: { name: '나를 알려주기', description: '당신에 대해 알려주세요' },
  GOAL_INPUT: { name: '목표 입력', description: '핵심 목표를 한 문장으로' },
  DISCOVERY: { name: '목표 발견', description: '나에게 맞는 목표 찾기' },
  ARCHETYPE_RESULT: { name: '유형 분석', description: '목표 성격 파악' },
  INTERVIEW: { name: '심층 인터뷰', description: '3가지 질문으로 깊이 탐색' },
  PILLAR_SELECTION: { name: '전략 선택', description: '8가지 핵심 영역 선택' },
  ACTION_SELECTION: { name: '실천 선택', description: '각 영역별 8가지 실천 항목 선택' },
  GENERATING: { name: '계획 생성', description: 'AI가 계획을 만들고 있습니다' },
  RESULT: { name: '완성', description: '나만의 만다라트' },
};

// Action selection state for a single pillar
export interface PillarActionState {
  pillar: Pillar;
  suggestedActions: string[];
  selectedActions: string[];
  isComplete: boolean;
}

// API Response types
export interface ArchetypeResponse {
  archetype: ArchetypeType;
  confidence: number;
  reasoning: string;
}

export interface DiscoveryQuestionResponse {
  question: string;
  questionIndex: number;
  totalQuestions: number;
}

export interface DiscoveryGoalsResponse {
  suggestedGoals: string[];
  summary: string;
}

export interface InterviewQuestionResponse {
  question: string;
  questionIndex: number;
  isComplete: boolean;
}

export interface InterviewSummaryResponse {
  vibeSummary: string;
}

export interface PillarsResponse {
  pillars: Pillar[];
}

export interface ActionsResponse {
  subGrids: SubGrid[];
}

// Initial session state
export const INITIAL_SESSION: MandalartSession = {
  projectInfo: null,
  quickContext: null,
  userContext: null,
  suggestedPillars: [],
  selectedPillars: [],
  mandalart: null,
  currentStep: 'QUICK_CONTEXT',
  isDiscoveryMode: false,
  discoveryAnswers: [],
  suggestedGoals: [],
};
