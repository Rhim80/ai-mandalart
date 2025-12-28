# AI Mandalart

목표 아키타입 기반 개인화 만다라트 플래너 - 사용자의 목표를 분석하여 81개의 구체적 실천 계획을 생성하는 미니멀리즘 웹앱

## 개발 히스토리

### 2025-12-26 구현 완료

#### Phase 1: 프로젝트 셋업
- Next.js 16 (App Router, Turbopack) 프로젝트 생성
- 의존성 설치: `framer-motion`, `openai`, `modern-screenshot`
- Pretendard (한글) + Geist (영문) 폰트 설정
- 모노크롬 미니멀리즘 디자인 시스템 구축

#### Phase 2: 핵심 기능 구현
1. **목표 입력 (GoalInput)**
   - 2026년 목표 입력
   - "뭘 해야 할지 모르겠어요" → Discovery Mode 진입

2. **목표 발견 모드 (DiscoveryMode)**
   - 5가지 탐색 질문 (관심사, 가치관)
   - AI가 3개 목표 후보 제안
   - 사용자 선택 후 일반 플로우 진입

3. **아키타입 분류 (ArchetypeResult)**
   - 4가지 유형: BUSINESS / GROWTH / RELATION / ROUTINE
   - GPT-4o 기반 자동 분류
   - 신뢰도 점수 및 분류 이유 제공

4. **심층 인터뷰 (InterviewStep)**
   - 아키타입별 3가지 맞춤 질문
   - 사용자 답변 기반 "삶의 결" 요약 생성

5. **전략 영역 선택 (PillarSelection)**
   - 12개 전략 카테고리 AI 제안
   - 8개 선택 (선택 순서 표시)
   - **재생성 기능**: 선택 안한 항목만 새로운 옵션으로 교체

6. **실천 항목 선택 (ActionSelection)**
   - 8개 pillar를 하나씩 순차 진행
   - 각 pillar당 12개 액션 AI 제안
   - 8개 선택 (선택 순서 표시)
   - **재생성 기능**: 선택 안한 액션만 새로운 옵션으로 교체
   - 진행 상황 인디케이터 (1-8)

7. **만다라트 그리드 (MandalartGrid)**
   - 9x9 그리드 (중심 목표 + 8개 서브그리드)
   - 각 서브그리드: 3x3 (제목 + 8개 액션)
   - 클릭하여 상세 보기
   - 이미지 내보내기 (modern-screenshot) + 워터마크
   - 공유 기능 (Web Share API)

#### Phase 3: 디자인 업그레이드 (Apple 스타일)
- 정제된 타이포그래피 (`font-extralight`, `tracking-tight`)
- Apple 스타일 섀도우 시스템 (`shadow-xs` ~ `shadow-xl`)
- Step 진행 인디케이터 (원형 숫자 뱃지)
- 부드러운 Framer Motion 애니메이션
- `btn-primary`, `btn-secondary` 버튼 스타일
- 커스텀 스크롤바, 포커스 스타일

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| AI | OpenAI GPT-4o |
| 폰트 | Pretendard (KOR), Geist (EN) |
| 이미지 내보내기 | modern-screenshot |
| 상태 관리 | React useState + LocalStorage |

---

## 프로젝트 구조

```
ai-mandalart/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트)
│   │   ├── page.tsx                # 메인 페이지
│   │   ├── globals.css             # 글로벌 스타일 + 디자인 토큰
│   │   └── api/
│   │       ├── archetype/route.ts  # 목표 유형 분류
│   │       ├── interview/route.ts  # 인터뷰 질문/요약
│   │       ├── discovery/route.ts  # 목표 발견 모드
│   │       ├── pillars/
│   │       │   ├── route.ts        # 전략 기둥 제안
│   │       │   └── regenerate/route.ts  # 재생성
│   │       └── actions/
│   │           ├── route.ts        # 전체 액션 생성
│   │           ├── suggest/route.ts     # 단일 pillar 액션 제안
│   │           └── regenerate/route.ts  # 액션 재생성
│   ├── components/
│   │   ├── MandalartBuilder.tsx    # 메인 컨테이너
│   │   ├── GoalInput.tsx           # 1단계: 목표 입력
│   │   ├── DiscoveryMode.tsx       # 0단계: 목표 발견
│   │   ├── ArchetypeResult.tsx     # 유형 결과 표시
│   │   ├── InterviewStep.tsx       # 2단계: 인터뷰
│   │   ├── PillarSelection.tsx     # 3단계: 전략 선택 + 재생성
│   │   ├── ActionSelection.tsx     # 4단계: 액션 선택
│   │   ├── MandalartGrid.tsx       # 5단계: 결과 그리드
│   │   ├── SubGrid.tsx             # 서브 그리드 (3x3)
│   │   └── GridCell.tsx            # 개별 셀
│   ├── types/
│   │   └── mandalart.ts            # 타입 정의
│   ├── lib/
│   │   ├── openai.ts               # OpenAI 클라이언트 (gpt-4o)
│   │   └── prompts.ts              # 프롬프트 템플릿
│   └── hooks/
│       └── useMandalartSession.ts  # 세션 상태 + LocalStorage
├── .env.local                      # OpenAI API 키
├── tailwind.config.ts
└── package.json
```

---

## 사용자 플로우

```
[목표 입력] ──────────────────────────────────────────┐
    │                                                 │
    ├── 목표 있음 ──→ [Archetype 분류]                │
    │                      │                          │
    │                      ↓                          │
    │              [심층 인터뷰 3Q]                    │
    │                      │                          │
    │                      ↓                          │
    │              [전략 영역 12개 제안]               │
    │                      │                          │
    │                      ├── 8개 선택               │
    │                      └── 재생성 (선택 안한 것만) │
    │                      │                          │
    │                      ↓                          │
    │              [액션 선택 x8 pillars]              │
    │                      │                          │
    │                      ├── 각 pillar 12개 제안    │
    │                      ├── 8개 선택               │
    │                      └── 재생성 (선택 안한 것만) │
    │                      │                          │
    │                      ↓                          │
    │              [만다라트 완성 9x9]                 │
    │                      │                          │
    │                      ├── 이미지 저장            │
    │                      ├── 공유                   │
    │                      └── 다시 시작              │
    │                                                 │
    └── "뭘 해야 할지 모르겠어요"                      │
           │                                          │
           ↓                                          │
    [Discovery Mode]                                  │
           │                                          │
           ├── 5가지 탐색 질문                        │
           ├── AI가 3개 목표 제안                     │
           └── 선택 ──────────────────────────────────┘
```

---

## 디자인 시스템

### 컬러 (모노크롬)
```css
--background: #ffffff;
--foreground: #1d1d1f;
--foreground-secondary: #86868b;
--foreground-tertiary: #aeaeb2;

/* 서브그리드 투명도 (1-8) */
--grid-opacity-1: rgba(0, 0, 0, 0.015);
--grid-opacity-8: rgba(0, 0, 0, 0.085);
```

### 섀도우 (Apple 스타일)
```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06);
```

### 타이포그래피
- 제목: `text-4xl font-extralight tracking-tight`
- 본문: `text-base leading-relaxed`
- Step 라벨: `text-sm tracking-[0.3em] uppercase`

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 OPENAI_API_KEY 추가

# 개발 서버 실행
npm run dev

# http://localhost:3000 접속
```

---

## 주요 개선 사항 (2025-12-26)

### 4. 바이럴 확산 기능
- **이미지 워터마크**: 저장되는 이미지 하단에 자동 삽입
  - `claude-code.imiwork.com | Sense & AI 오픈채팅방`
- **앱 푸터**: 오픈채팅방 링크 추가
  - "AI 활용에 관심 있다면 함께해요"
  - [Sense & AI 오픈채팅방](https://open.kakao.com/o/gyWjLY6h)
- **modern-screenshot** 라이브러리로 이미지 내보내기 개선

### 1. Pillar 재생성 기능
- 12개 중 마음에 드는 것만 선택
- 선택 안한 항목만 AI가 새로운 옵션으로 교체
- `/api/pillars/regenerate` API 추가

### 2. Action Selection 단계
- 기존: 8개 pillar 선택 후 자동으로 64개 액션 생성
- 변경: 각 pillar별로 12개 제안 → 8개 직접 선택
- 사용자 자기결정감 향상
- `/api/actions/suggest`, `/api/actions/regenerate` API 추가

### 3. Apple 스타일 디자인
- 기존: 단순한 미니멀 (위계 부족)
- 변경: Apple 디자인 철학 적용
  - 정제된 타이포그래피
  - 섀도우 계층 시스템
  - Step 진행 인디케이터
  - 부드러운 마이크로 인터랙션

---

## 연동 정보

| 항목 | 값 |
|------|-----|
| 블로그 | [claude-code.imiwork.com](https://claude-code.imiwork.com) |
| 오픈채팅방 | [Sense & AI](https://open.kakao.com/o/gyWjLY6h) |

---

---

## 2025-12-27 업데이트: Quick Context & 동적 인터뷰

### 문제 인식
> "목표를 적으세요" 라는 빈 입력창은 사용자에게 **백지 공포**를 줄 수 있다.
> 또한 AI가 사용자를 **다층적으로 이해**해야 더 좋은 제안을 할 수 있다.

### 해결: Phase 5 - Quick Context 시스템

#### 핵심 아이디어
```
빈 종이 공포 → 가이드된 시작
고정 질문 → 맞춤형 동적 질문
```

목표 입력 전에 2-3개 칩을 선택하는 **Quick Context** 단계를 추가하여:
1. 사용자가 더 쉽게 시작할 수 있도록 안내
2. AI가 사용자 맥락을 이해하고 더 맞춤형 제안 가능

#### 구현 내용

**Step 1: Quick Context 타입 정의**
```typescript
// src/types/mandalart.ts
export interface QuickContext {
  lifeAreas: string[];      // 복수 선택: 커리어, 건강, 관계, 재정, 자기계발, 취미
  currentStatus: string;    // 단일: 학생, 직장인, 창업자, 프리랜서, 구직중, 기타
  goalStyle: string;        // 단일: 도전적, 안정적, 실험적, 회복/재충전
  yearKeyword: string;      // 단일: 성장, 변화, 안정, 도전, 균형, 회복
}

export const QUICK_CONTEXT_OPTIONS = {
  lifeAreas: ['커리어', '건강', '관계', '재정', '자기계발', '취미'],
  currentStatus: ['학생', '직장인', '창업자', '프리랜서', '구직중', '기타'],
  goalStyle: ['도전적', '안정적', '실험적', '회복/재충전'],
  yearKeyword: ['성장', '변화', '안정', '도전', '균형', '회복'],
};
```

**Step 2: QuickContext 컴포넌트 생성**
- 4개 카테고리별 칩 선택 UI
- 삶의 영역만 복수 선택, 나머지는 단일 선택
- 선택된 칩에 빨강 테두리 강조 (모노크롬 + 빨강 디자인)
- 모든 카테고리 선택 완료 시 "다음" 버튼 활성화

**Step 3: 세션 훅 업데이트**
```typescript
// useMandalartSession.ts
const setQuickContext = useCallback((context: QuickContext) => {
  setSession((prev) => ({
    ...prev,
    quickContext: context,
    currentStep: 'GOAL_INPUT',  // 자동으로 다음 단계로
  }));
}, []);
```

**Step 4: GoalInput 개선**
- Quick Context 기반 동적 플레이스홀더
- 예: "커리어" 선택 → "커리어에서 이루고 싶은 목표를 적어주세요"
- 예: "성장" 키워드 → "성장을 향한 도전적 목표를 만들어보세요"

**Step 5: AI 프롬프트에 맥락 반영**
```typescript
// prompts.ts
const formatQuickContext = (context: QuickContext | null) => {
  if (!context) return '';
  return `
사용자 맥락:
- 집중 영역: ${context.lifeAreas.join(', ')}
- 현재 상황: ${context.currentStatus}
- 목표 스타일: ${context.goalStyle}
- 올해 키워드: ${context.yearKeyword}`;
};
```

적용된 프롬프트:
- `ARCHETYPE_DETECTION` - 목표 유형 분류 시 맥락 반영
- `PILLAR_SUGGESTION` - 전략 카테고리 제안 시 맥락 반영
- `ACTION_SUGGESTION` - 실천 항목 제안 시 맥락 반영

---

### 추가 개선: 동적 인터뷰 질문 생성

#### 기존 문제
심층 인터뷰 질문이 아키타입별로 **고정**되어 있어서:
- 사용자의 구체적인 목표를 반영하지 못함
- 맥락과 무관한 일반적인 질문

#### 해결
목표와 Quick Context를 반영한 **동적 질문 생성**:

```typescript
// prompts.ts
export const INTERVIEW_QUESTION_GENERATION = (
  archetype: ArchetypeType,
  goal: string,
  quickContext: QuickContext | null,
  previousAnswers: InterviewAnswer[]
) => `
${SYSTEM_PERSONA}

사용자의 목표와 맥락에 맞는 심층 인터뷰 질문 3개를 생성해주세요.
${formatQuickContext(quickContext)}

목표 유형: ${archetype}
목표: "${goal}"

질문 설계 원칙:
- 사용자의 구체적인 목표와 맥락을 반영한 맞춤형 질문
- 열린 질문으로 사용자가 자신의 동기와 가치를 탐색하게 유도
- 너무 추상적이거나 철학적이지 않게, 실질적으로 답변할 수 있는 질문
- 각 질문은 서로 다른 측면을 탐색 (동기/감정/실천/관계 등)

JSON 형식으로 응답:
{
  "questions": ["질문1", "질문2", "질문3"]
}
`;
```

#### API 변경
```typescript
// interview/route.ts
if (action === 'getQuestions') {
  const prompt = INTERVIEW_QUESTION_GENERATION(archetype, goal, quickContext, []);
  const result = await callOpenAI<InterviewQuestionsResponse>(prompt);
  return NextResponse.json({ questions: result.questions });
}
```

#### 컴포넌트 변경
```typescript
// InterviewStep.tsx
useEffect(() => {
  // 마운트 시 AI가 맞춤형 질문 3개 한번에 생성
  fetch('/api/interview', {
    body: JSON.stringify({
      action: 'getQuestions',  // 새 액션
      archetype, goal, quickContext,
    }),
  });
}, [archetype, goal, quickContext]);
```

---

### 새로운 사용자 플로우

```
[Quick Context] ─── 칩 선택 (10초)
       │
       ├── 삶의 영역 (복수 선택): 커리어, 건강, 관계...
       ├── 현재 상황 (단일): 학생, 직장인, 창업자...
       ├── 목표 스타일 (단일): 도전적, 안정적, 실험적...
       └── 올해 키워드 (단일): 성장, 변화, 도전...
       │
       ↓
[Goal Input] ─── 맥락 기반 플레이스홀더
       │
       ↓
[Archetype 분류] ─── Quick Context 반영
       │
       ↓
[심층 인터뷰] ─── 목표+맥락 기반 동적 질문 3개
       │
       ↓
[전략 선택] ─── Quick Context 반영된 제안
       │
       ↓
[액션 선택] ─── Quick Context 반영된 제안
       │
       ↓
[만다라트 완성]
```

---

### 파일 변경 요약

| 파일 | 변경 내용 |
|------|----------|
| `types/mandalart.ts` | QuickContext 인터페이스, 옵션 상수, 세션에 quickContext 추가 |
| `components/QuickContext.tsx` | **신규** - 칩 선택 UI 컴포넌트 |
| `hooks/useMandalartSession.ts` | setQuickContext 함수 추가 |
| `components/GoalInput.tsx` | quickContext prop, 동적 플레이스홀더/서브타이틀 |
| `lib/prompts.ts` | formatQuickContext 헬퍼, INTERVIEW_QUESTION_GENERATION 프롬프트 |
| `app/api/archetype/route.ts` | quickContext 파라미터 수신 |
| `app/api/interview/route.ts` | getQuestions 액션 추가 (동적 질문 생성) |
| `components/InterviewStep.tsx` | quickContext prop, 동적 질문 사용 |
| `components/MandalartBuilder.tsx` | Quick Context 단계 추가, 각 컴포넌트에 quickContext 전달 |

---

### 디자인 디테일

**칩 스타일 (모노크롬 + 빨강)**
```css
/* 미선택 */
.chip {
  background: white;
  border: 1px solid rgba(0,0,0,0.15);
  color: #86868b;
}

/* 선택됨 */
.chip.selected {
  background: white;
  border: 2px solid #E53935;  /* 빨강 강조 */
  color: #1d1d1f;
  font-weight: 500;
}
```

---

---

## 2025-12-28 업데이트: Phase 6 - UX 개선 및 다국어 지원

### 1. 다국어 지원 시스템 (한국어/영어)

#### 핵심 아이디어
```
한국어 전용 → 글로벌 사용자 대응
하드코딩 텍스트 → 중앙화된 번역 관리
```

#### 구현 아키텍처

**LanguageContext 생성**
```typescript
// contexts/LanguageContext.tsx
type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;           // 단일 문자열 번역
  options: (key: string) => string[];   // 배열 옵션 번역
}
```

**translations.ts 구조**
```typescript
const translations = {
  ko: {
    quickContext: {
      title: '만다라트',
      subtitle: '당신에 대해 알려주세요',
      // ...
    },
    options: {
      lifeAreas: ['커리어', '건강', '관계', '재정', '자기계발', '취미'],
      // ...
    },
  },
  en: {
    quickContext: {
      title: 'Mandalart',
      subtitle: 'Tell us about yourself',
      // ...
    },
    options: {
      lifeAreas: ['Career', 'Health', 'Relationships', 'Finance', 'Self-Development', 'Hobbies'],
      // ...
    },
  },
};
```

**인덱스 기반 상태 관리 (핵심 패턴)**
```typescript
// 문제: 언어 전환 시 선택한 값이 깨짐
// 해결: 표시값이 아닌 인덱스를 저장

const [lifeAreaIndex, setLifeAreaIndex] = useState<number>(-1);

// 표시용: 현재 언어로 변환
const selectedLifeArea = lifeAreaIndex >= 0 ? lifeAreasOptions[lifeAreaIndex] : '';

// API 전송용: 항상 한국어로 변환 (백엔드 호환성)
const koOptions = { lifeAreas: ['커리어', '건강', ...] };
onComplete({ lifeAreas: [koOptions.lifeAreas[lifeAreaIndex]] });
```

#### 적용된 컴포넌트
- QuickContext, GoalInput, DiscoveryMode
- ArchetypeResult, InterviewStep
- PillarSelection, ActionSelection
- MandalartGrid, DonationLink

---

### 2. 오타니 만다라트 이미지 개선

#### 문제
- 데스크탑에서 이미지가 너무 작음
- 원본 이미지의 연두색이 모노크롬 디자인과 부조화

#### 해결

**이미지 크기 확대**
```tsx
// Before
<div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]">

// After
<div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
```

**그레이스케일 필터 적용**
```tsx
<Image
  src="/ohtani-mandalart.jpg"
  className="object-cover w-full h-full grayscale contrast-[1.05]"
/>
```

**캡션 추가**
```tsx
<p className="mt-3 text-xs text-black/40">
  {language === 'ko'
    ? '오타니 쇼헤이, 고등학교 1학년 (2010)'
    : 'Shohei Ohtani, High School Freshman (2010)'}
</p>
```

---

### 3. 집중 영역 단일 선택으로 변경

#### 문제
복수 선택 시 선택한 영역과 무관한 인터뷰 질문 생성
- 예: "건강" + "커리어" 선택 → 체중감량 목표 → 커리어 관련 질문 등장

#### 해결
```typescript
// Before: 복수 선택
const [lifeAreaIndices, setLifeAreaIndices] = useState<number[]>([]);

// After: 단일 선택
const [lifeAreaIndex, setLifeAreaIndex] = useState<number>(-1);
```

---

### 4. 후원 링크 변경 (Toss → 카카오페이)

#### 배경
토스 아이디 서비스 종료

#### 변경
```typescript
const DONATION_URLS = {
  ko: 'https://qr.kakaopay.com/FPDgOu0JD',  // 카카오페이 QR
  en: 'https://buymeacoffee.com/imiwork',   // Buy Me a Coffee
};
```

---

### 5. Discovery Mode 전면 개편

#### 문제
기존 AI 기반 주관식 질문이 너무 어렵고 막연함
> "어떤 목표를 세우고 싶으세요?" → 사용자 막막함

#### 해결 방향 검토

**Option A (기각)**: 템플릿에 수치 입력
```
건강 → 체중 감량 → "{target}kg" 입력 → "체중 10kg 감량"
```
- 문제: 너무 구체적이어서 AI pillar 생성이 제한적

**Option B (채택)**: 넓은 범위의 목표
```
건강 → 체중 감량 → "건강한 체중 관리와 감량" (바로 완료)
```
- 장점: AI에게 창의적 여지 제공, 사용자 부담 감소

#### 최종 구현

**3단계 → 2단계 간소화**
```
Before: 영역 → 세부 목표 → 수치 입력
After:  영역 → 세부 목표 (바로 완료)
```

**DISCOVERY_OPTIONS 구조**
```typescript
const DISCOVERY_OPTIONS = {
  ko: {
    areas: [
      {
        id: 'health',
        label: '건강',
        subGoals: [
          { id: 'weight_loss', label: '체중 감량', goal: '건강한 체중 관리와 감량' },
          { id: 'exercise_habit', label: '운동 습관', goal: '규칙적인 운동 습관 만들기' },
          // ...
        ],
      },
      // career, finance, relationship, selfdev, hobby
    ],
  },
  en: { /* English translations */ },
};
```

**6개 영역 × 세부 목표**

| 영역 | 세부 목표 |
|------|----------|
| 건강 | 체중 감량, 체중 증가/근육, 운동 습관, 금연, 금주/절주, 수면 개선, 정신건강 |
| 커리어 | 승진/성과, 이직/전직, 역량 강화, 자격증 취득, 사이드 프로젝트, 프리랜서 전환 |
| 재정 | 저축, 빚 상환, 투자 시작, 수입 증가, 지출 줄이기 |
| 관계 | 가족 관계, 친구 관계, 연애/결혼, 네트워킹, 소통 능력 |
| 자기계발 | 독서, 외국어, 새로운 기술, 온라인 강의, 글쓰기/블로그 |
| 취미/여가 | 여행, 창작 활동, 스포츠/레저, 음악, 휴식/힐링 |

---

### 파일 변경 요약

| 파일 | 작업 |
|------|------|
| `contexts/LanguageContext.tsx` | **신규** - 언어 컨텍스트 |
| `components/LanguageToggle.tsx` | **신규** - 언어 전환 버튼 |
| `lib/translations.ts` | **신규** - 전체 UI 번역 |
| `components/ClientLayout.tsx` | **신규** - Provider 래핑 |
| `components/QuickContext.tsx` | 다국어, 단일선택, 이미지 개선 |
| `components/DiscoveryMode.tsx` | 2단계 객관식으로 전면 개편 |
| `components/DonationLink.tsx` | 카카오페이 URL 변경 |
| 기타 모든 컴포넌트 | `useLanguage()` 훅 적용 |

---

### 새로운 프로젝트 구조

```
ai-mandalart/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── archetype/route.ts
│   │       ├── interview/route.ts
│   │       ├── discovery/route.ts
│   │       ├── pillars/
│   │       │   ├── route.ts
│   │       │   └── regenerate/route.ts
│   │       └── actions/
│   │           ├── route.ts
│   │           ├── suggest/route.ts
│   │           └── regenerate/route.ts
│   ├── components/
│   │   ├── ClientLayout.tsx          # NEW - Provider 래핑
│   │   ├── LanguageToggle.tsx        # NEW - 언어 전환
│   │   ├── DonationLink.tsx          # NEW - 후원 링크
│   │   ├── MandalartBuilder.tsx
│   │   ├── QuickContext.tsx          # 다국어 + 단일선택
│   │   ├── GoalInput.tsx
│   │   ├── DiscoveryMode.tsx         # 2단계 객관식
│   │   ├── ArchetypeResult.tsx
│   │   ├── InterviewStep.tsx
│   │   ├── PillarSelection.tsx
│   │   ├── ActionSelection.tsx
│   │   ├── MandalartGrid.tsx
│   │   ├── SubGrid.tsx
│   │   └── GridCell.tsx
│   ├── contexts/
│   │   └── LanguageContext.tsx       # NEW - 언어 상태 관리
│   ├── types/
│   │   └── mandalart.ts
│   ├── lib/
│   │   ├── openai.ts
│   │   ├── prompts.ts
│   │   └── translations.ts           # NEW - 번역 데이터
│   └── hooks/
│       └── useMandalartSession.ts
├── public/
│   └── ohtani-mandalart.jpg          # 오타니 만다라트 이미지
├── .env.local
├── tailwind.config.ts
└── package.json
```

---

## 향후 개선 계획

- [x] Quick Context 시스템 (2025-12-27)
- [x] 동적 인터뷰 질문 생성 (2025-12-27)
- [x] 다국어 지원 - 한국어/영어 (2025-12-28)
- [x] Discovery Mode 개편 - 객관식 2단계 (2025-12-28)
- [x] 오타니 이미지 디자인 개선 (2025-12-28)
- [x] 집중 영역 단일 선택 (2025-12-28)
- [x] 후원 링크 카카오페이 변경 (2025-12-28)
- [x] Cloudflare Pages 배포 + AI Gateway 연동 (2025-12-28)
- [x] 내보내기 비율 선택 기능 (9:16, 1:1, 16:9) (2025-12-28)
- [ ] 결과 URL 공유 (query param 인코딩)
- [ ] PDF 내보내기
- [ ] 일본어 지원
- [ ] 진행 상황 저장/불러오기 개선
- [ ] 모바일 반응형 최적화

---

---

## 2025-12-28 업데이트: Phase 7 - Cloudflare Pages 배포 및 내보내기 개선

### 1. Cloudflare Pages 배포 + AI Gateway 연동

#### 문제 상황
Cloudflare Pages에 배포 후 OpenAI API 호출 시 403 에러 발생:
```
"Country, region, or territory not supported"
```
Cloudflare의 Edge 서버가 OpenAI API를 직접 호출할 때 지역 제한에 걸림.

#### 해결: Cloudflare AI Gateway

**Step 1: AI Gateway 생성**
- Cloudflare Dashboard > AI > AI Gateway > Create Gateway
- Gateway 이름: `ai-mandalart`
- 생성된 URL: `https://gateway.ai.cloudflare.com/v1/{account_id}/ai-mandalart/openai`

**Step 2: OpenAI 클라이언트 수정**
```typescript
// src/lib/openai.ts
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  // Cloudflare AI Gateway를 통해 OpenAI API 호출 (403 에러 우회)
  const baseURL = process.env.CLOUDFLARE_AI_GATEWAY_URL || 'https://api.openai.com/v1';

  return new OpenAI({ apiKey, baseURL });
}
```

**Step 3: Edge Runtime 환경변수 주입**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'standalone',

  // Edge Runtime에서 환경변수 사용을 위한 설정
  env: {
    CLOUDFLARE_AI_GATEWAY_URL: process.env.CLOUDFLARE_AI_GATEWAY_URL,
  },
};
```

> **핵심 포인트**: Next.js Edge Runtime에서는 `process.env`가 빌드 타임에 주입됨.
> `next.config.ts`의 `env` 설정을 통해 환경변수를 명시적으로 노출해야 함.

**Step 4: Cloudflare Pages 환경변수 설정**
- Settings > Environment variables
- `CLOUDFLARE_AI_GATEWAY_URL`: AI Gateway URL
- `OPENAI_API_KEY`: OpenAI API 키

#### AI Gateway의 장점
- 지역 제한 우회
- API 호출 모니터링 및 로깅
- Rate limiting 설정 가능
- 캐싱 옵션

---

### 2. 내보내기 비율 선택 기능

#### 문제
기존: 인스타 스토리(9:16) 비율로만 내보내기 가능
요청: 데스크탑 사용자를 위한 다양한 비율 지원

#### 해결: 3가지 비율 옵션

**비율 정의**
```typescript
type ExportRatio = 'story' | 'square' | 'desktop';

const EXPORT_RATIOS: Record<ExportRatio, { width: number; height: number; label: string }> = {
  story: { width: 1080, height: 1920, label: '인스타 스토리 (9:16)' },
  square: { width: 1080, height: 1080, label: '정사각형 (1:1)' },
  desktop: { width: 1920, height: 1080, label: '데스크탑 (16:9)' },
};
```

**Canvas 기반 이미지 생성**
- 비율별로 그리드 크기, 폰트 크기, 여백 자동 조정
- 세로형/정사각형/가로형에 맞는 레이아웃 적용

**UI: 드롭다운 선택**
```tsx
<motion.button onClick={() => setShowExportOptions(!showExportOptions)}>
  {t('result.export')}
</motion.button>

{showExportOptions && (
  <div className="dropdown">
    {(Object.keys(EXPORT_RATIOS) as ExportRatio[]).map((ratio) => (
      <button onClick={() => handleExportWithRatio(ratio)}>
        {EXPORT_RATIOS[ratio].label}
      </button>
    ))}
  </div>
)}
```

---

### 3. URL 통일

모든 푸터 및 내보내기 이미지에서 URL 통일:
- 변경 전: `claude-code.imiwork.com` (일부 혼재)
- 변경 후: `mandalart.imiwork.com` (전체 통일)

---

### 파일 변경 요약

| 파일 | 변경 내용 |
|------|----------|
| `src/lib/openai.ts` | AI Gateway baseURL 설정 |
| `next.config.ts` | Edge Runtime 환경변수 주입 |
| `wrangler.toml` | Cloudflare Pages 설정 |
| `src/components/MandalartGrid.tsx` | 내보내기 비율 선택 UI, URL 통일 |
| `src/components/MandalartBuilder.tsx` | USE_ANTHROPIC_STYLE = false (디자인 롤백) |

---

### 배포 정보

| 항목 | 값 |
|------|-----|
| 배포 URL | [mandalart.imiwork.com](https://mandalart.imiwork.com) |
| 플랫폼 | Cloudflare Pages |
| AI Gateway | Cloudflare AI Gateway (OpenAI 프록시) |

---

## 라이선스

MIT License
