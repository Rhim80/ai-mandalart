'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartData } from '@/types/mandalart';
import { SubGrid } from './SubGrid';

// Accent red color
const ACCENT_RED = '#E53935';

interface MandalartGridProps {
  data: MandalartData;
  onExport: () => void;
  onShare: () => void;
  onReset: () => void;
}

export function MandalartGrid({ data, onExport, onShare, onReset }: MandalartGridProps) {
  const [activeSubGrid, setActiveSubGrid] = useState<string | null>(null);

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

  // Get pillar titles in grid order (positions 0-3, skip 4 for center, 5-8)
  const getPillarTitle = (position: number): string => {
    const index = position < 4 ? position : position - 1;
    return data.subGrids[index]?.title || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-5xl mx-auto px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT_RED }}
        >
          Complete
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-extralight mb-4 tracking-tight"
        >
          나만의 만다라트
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-secondary"
        >
          클릭하여 확대해보세요
        </motion.p>
      </div>

      {/* Grid - increased spacing */}
      <div id="mandalart-grid" className="relative bg-white">
        <motion.div
          layout
          className="grid grid-cols-3 gap-2 md:gap-3 p-5 md:p-8 bg-white zen-card"
        >
          {/* Render 9 cells: 8 subGrids + 1 center (core as 9-cell grid) */}
          {Array.from({ length: 9 }).map((_, position) => {
            if (position === 4) {
              // Center cell - Core as 9-cell mini grid
              // Outer border: black, Inner grid lines: red
              return (
                <motion.div
                  key="core"
                  layout
                  className="aspect-square grid grid-cols-3 p-0 bg-[#E53935] border-[3px] border-black rounded-sm overflow-hidden"
                  style={{ gap: '2px' }}
                >
                  {/* 9 cells: 8 pillar titles + center goal */}
                  {Array.from({ length: 9 }).map((_, cellPos) => {
                    if (cellPos === 4) {
                      // Center - main goal (strongest hierarchy)
                      return (
                        <div
                          key="goal"
                          className="aspect-square flex items-center justify-center p-1.5 md:p-2 text-center bg-white"
                        >
                          <span className="text-[9px] md:text-sm font-black leading-tight line-clamp-3 text-black tracking-tight">
                            {data.core}
                          </span>
                        </div>
                      );
                    }
                    // Pillar title cells - clickable (medium hierarchy)
                    const pillarIndex = cellPos < 4 ? cellPos : cellPos - 1;
                    const subGrid = data.subGrids[pillarIndex];
                    return (
                      <motion.div
                        key={cellPos}
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        onClick={() => subGrid && handleSubGridClick(subGrid.id)}
                        className="aspect-square flex items-center justify-center p-0.5 md:p-1 text-center bg-white cursor-pointer transition-colors"
                      >
                        <span className="text-[5px] md:text-[8px] font-semibold leading-tight line-clamp-2 text-black/80">
                          {getPillarTitle(cellPos)}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            }

            const subGridIndex = position < 4 ? position : position - 1;
            const subGrid = data.subGrids[subGridIndex];

            if (!subGrid) return null;

            return (
              <SubGrid
                key={subGrid.id}
                data={subGrid}
                isActive={activeSubGrid === subGrid.id}
                onActivate={() => handleSubGridClick(subGrid.id)}
              />
            );
          })}
        </motion.div>

        {/* Watermark for image export */}
        <div className="bg-white py-4 px-6 text-center border-t border-black/5">
          <p className="text-sm text-black/60">
            claude-code.imiwork.com | Sense & AI 오픈채팅방
          </p>
        </div>

        {/* Zoomed SubGrid overlay - expands from position */}
        <AnimatePresence>
          {activeGrid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={handleCoreClick}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[85vw] max-w-md aspect-square"
              >
                {/* Expanded SubGrid - same 3x3 layout but bigger */}
                {/* Outer: black border, Inner: red grid lines */}
                <div
                  className="w-full h-full grid grid-cols-3 p-0 bg-[#E53935] rounded-lg shadow-2xl border-[3px] border-black overflow-hidden"
                  style={{ gap: '2px' }}
                >
                  {/* Position 0-3: top row and first cell of middle row */}
                  {activeGrid.actions.slice(0, 4).map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="aspect-square flex items-center justify-center p-2 md:p-4 text-center bg-white"
                    >
                      <span className="text-xs md:text-sm leading-relaxed text-black/70 font-normal">
                        {action}
                      </span>
                    </motion.div>
                  ))}

                  {/* Position 4: Center cell (title) - medium hierarchy */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 }}
                    className="aspect-square flex items-center justify-center p-2 md:p-3 text-center bg-white"
                  >
                    <span className="text-base md:text-lg font-bold leading-tight text-black">
                      {activeGrid.title}
                    </span>
                  </motion.div>

                  {/* Position 5-7: rest of middle row and bottom row */}
                  {activeGrid.actions.slice(4, 8).map((action, index) => (
                    <motion.div
                      key={index + 4}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index + 5) * 0.03 }}
                      className="aspect-square flex items-center justify-center p-2 md:p-4 text-center bg-white"
                    >
                      <span className="text-xs md:text-sm leading-relaxed text-black/70 font-normal">
                        {action}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Close hint */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mt-4 text-white/80 text-sm"
                >
                  아무 곳이나 클릭하여 닫기
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
        className="flex flex-col md:flex-row justify-center items-center gap-4 mt-10"
      >
        <motion.button
          onClick={onExport}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary min-w-[160px]"
        >
          이미지로 저장
        </motion.button>
        <motion.button
          onClick={onShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-secondary min-w-[160px]"
        >
          공유하기
        </motion.button>
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-secondary hover:text-black transition-colors text-sm font-medium px-6 py-3"
        >
          다시 시작
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
