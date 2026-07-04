'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 text-primary-foreground shadow-sm ${
          isOpen 
            ? 'scale-110 bg-black/20 ring-2 ring-white/30 shadow-md' 
            : 'scale-100 bg-black/10 hover:bg-black/20'
        }`}
      >
        <Globe size={16} />
        <span className="uppercase">{language}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-44 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-2 origin-top-right duration-300 ease-out">
          <div className="p-1.5 flex flex-col gap-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] ${
                  language === lang.code 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-foreground/80 hover:bg-black/5 font-medium'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
