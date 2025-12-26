# AI Mandalart

목표 아키타입 기반 개인화 만다라트 플래너 - 사용자의 목표를 분석하여 81개의 구체적 실천 계획을 생성하는 미니멀리즘 웹앱

## 개발 히스토리

### 2025-12-26 구현 완료

#### Phase 1: 프로젝트 셋업
- Next.js 16 (App Router, Turbopack) 프로젝트 생성
- 의존성 설치: `framer-motion`, `openai`, `html2canvas`
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
   - 이미지 내보내기 (html2canvas)
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
| 이미지 내보내기 | html2canvas |
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

## 향후 개선 계획

- [ ] 결과 URL 공유 (query param 인코딩)
- [ ] PDF 내보내기
- [ ] 다국어 지원 (EN)
- [ ] 진행 상황 저장/불러오기 개선
- [ ] 모바일 반응형 최적화

---

## 라이선스

MIT License
