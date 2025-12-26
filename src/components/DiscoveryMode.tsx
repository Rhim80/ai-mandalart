'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InterviewAnswer } from '@/types/mandalart';

interface DiscoveryModeProps {
  onComplete: (goal: string) => void;
  onBack: () => void;
}

export function DiscoveryMode({ onComplete, onBack }: DiscoveryModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [suggestedGoals, setSuggestedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<'questions' | 'goals'>('questions');

  useEffect(() => {
    fetchQuestion(0);
  }, []);

  const fetchQuestion = async (index: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getQuestion', questionIndex: index }),
      });
      const data = await res.json();
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    const newAnswer: InterviewAnswer = {
      question: currentQuestion,
      answer: answer.trim(),
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setAnswer('');

    if (questionIndex < totalQuestions - 1) {
      fetchQuestion(questionIndex + 1);
    } else {
      setIsLoading(true);
      try {
        const res = await fetch('/api/discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generateGoals', answers: updatedAnswers }),
        });
        const data = await res.json();
        setSuggestedGoals(data.suggestedGoals);
        setPhase('goals');
      } catch (error) {
        console.error('Failed to generate goals:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectGoal = (goal: string) => {
    onComplete(goal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <AnimatePresence mode="wait">
        {phase === 'questions' ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light mb-2">목표 발견하기</h2>
              <p className="text-secondary">
                {questionIndex + 1} / {totalQuestions}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-secondary">
                질문을 준비하고 있습니다...
              </div>
            ) : (
              <>
                <p className="text-xl text-center py-8">{currentQuestion}</p>

                <div className="space-y-4">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="편하게 적어주세요"
                    rows={3}
                    className="w-full px-6 py-4 text-lg bg-white border border-black/10 focus:border-black outline-none transition-colors resize-none"
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={onBack}
                      className="text-secondary hover:text-black transition-colors"
                    >
                      돌아가기
                    </button>

                    <motion.button
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    >
                      {questionIndex < totalQuestions - 1 ? '다음' : '목표 제안받기'}
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light mb-2">이런 목표는 어떨까요?</h2>
              <p className="text-secondary">
                답변을 바탕으로 제안드립니다
              </p>
            </div>

            <div className="space-y-4">
              {suggestedGoals.map((goal, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelectGoal(goal)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-6 text-left zen-card hover:zen-border transition-all"
                >
                  {goal}
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={onBack}
                className="text-secondary hover:text-black transition-colors"
              >
                직접 입력하기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
