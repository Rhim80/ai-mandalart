'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-sm">
      <motion.button
        onClick={() => setLanguage('ko')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'ko'
            ? 'bg-black text-white'
            : 'text-secondary hover:text-black'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        한
      </motion.button>
      <span className="text-tertiary">/</span>
      <motion.button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-black text-white'
            : 'text-secondary hover:text-black'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
    </div>
  );
}
