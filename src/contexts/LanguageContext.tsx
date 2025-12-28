'use client';

import { createContext, useContext, useState, ReactNode, useSyncExternalStore } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  options: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Client-side language detection
function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'ko';
  const saved = localStorage.getItem('language') as Language;
  if (saved && (saved === 'ko' || saved === 'en')) {
    return saved;
  }
  return navigator.language.startsWith('ko') ? 'ko' : 'en';
}

// Subscribe to storage changes
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore for hydration-safe client state
  const storedLanguage = useSyncExternalStore(
    subscribeToStorage,
    getStoredLanguage,
    () => 'ko' as Language // Server snapshot
  );

  const [language, setLanguageState] = useState<Language>(storedLanguage);

  // Save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

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
