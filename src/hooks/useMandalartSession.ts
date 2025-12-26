'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  MandalartSession,
  INITIAL_SESSION,
  SessionStep,
  ArchetypeType,
  InterviewAnswer,
  Pillar,
  SubGrid,
} from '@/types/mandalart';

const STORAGE_KEY = 'ai-mandalart-session';

export function useMandalartSession() {
  const [session, setSession] = useState<MandalartSession>(INITIAL_SESSION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (session !== INITIAL_SESSION) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const setStep = useCallback((step: SessionStep) => {
    setSession((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setGoal = useCallback((goal: string) => {
    setSession((prev) => ({
      ...prev,
      userContext: {
        goal,
        persona: prev.userContext?.persona || { identityAnswers: [], vibeSummary: '' },
      },
    }));
  }, []);

  const setArchetype = useCallback((archetype: ArchetypeType) => {
    setSession((prev) => ({
      ...prev,
      projectInfo: {
        name: 'AI Mandalart',
        archetype,
        createdAt: new Date().toISOString(),
      },
    }));
  }, []);

  const addInterviewAnswer = useCallback((answer: InterviewAnswer) => {
    setSession((prev) => ({
      ...prev,
      userContext: {
        ...prev.userContext!,
        persona: {
          ...prev.userContext!.persona,
          identityAnswers: [...prev.userContext!.persona.identityAnswers, answer],
        },
      },
    }));
  }, []);

  const setVibeSummary = useCallback((vibeSummary: string) => {
    setSession((prev) => ({
      ...prev,
      userContext: {
        ...prev.userContext!,
        persona: {
          ...prev.userContext!.persona,
          vibeSummary,
        },
      },
    }));
  }, []);

  const setSuggestedPillars = useCallback((pillars: Pillar[]) => {
    setSession((prev) => ({ ...prev, suggestedPillars: pillars }));
  }, []);

  const togglePillarSelection = useCallback((pillarId: string) => {
    setSession((prev) => {
      const isSelected = prev.selectedPillars.some((p) => p.id === pillarId);
      const pillar = prev.suggestedPillars.find((p) => p.id === pillarId);

      if (!pillar) return prev;

      if (isSelected) {
        return {
          ...prev,
          selectedPillars: prev.selectedPillars.filter((p) => p.id !== pillarId),
        };
      } else if (prev.selectedPillars.length < 8) {
        return {
          ...prev,
          selectedPillars: [...prev.selectedPillars, pillar],
        };
      }
      return prev;
    });
  }, []);

  const setMandalart = useCallback((core: string, subGrids: SubGrid[]) => {
    setSession((prev) => ({
      ...prev,
      mandalart: { core, subGrids },
    }));
  }, []);

  const enterDiscoveryMode = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      isDiscoveryMode: true,
      currentStep: 'DISCOVERY',
    }));
  }, []);

  const addDiscoveryAnswer = useCallback((answer: InterviewAnswer) => {
    setSession((prev) => ({
      ...prev,
      discoveryAnswers: [...prev.discoveryAnswers, answer],
    }));
  }, []);

  const setSuggestedGoals = useCallback((goals: string[]) => {
    setSession((prev) => ({ ...prev, suggestedGoals: goals }));
  }, []);

  const resetSession = useCallback(() => {
    setSession(INITIAL_SESSION);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    session,
    isLoading,
    setIsLoading,
    error,
    setError,
    setStep,
    setGoal,
    setArchetype,
    addInterviewAnswer,
    setVibeSummary,
    setSuggestedPillars,
    togglePillarSelection,
    setMandalart,
    enterDiscoveryMode,
    addDiscoveryAnswer,
    setSuggestedGoals,
    resetSession,
  };
}
