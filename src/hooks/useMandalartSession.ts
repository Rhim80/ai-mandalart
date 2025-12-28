'use client';

import { useState, useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  MandalartSession,
  INITIAL_SESSION,
  SessionStep,
  ArchetypeType,
  InterviewAnswer,
  Pillar,
  SubGrid,
  QuickContext,
} from '@/types/mandalart';

const STORAGE_KEY = 'ai-mandalart-session';

// Get initial session from localStorage
function getStoredSession(): MandalartSession {
  if (typeof window === 'undefined') return INITIAL_SESSION;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return INITIAL_SESSION;
}

// Subscribe to storage changes
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useMandalartSession() {
  // Use useSyncExternalStore for hydration-safe initial state
  const storedSession = useSyncExternalStore(
    subscribeToStorage,
    getStoredSession,
    () => INITIAL_SESSION // Server snapshot
  );

  const [session, setSession] = useState<MandalartSession>(storedSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    if (session !== INITIAL_SESSION) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  }, [session]);

  const setStep = useCallback((step: SessionStep) => {
    setSession((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setQuickContext = useCallback((context: QuickContext) => {
    setSession((prev) => ({
      ...prev,
      quickContext: context,
      currentStep: 'GOAL_INPUT',
    }));
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

  const togglePillarSelection = useCallback((pillarId: string, customPillar?: Pillar) => {
    setSession((prev) => {
      const isSelected = prev.selectedPillars.some((p) => p.id === pillarId);
      // Use customPillar if provided (for user-added pillars), otherwise find from suggested
      const pillar = customPillar || prev.suggestedPillars.find((p) => p.id === pillarId);

      if (!pillar) return prev;

      if (isSelected) {
        // When deselecting, remove and reassign colorIndex to remaining pillars
        const remaining = prev.selectedPillars.filter((p) => p.id !== pillarId);
        const reindexed = remaining.map((p, idx) => ({ ...p, colorIndex: idx + 1 }));
        return {
          ...prev,
          selectedPillars: reindexed,
        };
      } else if (prev.selectedPillars.length < 8) {
        // Assign colorIndex based on selection order (1-8)
        const newColorIndex = prev.selectedPillars.length + 1;
        return {
          ...prev,
          selectedPillars: [...prev.selectedPillars, { ...pillar, colorIndex: newColorIndex }],
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
    setQuickContext,
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
