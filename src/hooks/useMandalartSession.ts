'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
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

// Mutable store for session state
let sessionStore: MandalartSession = INITIAL_SESSION;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribeToSession(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSessionSnapshot(): MandalartSession {
  return sessionStore;
}

function getServerSnapshot(): MandalartSession {
  return INITIAL_SESSION;
}

// Initialize from localStorage (called once on client)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      sessionStore = JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

function updateSession(updater: (prev: MandalartSession) => MandalartSession) {
  sessionStore = updater(sessionStore);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionStore));
  }
  notifyListeners();
}

export function useMandalartSession() {
  const session = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSnapshot
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setStep = useCallback((step: SessionStep) => {
    updateSession((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setQuickContext = useCallback((context: QuickContext) => {
    updateSession((prev) => ({
      ...prev,
      quickContext: context,
      currentStep: 'GOAL_INPUT',
    }));
  }, []);

  const setGoal = useCallback((goal: string) => {
    updateSession((prev) => ({
      ...prev,
      userContext: {
        goal,
        persona: prev.userContext?.persona || { identityAnswers: [], vibeSummary: '' },
      },
    }));
  }, []);

  const setArchetype = useCallback((archetype: ArchetypeType) => {
    updateSession((prev) => ({
      ...prev,
      projectInfo: {
        name: 'AI Mandalart',
        archetype,
        createdAt: new Date().toISOString(),
      },
    }));
  }, []);

  const addInterviewAnswer = useCallback((answer: InterviewAnswer) => {
    updateSession((prev) => ({
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
    updateSession((prev) => ({
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
    updateSession((prev) => ({ ...prev, suggestedPillars: pillars }));
  }, []);

  const togglePillarSelection = useCallback((pillarId: string, customPillar?: Pillar) => {
    updateSession((prev) => {
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
    updateSession((prev) => ({
      ...prev,
      mandalart: { core, subGrids },
    }));
  }, []);

  const enterDiscoveryMode = useCallback(() => {
    updateSession((prev) => ({
      ...prev,
      isDiscoveryMode: true,
      currentStep: 'DISCOVERY',
    }));
  }, []);

  const addDiscoveryAnswer = useCallback((answer: InterviewAnswer) => {
    updateSession((prev) => ({
      ...prev,
      discoveryAnswers: [...prev.discoveryAnswers, answer],
    }));
  }, []);

  const setSuggestedGoals = useCallback((goals: string[]) => {
    updateSession((prev) => ({ ...prev, suggestedGoals: goals }));
  }, []);

  const resetSession = useCallback(() => {
    updateSession(() => INITIAL_SESSION);
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
