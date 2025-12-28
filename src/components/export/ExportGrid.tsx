import { ExportBlock } from './ExportBlock';
import { MandalartData } from '@/types/mandalart';

interface ExportGridProps {
  data: MandalartData;
}

export function ExportGrid({ data }: ExportGridProps) {
  // 9개 블록 배치 (3x3)
  // subGrids 순서: [0,1,2,3,4,5,6,7] = 8개 외곽
  // 배치: [0,1,2], [3,center,4], [5,6,7]
  const blockOrder = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1은 center block

  // Center block: 8개 pillar titles + core goal
  const centerBlock = {
    title: data.core,
    actions: data.subGrids.map((sg) => sg.title),
    colorIndex: 0, // center는 흰색 계열
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '12px',
        height: '100%',
        width: '100%',
      }}
    >
      {blockOrder.map((blockIndex, i) => {
        if (blockIndex === -1) {
          // Center block
          return (
            <ExportBlock
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
          <ExportBlock
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
