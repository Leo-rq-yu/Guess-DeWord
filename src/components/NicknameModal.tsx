import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { User, Sparkles } from 'lucide-react';

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
}

const AVATARS = ['🐱', '🐶', '🐼', '🦊', '🐰', '🐻', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸'];

export function NicknameModal({ onSubmit }: NicknameModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(`${selectedAvatar} ${name.trim()}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Language switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('appName')}</h1>
          <p className="text-slate-400">{t('selectAvatar')}，{t('enterNickname')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">{t('selectAvatar')}</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`
                    w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all
                    ${selectedAvatar === avatar 
                      ? 'bg-cyan-500/30 ring-2 ring-cyan-500 scale-110' 
                      : 'bg-slate-700/50 hover:bg-slate-700'}
                  `}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('nickname')}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('enterNickname')}
                className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                maxLength={12}
                autoFocus
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
          >
            {t('enterGame')}
          </button>
        </form>
      </div>
    </div>
  );
}
