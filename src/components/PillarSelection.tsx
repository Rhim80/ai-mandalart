'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pillar } from '@/types/mandalart';

// Accent red color
const ACCENT_RED = '#E53935';

interface PillarSelectionProps {
  pillars: Pillar[];
  selectedPillars: Pillar[];
  onToggle: (pillarId: string, customPillar?: Pillar) => void;
  onRegenerate: (selectedPillars: Pillar[], count: number) => Promise<Pillar[]>;
  onComplete: () => void;
  isLoading: boolean;
}

export function PillarSelection({
  pillars,
  selectedPillars,
  onToggle,
  onRegenerate,
  onComplete,
  isLoading,
}: PillarSelectionProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [localPillars, setLocalPillars] = useState<Pillar[]>(pillars);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const selectedCount = selectedPillars.length;
  const canComplete = selectedCount === 8;
  const unselectedCount = localPillars.length - selectedCount;

  const getSelectionOrder = (pillarId: string) => {
    const selected = selectedPillars.find((p) => p.id === pillarId);
    return selected?.colorIndex || null;
  };

  const handleRegenerate = async () => {
    if (isRegenerating || unselectedCount === 0) return;

    setIsRegenerating(true);
    try {
      const newPillars = await onRegenerate(selectedPillars, unselectedCount);

      // Keep selected pillars, replace unselected ones
      const updatedPillars = [
        ...localPillars.filter((p) => selectedPillars.some((sp) => sp.id === p.id)),
        ...newPillars,
      ];
      setLocalPillars(updatedPillars);
    } catch (error) {
      console.error('Failed to regenerate pillars:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAddCustomPillar = () => {
    if (!customTitle.trim()) return;

    const title = customTitle.trim();
    const newPillar: Pillar = {
      id: `custom_${Date.now()}`,
      title,
      description: customDescription.trim() || `${title} 관련 실천 영역`,
    };

    setLocalPillars([...localPillars, newPillar]);
    onToggle(newPillar.id, newPillar); // Pass pillar object for custom pillars
    setCustomTitle('');
    setCustomDescription('');
    setShowCustomInput(false);
  };

  // Update local pillars when props change
  if (pillars !== localPillars && localPillars.length === 0) {
    setLocalPillars(pillars);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
          Step 3
        </motion.p>
        <h2 className="text-4xl font-extralight mb-4 tracking-tight">
          전략 영역 선택
        </h2>
        <p className="text-secondary text-lg">
          목표 달성을 위한 8가지 핵심 영역을 선택하세요
        </p>

        {/* Progress indicator - monochrome */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                backgroundColor: i < selectedCount ? '#1d1d1f' : 'rgba(0,0,0,0.1)'
              }}
              transition={{ delay: i * 0.05 }}
              className="w-3 h-3 rounded-full"
            />
          ))}
          <span className="ml-3 text-sm text-secondary">{selectedCount}/8</span>
        </div>
      </div>

      {/* Pillars Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10"
      >
        <AnimatePresence mode="popLayout">
          {localPillars.map((pillar, index) => {
            const order = getSelectionOrder(pillar.id);
            const isSelected = order !== null;
            const isDisabled = !isSelected && selectedCount >= 8;

            return (
              <motion.button
                key={pillar.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.03 }}
                onClick={() => !isDisabled && onToggle(pillar.id, pillar)}
                disabled={isDisabled}
                className={`
                  relative p-6 text-left transition-all duration-300 rounded-sm bg-white
                  ${isSelected
                    ? 'border-2 border-black shadow-lg'
                    : 'border border-black/8 hover:border-black/20 hover:shadow-md'
                  }
                  ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Selection order badge - red accent */}
                <AnimatePresence>
                  {order && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{ backgroundColor: ACCENT_RED }}
                      className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center text-white text-sm font-bold rounded-full shadow-md"
                    >
                      {order}
                    </motion.span>
                  )}
                </AnimatePresence>

                <h3 className="font-semibold mb-2 text-black">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary">
                  {pillar.description}
                </p>
              </motion.button>
            );
          })}

          {/* Custom input card */}
          {selectedCount < 8 && (
            <motion.div
              key="custom-input"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {showCustomInput ? (
                <div className="p-4 bg-white border-2 border-dashed border-black/20 rounded-sm">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="영역 이름"
                    className="w-full mb-2 px-2 py-1.5 text-sm border border-black/10 rounded focus:outline-none focus:border-black/30"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="설명 (선택)"
                    className="w-full mb-3 px-2 py-1.5 text-sm border border-black/10 rounded focus:outline-none focus:border-black/30"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCustomPillar}
                      disabled={!customTitle.trim()}
                      className="flex-1 py-1.5 text-sm bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomTitle('');
                        setCustomDescription('');
                      }}
                      className="flex-1 py-1.5 text-sm border border-black/20 text-secondary hover:text-black"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full h-full min-h-[120px] p-5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-black/20 rounded-sm text-secondary hover:border-black/40 hover:text-black transition-all cursor-pointer"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-sm">직접 추가하기</span>
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
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-4">
          {/* Regenerate button */}
          <motion.button
            onClick={handleRegenerate}
            disabled={isRegenerating || unselectedCount === 0 || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 border border-black/20 text-secondary hover:text-black hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isRegenerating ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
                다른 옵션 가져오는 중...
              </span>
            ) : (
              `선택 안한 ${unselectedCount}개 다시 제안받기`
            )}
          </motion.button>

          {/* Complete button */}
          <motion.button
            onClick={onComplete}
            disabled={!canComplete || isLoading || isRegenerating}
            whileHover={{ scale: canComplete ? 1.02 : 1 }}
            whileTap={{ scale: canComplete ? 0.98 : 1 }}
            className={`
              px-8 py-3 font-medium transition-all
              ${canComplete
                ? 'bg-black text-white shadow-lg hover:shadow-xl'
                : 'bg-black/10 text-black/30 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? '다음 단계로...' : '다음 단계'}
          </motion.button>
        </div>

        {!canComplete && selectedCount > 0 && (
          <p className="text-sm text-secondary">
            {8 - selectedCount}개 더 선택해주세요
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
