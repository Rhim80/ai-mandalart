'use client';

import { createContext, useContext, useSyncExternalStore, ReactNode, useCallback } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  options: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Language store
let languageStore: Language = 'ko';
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribeToLanguage(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getLanguageSnapshot(): Language {
  return languageStore;
}

function getServerSnapshot(): Language {
  return 'ko';
}

// Initialize from localStorage (called once on client)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('language') as Language;
  if (saved && (saved === 'ko' || saved === 'en')) {
    languageStore = saved;
  } else {
    languageStore = navigator.language.startsWith('ko') ? 'ko' : 'en';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerSnapshot
  );

  // Save to localStorage and update store
  const setLanguage = useCallback((lang: Language) => {
    languageStore = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    notifyListeners();
  }, []);

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = translations[language][key];
    if (typeof value !== 'string') return key;

    let text = value;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Get options array
  const options = (key: string): string[] => {
    const value = translations[language][key];
    if (Array.isArray(value)) return value;
    return [];
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      options
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
