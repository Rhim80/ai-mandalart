'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MandalartData } from '@/types/mandalart';
import { useLanguage } from '@/contexts/LanguageContext';
import { DonationLink } from './DonationLink';

// Anthropic 스타일 가이드 기반 컬러 시스템
const ANTHROPIC = {
  // 브랜드 컬러
  primary: '#CC785C',       // Antique Brass - 강조, 액센트
  primaryAlt: '#D97757',    // Coral Rust - 하이라이트
  secondary: '#828179',     // Friar Gray - 보조 텍스트

  // 시스템 컬러 (라이트 모드)
  background: '#F0EFEA',    // Cararra - 페이지 배경
  backgroundDark: '#141413', // Cod Gray - 다크 모드 배경
  text: '#131314',          // Cod Gray - 본문 텍스트
  textLight: '#FFFFFF',     // 다크 모드 텍스트

  // 선택 하이라이트
  selection: 'rgba(204,120,92,0.5)',
};

// Anthropic 톤의 서브그리드 컬러 (코랄/테라코타 변주)
const SUBGRID_COLORS = [
  '#E8D4CC',  // 웜 코랄 베이지
  '#E0CCC4',  // 더스티 테라코타
  '#D8C8C0',  // 토프 코랄
  '#E4D0C8',  // 로즈 베이지
  '#DCC8C0',  // 샌드 코랄
  '#E0D0C8',  // 웜 샌드
  '#D8CCC8',  // 그레이 코랄
  '#E4D4CC',  // 블러쉬 코랄
];

// 화살표 컴포넌트 (Anthropic primary 컬러)
const Arrow = ({ direction }: { direction: string }) => {
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
    <svg width="6" height="6" viewBox="0 0 6 6">
      <path d={paths[direction]} fill={ANTHROPIC.primary} opacity={0.6} />
    </svg>
  );
};

interface MandalartGridAnthropicProps {
  data: MandalartData;
  nickname?: string;
  onExport: () => void;
  onShare: () => void;
  onReset: () => void;
}

export function MandalartGridAnthropic({ data, nickname, onExport, onShare, onReset }: MandalartGridAnthropicProps) {
  const { t, language } = useLanguage();
  const [activeSubGrid, setActiveSubGrid] = useState<string | null>(null);

  const handleSubGridClick = (gridId: string) => {
    setActiveSubGrid(activeSubGrid === gridId ? null : gridId);
  };

  const handleCoreClick = () => {
    setActiveSubGrid(null);
  };

  const activeGrid = activeSubGrid ? data.subGrids.find((g) => g.id === activeSubGrid) : null;
  const activeGridIndex = activeGrid ? data.subGrids.findIndex((g) => g.id === activeSubGrid) : -1;

  // 3x3 서브그리드 렌더링 - 여백 충분히, 텍스트 작게
  const renderSubGrid = (subGridIndex: number, isCore: boolean = false) => {
    const subGrid = isCore ? null : data.subGrids[subGridIndex];

    return (
      <div className="grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 9 }).map((_, cellIndex) => {
          const isCenter = cellIndex === 4;

          if (isCore) {
            if (isCenter) {
              // 정중앙 - 목표만 표시 (GOAL 라벨 제거하여 공간 확보)
              return (
                <div
                  key={cellIndex}
                  className="aspect-square flex items-center justify-center p-0.5 text-center"
                  style={{
                    backgroundColor: ANTHROPIC.textLight,
                    borderLeft: `3px solid ${ANTHROPIC.primary}`,
                  }}
                >
                  <span
                    className="text-[6px] md:text-[8px] font-bold leading-tight line-clamp-3"
                    style={{ color: ANTHROPIC.text }}
                  >
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => pillarSubGrid && handleSubGridClick(pillarSubGrid.id)}
                className="aspect-square flex items-center justify-center p-1 text-center cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: SUBGRID_COLORS[pillarIndex],
                  borderRadius: '3px',
                }}
              >
                <span
                  className="text-[7px] md:text-[10px] font-semibold leading-tight line-clamp-2"
                  style={{ color: ANTHROPIC.text }}
                >
                  {pillarSubGrid?.title || ''}
                </span>
              </motion.div>
            );
          }

          // 일반 서브그리드
          if (!subGrid) return <div key={cellIndex} className="aspect-square" style={{ backgroundColor: ANTHROPIC.textLight }} />;

          if (isCenter) {
            // 중앙 - 필라 제목
            return (
              <motion.div
                key={cellIndex}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubGridClick(subGrid.id)}
                className="aspect-square flex items-center justify-center p-1 text-center cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: SUBGRID_COLORS[subGridIndex],
                  borderRadius: '3px',
                }}
              >
                <span
                  className="text-[7px] md:text-[10px] font-bold leading-tight line-clamp-2"
                  style={{ color: ANTHROPIC.text }}
                >
                  {subGrid.title}
                </span>
              </motion.div>
            );
          }

          // 8개 액션
          const actionIndex = cellIndex < 4 ? cellIndex : cellIndex - 1;
          return (
            <div
              key={cellIndex}
              className="aspect-square flex items-center justify-center p-1 text-center"
              style={{
                backgroundColor: ANTHROPIC.textLight,
                borderRadius: '3px',
              }}
            >
              <span
                className="text-[6px] md:text-[9px] leading-tight line-clamp-3"
                style={{ color: ANTHROPIC.secondary }}
              >
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
      {/* Grid Container - 9:16 비율 (모바일/인스타 스토리 최적화) */}
      <div
        id="mandalart-grid"
        className="relative overflow-hidden rounded-lg mx-auto"
        style={{
          backgroundColor: ANTHROPIC.background,
          aspectRatio: '9 / 16',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div className="h-full flex flex-col justify-between p-4 md:p-6">
          {/* Header - 컴팩트하게 */}
          <div className="text-center py-4">
            <h1
              className="text-3xl md:text-4xl font-light tracking-tight mb-1"
              style={{
                color: ANTHROPIC.text,
                fontFamily: 'anthropicSans, system-ui, -apple-system, sans-serif',
              }}
            >
              {t('result.year')}
            </h1>
            <p
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: ANTHROPIC.secondary }}
            >
              {t('result.subtitle')}
            </p>
            {nickname && (
              <p
                className="text-base mt-2 font-medium"
                style={{ color: ANTHROPIC.primary }}
              >
                {nickname}
              </p>
            )}
          </div>

          {/* 5x5 Grid - 화면 가득 채우기 */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div className="w-full grid grid-cols-[1fr_8px_1fr_8px_1fr] grid-rows-[1fr_8px_1fr_8px_1fr] gap-0">
            {/* Row 0 */}
            <div>{renderSubGrid(0)}</div>
            <div />
            <div>{renderSubGrid(1)}</div>
            <div />
            <div>{renderSubGrid(2)}</div>

            {/* Arrow Row 1 */}
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

            {/* Arrow Row 2 */}
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
          </div>

          {/* Footer - CTA 문구 + 브랜딩 */}
          <div className="text-center py-4 space-y-2">
            <p
              className="text-sm font-medium leading-relaxed whitespace-pre-line"
              style={{ color: ANTHROPIC.text }}
            >
              {language === 'ko'
                ? '2026년 목표를 SNS에 공유하고\n함께 실천해보세요!'
                : 'Share your 2026 goals on SNS\nand achieve them together!'}
            </p>
            <p
              className="text-xs tracking-wider"
              style={{ color: ANTHROPIC.secondary }}
            >
              mandalart.imiwork.com
            </p>
          </div>
        </div>

        {/* Zoomed SubGrid overlay - Anthropic 모달 스타일 */}
        <AnimatePresence>
          {activeGrid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{
                backgroundColor: 'color-mix(in srgb, #141413 80%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
              onClick={handleCoreClick}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.77, 0, 0.175, 1] // Anthropic 이징
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-[90vw] max-w-md overflow-hidden rounded-lg shadow-2xl"
                style={{ backgroundColor: ANTHROPIC.background }}
              >
                <div className="p-8">
                  {/* 모달 헤더 */}
                  <div className="text-center mb-6">
                    <p
                      className="text-xl font-semibold px-6 py-3 rounded-md inline-block"
                      style={{
                        backgroundColor: SUBGRID_COLORS[activeGridIndex],
                        color: ANTHROPIC.text,
                      }}
                    >
                      {activeGrid.title}
                    </p>
                  </div>

                  {/* 3x3 액션 그리드 */}
                  <div className="grid grid-cols-3 gap-3">
                    {activeGrid.actions.slice(0, 4).map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-square flex items-center justify-center p-4 text-center rounded-md"
                        style={{ backgroundColor: ANTHROPIC.textLight }}
                      >
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: ANTHROPIC.text }}
                        >
                          {action}
                        </span>
                      </motion.div>
                    ))}

                    {/* 중앙 - 필라 제목 */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="aspect-square flex items-center justify-center p-3 text-center rounded-md"
                      style={{ backgroundColor: SUBGRID_COLORS[activeGridIndex] }}
                    >
                      <span
                        className="text-base font-bold leading-tight"
                        style={{ color: ANTHROPIC.text }}
                      >
                        {activeGrid.title}
                      </span>
                    </motion.div>

                    {activeGrid.actions.slice(4, 8).map((action, index) => (
                      <motion.div
                        key={index + 4}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (index + 5) * 0.05 }}
                        className="aspect-square flex items-center justify-center p-4 text-center rounded-md"
                        style={{ backgroundColor: ANTHROPIC.textLight }}
                      >
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: ANTHROPIC.text }}
                        >
                          {action}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center pb-6 text-sm"
                  style={{ color: ANTHROPIC.secondary }}
                >
                  {t('result.closeOverlay')}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons - Anthropic 버튼 스타일 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-4 mt-10"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {/* Primary 버튼 */}
          <motion.button
            onClick={onExport}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="min-w-[140px] px-6 py-3 rounded-md font-medium transition-all duration-200"
            style={{
              backgroundColor: ANTHROPIC.primary,
              color: ANTHROPIC.textLight,
            }}
          >
            {t('result.export')}
          </motion.button>

          {/* Secondary 버튼 */}
          <motion.button
            onClick={onShare}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="min-w-[140px] px-6 py-3 rounded-md font-medium transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: ANTHROPIC.text,
              border: `1px solid ${ANTHROPIC.text}`,
            }}
          >
            {t('result.share')}
          </motion.button>
        </div>

        {/* Ghost 버튼 (Reset) */}
        <motion.button
          onClick={onReset}
          whileHover={{ opacity: 0.8 }}
          whileTap={{ scale: 0.98 }}
          className="text-sm font-medium px-6 py-3 transition-all duration-200"
          style={{ color: ANTHROPIC.primary }}
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
