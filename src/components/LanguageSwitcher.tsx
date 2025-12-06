import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
      className={`flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors ${className}`}
    >
      <Globe className="w-4 h-4" />
      {language === 'zh' ? t('english') : t('chinese')}
    </button>
  );
}

