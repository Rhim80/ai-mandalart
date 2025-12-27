'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface DonationLinkProps {
  variant?: 'default' | 'compact' | 'button';
}

// Donation URLs
const DONATION_URLS = {
  ko: 'https://qr.kakaopay.com/FPDgOu0JD',
  en: 'https://buymeacoffee.com/imiwork',
};

export function DonationLink({ variant = 'default' }: DonationLinkProps) {
  const { t, language } = useLanguage();

  const donationUrl = DONATION_URLS[language];

  if (variant === 'compact') {
    return (
      <a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-secondary hover:text-black transition-colors"
      >
        {t('donation.supportShort')}
      </a>
    );
  }

  if (variant === 'button') {
    return (
      <motion.a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-black/80 transition-colors text-sm"
      >
        <span>☕</span>
        <span>{t('donation.support')}</span>
      </motion.a>
    );
  }

  // Default variant
  return (
    <motion.a
      href={donationUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 px-4 py-2 border border-black/10 hover:border-black/30 text-secondary hover:text-black rounded-sm transition-all text-sm"
    >
      <span>☕</span>
      <span>{t('donation.support')}</span>
    </motion.a>
  );
}
