import { ExportCell } from './ExportCell';

interface ExportBlockProps {
  title: string;
  actions: string[];
  colorIndex: number;
  isCenter?: boolean; // 이 블록이 9x9 그리드의 중앙 블록인지
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

export function ExportBlock({ title, actions, colorIndex, isCenter = false }: ExportBlockProps) {
  // 3x3 그리드: 8개 action + 1개 center (title)
  // 배치 순서: [0,1,2], [3,center,4], [5,6,7]
  const cells = [
    actions[0] || '',
    actions[1] || '',
    actions[2] || '',
    actions[3] || '',
    title, // center
    actions[4] || '',
    actions[5] || '',
    actions[6] || '',
    actions[7] || '',
  ];

  const bgColor = SUBGRID_COLORS[colorIndex] || '#FFFFFF';

  // 중앙 블록일 때: 각 필러 셀의 colorIndex (1-8)
  // 셀 인덱스 → 필러 인덱스 매핑: [0,1,2,3,center,4,5,6,7]
  // 필러 colorIndex: 1~8 (subGrids[0].colorIndex ~ subGrids[7].colorIndex)
  const getCellColorIndex = (cellIndex: number): number | undefined => {
    if (!isCenter) {
      // 외곽 블록: 센터 셀만 색상
      return cellIndex === 4 ? colorIndex : undefined;
    }
    // 중앙 블록: 각 필러 셀은 해당 필러 색상, 코어 셀은 별도 처리
    if (cellIndex === 4) return undefined; // isCoreCenter로 처리됨
    // 셀 인덱스 → 필러 인덱스 변환
    const pillarMapping: Record<number, number> = {
      0: 1, 1: 2, 2: 3, // 상단 행 (필러 1,2,3)
      3: 4, 5: 5,       // 중간 행 (필러 4, 5)
      6: 6, 7: 7, 8: 8, // 하단 행 (필러 6,7,8)
    };
    return pillarMapping[cellIndex];
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '2px',
        padding: '2px',
        height: '100%',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: bgColor,
      }}
    >
      {cells.map((text, i) => (
        <ExportCell
          key={i}
          text={text}
          isCenter={i === 4 || (isCenter && i !== 4)} // 중앙 블록의 필러 셀들도 isCenter
          isCoreCenter={i === 4 && isCenter} // 중앙 블록의 중앙 셀 = 정중앙 코어
          colorIndex={getCellColorIndex(i)}
        />
      ))}
    </div>
  );
}
