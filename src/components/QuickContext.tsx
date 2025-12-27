'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { QuickContext as QuickContextType } from '@/types/mandalart';
import { useLanguage } from '@/contexts/LanguageContext';

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
  multiSelectLabel?: string;
}

function ChipGroup({ label, options, selected, onSelect, multiSelect = false, multiSelectLabel }: ChipGroupProps) {
  const isSelected = (option: string) => {
    if (multiSelect && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected === option;
  };

  return (
    <div className="mb-8">
      <p className="text-sm text-secondary mb-3">
        {label} {multiSelect && multiSelectLabel && <span className="text-tertiary">({multiSelectLabel})</span>}
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
  const { t, options: getOptions, language } = useLanguage();
  const [nickname, setNickname] = useState<string>('');
  const [lifeAreaIndex, setLifeAreaIndex] = useState<number>(-1);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(-1);
  const [goalStyleIndex, setGoalStyleIndex] = useState<number>(-1);
  const [yearKeywordIndex, setYearKeywordIndex] = useState<number>(-1);

  // Get localized options
  const lifeAreasOptions = getOptions('options.lifeAreas');
  const currentStatusOptions = getOptions('options.currentStatus');
  const goalStyleOptions = getOptions('options.goalStyle');
  const yearKeywordOptions = getOptions('options.yearKeyword');

  const handleLifeAreaSelect = (option: string) => {
    const index = lifeAreasOptions.indexOf(option);
    setLifeAreaIndex(index);
  };

  const handleSingleSelect = (
    option: string,
    optionsList: string[],
    setter: (index: number) => void
  ) => {
    const index = optionsList.indexOf(option);
    setter(index);
  };

  const canContinue =
    nickname.trim() &&
    lifeAreaIndex >= 0 &&
    currentStatusIndex >= 0 &&
    goalStyleIndex >= 0 &&
    yearKeywordIndex >= 0;

  const handleSubmit = () => {
    if (canContinue) {
      // Store indices and convert to Korean for API compatibility
      // The actual values are stored in Korean regardless of display language
      const koOptions = {
        lifeAreas: ['커리어', '건강', '관계', '재정', '자기계발', '취미'],
        currentStatus: ['학생', '직장인', '창업자', '프리랜서', '구직중', '기타'],
        goalStyle: ['도전적', '안정적', '실험적', '회복/재충전'],
        yearKeyword: ['성장', '변화', '안정', '도전', '균형', '회복'],
      };

      onComplete({
        nickname: nickname.trim(),
        lifeAreas: [koOptions.lifeAreas[lifeAreaIndex]],
        currentStatus: koOptions.currentStatus[currentStatusIndex],
        goalStyle: koOptions.goalStyle[goalStyleIndex],
        yearKeyword: koOptions.yearKeyword[yearKeywordIndex],
      });
    }
  };

  // For display, get the selected values in current language
  const selectedLifeArea = lifeAreaIndex >= 0 ? lifeAreasOptions[lifeAreaIndex] : '';
  const selectedCurrentStatus = currentStatusIndex >= 0 ? currentStatusOptions[currentStatusIndex] : '';
  const selectedGoalStyle = goalStyleIndex >= 0 ? goalStyleOptions[goalStyleIndex] : '';
  const selectedYearKeyword = yearKeywordIndex >= 0 ? yearKeywordOptions[yearKeywordIndex] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-2xl mx-auto px-6"
    >
      {/* Value Proposition Section */}
      <div className="text-center mb-10">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-extralight mb-8 tracking-tight"
        >
          {t('quickContext.title')}
        </motion.h1>

        {/* Ohtani Mandalart Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-sm overflow-hidden border border-black/10 bg-gray-50">
            <Image
              src="/ohtani-mandalart.jpg"
              alt={language === 'ko' ? '오타니 쇼헤이의 고등학교 시절 만다라트 계획표' : "Shohei Ohtani's high school mandalart chart"}
              width={400}
              height={400}
              className="object-cover w-full h-full grayscale contrast-[1.05]"
              priority
              unoptimized
            />
          </div>
          {/* Caption */}
          <p className="mt-3 text-xs text-black/40">
            {language === 'ko' ? '오타니 쇼헤이, 고등학교 1학년 (2010)' : 'Shohei Ohtani, High School Freshman (2010)'}
          </p>
        </motion.div>

        {/* Ohtani Story */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base text-black/80 max-w-md mx-auto mb-4 leading-relaxed"
        >
          {t('quickContext.ohtaniStory')}
        </motion.p>

        {/* Process Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-secondary mb-2"
        >
          {t('quickContext.processDesc')}
        </motion.p>

        {/* Call to Action */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-medium"
          style={{ color: ACCENT_RED }}
        >
          {language === 'ko' ? '당신의 81칸을 채워보세요' : 'Fill your 81 cells'}
        </motion.p>
      </div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="w-16 h-px bg-black/20 mx-auto mb-10"
      />

      {/* Subtitle for form */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-lg text-secondary mb-8"
      >
        {t('quickContext.subtitle')}
      </motion.p>

      {/* Quick Context Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        {/* Nickname Input */}
        <div className="mb-8">
          <p className="text-sm text-secondary mb-3">
            {t('quickContext.nickname')} <span className="text-tertiary">({t('quickContext.nicknameHint')})</span>
          </p>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t('quickContext.nicknamePlaceholder')}
            maxLength={20}
            className="w-full px-4 py-3 text-base bg-white border border-black/15 rounded-sm focus:outline-none focus:border-black/40 transition-colors placeholder:text-black/25"
          />
        </div>

        <ChipGroup
          label={t('quickContext.lifeAreas')}
          options={lifeAreasOptions}
          selected={selectedLifeArea}
          onSelect={handleLifeAreaSelect}
        />

        <ChipGroup
          label={t('quickContext.currentStatus')}
          options={currentStatusOptions}
          selected={selectedCurrentStatus}
          onSelect={(opt) => handleSingleSelect(opt, currentStatusOptions, setCurrentStatusIndex)}
        />

        <ChipGroup
          label={t('quickContext.goalStyle')}
          options={goalStyleOptions}
          selected={selectedGoalStyle}
          onSelect={(opt) => handleSingleSelect(opt, goalStyleOptions, setGoalStyleIndex)}
        />

        <ChipGroup
          label={t('quickContext.yearKeyword')}
          options={yearKeywordOptions}
          selected={selectedYearKeyword}
          onSelect={(opt) => handleSingleSelect(opt, yearKeywordOptions, setYearKeywordIndex)}
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
          {t('quickContext.next')}
        </motion.button>

        {!canContinue && (
          <p className="text-sm text-secondary">
            {language === 'ko' ? '모든 항목을 선택해주세요' : 'Please select all options'}
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
