import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../i18n';

const SUPPORTED_LANGUAGES: Language[] = ['zh', 'en'];
const DEFAULT_LANGUAGE: Language = 'zh';
const STORAGE_KEY = 'word_guess_language';
const URL_PARAM = 'lang';

/**
 * Language detection priority:
 * 1. URL parameter (?lang=en or ?lang=zh)
 * 2. localStorage
 * 3. Browser language preference
 * 4. Default (zh)
 */
function detectLanguage(): Language {
  // 1. Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get(URL_PARAM);
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as Language)) {
    return urlLang as Language;
  }

  // 2. Check localStorage
  const storedLang = localStorage.getItem(STORAGE_KEY);
  if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang as Language)) {
    return storedLang as Language;
  }

  // 3. Check browser language
  const browserLang = navigator.language.split('-')[0]; // 'zh-CN' -> 'zh', 'en-US' -> 'en'
  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  // 4. Default
  return DEFAULT_LANGUAGE;
}

/**
 * Update URL with language parameter (without page reload)
 */
function updateURLLanguage(lang: Language) {
  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM, lang);
  window.history.replaceState({}, '', url.toString());
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectLanguage);

  // Sync to localStorage and URL on mount
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    updateURLLanguage(language);
  }, []);

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const newLang = detectLanguage();
      if (newLang !== language) {
        setLanguageState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    
    // Update state
    setLanguageState(lang);
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, lang);
    // Update URL (without reload)
    updateURLLanguage(lang);
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>): string => {
    let text: string = translations[language][key] || translations.zh[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

