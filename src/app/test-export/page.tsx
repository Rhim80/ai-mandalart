'use client';

import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import { ExportContainer, ExportRatio } from '@/components/export';
import { MandalartData } from '@/types/mandalart';

// 테스트용 샘플 데이터
const SAMPLE_DATA: MandalartData = {
  core: 'AI 비즈니스 성공',
  subGrids: [
    {
      id: 'product',
      title: '제품 개발',
      opacityLevel: 1,
      colorIndex: 1,
      actions: [
        'AI 기능 아이디어',
        '고객 페르소나 정립',
        '고객 여정 맵 정리',
        '브랜드 핵심 가치',
        '로고 및 디자인',
        '소셜 미디어 계정',
        '핵심 가치 리스트',
        '퇴근 후 반 배달',
      ],
    },
    {
      id: 'brand',
      title: '브랜드 구축',
      opacityLevel: 2,
      colorIndex: 2,
      actions: [
        '제품 출시 계획',
        '주간 AI 학습',
        '브랜드 스토리 정립',
        '웹사이트 기획 및 제작',
        '비전 및 미션 정립',
        '퀴어 뉴스레터',
        'AI 슬로건 만들기',
        '비전 스토리텔링',
      ],
    },
    {
      id: 'marketing',
      title: '디지털 마케팅',
      opacityLevel: 3,
      colorIndex: 3,
      actions: [
        'AI 모델 프롬프팅',
        '프로토타입 유저',
        '시장 니즈 조사',
        '자사 블로그 콘텐츠',
        '브랜드 가치 슬로건',
        '네이버 SEO 최적화',
        '비전 슬로건 포스터',
        '인스타',
      ],
    },
    {
      id: 'partnership',
      title: '파트너십 개발',
      opacityLevel: 4,
      colorIndex: 4,
      actions: [
        '고객 요구 분석',
        '직접 대면 AI',
        '직접 비대면 수업',
        '고객 원티드 AI',
        'AI 서비스 발굴 마케팅',
        'AI 콘텐츠 전략',
        '인스타 전략',
        '시장 진입 전략',
      ],
    },
    {
      id: 'growth',
      title: '비전 정립',
      opacityLevel: 5,
      colorIndex: 5,
      actions: [
        '고객 설문 AI',
        '교육 및 훈련',
        '직원 온보딩 수업',
        'AI 사례연구 공유',
        'AI 관련 도서랑',
        '세미나 참가',
        'AI 솔루션 정도',
        '검색 가능 7단계',
      ],
    },
    {
      id: 'team',
      title: '시장 진입 전략',
      opacityLevel: 6,
      colorIndex: 6,
      actions: [
        '타겟 고객 설문조사',
        '블로그에 AI 사례',
        'SNS 콘텐츠활용',
        '관심 있는 AI',
        'AI 트론 세션',
        '커뮤니티 참여',
        '커뮤니티 피드백',
        'AI 관련 분야에서',
      ],
    },
    {
      id: 'finance',
      title: '파트너십 개발',
      opacityLevel: 7,
      colorIndex: 7,
      actions: [
        '딜러 AI 뉴스레터',
        '월간 AI 뉴스레터',
        'AI 넥센서 책임',
        '새로운 AI 사용',
        '사업 계획서',
        '투자 및 펀딩',
        '사업 잠재력 보고서',
        '시장 잠재력 보고서',
      ],
    },
    {
      id: 'legal',
      title: 'AI 기술 연구',
      opacityLevel: 8,
      colorIndex: 8,
      actions: [
        '디지털 고객 발굴',
        'AI 방안 책임 및',
        '일일 트렌드 스캔',
        '시장 리더스 리스트',
        '수익 및 펀딩',
        '시장 참여자 분석',
        'AI 기술 데이터 준비',
        '비전 전략의 과제',
      ],
    },
  ],
};

const RATIOS: { key: ExportRatio; label: string; size: string }[] = [
  { key: 'story', label: '인스타 스토리', size: '1080×1920 (9:16)' },
  { key: 'feed', label: '인스타 피드', size: '1080×1350 (4:5)' },
  { key: 'wide', label: '데스크탑', size: '1920×1080 (16:9)' },
];

const RATIO_SIZES: Record<ExportRatio, { width: number; height: number }> = {
  story: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
  wide: { width: 1920, height: 1080 },
};

export default function TestExportPage() {
  const [selectedRatio, setSelectedRatio] = useState<ExportRatio>('feed');
  const [nickname, setNickname] = useState('Rhim');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, {
        pixelRatio: 2,
        backgroundColor: '#f6f3f0',
      });

      const link = document.createElement('a');
      link.download = `${nickname}-mandalart-${selectedRatio}-test.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, [nickname, selectedRatio]);

  const { width, height } = RATIO_SIZES[selectedRatio];

  return (
    <div style={{ padding: '40px', backgroundColor: '#e0e0e0', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
        Export 테스트 페이지
      </h1>

      {/* 컨트롤 패널 */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* 닉네임 입력 */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
            닉네임
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        </div>

        {/* 비율 선택 */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
            비율 선택
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {RATIOS.map((ratio) => (
              <button
                key={ratio.key}
                onClick={() => setSelectedRatio(ratio.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: selectedRatio === ratio.key ? '2px solid #d68c7b' : '1px solid #ccc',
                  backgroundColor: selectedRatio === ratio.key ? '#fff' : '#f5f5f5',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <div style={{ fontWeight: 500 }}>{ratio.label}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>{ratio.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <button
          onClick={handleDownload}
          style={{
            padding: '12px 24px',
            backgroundColor: '#d68c7b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 500,
            marginTop: '20px',
          }}
        >
          PNG 다운로드
        </button>
      </div>

      {/* 미리보기 (축소) */}
      <div style={{ marginBottom: '16px', color: '#666', fontSize: '14px' }}>
        미리보기 (실제 크기의 50%)
      </div>

      <div
        style={{
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
          marginBottom: `${height * 0.5 + 20}px`,
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <ExportContainer data={SAMPLE_DATA} nickname={nickname} ratio={selectedRatio} />
        </div>
      </div>
    </div>
  );
}
