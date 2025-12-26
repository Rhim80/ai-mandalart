'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuickContext } from '@/types/mandalart';

interface GoalInputProps {
  onSubmit: (goal: string) => void;
  onDiscoveryMode: () => void;
  isLoading: boolean;
  quickContext?: QuickContext | null;
}

export function GoalInput({ onSubmit, onDiscoveryMode, isLoading, quickContext }: GoalInputProps) {
  const [goal, setGoal] = useState('');

  // Generate dynamic placeholder based on quick context
  const getPlaceholder = () => {
    if (!quickContext) return '2026년에 이루고 싶은 목표를 한 문장으로 적어주세요';

    const area = quickContext.lifeAreas[0] || '';
    const keyword = quickContext.yearKeyword || '';

    const hints: Record<string, string> = {
      '커리어': '커리어에서 이루고 싶은 목표를 적어주세요',
      '건강': '건강 관련 목표를 적어주세요',
      '관계': '관계에서 이루고 싶은 목표를 적어주세요',
      '재정': '재정 목표를 적어주세요',
      '자기계발': '자기계발 목표를 적어주세요',
      '취미': '취미 관련 목표를 적어주세요',
    };

    return hints[area] || `${keyword}을 위한 2026년 목표를 적어주세요`;
  };

  // Generate subtitle based on context
  const getSubtitle = () => {
    if (!quickContext) return '당신의 목표를 81개의 구체적인 실천 계획으로';

    const style = quickContext.goalStyle;
    const keyword = quickContext.yearKeyword;

    return `${keyword}을 향한 ${style} 목표를 만들어보세요`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isLoading) {
      onSubmit(goal.trim());
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
      {/* Hero section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-extralight mb-6 tracking-tight">
            AI Mandalart
          </h1>
          <p className="text-xl text-secondary font-light leading-relaxed">
            {getSubtitle().split(' ').slice(0, 3).join(' ')}<br className="md:hidden" /> {getSubtitle().split(' ').slice(3).join(' ')}
          </p>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={getPlaceholder()}
            className="input-underline text-center"
            disabled={isLoading}
          />

          {/* Subtle focus indicator */}
          <motion.div
            className="absolute bottom-0 left-1/2 h-0.5 bg-black"
            initial={{ width: 0, x: '-50%' }}
            animate={{
              width: goal.length > 0 ? '100%' : 0,
              x: goal.length > 0 ? '-50%' : '-50%'
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.button
            type="submit"
            disabled={!goal.trim() || isLoading}
            whileHover={{ scale: goal.trim() && !isLoading ? 1.02 : 1 }}
            whileTap={{ scale: goal.trim() && !isLoading ? 0.98 : 1 }}
            className="btn-primary min-w-[200px]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="spinner" />
                분석 중...
              </span>
            ) : (
              '시작하기'
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={onDiscoveryMode}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-secondary hover:text-black transition-colors duration-200 text-sm"
          >
            뭘 해야 할지 모르겠어요
          </motion.button>
        </motion.div>
      </form>

      {/* Decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 flex justify-center"
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
