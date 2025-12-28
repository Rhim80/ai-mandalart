'use client';

import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { domToPng } from 'modern-screenshot';
import { useMandalartSession } from '@/hooks/useMandalartSession';
import { QuickContext } from './QuickContext';
import { GoalInput } from './GoalInput';
import { DiscoveryMode } from './DiscoveryMode';
import { ArchetypeResult } from './ArchetypeResult';
import { InterviewStep } from './InterviewStep';
import { PillarSelection } from './PillarSelection';
import { ActionSelection } from './ActionSelection';
import { MandalartGrid } from './MandalartGrid';
import { MandalartGridAnthropic } from './MandalartGridAnthropic';
import { InterviewAnswer, ArchetypeResponse, PillarsResponse, Pillar, SubGrid, QuickContext as QuickContextType } from '@/types/mandalart';

// 테스트: Anthropic 스타일 적용 여부 (true로 변경하면 Anthropic 스타일)
const USE_ANTHROPIC_STYLE = false;

export function MandalartBuilder() {
  const {
    session,
    isLoading,
    setIsLoading,
    error,
    setError,
    setStep,
    setQuickContext,
    setGoal,
    setArchetype,
    addInterviewAnswer,
    setVibeSummary,
    setSuggestedPillars,
    togglePillarSelection,
    setMandalart,
    enterDiscoveryMode,
    resetSession,
  } = useMandalartSession();

  // Handle quick context completion
  const handleQuickContextComplete = useCallback((context: QuickContextType) => {
    setQuickContext(context);
  }, [setQuickContext]);

  // Handle goal submission
  const handleGoalSubmit = useCallback(async (goal: string) => {
    setIsLoading(true);
    setError(null);
    setGoal(goal);

    try {
      const res = await fetch('/api/archetype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, quickContext: session.quickContext }),
      });

      if (!res.ok) throw new Error('Failed to analyze goal');

      const data: ArchetypeResponse = await res.json();
      setArchetype(data.archetype);
      setStep('ARCHETYPE_RESULT');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, setGoal, setArchetype, setStep, session.quickContext]);

  // Handle discovery mode completion
  const handleDiscoveryComplete = useCallback((goal: string) => {
    handleGoalSubmit(goal);
  }, [handleGoalSubmit]);

  // Handle archetype continue
  const handleArchetypeContinue = useCallback(() => {
    setStep('INTERVIEW');
  }, [setStep]);

  // Handle interview completion
  const handleInterviewComplete = useCallback(async (
    answers: InterviewAnswer[],
    vibeSummary: string
  ) => {
    setIsLoading(true);
    answers.forEach(addInterviewAnswer);
    setVibeSummary(vibeSummary);

    try {
      const res = await fetch('/api/pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype: session.projectInfo?.archetype,
          goal: session.userContext?.goal,
          vibeSummary,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate pillars');

      const data: PillarsResponse = await res.json();
      setSuggestedPillars(data.pillars);
      setStep('PILLAR_SELECTION');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [session, setIsLoading, addInterviewAnswer, setVibeSummary, setSuggestedPillars, setStep, setError]);

  // Handle pillar regeneration
  const handlePillarRegenerate = useCallback(async (
    selectedPillars: Pillar[],
    count: number
  ): Promise<Pillar[]> => {
    // Calculate rejected pillars: previously suggested but not selected
    const selectedIds = new Set(selectedPillars.map(p => p.id));
    const rejectedPillars = session.suggestedPillars.filter(p => !selectedIds.has(p.id));

    const res = await fetch('/api/pillars/regenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        archetype: session.projectInfo?.archetype,
        goal: session.userContext?.goal,
        vibeSummary: session.userContext?.persona.vibeSummary,
        selectedPillars,
        rejectedPillars,
        count,
      }),
    });

    if (!res.ok) throw new Error('Failed to regenerate pillars');

    const data: PillarsResponse = await res.json();
    return data.pillars;
  }, [session]);

  // Handle pillar selection completion - move to action selection
  const handlePillarComplete = useCallback(() => {
    if (session.selectedPillars.length !== 8) return;
    setStep('ACTION_SELECTION');
  }, [session.selectedPillars.length, setStep]);

  // Handle action selection completion
  const handleActionComplete = useCallback((subGrids: SubGrid[]) => {
    setMandalart(session.userContext?.goal || '', subGrids);
    setStep('RESULT');
  }, [session.userContext?.goal, setMandalart, setStep]);

  // 참고 이미지 스타일 - for export
  const EXPORT_COLORS = {
    background: '#F5EEEB',
    text: '#4a4a4a',
    textLight: '#888888',
  };

  // Handle export to image
  const handleExport = useCallback(async () => {
    const element = document.getElementById('mandalart-grid');
    if (!element) return;

    try {
      const dataUrl = await domToPng(element, {
        scale: 4,  // 고해상도 (4x)
        backgroundColor: EXPORT_COLORS.background,
      });

      const nickname = session.quickContext?.nickname || 'my';
      const link = document.createElement('a');
      link.download = `${nickname}-mandalart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, [session.quickContext?.nickname]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!session.mandalart) return;

    const shareData = {
      title: 'My AI Mandalart',
      text: `My goal: ${session.mandalart.core}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  }, [session.mandalart]);

  // Handle reset
  const handleReset = useCallback(() => {
    if (confirm('처음부터 다시 시작하시겠습니까?')) {
      resetSession();
    }
  }, [resetSession]);

  // Handle back to goal input
  const handleBackToGoal = useCallback(() => {
    setStep('GOAL_INPUT');
  }, [setStep]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-800 px-6 py-3 rounded-sm shadow-lg z-50 border border-red-200">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {session.currentStep === 'QUICK_CONTEXT' && (
          <QuickContext
            key="quick-context"
            onComplete={handleQuickContextComplete}
          />
        )}

        {session.currentStep === 'GOAL_INPUT' && (
          <GoalInput
            key="goal-input"
            onSubmit={handleGoalSubmit}
            onDiscoveryMode={enterDiscoveryMode}
            isLoading={isLoading}
            quickContext={session.quickContext}
          />
        )}

        {session.currentStep === 'DISCOVERY' && (
          <DiscoveryMode
            key="discovery"
            onComplete={handleDiscoveryComplete}
            onBack={handleBackToGoal}
          />
        )}

        {session.currentStep === 'ARCHETYPE_RESULT' && session.projectInfo && session.userContext && (
          <ArchetypeResult
            key="archetype"
            goal={session.userContext.goal}
            archetype={session.projectInfo.archetype}
            reasoning=""
            onContinue={handleArchetypeContinue}
            onReset={handleReset}
          />
        )}

        {session.currentStep === 'INTERVIEW' && session.projectInfo && session.userContext && (
          <InterviewStep
            key="interview"
            archetype={session.projectInfo.archetype}
            goal={session.userContext.goal}
            quickContext={session.quickContext}
            onComplete={handleInterviewComplete}
            onReset={handleReset}
          />
        )}

        {session.currentStep === 'PILLAR_SELECTION' && (
          <PillarSelection
            key="pillars"
            pillars={session.suggestedPillars}
            selectedPillars={session.selectedPillars}
            onToggle={togglePillarSelection}
            onRegenerate={handlePillarRegenerate}
            onComplete={handlePillarComplete}
            isLoading={isLoading}
            onReset={handleReset}
          />
        )}

        {session.currentStep === 'ACTION_SELECTION' && session.userContext && (
          <ActionSelection
            key="actions"
            selectedPillars={session.selectedPillars}
            goal={session.userContext.goal}
            vibeSummary={session.userContext.persona.vibeSummary || ''}
            onComplete={handleActionComplete}
            onReset={handleReset}
          />
        )}

        {session.currentStep === 'GENERATING' && (
          <div key="generating" className="text-center">
            <p className="text-xl">만다라트를 생성하고 있습니다...</p>
            <p className="text-secondary mt-2">잠시만 기다려주세요</p>
          </div>
        )}

        {session.currentStep === 'RESULT' && session.mandalart && (
          USE_ANTHROPIC_STYLE ? (
            <MandalartGridAnthropic
              key="result-anthropic"
              data={session.mandalart}
              nickname={session.quickContext?.nickname}
              onExport={handleExport}
              onShare={handleShare}
              onReset={handleReset}
            />
          ) : (
            <MandalartGrid
              key="result"
              data={session.mandalart}
              nickname={session.quickContext?.nickname}
              onExport={handleExport}
              onShare={handleShare}
              onReset={handleReset}
            />
          )
        )}
      </AnimatePresence>
    </div>
  );
}
