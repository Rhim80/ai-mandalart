interface ExportCellProps {
  text: string;
  isCenter?: boolean;
  isCoreCenter?: boolean; // 정중앙 코어 셀 (GOAL 라벨 표시)
  colorIndex?: number;
}

// 기존 MandalartGrid의 컬러 시스템 (핑크/베이지 톤)
const SUBGRID_COLORS: Record<number, string> = {
  0: '#FFFFFF', // center block (흰색)
  1: '#E8D8D4', // 웜 베이지
  2: '#E4D4D8', // 더스티 핑크
  3: '#E0D4D0', // 토프
  4: '#DCD4D4', // 그레이 핑크
  5: '#E4D8D8', // 로즈 베이지
  6: '#E0D8D4', // 샌드
  7: '#DCD8D4', // 웜 그레이
  8: '#E4D4D4', // 블러쉬
};

export function ExportCell({ text, isCenter = false, isCoreCenter = false, colorIndex }: ExportCellProps) {
  // 정중앙 코어 셀: GOAL 라벨 + 목표 텍스트 + 흰색 배경
  if (isCoreCenter) {
    return (
      <div
        style={{
          display: 'table',
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center',
            padding: '2px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#888888',
              fontWeight: 500,
              letterSpacing: '0.1em',
              marginBottom: '2px',
            }}
          >
            GOAL
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#4a4a4a',
              lineHeight: 1.1,
              wordBreak: 'keep-all',
              whiteSpace: 'pre-wrap',
            }}
          >
            {text}
          </div>
        </div>
      </div>
    );
  }

  // 센터 셀 (필러 제목): 해당 필러 색상 적용
  if (isCenter && colorIndex !== undefined) {
    const bgColor = SUBGRID_COLORS[colorIndex] || '#FFFFFF';
    return (
      <div
        style={{
          display: 'table',
          backgroundColor: bgColor,
          borderRadius: '4px',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center',
            padding: '2px',
            color: '#5d5654',
            lineHeight: 1.1,
            fontSize: '18px',
            fontWeight: 600,
            wordBreak: 'keep-all',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  // 일반 액션 셀: 흰색 배경
  return (
    <div
      style={{
        display: 'table',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center',
          padding: '2px',
          color: '#5d5654',
          lineHeight: 1.1,
          fontSize: '14px',
          fontWeight: 400,
          wordBreak: 'keep-all',
          whiteSpace: 'pre-wrap',
        }}
      >
        {text}
      </div>
    </div>
  );
}
