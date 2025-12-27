import { ArchetypeType, InterviewAnswer, Pillar, QuickContext } from '@/types/mandalart';

// Helper to format quick context for prompts
const formatQuickContext = (context: QuickContext | null) => {
  if (!context) return '';
  return `
사용자 맥락:
- 집중 영역: ${context.lifeAreas.join(', ')}
- 현재 상황: ${context.currentStatus}
- 목표 스타일: ${context.goalStyle}
- 올해 키워드: ${context.yearKeyword}`;
};

export const SYSTEM_PERSONA = `
당신은 인격적 라이프 설계자입니다.
- 차가운 AI가 아닌, 따뜻하게 응원하는 코치
- 열린 질문으로 사용자가 스스로 영감을 얻게 유도
- 구체적이고 현실적인 실천 방법 제안
- 사용자의 삶의 결을 존중
- 반말이 아닌 존댓말 사용
`;

// Discovery Mode Prompts
export const DISCOVERY_QUESTIONS = [
  '요즘 시간 가는 줄 모르고 했던 일이 있다면 무엇인가요?',
  '1년 후, 어떤 사람이 되어있고 싶으신가요?',
  '지금 삶에서 가장 바꾸고 싶은 한 가지가 있다면요?',
  '주변 사람들이 당신을 어떤 사람으로 기억했으면 하나요?',
  '돈과 시간이 무한하다면 가장 먼저 하고 싶은 일은 무엇인가요?',
];

export const DISCOVERY_GOAL_SUGGESTION = (answers: InterviewAnswer[]) => `
${SYSTEM_PERSONA}

사용자의 답변을 바탕으로, 2026년에 집중할 만한 목표 3가지를 제안해주세요.

사용자 답변:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}

규칙:
- 각 목표는 구체적이고 측정 가능해야 합니다
- 사용자의 관심사와 가치관이 반영되어야 합니다
- 너무 추상적이거나 막연하면 안 됩니다
- 한 문장으로 명확하게 표현해주세요

JSON 형식으로 응답:
{
  "suggestedGoals": ["목표1", "목표2", "목표3"],
  "summary": "사용자 성향 요약 (2-3문장)"
}
`;

// Archetype Detection
export const ARCHETYPE_DETECTION = (goal: string, quickContext?: QuickContext | null) => `
${SYSTEM_PERSONA}

사용자의 목표를 분석하여 4가지 유형 중 하나로 분류하세요.
${formatQuickContext(quickContext || null)}

유형:
- BUSINESS: 사업, 커리어, 매출, 성과, 승진, 수익 관련
- GROWTH: 자기계발, 학습, 역량 향상, 새로운 기술 습득 관련
- RELATION: 관계, 가족, 소통, 네트워킹, 사랑 관련
- ROUTINE: 습관, 건강, 일상 루틴, 생활 패턴 관련

사용자 목표: "${goal}"

JSON 형식으로 응답:
{
  "archetype": "BUSINESS | GROWTH | RELATION | ROUTINE 중 하나",
  "confidence": 0.0부터 1.0 사이 숫자,
  "reasoning": "분류 이유를 한 문장으로"
}
`;

// Interview Questions by Archetype (fallback)
export const INTERVIEW_QUESTIONS: Record<ArchetypeType, string[]> = {
  BUSINESS: [
    '이 목표를 이루었을 때, 당신의 하루는 어떻게 달라져 있을까요?',
    '이 여정에서 절대 포기하지 않을 한 가지가 있다면 무엇인가요?',
    '이 목표를 향해 나아가는 당신을 가장 잘 표현하는 한 단어는 무엇인가요?',
  ],
  GROWTH: [
    '이 배움의 끝에서 어떤 일을 하고 있는 자신을 상상하시나요?',
    '성장 과정에서 가장 두려운 것이 있다면 무엇인가요?',
    '이 여정을 통해 당신이 증명하고 싶은 것은 무엇인가요?',
  ],
  RELATION: [
    '이 여정을 마쳤을 때 곁에 누가 웃고 있길 바라나요?',
    '관계에서 당신이 가장 소중히 여기는 가치는 무엇인가요?',
    '사랑하는 사람에게 어떤 사람으로 기억되고 싶으신가요?',
  ],
  ROUTINE: [
    '이 습관이 완전히 자리잡았을 때의 나는 어떤 사람인가요?',
    '하루 중 가장 소중한 시간대는 언제인가요?',
    '지금의 루틴에서 가장 먼저 바꾸고 싶은 것은 무엇인가요?',
  ],
};

// Dynamic Interview Question Generation
export const INTERVIEW_QUESTION_GENERATION = (
  archetype: ArchetypeType,
  goal: string,
  quickContext: QuickContext | null,
  previousAnswers: InterviewAnswer[]
) => `
${SYSTEM_PERSONA}

사용자의 목표에 맞는 전략 영역(Pillar)을 더 잘 제안하기 위해 필요한 실질적인 정보를 수집하는 질문 3개를 생성해주세요.
${formatQuickContext(quickContext)}

목표 유형: ${archetype}
목표: "${goal}"
${previousAnswers.length > 0 ? `
이전 답변:
${previousAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}
` : ''}

질문의 목적:
- 이 질문들의 답변을 바탕으로 8개의 전략 영역(Pillar)을 제안할 것임
- 따라서 전략 수립에 실질적으로 도움이 되는 정보를 수집해야 함

질문 설계 원칙:
- **실용적 정보 수집**: 현재 상황, 제약 조건, 가용 자원, 우선순위 파악
- **구체적 질문**: "일주일에 운동에 쓸 수 있는 시간은?" 같은 구체적 질문
- **금지**: 감정/기분/느낌을 묻는 추상적 질문 ("어떤 기분일까요?", "어떤 의미인가요?")
- **금지**: 이미 시도했다고 가정하는 질문 ("해본 방법", "실패 경험")
- **금지**: 철학적/동기 탐색 질문 ("왜 하고 싶으세요?", "무엇이 중요한가요?")
${previousAnswers.length > 0 ? '- 이전 답변을 바탕으로 더 구체적인 제약/상황 파악' : ''}

좋은 질문 예시:
- "하루 중 언제 시간을 낼 수 있나요?"
- "혼자 하는 걸 선호하나요, 함께 하는 걸 선호하나요?"
- "예산 제약이 있나요?"
- "집에서 할 수 있어야 하나요, 외부 활동도 괜찮나요?"

JSON 형식으로 응답:
{
  "questions": ["질문1", "질문2", "질문3"]
}
`;

// Interview Summary
export const INTERVIEW_SUMMARY = (
  archetype: ArchetypeType,
  goal: string,
  answers: InterviewAnswer[]
) => `
${SYSTEM_PERSONA}

사용자의 인터뷰 답변을 바탕으로, 그들의 삶의 결을 요약해주세요.

목표 유형: ${archetype}
목표: "${goal}"
인터뷰 답변:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join('\n\n')}

규칙:
- 2-3문장으로 간결하게
- 사용자의 가치관, 동기, 성향을 담아
- 따뜻하지만 통찰력 있게

JSON 형식으로 응답:
{
  "vibeSummary": "사용자의 삶의 결 요약"
}
`;

// Pillar Suggestion
export const PILLAR_SUGGESTION = (
  archetype: ArchetypeType,
  goal: string,
  vibeSummary: string,
  quickContext?: QuickContext | null
) => `
${SYSTEM_PERSONA}

사용자의 목표와 성향을 바탕으로 목표 달성을 위한 12개의 전략 카테고리를 제안해주세요.
${formatQuickContext(quickContext || null)}

목표 유형: ${archetype}
목표: "${goal}"
사용자 성향: "${vibeSummary}"

규칙:
- 각 카테고리는 실질적이고 구체적인 영역이어야 합니다
- 사용자의 삶의 맥락에 맞아야 합니다
- 서로 겹치지 않는 독립적인 영역이어야 합니다
- 제목은 2-4단어로 간결하게
- 설명은 1문장으로

JSON 형식:
{
  "pillars": [
    { "id": "pillar_1", "title": "카테고리 제목", "description": "간단한 설명" },
    ... 총 12개
  ]
}
`;

// Pillar Regeneration (keep selected, regenerate others)
export const PILLAR_REGENERATION = (
  archetype: ArchetypeType,
  goal: string,
  vibeSummary: string,
  selectedPillars: Pillar[],
  rejectedPillars: Pillar[],
  count: number
) => `
${SYSTEM_PERSONA}

사용자의 목표와 성향을 바탕으로 ${count}개의 **완전히 새로운** 전략 카테고리를 제안해주세요.

목표 유형: ${archetype}
목표: "${goal}"
사용자 성향: "${vibeSummary}"

⚠️ 다음 영역들은 이미 제안되었으므로 절대 비슷한 것도 제안하지 마세요:

[이미 선택된 영역 - 중복 제안 금지]:
${selectedPillars.length > 0 ? selectedPillars.map((p) => `- ${p.title}: ${p.description}`).join('\n') : '(없음)'}

[이전에 제안됐지만 선택되지 않은 영역 - 이것도 피하세요]:
${rejectedPillars.length > 0 ? rejectedPillars.map((p) => `- ${p.title}: ${p.description}`).join('\n') : '(없음)'}

🎯 창의성 규칙:
- 위에 나열된 영역과 **완전히 다른 관점**에서 접근하세요
- 기존 제안의 변형이 아닌, **새로운 각도**의 전략을 제시하세요
- 예상치 못한 접근법, 독특한 관점을 환영합니다
- 사용자가 생각하지 못했던 영역을 발굴하세요
- 제목은 2-4단어로 간결하게
- 설명은 1문장으로

JSON 형식:
{
  "pillars": [
    { "id": "pillar_new_1", "title": "카테고리 제목", "description": "간단한 설명" },
    ... 총 ${count}개
  ]
}
`;

// Action Suggestion (12 suggestions for a single pillar)
export const ACTION_SUGGESTION = (
  goal: string,
  vibeSummary: string,
  pillar: Pillar,
  quickContext?: QuickContext | null
) => `
${SYSTEM_PERSONA}

사용자의 목표와 선택한 전략 영역에 대해 12개의 구체적인 실천 지침을 제안해주세요.
${formatQuickContext(quickContext || null)}

목표: "${goal}"
사용자 성향: "${vibeSummary}"
전략 영역: ${pillar.title} - ${pillar.description}

중요 규칙:
- "최선을 다하기", "꾸준히 노력하기" 같은 추상적 표현 절대 금지
- 행동 중심의 구체적 표현 사용
- 다양한 유형의 액션을 균형있게 포함:
  * 일회성 행동 (예: "러닝화 구매하기", "멘토에게 연락하기")
  * 습관 형성 (예: "아침 스트레칭 5분", "주 3회 30분 걷기")
  * 마일스톤 (예: "5km 러닝 완주", "자격증 시험 응시")
  * 환경 조성 (예: "책상 정리", "운동복 눈에 띄게 배치")
  * 관계/경험 (예: "러닝 크루 참여", "가족과 주말 산책")
- 모든 액션에 시간/빈도를 강제하지 말 것
- 사용자의 삶의 결에 맞는 현실적인 제안
- 각 액션은 20자 이내로 간결하게

JSON 형식:
{
  "actions": ["액션1", "액션2", ... 총 12개]
}
`;

// Action Regeneration (keep selected, regenerate others)
export const ACTION_REGENERATION = (
  goal: string,
  vibeSummary: string,
  pillar: Pillar,
  selectedActions: string[],
  rejectedActions: string[],
  count: number
) => `
${SYSTEM_PERSONA}

사용자의 목표와 선택한 전략 영역에 대해 ${count}개의 **완전히 새로운** 실천 지침을 제안해주세요.

목표: "${goal}"
사용자 성향: "${vibeSummary}"
전략 영역: ${pillar.title} - ${pillar.description}

⚠️ 다음 액션들은 이미 제안되었으므로 비슷한 것도 제안하지 마세요:

[이미 선택된 액션]:
${selectedActions.length > 0 ? selectedActions.map((a) => `- ${a}`).join('\n') : '(없음)'}

[이전에 제안됐지만 선택되지 않은 액션]:
${rejectedActions.length > 0 ? rejectedActions.map((a) => `- ${a}`).join('\n') : '(없음)'}

🎯 창의성 규칙:
- 위에 나열된 액션과 **완전히 다른 유형**의 행동을 제안하세요
- 같은 카테고리 내에서도 **전혀 다른 접근법**을 사용하세요
- 일반적이지 않은, 독창적인 실천 방법을 환영합니다
- 다양한 유형 포함 (일회성 행동, 습관, 마일스톤, 환경 조성, 관계/경험)
- "최선을 다하기" 같은 추상적 표현 절대 금지
- 각 액션은 20자 이내로 간결하게

JSON 형식:
{
  "actions": ["액션1", "액션2", ... 총 ${count}개]
}
`;

// Action Generation
export const ACTION_GENERATION = (
  goal: string,
  vibeSummary: string,
  selectedPillars: Pillar[]
) => `
${SYSTEM_PERSONA}

사용자의 목표와 선택한 8개 전략 영역에 대해 각각 8개의 구체적인 실천 지침을 만들어주세요.

목표: "${goal}"
사용자 성향: "${vibeSummary}"
선택한 전략 영역:
${selectedPillars.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n')}

중요 규칙:
- "최선을 다하기", "꾸준히 노력하기" 같은 추상적 표현 절대 금지
- 행동 중심의 구체적 표현 사용
- 다양한 유형의 액션을 균형있게 포함:
  * 일회성 행동 (예: "러닝화 구매하기")
  * 습관 형성 (예: "아침 스트레칭 5분")
  * 마일스톤 (예: "5km 러닝 완주")
  * 환경 조성 (예: "운동복 눈에 띄게 배치")
  * 관계/경험 (예: "러닝 크루 참여")
- 모든 액션에 시간/빈도를 강제하지 말 것
- 사용자의 삶의 결에 맞는 현실적인 제안
- 각 액션은 20자 이내로 간결하게

JSON 형식:
{
  "subGrids": [
    {
      "id": "grid_1",
      "title": "전략 영역 제목",
      "opacityLevel": 1,
      "actions": ["액션1", "액션2", "액션3", "액션4", "액션5", "액션6", "액션7", "액션8"]
    },
    ... 총 8개
  ]
}
`;
