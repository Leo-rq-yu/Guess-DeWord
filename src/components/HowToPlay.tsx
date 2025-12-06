import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { 
  ArrowLeft, Users, Clock, Trophy, MessageSquare, Lightbulb, 
  Crown, Target, Sparkles, CheckCircle, Hash
} from 'lucide-react';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Top bar */}
      <div className="relative bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToLobby')}
          </button>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('howToPlay')}</h1>
          <p className="text-slate-400 text-lg">{t('howToPlaySubtitle')}</p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1: Create/Join Room */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step1Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step1Point1')}</p>
                  <p>• {t('step1Point2')}</p>
                  <p>• {t('step1Point3')}</p>
                </div>
                <div className="mt-4 p-3 bg-slate-700/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Hash className="w-4 h-4" />
                    {t('roomCodeTip')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Waiting Room */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step2Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step2Point1')}</p>
                  <p>• {t('step2Point2')}</p>
                  <p>• {t('step2Point3')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Word Selection */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step3Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step3Point1')}</p>
                  <p>• {t('step3Point2')}</p>
                  <p>• {t('step3Point3')}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-700/30 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">{t('wordLengthExample')}</div>
                    <div className="flex gap-2">
                      {['_', '_', '_'].map((_, i) => (
                        <div key={i} className="w-8 h-8 border-b-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-bold">
                          _
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{t('threeCharWord')}</div>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">{t('categoryExample')}</div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">
                      <Sparkles className="w-3 h-3" />
                      {language === 'zh' ? '名胜古迹' : 'Landmarks'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Hints */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step4Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step4Point1')}</p>
                  <p>• {t('step4Point2')}</p>
                  <p>• {t('step4Point3')}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { icon: '🎨', label: language === 'zh' ? '颜色' : 'Color' },
                    { icon: '👅', label: language === 'zh' ? '味道' : 'Taste' },
                    { icon: '📐', label: language === 'zh' ? '形状' : 'Shape' },
                    { icon: '📍', label: language === 'zh' ? '位置' : 'Location' },
                    { icon: '🌍', label: language === 'zh' ? '地理' : 'Geography' },
                  ].map((hint, i) => (
                    <div key={i} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      <span>{hint.icon}</span>
                      <span>{hint.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Guessing */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step5Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step5Point1')}</p>
                  <p>• {t('step5Point2')}</p>
                  <p>• {t('step5Point3')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6: Scoring */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step6Title')}</h2>
                
                {/* Guesser scoring */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {t('guesserScoring')}
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { rank: '1st', points: 100 },
                      { rank: '2nd', points: 80 },
                      { rank: '3rd', points: 60 },
                      { rank: '4th', points: 40 },
                      { rank: '5th', points: 20 },
                    ].map((item, i) => (
                      <div key={i} className="text-center p-2 bg-slate-700/30 rounded-lg">
                        <div className="text-xs text-slate-400">{item.rank}</div>
                        <div className="text-lg font-bold text-cyan-400">+{item.points}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Picker scoring */}
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {t('pickerScoring')}
                  </h3>
                  <div className="p-3 bg-slate-700/30 rounded-xl text-slate-300 text-sm">
                    {t('pickerScoringDesc')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 7: Timer */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-3">{t('step7Title')}</h2>
                <div className="space-y-2 text-slate-300">
                  <p>• {t('step7Point1')}</p>
                  <p>• {t('step7Point2')}</p>
                  <p>• {t('step7Point3')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 p-6 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-2xl border border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {t('proTips')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm">{t('tip1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm">{t('tip2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm">{t('tip3')}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm">{t('tip4')}</p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            {t('startPlaying')}
          </button>
        </div>
      </div>
    </div>
  );
}

