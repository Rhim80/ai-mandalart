export type Language = 'ko' | 'en';

type TranslationValue = string | string[];

export const translations: Record<Language, Record<string, TranslationValue>> = {
  ko: {
    // QuickContext - Value Proposition
    'quickContext.title': 'AI Mandalart',
    'quickContext.ohtaniStory': '현재 MLB에서 가장 핫한 오타니 쇼헤이는 고등학교 때 이 방법으로 "8구단 1순위 드래프트" 목표를 세우고 달성했습니다',
    'quickContext.processDesc': '목표 하나를 입력하면, AI가 8개 전략과 64개 실천항목을 제안합니다',
    'quickContext.subtitle': '먼저, 당신에 대해 알려주세요',
    'quickContext.nickname': '닉네임',
    'quickContext.nicknameHint': '결과 이미지에 표시됩니다',
    'quickContext.nicknamePlaceholder': '예: 열정맨, 성장러버',
    'quickContext.lifeAreas': '집중하고 싶은 삶의 영역',
    'quickContext.currentStatus': '현재 상황',
    'quickContext.goalStyle': '목표 스타일',
    'quickContext.yearKeyword': '올해 키워드',
    'quickContext.next': '다음',

    // GoalInput
    'goalInput.title': 'AI Mandalart',
    'goalInput.subtitle': '당신의 목표를 81개의 구체적인 실천 계획으로',
    'goalInput.placeholder': '예: 2026년에 월 1000만원 부업 수익 만들기',
    'goalInput.submit': '시작하기',
    'goalInput.discovery': '목표가 명확하지 않다면?',
    'goalInput.discoveryButton': '목표 발견 모드',

    // ArchetypeResult
    'archetype.step': 'Step 1',
    'archetype.title': '목표 유형 분석',
    'archetype.yourGoal': '당신의 목표',
    'archetype.goalType': '목표 유형',
    'archetype.continue': '인터뷰 시작',
    'archetype.BUSINESS': '비즈니스 성장',
    'archetype.GROWTH': '자기 성장',
    'archetype.RELATION': '관계 발전',
    'archetype.ROUTINE': '일상 개선',

    // InterviewStep
    'interview.step': 'Step 2',
    'interview.title': '심층 인터뷰',
    'interview.subtitle': '마음 가는 대로 적어주세요',
    'interview.placeholder': '생각나는 대로 자유롭게 적어주세요...',
    'interview.next': '다음',
    'interview.previous': '이전 답변',

    // PillarSelection
    'pillarSelection.step': 'Step 3',
    'pillarSelection.title': '전략 영역 선택',
    'pillarSelection.subtitle': '목표 달성을 위한 8가지 핵심 영역을 선택하세요',
    'pillarSelection.regenerate': '선택 안한 {n}개 다시 제안받기',
    'pillarSelection.next': '다음 단계',
    'pillarSelection.reset': '처음으로',
    'pillarSelection.addCustom': '직접 추가하기',
    'pillarSelection.customPlaceholder': '새로운 전략 영역',
    'pillarSelection.needMore': '{n}개 더 선택해주세요',

    // ActionSelection
    'actionSelection.step': 'Step 4',
    'actionSelection.title': '실천 항목 선택',
    'actionSelection.subtitle': '각 영역별 8가지 실천 항목을 선택하세요',
    'actionSelection.progress': '{current} / {total} 영역',
    'actionSelection.regenerate': '다른 옵션 제안받기',
    'actionSelection.next': '다음 영역으로',
    'actionSelection.complete': '만다라트 완성하기',
    'actionSelection.reset': '처음으로',
    'actionSelection.needMore': '{n}개 더 선택해주세요',
    'actionSelection.addCustom': '직접 추가',
    'actionSelection.customPlaceholder': '실천 항목 입력',

    // MandalartGrid (Result)
    'result.year': '2026',
    'result.subtitle': 'Life Keyword',
    'result.goal': 'GOAL',
    'result.export': '이미지 저장',
    'result.exportStory': '스토리용 저장',
    'result.exportCarousel': '캐러셀 저장 (9장)',
    'result.share': '공유하기',
    'result.reset': '다시 시작',
    'result.closeOverlay': '아무 곳이나 클릭하여 닫기',
    'result.carouselDownloading': '캐러셀 이미지 다운로드 중...',
    'result.carouselComplete': '9장의 이미지가 저장되었습니다!',

    // DiscoveryMode
    'discovery.title': '목표 발견 모드',
    'discovery.subtitle': '몇 가지 질문으로 당신의 목표를 찾아드릴게요',
    'discovery.back': '돌아가기',
    'discovery.selectGoal': '이 목표로 시작하기',

    // Donation
    'donation.support': '커피 한 잔 사주기',
    'donation.supportShort': '후원하기',

    // Footer
    'footer.community': 'AI 활용에 관심 있다면 함께해요',
    'footer.chatroom': 'Sense & AI 오픈채팅방',

    // Common
    'common.loading': '잠시만 기다려주세요',
    'common.generating': '만다라트를 생성하고 있습니다...',
    'common.confirmReset': '처음부터 다시 시작하시겠습니까?',
    'common.linkCopied': '링크가 복사되었습니다!',

    // Options (QUICK_CONTEXT_OPTIONS)
    'options.lifeAreas': ['커리어', '건강', '관계', '재정', '자기계발', '취미'],
    'options.currentStatus': ['학생', '직장인', '창업자', '프리랜서', '구직중', '기타'],
    'options.goalStyle': ['도전적', '안정적', '실험적', '회복/재충전'],
    'options.yearKeyword': ['성장', '변화', '안정', '도전', '균형', '회복'],
  },
  en: {
    // QuickContext - Value Proposition
    'quickContext.title': 'AI Mandalart',
    'quickContext.ohtaniStory': 'The hottest player in MLB, Shohei Ohtani, used this method in high school to set and achieve his goal of being "drafted 1st round by 8 teams"',
    'quickContext.processDesc': 'Enter one goal, and AI will suggest 8 strategies and 64 action items',
    'quickContext.subtitle': 'Tell us about yourself',
    'quickContext.nickname': 'Nickname',
    'quickContext.nicknameHint': 'Displayed on result image',
    'quickContext.nicknamePlaceholder': 'e.g., Dreamer, GoalGetter',
    'quickContext.lifeAreas': 'Life areas to focus on',
    'quickContext.currentStatus': 'Current status',
    'quickContext.goalStyle': 'Goal style',
    'quickContext.yearKeyword': 'Year keyword',
    'quickContext.next': 'Next',

    // GoalInput
    'goalInput.title': 'AI Mandalart',
    'goalInput.subtitle': 'Transform your goal into 81 actionable steps',
    'goalInput.placeholder': 'e.g., Build a side business earning $5000/month in 2026',
    'goalInput.submit': 'Start',
    'goalInput.discovery': "Not sure about your goal?",
    'goalInput.discoveryButton': 'Discovery Mode',

    // ArchetypeResult
    'archetype.step': 'Step 1',
    'archetype.title': 'Goal Type Analysis',
    'archetype.yourGoal': 'Your Goal',
    'archetype.goalType': 'Goal Type',
    'archetype.continue': 'Start Interview',
    'archetype.BUSINESS': 'Business Growth',
    'archetype.GROWTH': 'Personal Growth',
    'archetype.RELATION': 'Relationship',
    'archetype.ROUTINE': 'Daily Routine',

    // InterviewStep
    'interview.step': 'Step 2',
    'interview.title': 'Deep Interview',
    'interview.subtitle': 'Write whatever comes to mind',
    'interview.placeholder': 'Feel free to write your thoughts...',
    'interview.next': 'Next',
    'interview.previous': 'Previous answers',

    // PillarSelection
    'pillarSelection.step': 'Step 3',
    'pillarSelection.title': 'Select Strategy Areas',
    'pillarSelection.subtitle': 'Choose 8 key areas to achieve your goal',
    'pillarSelection.regenerate': 'Regenerate {n} unselected',
    'pillarSelection.next': 'Next Step',
    'pillarSelection.reset': 'Start Over',
    'pillarSelection.addCustom': 'Add Custom',
    'pillarSelection.customPlaceholder': 'New strategy area',
    'pillarSelection.needMore': 'Select {n} more',

    // ActionSelection
    'actionSelection.step': 'Step 4',
    'actionSelection.title': 'Select Action Items',
    'actionSelection.subtitle': 'Choose 8 action items for each area',
    'actionSelection.progress': '{current} / {total} areas',
    'actionSelection.regenerate': 'Suggest different options',
    'actionSelection.next': 'Next Area',
    'actionSelection.complete': 'Complete Mandalart',
    'actionSelection.reset': 'Start Over',
    'actionSelection.needMore': 'Select {n} more',
    'actionSelection.addCustom': 'Add Custom',
    'actionSelection.customPlaceholder': 'Enter action item',

    // MandalartGrid (Result)
    'result.year': '2026',
    'result.subtitle': 'Life Keyword',
    'result.goal': 'GOAL',
    'result.export': 'Save Image',
    'result.exportStory': 'Save for Story',
    'result.exportCarousel': 'Save Carousel (9)',
    'result.share': 'Share',
    'result.reset': 'Start Over',
    'result.closeOverlay': 'Click anywhere to close',
    'result.carouselDownloading': 'Downloading carousel images...',
    'result.carouselComplete': '9 images saved!',

    // DiscoveryMode
    'discovery.title': 'Discovery Mode',
    'discovery.subtitle': "Let's find your goal with a few questions",
    'discovery.back': 'Go Back',
    'discovery.selectGoal': 'Start with this goal',

    // Donation
    'donation.support': 'Buy me a coffee',
    'donation.supportShort': 'Support',

    // Footer
    'footer.community': 'Interested in AI? Join us',
    'footer.chatroom': 'Sense & AI Chat',

    // Common
    'common.loading': 'Please wait...',
    'common.generating': 'Generating your mandalart...',
    'common.confirmReset': 'Start over from the beginning?',
    'common.linkCopied': 'Link copied to clipboard!',

    // Options
    'options.lifeAreas': ['Career', 'Health', 'Relationship', 'Finance', 'Growth', 'Hobby'],
    'options.currentStatus': ['Student', 'Employee', 'Entrepreneur', 'Freelancer', 'Job Seeking', 'Other'],
    'options.goalStyle': ['Ambitious', 'Stable', 'Experimental', 'Recovery'],
    'options.yearKeyword': ['Growth', 'Change', 'Stability', 'Challenge', 'Balance', 'Recovery'],
  },
};
