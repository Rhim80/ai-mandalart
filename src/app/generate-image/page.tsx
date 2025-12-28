'use client';

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { MandalartData } from '@/types/mandalart';

// 컬러 시스템 (결과 페이지와 동일)
const SUBGRID_COLORS: Record<number, string> = {
  0: '#FFFFFF',
  1: '#E8D8D4',
  2: '#E4D4D8',
  3: '#E0D4D0',
  4: '#DCD4D4',
  5: '#E4D8D8',
  6: '#E0D8D4',
  7: '#DCD8D4',
  8: '#E4D4D4',
};

// 오타니 쇼헤이 실제 만다라트 데이터 (고등학교 1학년, 2010년)
const OHTANI_MANDALART: MandalartData = {
  core: '8구단 드래프트 1순위',
  subGrids: [
    {
      id: 'body',
      title: '몸 만들기',
      opacityLevel: 1,
      colorIndex: 1,
      actions: [
        '체력',
        'RSQ 130kg',
        '스테미너',
        '유연성',
        'FSQ 90kg',
        '가동역',
        '영양제 먹기',
        '저녁7순갈 아침3순갈',
      ],
    },
    {
      id: 'control',
      title: '제구',
      opacityLevel: 2,
      colorIndex: 2,
      actions: [
        '인스텝 개선',
        '릴리즈 포인트 안정',
        '불안정 없애기',
        '몸통 강화',
        '축 흔들지 않기',
        '하체 강화',
        '몸을 열지 않기',
        '멘탈을 컨트롤',
      ],
    },
    {
      id: 'pitch',
      title: '구위',
      opacityLevel: 3,
      colorIndex: 3,
      actions: [
        '각도를 만든다',
        '위에서부터 던진다',
        '힘 모으기',
        '손목 강화',
        '볼에서 릴리즈',
        '회전수 증가',
        '가동력',
        '하반신 주도',
      ],
    },
    {
      id: 'mental',
      title: '멘탈',
      opacityLevel: 4,
      colorIndex: 4,
      actions: [
        '뚜렷한 목표·목적',
        '일희일비 하지 않기',
        '머리는 차갑게 심장은 뜨겁게',
        '핀치에 강하게',
        '승리에 대한 집념',
        '동료를 배려하는 마음',
        '계획성',
        '인사하기',
      ],
    },
    {
      id: 'personality',
      title: '인간성',
      opacityLevel: 5,
      colorIndex: 5,
      actions: [
        '감사',
        '사랑받는 사람',
        '배려',
        '신뢰받는 사람',
        '예의',
        '긍정적 사고',
        '지속력',
        '물건을 소중히 쓰자',
      ],
    },
    {
      id: 'luck',
      title: '운',
      opacityLevel: 6,
      colorIndex: 6,
      actions: [
        '인사',
        '쓰레기 줍기',
        '부실 청소',
        '심판을 대하는 태도',
        '책 읽기',
        '응원받는 사람',
        '변화구',
        '운',
      ],
    },
    {
      id: 'changeup',
      title: '변화구',
      opacityLevel: 7,
      colorIndex: 7,
      actions: [
        '카운트볼 늘리기',
        '포크볼 완성',
        '슬라이더 구위',
        '좌타자 결정구',
        '늦게 낙차 있는 커브',
        '스피드 160km/h',
        '스트라이크 제구',
        '직구와 같은 폼',
      ],
    },
    {
      id: 'speed',
      title: '스피드 160km/h',
      opacityLevel: 8,
      colorIndex: 8,
      actions: [
        '어깨 주변 강화',
        '라이너 캐치볼',
        '피칭 늘리기',
        '체중 증가',
        '몸통 강화',
        '하체 강화',
        '스피드 160km/h',
        '가동역',
      ],
    },
  ],
};

// 작은 사이즈용 셀 컴포넌트
function SmallCell({
  text,
  isCenter = false,
  isCoreCenter = false,
  colorIndex,
}: {
  text: string;
  isCenter?: boolean;
  isCoreCenter?: boolean;
  colorIndex?: number;
}) {
  if (isCoreCenter) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '3px',
          height: '100%',
          width: '100%',
          padding: '2px',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            fontWeight: 600,
            color: '#d68c7b',
            lineHeight: 1.2,
            textAlign: 'center',
            wordBreak: 'keep-all',
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  if (isCenter && colorIndex !== undefined) {
    const bgColor = SUBGRID_COLORS[colorIndex] || '#FFFFFF';
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
          borderRadius: '3px',
          height: '100%',
          width: '100%',
          padding: '1px',
        }}
      >
        <div
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: '#5d5654',
            lineHeight: 1.1,
            textAlign: 'center',
            wordBreak: 'keep-all',
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: '2px',
        height: '100%',
        width: '100%',
        padding: '1px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: '8px',
          fontWeight: 400,
          color: '#5d5654',
          lineHeight: 1.05,
          textAlign: 'center',
          wordBreak: 'keep-all',
        }}
      >
        {text}
      </div>
    </div>
  );
}

// 작은 사이즈용 블록 컴포넌트
function SmallBlock({
  title,
  actions,
  colorIndex,
  isCenter = false,
}: {
  title: string;
  actions: string[];
  colorIndex: number;
  isCenter?: boolean;
}) {
  const cells = [
    actions[0] || '',
    actions[1] || '',
    actions[2] || '',
    actions[3] || '',
    title,
    actions[4] || '',
    actions[5] || '',
    actions[6] || '',
    actions[7] || '',
  ];

  const bgColor = SUBGRID_COLORS[colorIndex] || '#FFFFFF';

  const getCellColorIndex = (cellIndex: number): number | undefined => {
    if (!isCenter) {
      return cellIndex === 4 ? colorIndex : undefined;
    }
    if (cellIndex === 4) return undefined;
    const pillarMapping: Record<number, number> = {
      0: 1, 1: 2, 2: 3,
      3: 4, 5: 5,
      6: 6, 7: 7, 8: 8,
    };
    return pillarMapping[cellIndex];
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '1px',
        padding: '2px',
        height: '100%',
        width: '100%',
        borderRadius: '4px',
        backgroundColor: bgColor,
      }}
    >
      {cells.map((text, i) => (
        <SmallCell
          key={i}
          text={text}
          isCenter={i === 4 || (isCenter && i !== 4)}
          isCoreCenter={i === 4 && isCenter}
          colorIndex={getCellColorIndex(i)}
        />
      ))}
    </div>
  );
}

// 작은 사이즈용 그리드 컴포넌트
function SmallGrid({ data }: { data: MandalartData }) {
  const blockOrder = [0, 1, 2, 3, -1, 4, 5, 6, 7];

  const centerBlock = {
    title: data.core,
    actions: data.subGrids.map((sg) => sg.title),
    colorIndex: 0,
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '4px',
        height: '100%',
        width: '100%',
      }}
    >
      {blockOrder.map((blockIndex, i) => {
        if (blockIndex === -1) {
          return (
            <SmallBlock
              key={i}
              title={centerBlock.title}
              actions={centerBlock.actions}
              colorIndex={0}
              isCenter={true}
            />
          );
        }

        const subGrid = data.subGrids[blockIndex];
        return (
          <SmallBlock
            key={i}
            title={subGrid.title}
            actions={subGrid.actions}
            colorIndex={subGrid.colorIndex}
          />
        );
      })}
    </div>
  );
}

export default function GenerateImagePage() {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!gridRef.current) return;

    try {
      const dataUrl = await toPng(gridRef.current, {
        pixelRatio: 2,
        backgroundColor: '#F5EEEB',
      });

      const link = document.createElement('a');
      link.download = 'ohtani-mandalart-example.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#e0e0e0', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>
        오타니 쇼헤이 만다라트 예시 이미지 생성
      </h1>
      <p style={{ marginBottom: '10px', color: '#666' }}>
        고등학교 1학년 (2010년) 작성 원본 데이터 기반
      </p>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        아래 그리드가 렌더링되면 &quot;PNG 다운로드&quot; 버튼을 클릭하세요.
      </p>

      <button
        onClick={handleDownload}
        style={{
          padding: '12px 24px',
          backgroundColor: '#d68c7b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 500,
        }}
      >
        PNG 다운로드
      </button>

      <div
        ref={gridRef}
        style={{
          width: '400px',
          height: '400px',
          padding: '8px',
          backgroundColor: '#F5EEEB',
          borderRadius: '8px',
        }}
      >
        <SmallGrid data={OHTANI_MANDALART} />
      </div>
    </div>
  );
}
