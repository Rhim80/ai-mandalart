'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

// Accent red color
const ACCENT_RED = '#E53935';

interface DiscoveryModeProps {
  onComplete: (goal: string) => void;
  onBack: () => void;
}

// Step 1: Life area options with sub-goals
// goal: broad goal for AI (no specific numbers)
// label: what user sees
const DISCOVERY_OPTIONS = {
  ko: {
    areas: [
      {
        id: 'health',
        label: '건강',
        subGoals: [
          { id: 'weight_loss', label: '체중 감량', goal: '건강한 체중 관리와 감량' },
          { id: 'weight_gain', label: '체중 증가/근육', goal: '근육 증가와 체중 관리' },
          { id: 'exercise_habit', label: '운동 습관', goal: '규칙적인 운동 습관 만들기' },
          { id: 'quit_smoking', label: '금연', goal: '금연 성공하기' },
          { id: 'quit_drinking', label: '금주/절주', goal: '음주 습관 개선하기' },
          { id: 'sleep', label: '수면 개선', goal: '수면의 질 높이기' },
          { id: 'mental_health', label: '정신건강/스트레스', goal: '스트레스 관리와 마음 건강' },
        ],
      },
      {
        id: 'career',
        label: '커리어',
        subGoals: [
          { id: 'promotion', label: '승진/성과', goal: '직장에서 성과 내고 승진하기' },
          { id: 'job_change', label: '이직/전직', goal: '새로운 직장으로 이직하기' },
          { id: 'skill_up', label: '역량 강화', goal: '업무 역량 강화하기' },
          { id: 'certification', label: '자격증 취득', goal: '전문 자격증 취득하기' },
          { id: 'side_project', label: '사이드 프로젝트', goal: '나만의 사이드 프로젝트 시작하기' },
          { id: 'freelance', label: '프리랜서 전환', goal: '프리랜서로 독립하기' },
        ],
      },
      {
        id: 'finance',
        label: '재정',
        subGoals: [
          { id: 'save_money', label: '저축', goal: '체계적인 저축 습관 만들기' },
          { id: 'pay_debt', label: '빚 상환', goal: '빚 상환하고 재정 자유 얻기' },
          { id: 'invest', label: '투자 시작', goal: '투자 시작하고 자산 늘리기' },
          { id: 'income_up', label: '수입 증가', goal: '수입원 다양화하고 소득 늘리기' },
          { id: 'expense_cut', label: '지출 줄이기', goal: '불필요한 지출 줄이기' },
        ],
      },
      {
        id: 'relationship',
        label: '관계',
        subGoals: [
          { id: 'family', label: '가족 관계', goal: '가족과 더 깊은 관계 만들기' },
          { id: 'friends', label: '친구 관계', goal: '친구들과 좋은 관계 유지하기' },
          { id: 'dating', label: '연애/결혼', goal: '의미있는 연인 관계 만들기' },
          { id: 'networking', label: '네트워킹', goal: '가치있는 인맥 확장하기' },
          { id: 'communication', label: '소통 능력', goal: '대인관계 소통 능력 향상' },
        ],
      },
      {
        id: 'selfdev',
        label: '자기계발',
        subGoals: [
          { id: 'reading', label: '독서', goal: '독서 습관 만들기' },
          { id: 'language', label: '외국어', goal: '외국어 실력 향상하기' },
          { id: 'new_skill', label: '새로운 기술', goal: '새로운 기술 배우기' },
          { id: 'online_course', label: '온라인 강의', goal: '온라인 학습으로 성장하기' },
          { id: 'writing', label: '글쓰기/블로그', goal: '꾸준히 글쓰기' },
        ],
      },
      {
        id: 'hobby',
        label: '취미/여가',
        subGoals: [
          { id: 'travel', label: '여행', goal: '의미있는 여행 경험 만들기' },
          { id: 'creative', label: '창작 활동', goal: '창작 활동으로 자기표현하기' },
          { id: 'sports', label: '스포츠/레저', goal: '스포츠/레저 활동 즐기기' },
          { id: 'music', label: '음악', goal: '음악 배우고 연주하기' },
          { id: 'rest', label: '휴식/힐링', goal: '나만의 휴식 시간 확보하기' },
        ],
      },
    ],
  },
  en: {
    areas: [
      {
        id: 'health',
        label: 'Health',
        subGoals: [
          { id: 'weight_loss', label: 'Weight Loss', goal: 'Achieve healthy weight management' },
          { id: 'weight_gain', label: 'Muscle/Weight Gain', goal: 'Build muscle and gain weight' },
          { id: 'exercise_habit', label: 'Exercise Habit', goal: 'Build a regular exercise routine' },
          { id: 'quit_smoking', label: 'Quit Smoking', goal: 'Successfully quit smoking' },
          { id: 'quit_drinking', label: 'Reduce Alcohol', goal: 'Improve drinking habits' },
          { id: 'sleep', label: 'Better Sleep', goal: 'Improve sleep quality' },
          { id: 'mental_health', label: 'Mental Health', goal: 'Manage stress and mental wellness' },
        ],
      },
      {
        id: 'career',
        label: 'Career',
        subGoals: [
          { id: 'promotion', label: 'Promotion', goal: 'Get promoted and achieve results' },
          { id: 'job_change', label: 'Career Change', goal: 'Transition to a new career' },
          { id: 'skill_up', label: 'Skill Development', goal: 'Enhance professional skills' },
          { id: 'certification', label: 'Certification', goal: 'Obtain professional certification' },
          { id: 'side_project', label: 'Side Project', goal: 'Launch a personal side project' },
          { id: 'freelance', label: 'Freelancing', goal: 'Transition to freelancing' },
        ],
      },
      {
        id: 'finance',
        label: 'Finance',
        subGoals: [
          { id: 'save_money', label: 'Savings', goal: 'Build consistent saving habits' },
          { id: 'pay_debt', label: 'Pay Off Debt', goal: 'Become debt-free' },
          { id: 'invest', label: 'Start Investing', goal: 'Start investing and grow wealth' },
          { id: 'income_up', label: 'Increase Income', goal: 'Diversify and increase income' },
          { id: 'expense_cut', label: 'Cut Expenses', goal: 'Reduce unnecessary spending' },
        ],
      },
      {
        id: 'relationship',
        label: 'Relationships',
        subGoals: [
          { id: 'family', label: 'Family', goal: 'Build deeper family connections' },
          { id: 'friends', label: 'Friends', goal: 'Maintain strong friendships' },
          { id: 'dating', label: 'Dating', goal: 'Find meaningful romantic connection' },
          { id: 'networking', label: 'Networking', goal: 'Expand valuable connections' },
          { id: 'communication', label: 'Communication', goal: 'Improve interpersonal communication' },
        ],
      },
      {
        id: 'selfdev',
        label: 'Self-Development',
        subGoals: [
          { id: 'reading', label: 'Reading', goal: 'Build a reading habit' },
          { id: 'language', label: 'Language', goal: 'Improve language skills' },
          { id: 'new_skill', label: 'New Skill', goal: 'Learn a new skill' },
          { id: 'online_course', label: 'Online Course', goal: 'Grow through online learning' },
          { id: 'writing', label: 'Writing/Blog', goal: 'Write consistently' },
        ],
      },
      {
        id: 'hobby',
        label: 'Hobbies',
        subGoals: [
          { id: 'travel', label: 'Travel', goal: 'Create meaningful travel experiences' },
          { id: 'creative', label: 'Creative Work', goal: 'Express yourself through creation' },
          { id: 'sports', label: 'Sports', goal: 'Enjoy sports and leisure activities' },
          { id: 'music', label: 'Music', goal: 'Learn and play music' },
          { id: 'rest', label: 'Rest/Wellness', goal: 'Secure personal rest time' },
        ],
      },
    ],
  },
};

type Step = 'area' | 'subgoal';

interface SelectedArea {
  id: string;
  label: string;
  subGoals: { id: string; label: string; goal: string }[];
}

interface SelectedSubGoal {
  id: string;
  label: string;
  goal: string;
}

export function DiscoveryMode({ onComplete, onBack }: DiscoveryModeProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('area');
  const [selectedArea, setSelectedArea] = useState<SelectedArea | null>(null);

  const options = DISCOVERY_OPTIONS[language];

  const handleSelectArea = (area: SelectedArea) => {
    setSelectedArea(area);
    setStep('subgoal');
  };

  const handleSelectSubGoal = (subGoal: SelectedSubGoal) => {
    // Directly complete with the broad goal
    onComplete(subGoal.goal);
  };

  const handleBack = () => {
    if (step === 'subgoal') {
      setStep('area');
      setSelectedArea(null);
    } else {
      onBack();
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case 'area': return 1;
      case 'subgoal': return 2;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Progress indicator */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light mb-4">
          {language === 'ko' ? '목표 찾기' : 'Find Your Goal'}
        </h2>
        <div className="flex justify-center gap-2 mb-2">
          {[1, 2].map((num) => (
            <div
              key={num}
              className={`w-12 h-1 rounded-full transition-colors ${
                num <= getStepNumber() ? 'bg-black' : 'bg-black/20'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-secondary">
          {step === 'area' && (language === 'ko' ? '어떤 영역을 개선하고 싶으세요?' : 'What area do you want to improve?')}
          {step === 'subgoal' && (language === 'ko' ? '구체적으로 어떤 목표인가요?' : 'What specific goal?')}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Area Selection */}
        {step === 'area' && (
          <motion.div
            key="area"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            {options.areas.map((area) => (
              <motion.button
                key={area.id}
                onClick={() => handleSelectArea(area)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-5 text-left bg-white border border-black/10 hover:border-black/30 rounded-sm transition-all"
              >
                <span className="text-lg">{area.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Sub-goal Selection */}
        {step === 'subgoal' && selectedArea && (
          <motion.div
            key="subgoal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3"
          >
            <p className="text-sm text-secondary mb-4">
              {selectedArea.label} &gt; {language === 'ko' ? '세부 목표 선택' : 'Select specific goal'}
            </p>
            {selectedArea.subGoals.map((subGoal) => (
              <motion.button
                key={subGoal.id}
                onClick={() => handleSelectSubGoal(subGoal)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-4 text-left bg-white border border-black/10 hover:border-black/30 rounded-sm transition-all group"
              >
                <span className="font-medium">{subGoal.label}</span>
                <p className="text-sm text-secondary mt-1 group-hover:text-black/60 transition-colors">
                  {subGoal.goal}
                </p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleBack}
          className="text-secondary hover:text-black transition-colors"
        >
          {language === 'ko' ? '이전' : 'Back'}
        </button>
      </div>
    </motion.div>
  );
}
