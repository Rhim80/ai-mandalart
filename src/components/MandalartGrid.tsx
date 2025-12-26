'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartData } from '@/types/mandalart';
import { SubGrid } from './SubGrid';

interface MandalartGridProps {
  data: MandalartData;
  onExport: () => void;
  onShare: () => void;
  onReset: () => void;
}

export function MandalartGrid({ data, onExport, onShare, onReset }: MandalartGridProps) {
  const [activeSubGrid, setActiveSubGrid] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleSubGridClick = (gridId: string) => {
    if (activeSubGrid === gridId) {
      setActiveSubGrid(null);
      setIsZoomed(false);
    } else {
      setActiveSubGrid(gridId);
      setIsZoomed(true);
    }
  };

  const handleCoreClick = () => {
    setActiveSubGrid(null);
    setIsZoomed(false);
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
          className="text-sm tracking-[0.3em] text-secondary uppercase mb-4"
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
          클릭하여 세부 내용을 확인하세요
        </motion.p>
      </div>

      {/* Grid */}
      <div id="mandalart-grid" className="relative">
        <motion.div
          layout
          className="grid grid-cols-3 gap-1 md:gap-2 p-4 md:p-6 bg-white zen-card"
          animate={{
            scale: isZoomed ? 1.02 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Render 9 cells: 8 subGrids + 1 center */}
          {Array.from({ length: 9 }).map((_, position) => {
            if (position === 4) {
              // Center cell - Core goal
              return (
                <motion.div
                  key="core"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCoreClick}
                  className="aspect-square flex items-center justify-center p-3 md:p-6 bg-black text-white cursor-pointer relative overflow-hidden group"
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-center font-medium text-sm md:text-base relative z-10">
                    {data.core}
                  </span>
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

        {/* Zoomed detail view */}
        <AnimatePresence>
          {isZoomed && activeSubGrid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-6 md:p-12"
              onClick={handleCoreClick}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 md:p-12 max-w-lg w-full zen-card"
              >
                {(() => {
                  const subGrid = data.subGrids.find((g) => g.id === activeSubGrid);
                  if (!subGrid) return null;

                  return (
                    <>
                      <div className="text-center mb-8">
                        <span className="inline-block w-10 h-10 mb-4 bg-black text-white flex items-center justify-center text-sm font-medium rounded-full">
                          {data.subGrids.indexOf(subGrid) + 1}
                        </span>
                        <h3 className="text-2xl font-light tracking-tight">
                          {subGrid.title}
                        </h3>
                      </div>

                      <ul className="space-y-3">
                        {subGrid.actions.map((action, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 p-4 bg-black/[0.02] rounded-sm"
                          >
                            <span className="text-sm text-secondary font-medium w-5 flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-sm leading-relaxed">{action}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <button
                        onClick={handleCoreClick}
                        className="mt-8 w-full py-4 text-secondary hover:text-black transition-colors text-sm font-medium"
                      >
                        닫기
                      </button>
                    </>
                  );
                })()}
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
