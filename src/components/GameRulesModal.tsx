import { useLanguage } from '../context/LanguageContext';
import { 
  X, MessageSquare, Lightbulb, Trophy, Clock, 
  Target, CheckCircle, Sparkles
} from 'lucide-react';

interface GameRulesModalProps {
  onClose: () => void;
  isPicker: boolean;
}

export function GameRulesModal({ onClose, isPicker }: GameRulesModalProps) {
  const { t, language } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            {isPicker ? t('pickerGuide') : t('guesserGuide')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isPicker ? (
            // Picker guide
            <>
              {/* Word display */}
              <div className="space-y-3">
                <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t('yourTask')}
                </h3>
                <p className="text-slate-300 text-sm">{t('pickerTask1')}</p>
                <p className="text-slate-300 text-sm">{t('pickerTask2')}</p>
              </div>

              {/* Hints */}
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {t('hintsGuide')}
                </h3>
                <p className="text-slate-300 text-sm">{t('hintsGuide1')}</p>
                <p className="text-slate-300 text-sm">{t('hintsGuide2')}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { icon: '🎨', label: language === 'zh' ? '颜色' : 'Color' },
                    { icon: '👅', label: language === 'zh' ? '味道' : 'Taste' },
                    { icon: '📐', label: language === 'zh' ? '形状' : 'Shape' },
                    { icon: '🌍', label: language === 'zh' ? '地理' : 'Geography' },
                  ].map((hint, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {hint.icon} {hint.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('chatGuide')}
                </h3>
                <p className="text-slate-300 text-sm">{t('pickerChatGuide')}</p>
              </div>

              {/* Scoring */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {t('yourScoring')}
                </h3>
                <p className="text-slate-300 text-sm">{t('pickerScoringGuide')}</p>
                <div className="p-3 bg-slate-700/30 rounded-xl">
                  <div className="text-sm text-slate-400">
                    {t('pickerScoringExample')}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Guesser guide
            <>
              {/* Word clues */}
              <div className="space-y-3">
                <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {t('wordClues')}
                </h3>
                <p className="text-slate-300 text-sm">{t('wordClues1')}</p>
                
                {/* Example */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="p-3 bg-slate-700/30 rounded-xl">
                    <div className="text-xs text-slate-400 mb-2">{t('wordLength')}</div>
                    <div className="flex gap-1.5">
                      {['_', '_', '_'].map((_, i) => (
                        <div key={i} className="w-6 h-6 border-b-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-bold text-sm">
                          _
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded-xl">
                    <div className="text-xs text-slate-400 mb-2">{t('category')}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs">
                      <Sparkles className="w-3 h-3" />
                      {language === 'zh' ? '美食' : 'Food'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hints */}
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {t('hintsFromPicker')}
                </h3>
                <p className="text-slate-300 text-sm">{t('hintsFromPicker1')}</p>
                <p className="text-slate-300 text-sm">{t('hintsFromPicker2')}</p>
              </div>

              {/* Guessing */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {t('howToGuess')}
                </h3>
                <p className="text-slate-300 text-sm">{t('howToGuess1')}</p>
                <p className="text-slate-300 text-sm">{t('howToGuess2')}</p>
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{t('correctGuessNote')}</span>
                </div>
              </div>

              {/* Scoring */}
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {t('yourScoring')}
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { rank: '1st', points: 100, color: 'text-amber-400' },
                    { rank: '2nd', points: 80, color: 'text-slate-300' },
                    { rank: '3rd', points: 60, color: 'text-amber-700' },
                    { rank: '4th', points: 40, color: 'text-slate-400' },
                    { rank: '5th', points: 20, color: 'text-slate-500' },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-2 bg-slate-700/30 rounded-lg">
                      <div className="text-xs text-slate-500">{item.rank}</div>
                      <div className={`text-sm font-bold ${item.color}`}>+{item.points}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="space-y-3">
                <h3 className="font-semibold text-red-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t('timeLimit')}
                </h3>
                <p className="text-slate-300 text-sm">{t('timeLimitNote')}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            {t('gotIt')}
          </button>
        </div>
      </div>
    </div>
  );
}

