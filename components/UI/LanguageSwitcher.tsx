'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
      className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg hover:bg-slate-700 transition-all flex items-center gap-2"
    >
      <span>{language === 'en' ? '🇺🇸 EN' : '🇹🇷 TR'}</span>
    </button>
  );
}
