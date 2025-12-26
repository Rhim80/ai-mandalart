'use client';

import { motion } from 'framer-motion';
import { ArchetypeType } from '@/types/mandalart';

interface ArchetypeResultProps {
  goal: string;
  archetype: ArchetypeType;
  reasoning: string;
  onContinue: () => void;
}

const ARCHETYPE_INFO: Record<ArchetypeType, { label: string; description: string; icon: string }> = {
  BUSINESS: {
    label: '성취형',
    description: '사업적 성과와 커리어 발전에 집중하는 목표',
    icon: 'B',
  },
  GROWTH: {
    label: '성장형',
    description: '자기계발과 역량 향상을 추구하는 목표',
    icon: 'G',
  },
  RELATION: {
    label: '관계형',
    description: '소중한 사람들과의 관계 발전을 중시하는 목표',
    icon: 'R',
  },
  ROUTINE: {
    label: '루틴형',
    description: '건강한 습관과 일상의 변화를 만드는 목표',
    icon: 'R',
  },
};

export function ArchetypeResult({
  goal,
  archetype,
  onContinue,
}: ArchetypeResultProps) {
  const info = ARCHETYPE_INFO[archetype];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      {/* Step indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm tracking-[0.3em] text-secondary uppercase mb-12"
      >
        Step 1
      </motion.p>

      {/* Goal display */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-secondary text-sm mb-4"
        >
          당신의 목표
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-light tracking-tight"
        >
          &ldquo;{goal}&rdquo;
        </motion.h2>
      </div>

      {/* Archetype card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative overflow-hidden mb-12"
      >
        <div className="zen-card p-10 md:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
            <span className="text-[120px] font-extralight leading-none">
              {info.icon}
            </span>
          </div>

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-black text-white text-2xl font-light rounded-full"
            >
              {info.icon}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs tracking-[0.25em] text-secondary uppercase mb-3"
            >
              목표 유형
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-4xl font-light mb-4 tracking-tight"
            >
              {info.label}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-secondary max-w-sm mx-auto"
            >
              {info.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          다음 단계로
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-sm text-secondary"
        >
          3가지 질문으로 더 깊이 알아볼게요
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
