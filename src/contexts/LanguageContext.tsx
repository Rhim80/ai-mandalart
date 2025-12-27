'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  options: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [isClient, setIsClient] = useState(false);

  // Hydration-safe initialization
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'ko' || saved === 'en')) {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
      setLanguageState(browserLang);
    }
  }, []);

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

  // Prevent hydration mismatch by using default language until client-side
  const effectiveLanguage = isClient ? language : 'ko';

  return (
    <LanguageContext.Provider value={{
      language: effectiveLanguage,
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
