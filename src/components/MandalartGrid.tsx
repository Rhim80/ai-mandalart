'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartData } from '@/types/mandalart';
import { useLanguage } from '@/contexts/LanguageContext';
import { DonationLink } from './DonationLink';

// 레퍼런스 이미지 스타일 - 핑크/베이지 톤으로 통일 (미묘한 차이만)
const SUBGRID_COLORS = [
  '#E8D8D4', // 웜 베이지
  '#E4D4D8', // 더스티 핑크
  '#E0D4D0', // 토프
  '#DCD4D4', // 그레이 핑크
  '#E4D8D8', // 로즈 베이지
  '#E0D8D4', // 샌드
  '#DCD8D4', // 웜 그레이
  '#E4D4D4', // 블러쉬
];

// 전체 배경색 (연한 핑크 베이지)
const BG_COLOR = '#F5EEEB';

// 삼각형 화살표 SVG - 뾰족한 부분이 해당 방향을 향함
const Arrow = ({ direction }: { direction: 'right' | 'left' | 'up' | 'down' | 'down-right' | 'down-left' | 'up-right' | 'up-left' }) => {
  const paths: Record<string, string> = {
    right: 'M0,0 L6,3 L0,6 Z',
    left: 'M6,0 L0,3 L6,6 Z',
    down: 'M0,0 L6,0 L3,6 Z',
    up: 'M0,6 L6,6 L3,0 Z',
    'up-left': 'M0,0 L6,3 L3,6 Z',
    'up-right': 'M6,0 L0,3 L3,6 Z',
    'down-left': 'M0,6 L3,0 L6,3 Z',
    'down-right': 'M6,6 L0,3 L3,0 Z',
  };
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" className="fill-gray-400">
      <path d={paths[direction]} />
    </svg>
  );
};

// 스토리 캔버스 크기 (9:16 비율)
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

interface MandalartGridProps {
  data: MandalartData;
  nickname?: string;
  onExport?: () => void; // 이제 내부에서 비율 선택 후 내보내기 처리
  onShare: () => void;
  onReset: () => void;
}

// 내보내기 비율 옵션
type ExportRatio = 'story' | 'square' | 'desktop';
const EXPORT_RATIOS: Record<ExportRatio, { width: number; height: number; label: string }> = {
  story: { width: 1080, height: 1920, label: '인스타 스토리 (9:16)' },
  square: { width: 1080, height: 1080, label: '정사각형 (1:1)' },
  desktop: { width: 1920, height: 1080, label: '데스크탑 (16:9)' },
};

export function MandalartGrid({ data, nickname, onExport, onShare, onReset }: MandalartGridProps) {
  const { t, language } = useLanguage();
  const [activeSubGrid, setActiveSubGrid] = useState<string | null>(null);
  const [isExportingCarousel, setIsExportingCarousel] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 비율별 이미지 내보내기
  const handleExportWithRatio = useCallback(async (ratio: ExportRatio) => {
    setIsExporting(true);
    setShowExportOptions(false);

    const { width, height } = EXPORT_RATIOS[ratio];
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filePrefix = nickname || 'mandalart';

    // 배경
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // 비율에 따른 그리드 크기 계산
    const isVertical = height > width;
    const isSquare = width === height;

    let gridTotalSize: number;
    let cellSize: number;
    let gap: number;
    let startX: number;
    let startY: number;
    let headerY: number;
    let footerY: number;
    let fontSize: { title: number; pillar: number; action: number; header: number };

    if (isVertical) {
      // 세로형 (9:16)
      gridTotalSize = width * 0.9;
      gap = 6;
      cellSize = (gridTotalSize - gap * 2) / 3;
      startX = (width - gridTotalSize) / 2;
      startY = height * 0.2;
      headerY = height * 0.08;
      footerY = height - 60;
      fontSize = { title: 32, pillar: 24, action: 20, header: 40 };
    } else if (isSquare) {
      // 정사각형 (1:1)
      gridTotalSize = width * 0.85;
      gap = 6;
      cellSize = (gridTotalSize - gap * 2) / 3;
      startX = (width - gridTotalSize) / 2;
      startY = height * 0.18;
      headerY = height * 0.06;
      footerY = height - 50;
      fontSize = { title: 28, pillar: 22, action: 18, header: 36 };
    } else {
      // 가로형 (16:9)
      gridTotalSize = height * 0.75;
      gap = 6;
      cellSize = (gridTotalSize - gap * 2) / 3;
      startX = (width - gridTotalSize) / 2;
      startY = height * 0.15;
      headerY = height * 0.06;
      footerY = height - 40;
      fontSize = { title: 26, pillar: 20, action: 16, header: 32 };
    }

    // 헤더
    ctx.fillStyle = '#4a4a4a';
    ctx.font = `bold ${fontSize.header}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(language === 'ko' ? '2026' : '2026', width / 2, headerY);

    ctx.font = `${fontSize.header * 0.4}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = '#888888';
    ctx.fillText('LIFE KEYWORD', width / 2, headerY + fontSize.header * 0.5);

    if (nickname) {
      ctx.font = `${fontSize.header * 0.5}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = '#CC785C';
      ctx.fillText(nickname, width / 2, headerY + fontSize.header * 1);
    }

    // 셀 그리기 함수
    const drawCell = (
      x: number, y: number, w: number, h: number,
      text: string, bgColor: string, textColor: string,
      textSize: number, isBold: boolean = false
    ) => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = textColor;
      ctx.font = `${isBold ? 'bold ' : ''}${textSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 텍스트 줄바꿈
      const maxWidth = w - 10;
      const chars = text.split('');
      let lines: string[] = [];
      let currentLine = '';

      for (const char of chars) {
        const testLine = currentLine + char;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      if (lines.length > 3) {
        lines = lines.slice(0, 3);
        lines[2] = lines[2].slice(0, -1) + '…';
      }

      const lineHeight = textSize * 1.2;
      const totalH = lines.length * lineHeight;
      const textStartY = y + h / 2 - totalH / 2 + lineHeight / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, x + w / 2, textStartY + i * lineHeight);
      });
    };

    // 3x3 서브그리드 그리기
    const drawSubGrid = (gridX: number, gridY: number, subGridIndex: number, isCore: boolean) => {
      const subGrid = isCore ? null : data.subGrids[subGridIndex];
      const subCellSize = (cellSize - 4) / 3;
      const subGap = 2;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const cellIndex = row * 3 + col;
          const x = gridX + col * (subCellSize + subGap);
          const y = gridY + row * (subCellSize + subGap);
          const isCenter = cellIndex === 4;

          if (isCore) {
            if (isCenter) {
              drawCell(x, y, subCellSize, subCellSize, data.core, '#ffffff', '#1d1d1f', fontSize.title * 0.5, true);
            } else {
              const pillarIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
              const pillar = data.subGrids[pillarIndex];
              if (pillar) {
                drawCell(x, y, subCellSize, subCellSize, pillar.title, SUBGRID_COLORS[pillarIndex], '#4a4a4a', fontSize.pillar * 0.6, true);
              }
            }
          } else if (subGrid) {
            if (isCenter) {
              drawCell(x, y, subCellSize, subCellSize, subGrid.title, SUBGRID_COLORS[subGridIndex], '#4a4a4a', fontSize.pillar * 0.6, true);
            } else {
              const actionIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
              drawCell(x, y, subCellSize, subCellSize, subGrid.actions[actionIndex] || '', '#ffffff', '#666666', fontSize.action * 0.6);
            }
          }
        }
      }
    };

    // 9개 서브그리드 배치 (3x3)
    const positions = [
      [0, 0, 0], [0, 1, 1], [0, 2, 2],
      [1, 0, 3], [1, 1, -1], [1, 2, 4],
      [2, 0, 5], [2, 1, 6], [2, 2, 7],
    ];

    positions.forEach(([row, col, subGridIndex]) => {
      const x = startX + col * (cellSize + gap);
      const y = startY + row * (cellSize + gap);
      drawSubGrid(x, y, subGridIndex, subGridIndex === -1);
    });

    // 푸터
    ctx.fillStyle = '#aaaaaa';
    ctx.font = `${fontSize.action}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('mandalart.imiwork.com', width / 2, footerY);

    // 다운로드
    const link = document.createElement('a');
    link.download = `${filePrefix}-mandalart-${ratio}-${dateStr}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setIsExporting(false);
  }, [data, nickname, language]);

  const handleSubGridClick = (gridId: string) => {
    if (activeSubGrid === gridId) {
      setActiveSubGrid(null);
    } else {
      setActiveSubGrid(gridId);
    }
  };

  const handleCoreClick = () => {
    setActiveSubGrid(null);
  };

  const activeGrid = activeSubGrid ? data.subGrids.find((g) => g.id === activeSubGrid) : null;
  const activeGridIndex = activeGrid ? data.subGrids.findIndex((g) => g.id === activeSubGrid) : -1;

  // 캐러셀 이미지 생성 함수 (9장: 코어 1장 + 영역별 8장)
  const handleExportCarousel = useCallback(async () => {
    if (isExportingCarousel) return;
    setIsExportingCarousel(true);

    const canvas = document.createElement('canvas');
    canvas.width = STORY_WIDTH;
    canvas.height = STORY_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExportingCarousel(false);
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const filePrefix = nickname || 'mandalart';

    // 공통 스타일 함수들
    const drawBackground = () => {
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
    };

    const drawHeader = (pageNum: number) => {
      // 상단 로고/타이틀
      ctx.fillStyle = '#4a4a4a';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MANDALART', STORY_WIDTH / 2, 100);

      // 닉네임
      if (nickname) {
        ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(nickname, STORY_WIDTH / 2, 145);
      }

      // 페이지 번호
      ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#999999';
      ctx.fillText(`${pageNum} / 9`, STORY_WIDTH / 2, STORY_HEIGHT - 80);

      // 푸터
      ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText('mandalart.imiwork.com', STORY_WIDTH / 2, STORY_HEIGHT - 40);
    };

    const downloadCanvas = (filename: string) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    // 셀 그리기 함수
    const drawCell = (
      x: number,
      y: number,
      width: number,
      height: number,
      text: string,
      bgColor: string,
      textColor: string,
      fontSize: number,
      isBold: boolean = false
    ) => {
      // 배경
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, width, height);

      // 텍스트
      ctx.fillStyle = textColor;
      ctx.font = `${isBold ? 'bold ' : ''}${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 텍스트 줄바꿈 처리
      const maxWidth = width - 20;
      const words = text.split('');
      let lines: string[] = [];
      let currentLine = '';

      for (const char of words) {
        const testLine = currentLine + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = char;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // 최대 3줄로 제한
      if (lines.length > 3) {
        lines = lines.slice(0, 3);
        lines[2] = lines[2].slice(0, -1) + '…';
      }

      const lineHeight = fontSize * 1.3;
      const totalHeight = lines.length * lineHeight;
      const startY = y + height / 2 - totalHeight / 2 + lineHeight / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, x + width / 2, startY + i * lineHeight);
      });
    };

    // 1. 코어 이미지 (목표 + 8개 전략 영역)
    drawBackground();
    drawHeader(1);

    const coreGridSize = 280;
    const coreGap = 8;
    const coreTotalSize = coreGridSize * 3 + coreGap * 2;
    const coreStartX = (STORY_WIDTH - coreTotalSize) / 2;
    const coreStartY = 280;

    // "나의 목표" 라벨
    ctx.fillStyle = '#4a4a4a';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(language === 'ko' ? '나의 목표' : 'MY GOAL', STORY_WIDTH / 2, coreStartY - 40);

    // 3x3 코어 그리드
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cellIndex = row * 3 + col;
        const x = coreStartX + col * (coreGridSize + coreGap);
        const y = coreStartY + row * (coreGridSize + coreGap);

        if (cellIndex === 4) {
          // 중앙 - 목표
          drawCell(x, y, coreGridSize, coreGridSize, data.core, '#ffffff', '#1d1d1f', 36, true);
        } else {
          // 8개 전략 영역
          const pillarIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
          const pillar = data.subGrids[pillarIndex];
          if (pillar) {
            drawCell(x, y, coreGridSize, coreGridSize, pillar.title, SUBGRID_COLORS[pillarIndex], '#4a4a4a', 32, true);
          }
        }
      }
    }

    // 설명 텍스트
    ctx.fillStyle = '#888888';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      language === 'ko' ? '← 스와이프하여 각 영역의 실천 항목 보기' : '← Swipe to see action items',
      STORY_WIDTH / 2,
      coreStartY + coreTotalSize + 60
    );

    downloadCanvas(`${filePrefix}-carousel-1-core-${dateStr}.png`);

    // 2~9. 각 영역별 이미지 (8장)
    for (let i = 0; i < 8; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 잠시 대기

      const subGrid = data.subGrids[i];
      if (!subGrid) continue;

      drawBackground();
      drawHeader(i + 2);

      // 영역 제목
      const titleY = 220;
      ctx.fillStyle = SUBGRID_COLORS[i];
      ctx.fillRect(STORY_WIDTH / 2 - 200, titleY - 35, 400, 70);
      ctx.fillStyle = '#4a4a4a';
      ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(subGrid.title, STORY_WIDTH / 2, titleY + 10);

      // 3x3 액션 그리드
      const gridSize = 300;
      const gap = 12;
      const totalSize = gridSize * 3 + gap * 2;
      const startX = (STORY_WIDTH - totalSize) / 2;
      const startY = 340;

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const cellIndex = row * 3 + col;
          const x = startX + col * (gridSize + gap);
          const y = startY + row * (gridSize + gap);

          if (cellIndex === 4) {
            // 중앙 - 영역 제목
            drawCell(x, y, gridSize, gridSize, subGrid.title, SUBGRID_COLORS[i], '#4a4a4a', 34, true);
          } else {
            // 8개 액션
            const actionIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
            const action = subGrid.actions[actionIndex] || '';
            drawCell(x, y, gridSize, gridSize, action, '#ffffff', '#4a4a4a', 28, false);
          }
        }
      }

      // 영역 번호 표시
      ctx.fillStyle = '#cccccc';
      ctx.font = '22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        language === 'ko' ? `영역 ${i + 1} / 8` : `Area ${i + 1} / 8`,
        STORY_WIDTH / 2,
        startY + totalSize + 50
      );

      downloadCanvas(`${filePrefix}-carousel-${i + 2}-${subGrid.title.replace(/\s/g, '_')}-${dateStr}.png`);
    }

    setIsExportingCarousel(false);
    alert(t('result.carouselComplete'));
  }, [data, nickname, language, t, isExportingCarousel]);

  // 3x3 서브그리드 렌더링
  const renderSubGrid = (subGridIndex: number, isCore: boolean = false) => {
    const subGrid = isCore ? null : data.subGrids[subGridIndex];

    return (
      <div className="grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 9 }).map((_, cellIndex) => {
          const isCenter = cellIndex === 4;

          if (isCore) {
            // 코어 영역
            if (isCenter) {
              // 정중앙 - GOAL + 목표 (흰색 배경)
              return (
                <div
                  key={cellIndex}
                  className="aspect-square flex flex-col items-center justify-center p-1 text-center bg-white"
                >
                  <span className="text-[7px] md:text-[9px] text-gray-400 font-medium tracking-wider">
                    {t('result.goal')}
                  </span>
                  <span className="text-[7px] md:text-[10px] text-gray-700 font-semibold leading-tight line-clamp-2 mt-0.5">
                    {data.core}
                  </span>
                </div>
              );
            }
            // 코어의 8개 필라 제목
            const pillarIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
            const pillarSubGrid = data.subGrids[pillarIndex];
            return (
              <motion.div
                key={cellIndex}
                whileHover={{ scale: 1.05 }}
                onClick={() => pillarSubGrid && handleSubGridClick(pillarSubGrid.id)}
                className="aspect-square flex items-center justify-center p-0.5 text-center cursor-pointer"
                style={{ backgroundColor: SUBGRID_COLORS[pillarIndex] }}
              >
                <span className="text-[5px] md:text-[8px] font-medium leading-tight line-clamp-2 text-gray-700">
                  {pillarSubGrid?.title || ''}
                </span>
              </motion.div>
            );
          }

          // 일반 서브그리드
          if (!subGrid) return <div key={cellIndex} className="aspect-square bg-white" />;

          if (isCenter) {
            // 중앙 - 필라 제목 (컬러 배경)
            return (
              <motion.div
                key={cellIndex}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubGridClick(subGrid.id)}
                className="aspect-square flex items-center justify-center p-0.5 text-center cursor-pointer"
                style={{ backgroundColor: SUBGRID_COLORS[subGridIndex] }}
              >
                <span className="text-[5px] md:text-[8px] font-semibold leading-tight line-clamp-2 text-gray-700">
                  {subGrid.title}
                </span>
              </motion.div>
            );
          }

          // 8개 액션 (흰색 배경)
          const actionIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
          return (
            <div
              key={cellIndex}
              className="aspect-square flex items-center justify-center p-0.5 text-center bg-white"
            >
              <span className="text-[5px] md:text-[7px] leading-tight line-clamp-3 text-gray-600">
                {subGrid.actions[actionIndex] || ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Grid Container */}
      <div
        id="mandalart-grid"
        className="relative overflow-hidden"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-light text-gray-700 mb-2">
              {t('result.year')}
            </h1>
            <p className="text-sm tracking-[0.3em] text-gray-500 uppercase">
              {t('result.subtitle')}
            </p>
            {nickname && (
              <p className="text-base text-gray-600 mt-2 font-medium">
                {nickname}
              </p>
            )}
          </div>

          {/* 5x5 Grid: 3 subgrids + 2 arrow gaps */}
          <div className="grid grid-cols-[1fr_8px_1fr_8px_1fr] grid-rows-[1fr_8px_1fr_8px_1fr] gap-0">
            {/* Row 0 */}
            <div>{renderSubGrid(0)}</div>
            <div />
            <div>{renderSubGrid(1)}</div>
            <div />
            <div>{renderSubGrid(2)}</div>

            {/* Arrow Row 1 (between row 0 and row 1) - 화살표가 외부 필러를 향함 */}
            <div />
            <div className="flex items-center justify-center"><Arrow direction="up-left" /></div>
            <div className="flex items-center justify-center"><Arrow direction="up" /></div>
            <div className="flex items-center justify-center"><Arrow direction="up-right" /></div>
            <div />

            {/* Row 1 */}
            <div>{renderSubGrid(3)}</div>
            <div className="flex items-center justify-center"><Arrow direction="left" /></div>
            <div>{renderSubGrid(-1, true)}</div>
            <div className="flex items-center justify-center"><Arrow direction="right" /></div>
            <div>{renderSubGrid(4)}</div>

            {/* Arrow Row 2 (between row 1 and row 2) - 화살표가 외부 필러를 향함 */}
            <div />
            <div className="flex items-center justify-center"><Arrow direction="down-left" /></div>
            <div className="flex items-center justify-center"><Arrow direction="down" /></div>
            <div className="flex items-center justify-center"><Arrow direction="down-right" /></div>
            <div />

            {/* Row 2 */}
            <div>{renderSubGrid(5)}</div>
            <div />
            <div>{renderSubGrid(6)}</div>
            <div />
            <div>{renderSubGrid(7)}</div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-[10px] tracking-wider text-gray-400">
              mandalart.imiwork.com
            </p>
          </div>
        </div>

        {/* Zoomed SubGrid overlay */}
        <AnimatePresence>
          {activeGrid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
              style={{ backdropFilter: 'blur(8px)' }}
              onClick={handleCoreClick}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[90vw] max-w-md overflow-hidden rounded-lg"
                style={{ backgroundColor: BG_COLOR }}
              >
                <div className="p-6">
                  <div className="text-center mb-4">
                    <p
                      className="text-xl font-semibold text-gray-700 px-4 py-2 rounded inline-block"
                      style={{ backgroundColor: SUBGRID_COLORS[activeGridIndex] }}
                    >
                      {activeGrid.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {activeGrid.actions.slice(0, 4).map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-square flex items-center justify-center p-3 text-center bg-white rounded"
                      >
                        <span className="text-sm leading-relaxed text-gray-700">{action}</span>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="aspect-square flex items-center justify-center p-2 text-center rounded"
                      style={{ backgroundColor: SUBGRID_COLORS[activeGridIndex] }}
                    >
                      <span className="text-base font-bold leading-tight text-gray-800">
                        {activeGrid.title}
                      </span>
                    </motion.div>

                    {activeGrid.actions.slice(4, 8).map((action, index) => (
                      <motion.div
                        key={index + 4}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (index + 5) * 0.05 }}
                        className="aspect-square flex items-center justify-center p-3 text-center bg-white rounded"
                      >
                        <span className="text-sm leading-relaxed text-gray-700">{action}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center pb-4 text-sm text-gray-500"
                >
                  {t('result.closeOverlay')}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-4 mt-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {/* 내보내기 버튼 (비율 선택) */}
          <div className="relative">
            <motion.button
              onClick={() => setShowExportOptions(!showExportOptions)}
              disabled={isExporting}
              whileHover={{ scale: isExporting ? 1 : 1.02 }}
              whileTap={{ scale: isExporting ? 1 : 0.98 }}
              className={`btn-secondary min-w-[130px] ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isExporting ? '저장 중...' : t('result.export')}
            </motion.button>

            {/* 비율 선택 드롭다운 */}
            <AnimatePresence>
              {showExportOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10 min-w-[180px]"
                >
                  {(Object.keys(EXPORT_RATIOS) as ExportRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => handleExportWithRatio(ratio)}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {EXPORT_RATIOS[ratio].label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleExportCarousel}
            disabled={isExportingCarousel}
            whileHover={{ scale: isExportingCarousel ? 1 : 1.02 }}
            whileTap={{ scale: isExportingCarousel ? 1 : 0.98 }}
            className={`btn-secondary min-w-[130px] ${isExportingCarousel ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isExportingCarousel ? t('result.carouselDownloading') : t('result.exportCarousel')}
          </motion.button>
          <motion.button
            onClick={onShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary min-w-[130px]"
          >
            {t('result.share')}
          </motion.button>
        </div>
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-secondary hover:text-black transition-colors text-sm font-medium px-6 py-3"
        >
          {t('result.reset')}
        </motion.button>

        {/* Donation link */}
        <div className="mt-4">
          <DonationLink />
        </div>
      </motion.div>
    </motion.div>
  );
}
