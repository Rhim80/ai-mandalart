'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pillar, SubGrid } from '@/types/mandalart';
import { useLanguage } from '@/contexts/LanguageContext';

// Accent red color
const ACCENT_RED = '#E53935';

interface ActionSelectionProps {
  selectedPillars: Pillar[];
  goal: string;
  vibeSummary: string;
  onComplete: (subGrids: SubGrid[]) => void;
  onReset?: () => void;
}

interface ActionItem {
  id: string;
  text: string;
}

interface PillarProgress {
  pillarIndex: number;
  suggestedActions: ActionItem[];
  selectedActions: ActionItem[];
  isLoading: boolean;
}

export function ActionSelection({
  selectedPillars,
  goal,
  vibeSummary,
  onComplete,
  onReset,
}: ActionSelectionProps) {
  const { t, language } = useLanguage();
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [progress, setProgress] = useState<PillarProgress>({
    pillarIndex: 0,
    suggestedActions: [],
    selectedActions: [],
    isLoading: true,
  });
  const [completedSubGrids, setCompletedSubGrids] = useState<SubGrid[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customActionText, setCustomActionText] = useState('');

  const currentPillar = selectedPillars[currentPillarIndex];
  const selectedCount = progress.selectedActions.length;
  const canProceed = selectedCount === 8;
  const isLastPillar = currentPillarIndex === selectedPillars.length - 1;

  // Helper to create ActionItem with unique ID
  const createActionItems = (actions: string[], prefix: string = ''): ActionItem[] => {
    return actions.map((text, index) => ({
      id: `${prefix}${Date.now()}_${index}_${Math.random().toString(36).slice(2, 11)}`,
      text,
    }));
  };

  // Reset state when moving to a new pillar
  useEffect(() => {
    // Immediately reset state when pillar changes
    setProgress({
      pillarIndex: currentPillarIndex,
      suggestedActions: [],
      selectedActions: [],
      isLoading: true,
    });
    setRegenerateError(null);
    setShowCustomInput(false);
    setCustomActionText('');
  }, [currentPillarIndex]);

  // Fetch actions for current pillar
  const fetchActions = useCallback(async () => {
    if (!currentPillar) return;

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
      const actionItems = createActionItems(data.actions || [], 'init_');
      setProgress({
        pillarIndex: currentPillarIndex,
        suggestedActions: actionItems,
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
  const toggleAction = (action: ActionItem) => {
    setProgress((prev) => {
      const isSelected = prev.selectedActions.some((a) => a.id === action.id);
      if (isSelected) {
        return {
          ...prev,
          selectedActions: prev.selectedActions.filter((a) => a.id !== action.id),
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

  // Add custom action
  const handleAddCustomAction = () => {
    if (!customActionText.trim() || selectedCount >= 8) return;

    const newAction: ActionItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      text: customActionText.trim(),
    };

    setProgress((prev) => ({
      ...prev,
      suggestedActions: [...prev.suggestedActions, newAction],
      selectedActions: [...prev.selectedActions, newAction],
    }));
    setCustomActionText('');
    setShowCustomInput(false);
  };

  // Regenerate unselected actions
  const handleRegenerate = async () => {
    const unselectedCount = progress.suggestedActions.length - selectedCount;
    if (isRegenerating || unselectedCount === 0) return;

    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      // Calculate rejected actions: previously suggested but not selected
      const selectedIds = new Set(progress.selectedActions.map((a) => a.id));
      const rejectedActions = progress.suggestedActions
        .filter((a) => !selectedIds.has(a.id))
        .map((a) => a.text);

      const res = await fetch('/api/actions/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          vibeSummary,
          pillar: currentPillar,
          selectedActions: progress.selectedActions.map((a) => a.text),
          rejectedActions,
          count: unselectedCount,
        }),
      });

      if (!res.ok) throw new Error('Failed to regenerate actions');

      const data = await res.json();
      const newActions = data.actions || [];

      if (newActions.length === 0) {
        setRegenerateError(language === 'ko' ? '새로운 옵션을 가져오지 못했습니다. 다시 시도해주세요.' : 'Failed to get new options. Please try again.');
        return;
      }

      const newActionItems = createActionItems(newActions, 'regen_');

      // Keep selected actions, replace unselected ones
      setProgress((prev) => ({
        ...prev,
        suggestedActions: [...prev.selectedActions, ...newActionItems],
      }));
    } catch (error) {
      console.error('Failed to regenerate actions:', error);
      setRegenerateError(language === 'ko' ? '옵션 재생성 중 오류가 발생했습니다.' : 'Error regenerating options.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Proceed to next pillar or complete
  const handleProceed = () => {
    // Save current subgrid with colorIndex
    const colorIndex = currentPillar.colorIndex || currentPillarIndex + 1;
    const newSubGrid: SubGrid = {
      id: `grid_${currentPillarIndex + 1}`,
      title: currentPillar.title,
      opacityLevel: currentPillarIndex + 1,
      colorIndex,
      actions: progress.selectedActions.map((a) => a.text),
    };

    const updatedSubGrids = [...completedSubGrids, newSubGrid];
    setCompletedSubGrids(updatedSubGrids);

    if (isLastPillar) {
      onComplete(updatedSubGrids);
    } else {
      setCurrentPillarIndex((prev) => prev + 1);
    }
  };

  const getSelectionOrder = (action: ActionItem) => {
    const index = progress.selectedActions.findIndex((a) => a.id === action.id);
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
          className="text-sm tracking-[0.3em] uppercase mb-4"
          style={{ color: ACCENT_RED }}
        >
          {t('actionSelection.step')}
        </motion.p>
        <h2 className="text-4xl font-extralight mb-4 tracking-tight">
          {t('actionSelection.title')}
        </h2>

        {/* Overall progress - monochrome */}
        <div className="flex items-center justify-center gap-3 mt-6 mb-2">
          {selectedPillars.map((pillar, i) => {
            const isCompleted = i < currentPillarIndex;
            const isCurrent = i === currentPillarIndex;

            return (
              <motion.div
                key={pillar.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  backgroundColor: isCurrent ? ACCENT_RED : isCompleted ? '#1d1d1f' : 'rgba(0,0,0,0.1)',
                }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${isCurrent ? 'ring-4 ring-red-200' : ''}
                  ${isCompleted || isCurrent ? 'text-white' : 'text-black/40'}
                `}
              >
                {i + 1}
              </motion.div>
            );
          })}
        </div>
        <p className="text-secondary">
          {t('actionSelection.progress', { current: currentPillarIndex + 1, total: selectedPillars.length })}
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
          {/* Pillar title - black background */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block px-6 py-3 mb-4 bg-black shadow-lg"
              layoutId="pillar-title"
            >
              <h3 className="text-xl font-medium text-white">{currentPillar.title}</h3>
            </motion.div>
            <p className="text-secondary">{currentPillar.description}</p>

            {/* Action progress - monochrome */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    backgroundColor: i < selectedCount ? '#1d1d1f' : 'rgba(0,0,0,0.1)'
                  }}
                  transition={{ delay: i * 0.03 }}
                  className="w-2.5 h-2.5 rounded-full"
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
              <p className="text-secondary">{language === 'ko' ? '실천 항목을 생성하고 있습니다...' : 'Generating action items...'}</p>
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
                        key={action.id}
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
                        {action.text}
                      </motion.button>
                    );
                  })}

                  {/* Custom input card */}
                  {selectedCount < 8 && (
                    <motion.div
                      key="custom-action-input"
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      {showCustomInput ? (
                        <div className="p-3 bg-white border-2 border-dashed border-black/20 rounded-sm">
                          <input
                            type="text"
                            value={customActionText}
                            onChange={(e) => setCustomActionText(e.target.value)}
                            placeholder={t('actionSelection.customPlaceholder')}
                            className="w-full mb-2 px-2 py-1.5 text-sm border border-black/10 rounded focus:outline-none focus:border-black/30"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCustomAction();
                              if (e.key === 'Escape') {
                                setShowCustomInput(false);
                                setCustomActionText('');
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddCustomAction}
                              disabled={!customActionText.trim()}
                              className="flex-1 py-1 text-xs bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              {language === 'ko' ? '추가' : 'Add'}
                            </button>
                            <button
                              onClick={() => {
                                setShowCustomInput(false);
                                setCustomActionText('');
                              }}
                              className="flex-1 py-1 text-xs border border-black/20 text-secondary hover:text-black"
                            >
                              {language === 'ko' ? '취소' : 'Cancel'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomInput(true)}
                          className="w-full h-full min-h-[80px] p-4 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-black/20 rounded-sm text-secondary hover:border-black/40 hover:text-black transition-all cursor-pointer"
                        >
                          <span className="text-xl">+</span>
                          <span className="text-xs">{t('actionSelection.addCustom')}</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  {/* Reset button */}
                  {onReset && (
                    <motion.button
                      onClick={onReset}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 border border-black/10 text-sm text-secondary hover:text-black hover:border-black/30 transition-all"
                    >
                      {t('actionSelection.reset')}
                    </motion.button>
                  )}

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
                        {language === 'ko' ? '재생성 중...' : 'Regenerating...'}
                      </span>
                    ) : (
                      t('actionSelection.regenerate')
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
                    {isLastPillar ? t('actionSelection.complete') : t('actionSelection.next')}
                  </motion.button>
                </div>

                {!canProceed && selectedCount > 0 && (
                  <p className="text-sm text-secondary">
                    {t('actionSelection.needMore', { n: 8 - selectedCount })}
                  </p>
                )}

                {regenerateError && (
                  <p className="text-sm text-red-500">
                    {regenerateError}
                  </p>
                )}
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Completed pillars preview - monochrome */}
      {completedSubGrids.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 pt-8 border-t border-black/10"
        >
          <p className="text-sm text-secondary mb-4 text-center">{language === 'ko' ? '완성된 영역' : 'Completed Areas'}</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {completedSubGrids.map((grid) => (
              <span
                key={grid.id}
                className="px-3 py-1.5 text-sm bg-white border border-black/15 shadow-sm"
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
