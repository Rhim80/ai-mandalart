'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pillar, SubGrid } from '@/types/mandalart';

interface ActionSelectionProps {
  selectedPillars: Pillar[];
  goal: string;
  vibeSummary: string;
  onComplete: (subGrids: SubGrid[]) => void;
}

interface PillarProgress {
  pillarIndex: number;
  suggestedActions: string[];
  selectedActions: string[];
  isLoading: boolean;
}

export function ActionSelection({
  selectedPillars,
  goal,
  vibeSummary,
  onComplete,
}: ActionSelectionProps) {
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [progress, setProgress] = useState<PillarProgress>({
    pillarIndex: 0,
    suggestedActions: [],
    selectedActions: [],
    isLoading: true,
  });
  const [completedSubGrids, setCompletedSubGrids] = useState<SubGrid[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const currentPillar = selectedPillars[currentPillarIndex];
  const selectedCount = progress.selectedActions.length;
  const canProceed = selectedCount === 8;
  const isLastPillar = currentPillarIndex === selectedPillars.length - 1;

  // Fetch actions for current pillar
  const fetchActions = useCallback(async () => {
    setProgress((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch('/api/actions/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          vibeSummary,
          pillar: currentPillar,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch actions');

      const data = await res.json();
      setProgress({
        pillarIndex: currentPillarIndex,
        suggestedActions: data.actions || [],
        selectedActions: [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch actions:', error);
      setProgress((prev) => ({ ...prev, isLoading: false }));
    }
  }, [currentPillarIndex, currentPillar, goal, vibeSummary]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  // Toggle action selection
  const toggleAction = (action: string) => {
    setProgress((prev) => {
      const isSelected = prev.selectedActions.includes(action);
      if (isSelected) {
        return {
          ...prev,
          selectedActions: prev.selectedActions.filter((a) => a !== action),
        };
      } else if (prev.selectedActions.length < 8) {
        return {
          ...prev,
          selectedActions: [...prev.selectedActions, action],
        };
      }
      return prev;
    });
  };

  // Regenerate unselected actions
  const handleRegenerate = async () => {
    const unselectedCount = progress.suggestedActions.length - selectedCount;
    if (isRegenerating || unselectedCount === 0) return;

    setIsRegenerating(true);
    try {
      const res = await fetch('/api/actions/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          vibeSummary,
          pillar: currentPillar,
          selectedActions: progress.selectedActions,
          count: unselectedCount,
        }),
      });

      if (!res.ok) throw new Error('Failed to regenerate actions');

      const data = await res.json();

      // Keep selected actions, replace unselected ones
      setProgress((prev) => ({
        ...prev,
        suggestedActions: [...prev.selectedActions, ...(data.actions || [])],
      }));
    } catch (error) {
      console.error('Failed to regenerate actions:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Proceed to next pillar or complete
  const handleProceed = () => {
    // Save current subgrid
    const newSubGrid: SubGrid = {
      id: `grid_${currentPillarIndex + 1}`,
      title: currentPillar.title,
      opacityLevel: currentPillarIndex + 1,
      actions: progress.selectedActions,
    };

    const updatedSubGrids = [...completedSubGrids, newSubGrid];
    setCompletedSubGrids(updatedSubGrids);

    if (isLastPillar) {
      onComplete(updatedSubGrids);
    } else {
      setCurrentPillarIndex((prev) => prev + 1);
    }
  };

  const getSelectionOrder = (action: string) => {
    const index = progress.selectedActions.indexOf(action);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto px-6"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-[0.3em] text-secondary uppercase mb-4"
        >
          Step 4
        </motion.p>
        <h2 className="text-4xl font-extralight mb-4 tracking-tight">
          실천 항목 선택
        </h2>

        {/* Overall progress */}
        <div className="flex items-center justify-center gap-3 mt-6 mb-2">
          {selectedPillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${i < currentPillarIndex
                  ? 'bg-black text-white'
                  : i === currentPillarIndex
                  ? 'bg-black text-white ring-4 ring-black/20'
                  : 'bg-black/10 text-black/40'
                }
              `}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
        <p className="text-secondary">
          {currentPillarIndex + 1} / {selectedPillars.length} 영역
        </p>
      </div>

      {/* Current Pillar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPillar.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Pillar title */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block px-6 py-3 bg-black text-white mb-4"
              layoutId="pillar-title"
            >
              <h3 className="text-xl font-medium">{currentPillar.title}</h3>
            </motion.div>
            <p className="text-secondary">{currentPillar.description}</p>

            {/* Action progress */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    backgroundColor: i < selectedCount ? '#000' : 'rgba(0,0,0,0.1)'
                  }}
                  transition={{ delay: i * 0.03 }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
              <span className="ml-2 text-sm text-secondary">{selectedCount}/8</span>
            </div>
          </div>

          {/* Loading state */}
          {progress.isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-8 h-8 border-2 border-black border-t-transparent rounded-full mb-4"
              />
              <p className="text-secondary">실천 항목을 생성하고 있습니다...</p>
            </div>
          ) : (
            <>
              {/* Actions grid */}
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
              >
                <AnimatePresence mode="popLayout">
                  {progress.suggestedActions.map((action, index) => {
                    const order = getSelectionOrder(action);
                    const isSelected = order !== null;
                    const isDisabled = !isSelected && selectedCount >= 8;

                    return (
                      <motion.button
                        key={action}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => !isDisabled && toggleAction(action)}
                        disabled={isDisabled}
                        className={`
                          relative p-4 text-left text-sm transition-all duration-200 rounded-sm
                          ${isSelected
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-white border border-black/10 hover:border-black/30 hover:shadow-md'
                          }
                          ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <AnimatePresence>
                          {order && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-white text-black text-xs font-medium rounded-full shadow-sm"
                            >
                              {order}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {action}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* Regenerate button */}
                  <motion.button
                    onClick={handleRegenerate}
                    disabled={isRegenerating || progress.suggestedActions.length - selectedCount === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 border border-black/20 text-sm text-secondary hover:text-black hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isRegenerating ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                        />
                        재생성 중...
                      </span>
                    ) : (
                      '다른 옵션 제안받기'
                    )}
                  </motion.button>

                  {/* Proceed button */}
                  <motion.button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    whileHover={{ scale: canProceed ? 1.02 : 1 }}
                    whileTap={{ scale: canProceed ? 0.98 : 1 }}
                    className={`
                      px-6 py-2.5 font-medium text-sm transition-all
                      ${canProceed
                        ? 'bg-black text-white shadow-lg hover:shadow-xl'
                        : 'bg-black/10 text-black/30 cursor-not-allowed'
                      }
                    `}
                  >
                    {isLastPillar ? '만다라트 완성하기' : '다음 영역으로'}
                  </motion.button>
                </div>

                {!canProceed && selectedCount > 0 && (
                  <p className="text-sm text-secondary">
                    {8 - selectedCount}개 더 선택해주세요
                  </p>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Completed pillars preview */}
      {completedSubGrids.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 pt-8 border-t border-black/10"
        >
          <p className="text-sm text-secondary mb-4 text-center">완성된 영역</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {completedSubGrids.map((grid) => (
              <span
                key={grid.id}
                className="px-3 py-1.5 bg-black/5 text-sm"
              >
                {grid.title}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
