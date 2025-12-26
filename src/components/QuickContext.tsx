'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuickContext as QuickContextType, QUICK_CONTEXT_OPTIONS } from '@/types/mandalart';

// Accent red color
const ACCENT_RED = '#E53935';

interface QuickContextProps {
  onComplete: (context: QuickContextType) => void;
}

interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string | string[];
  onSelect: (value: string) => void;
  multiSelect?: boolean;
}

function ChipGroup({ label, options, selected, onSelect, multiSelect = false }: ChipGroupProps) {
  const isSelected = (option: string) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  return (
    <div className="mb-8">
      <p className="text-sm text-secondary mb-3">
        {label} {multiSelect && <span className="text-tertiary">(복수 선택 가능)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <motion.button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              px-4 py-2 text-sm transition-all duration-200 rounded-sm
              ${isSelected(option)
                ? 'bg-white border-2 font-medium text-black'
                : 'bg-white border border-black/15 text-secondary hover:border-black/30'
              }
            `}
            style={{
              borderColor: isSelected(option) ? ACCENT_RED : undefined,
            }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function QuickContext({ onComplete }: QuickContextProps) {
  const [lifeAreas, setLifeAreas] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [goalStyle, setGoalStyle] = useState<string>('');
  const [yearKeyword, setYearKeyword] = useState<string>('');

  const handleLifeAreaToggle = (area: string) => {
    setLifeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const canContinue = lifeAreas.length > 0 && currentStatus && goalStyle && yearKeyword;

  const handleSubmit = () => {
    if (canContinue) {
      onComplete({
        lifeAreas,
        currentStatus,
        goalStyle,
        yearKeyword,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
            AI Mandalart
          </h1>
          <p className="text-xl text-secondary font-light leading-relaxed">
            먼저, 당신에 대해 알려주세요
          </p>
        </motion.div>
      </div>

      {/* Quick Context Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <ChipGroup
          label="집중하고 싶은 삶의 영역"
          options={QUICK_CONTEXT_OPTIONS.lifeAreas}
          selected={lifeAreas}
          onSelect={handleLifeAreaToggle}
          multiSelect
        />

        <ChipGroup
          label="현재 상황"
          options={QUICK_CONTEXT_OPTIONS.currentStatus}
          selected={currentStatus}
          onSelect={setCurrentStatus}
        />

        <ChipGroup
          label="목표 스타일"
          options={QUICK_CONTEXT_OPTIONS.goalStyle}
          selected={goalStyle}
          onSelect={setGoalStyle}
        />

        <ChipGroup
          label="올해 키워드"
          options={QUICK_CONTEXT_OPTIONS.yearKeyword}
          selected={yearKeyword}
          onSelect={setYearKeyword}
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-4 mt-12"
      >
        <motion.button
          onClick={handleSubmit}
          disabled={!canContinue}
          whileHover={{ scale: canContinue ? 1.02 : 1 }}
          whileTap={{ scale: canContinue ? 0.98 : 1 }}
          className="btn-primary min-w-[200px]"
        >
          다음
        </motion.button>

        {!canContinue && (
          <p className="text-sm text-secondary">
            모든 항목을 선택해주세요
          </p>
        )}
      </motion.div>

      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex justify-center"
      >
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="w-1.5 h-1.5 rounded-full bg-black/10"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
