'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArchetypeType, InterviewAnswer, QuickContext } from '@/types/mandalart';

interface InterviewStepProps {
  archetype: ArchetypeType;
  goal: string;
  quickContext?: QuickContext | null;
  onComplete: (answers: InterviewAnswer[], vibeSummary: string) => void;
}

export function InterviewStep({ archetype, goal, quickContext, onComplete }: InterviewStepProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Generate summary function
  const generateSummary = useCallback(async (finalAnswers: InterviewAnswer[]) => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getSummary',
          archetype,
          goal,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      onComplete(finalAnswers, data.vibeSummary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [archetype, goal, onComplete]);

  // Fetch all questions dynamically on mount
  useEffect(() => {
    const fetchAllQuestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'getQuestions',
            archetype,
            goal,
            quickContext,
          }),
        });
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllQuestions();
  }, [archetype, goal, quickContext]);

  const handleSubmitAnswer = useCallback(() => {
    if (!answer.trim() || questions.length === 0) return;

    const newAnswer: InterviewAnswer = {
      question: questions[questionIndex],
      answer: answer.trim(),
    };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setAnswer('');

    if (questionIndex >= questions.length - 1) {
      // Last question - generate summary
      generateSummary(updatedAnswers);
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  }, [answer, answers, questionIndex, questions, generateSummary]);

  const currentQuestion = questions[questionIndex] || '';
  const showLoading = isLoading || isGeneratingSummary;

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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-[0.3em] text-secondary uppercase mb-4"
        >
          Step 2
        </motion.p>
        <h2 className="text-4xl font-extralight mb-6 tracking-tight">심층 인터뷰</h2>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${i < questionIndex
                  ? 'bg-black text-white'
                  : i === questionIndex
                  ? 'bg-black text-white ring-4 ring-black/10'
                  : 'bg-black/10 text-black/40'
                }
              `}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-8 h-8 mx-auto mb-6 border-2 border-black border-t-transparent rounded-full"
            />
            <p className="text-secondary">
              {isGeneratingSummary
                ? '당신의 이야기를 정리하고 있습니다...'
                : '맞춤형 질문을 준비하고 있습니다...'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
          >
            {/* Question */}
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight"
              >
                {currentQuestion}
              </motion.p>
            </div>

            {/* Answer input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="마음 가는 대로 적어주세요"
                rows={4}
                className="w-full px-0 py-4 text-lg bg-transparent border-b-2 border-black/10 focus:border-black outline-none transition-colors resize-none placeholder:text-black/25"
              />

              <div className="flex justify-end">
                <motion.button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  whileHover={{ scale: answer.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: answer.trim() ? 0.98 : 1 }}
                  className="btn-primary"
                >
                  {questionIndex < 2 ? '다음 질문' : '완료'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previous answers */}
      {answers.length > 0 && !showLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 pt-8 border-t border-black/5"
        >
          <p className="text-xs tracking-[0.2em] text-secondary uppercase mb-4 text-center">
            이전 답변
          </p>
          <div className="space-y-4">
            {answers.map((a, i) => (
              <div key={i} className="p-4 bg-black/[0.02] rounded-sm">
                <p className="text-sm text-secondary mb-1">Q{i + 1}. {a.question}</p>
                <p className="text-sm">{a.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
