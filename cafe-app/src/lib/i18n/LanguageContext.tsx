'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language, TranslationKey } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('cafe-language') as Language;
    if (saved && ['en', 'te', 'hi', 'kn'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('cafe-language', lang);
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>): string => {
    let str = translations[language][key] || translations['en'][key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(`{${k}}`, String(vars[k]));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
