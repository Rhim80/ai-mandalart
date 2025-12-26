import { ArchetypeType, InterviewAnswer, Pillar } from '@/types/mandalart';

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
export const ARCHETYPE_DETECTION = (goal: string) => `
${SYSTEM_PERSONA}

사용자의 목표를 분석하여 4가지 유형 중 하나로 분류하세요.

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

// Interview Questions by Archetype
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
  vibeSummary: string
) => `
${SYSTEM_PERSONA}

사용자의 목표와 성향을 바탕으로 목표 달성을 위한 12개의 전략 카테고리를 제안해주세요.

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
  count: number
) => `
${SYSTEM_PERSONA}

사용자의 목표와 성향을 바탕으로 ${count}개의 새로운 전략 카테고리를 제안해주세요.

목표 유형: ${archetype}
목표: "${goal}"
사용자 성향: "${vibeSummary}"

이미 선택된 영역 (중복 제안 금지):
${selectedPillars.map((p) => `- ${p.title}: ${p.description}`).join('\n')}

규칙:
- 이미 선택된 영역과 중복되지 않아야 합니다
- 각 카테고리는 실질적이고 구체적인 영역이어야 합니다
- 사용자의 삶의 맥락에 맞아야 합니다
- 서로 겹치지 않는 독립적인 영역이어야 합니다
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
  pillar: Pillar
) => `
${SYSTEM_PERSONA}

사용자의 목표와 선택한 전략 영역에 대해 12개의 구체적인 실천 지침을 제안해주세요.

목표: "${goal}"
사용자 성향: "${vibeSummary}"
전략 영역: ${pillar.title} - ${pillar.description}

중요 규칙:
- "최선을 다하기", "꾸준히 노력하기" 같은 추상적 표현 절대 금지
- "매일 저녁 8시, 아이와 10분 대화하기" 같은 구체적 실천 방법 사용
- 시간, 장소, 횟수, 방법이 명확해야 함
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
  count: number
) => `
${SYSTEM_PERSONA}

사용자의 목표와 선택한 전략 영역에 대해 ${count}개의 새로운 실천 지침을 제안해주세요.

목표: "${goal}"
사용자 성향: "${vibeSummary}"
전략 영역: ${pillar.title} - ${pillar.description}

이미 선택된 액션 (중복 제안 금지):
${selectedActions.map((a) => `- ${a}`).join('\n')}

중요 규칙:
- 이미 선택된 액션과 중복되지 않아야 합니다
- "최선을 다하기" 같은 추상적 표현 절대 금지
- 구체적인 시간, 장소, 횟수, 방법 포함
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
- "매일 저녁 8시, 아이와 10분 대화하기" 같은 구체적 실천 방법 사용
- 시간, 장소, 횟수, 방법이 명확해야 함
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
