import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { WORD_CATEGORIES, MAX_HINTS } from '../types/game';
import { 
  Users, Crown, Check, Copy, LogOut, Play, Clock, Send, 
  Trophy, Star, Sparkles, ArrowRight, SkipForward, Plus, X,
  Lightbulb, ChevronDown
} from 'lucide-react';

interface GameRoomProps {
  onLeave: () => void;
}

export function GameRoom({ onLeave }: GameRoomProps) {
  const { t, language } = useLanguage();
  const {
    room, players, myPlayer, currentRound, guesses, wordChoices,
    timeLeft, toggleReady, startGame, selectWord, submitGuess, leaveRoom, nextRound, userId,
    // Hint system
    hintTypes, currentHints, addHint, updateHint, getOptionsForType
  } = useGame();

  const [guess, setGuess] = useState('');
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Hint selection state
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [guesses]);

  const copyCode = async () => {
    if (room?.code) {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeave = async () => {
    await leaveRoom();
    onLeave();
  };

  const handleGuess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    await submitGuess(guess.trim());
    setGuess('');
  };

  const canStartGame = myPlayer?.is_admin && 
    players.length >= 2 && 
    players.filter(p => !p.is_admin).every(p => p.is_ready);

  const isPicker = currentRound?.picker_id === userId;
  const currentPicker = players.find(p => p.user_id === currentRound?.picker_id);
  const myCorrectGuess = guesses.find(g => g.user_id === userId && g.is_correct);

  // Render word display (underscores)
  const renderWordDisplay = () => {
    if (!currentRound?.word_length) return null;
    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: currentRound.word_length }).map((_, i) => (
          <div 
            key={i}
            className="w-12 h-12 border-b-4 border-cyan-400 flex items-center justify-center text-3xl font-bold text-cyan-400"
          >
            _
          </div>
        ))}
      </div>
    );
  };

  // Game finished view
  if (room?.status === 'finished') {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-lg w-full mx-4">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('gameEnded')}</h1>
            <p className="text-slate-400">{t('finalRanking')}</p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 space-y-3">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  index === 0 
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30' 
                    : 'bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`font-semibold ${index === 0 ? 'text-amber-400' : 'text-white'}`}>
                    {player.nickname}
                  </span>
                </div>
                <span className={`text-2xl font-mono font-bold ${index === 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {player.score}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleLeave}
            className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            {t('backToLobby')}
          </button>
        </div>
      </div>
    );
  }

  // Waiting room view
  if (room?.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleLeave}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">{room?.name}</h1>
              <button
                onClick={copyCode}
                className="mt-1 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mx-auto"
              >
                <span className="font-mono">{room?.code}</span>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="w-9" /> {/* Spacer */}
          </div>

          {/* Room info card */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-5 h-5" />
                <span>{players.length}/{room?.max_players} {t('players')}</span>
              </div>
              <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                {t('waiting')}
              </div>
            </div>

            {/* Players list */}
            <div className="space-y-3">
              {players
                .sort((a, b) => a.player_order - b.player_order)
                .map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      player.user_id === userId
                        ? 'bg-cyan-500/20 border border-cyan-500/30'
                        : 'bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{player.avatar || player.nickname.split(' ')[0]}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {player.nickname.includes(' ') ? player.nickname.split(' ').slice(1).join(' ') : player.nickname}
                          </span>
                          {player.is_admin && (
                            <Crown className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          #{player.player_order + 1}
                        </span>
                      </div>
                    </div>

                    {player.is_admin ? (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
                        {t('host')}
                      </span>
                    ) : player.is_ready ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t('ready')}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-600/50 text-slate-400 rounded-full text-sm">
                        {t('notReady')}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Action button */}
          {myPlayer?.is_admin ? (
            <button
              onClick={startGame}
              disabled={!canStartGame}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <Play className="w-5 h-5" />
              {t('startGame')}
            </button>
          ) : (
            <button
              onClick={toggleReady}
              className={`w-full py-4 font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2 ${
                myPlayer?.is_ready
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
              }`}
            >
              <Check className="w-5 h-5" />
              {myPlayer?.is_ready ? t('cancelReady') : t('getReady')}
            </button>
          )}

          {/* Hint for admin */}
          {myPlayer?.is_admin && !canStartGame && (
            <p className="text-center text-slate-400 text-sm mt-4">
              {players.length < 2 ? t('needMorePlayers') : t('waitingForPlayers')}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Main game area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={handleLeave}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="font-semibold text-white">{t('round', { n: currentRound?.round_number || 1 })}</h2>
              <p className="text-sm text-slate-400">
                {currentPicker?.nickname || '...'} {t('pickingWord')}
              </p>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg ${
              timeLeft <= 30 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : 'bg-slate-700/50 text-white'
            }`}>
              <Clock className="w-5 h-5" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Word selection (for picker) */}
        {isPicker && currentRound?.status === 'selecting' && wordChoices.length > 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">{t('selectWord')}</h2>
              <p className="text-slate-400 mb-8">{t('afterSelectHint')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                {wordChoices.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => selectWord(word)}
                    className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group"
                  >
                    <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {word.word}
                    </div>
                    <div className="text-sm text-slate-400">
                      {word.category}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {word.length} 字
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Waiting for word selection */}
        {!isPicker && currentRound?.status === 'selecting' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">{t('waitingForPicker')}</h2>
              <p className="text-slate-400">{currentPicker?.nickname} {t('pickerSelecting')}</p>
            </div>
          </div>
        )}

        {/* Guessing phase */}
        {currentRound?.status === 'guessing' && (
          <div className="flex-1 flex flex-col p-8 overflow-y-auto">
            {/* Word hint area */}
            <div className="text-center mb-6">
              {/* Category hint */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-full text-sm mb-4">
                <Star className="w-4 h-4" />
                {WORD_CATEGORIES.find(c => c.id === currentRound.category)?.[language === 'zh' ? 'zh' : 'en'] || currentRound.category}
              </div>

              {/* Word length display */}
              {renderWordDisplay()}

              {isPicker && (
                <div className="mt-6 p-4 bg-slate-800/60 rounded-xl inline-block">
                  <p className="text-sm text-slate-400 mb-1">{t('yourWord')}</p>
                  <p className="text-3xl font-bold text-white">{currentRound.word}</p>
                </div>
              )}

              {myCorrectGuess && (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl inline-block">
                  <p className="text-green-400 font-semibold flex items-center gap-2 text-lg">
                    <Check className="w-5 h-5" />
                    {t('youGuessedCorrectlyPoints', { n: myCorrectGuess.points })}
                  </p>
                </div>
              )}
            </div>

            {/* Hints display for all players */}
            <div className="max-w-2xl mx-auto w-full mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">{t('hints')} ({currentHints.length}/{MAX_HINTS})</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentHints.map((hint) => (
                  <div
                    key={hint.id}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg"
                  >
                    <span className="text-amber-400 text-sm font-medium">
                      {hint.hint_type?.[language === 'zh' ? 'name_zh' : 'name_en']}:
                    </span>
                    <span className="text-white">
                      {hint.hint_option?.[language === 'zh' ? 'value_zh' : 'value_en']}
                    </span>
                    {/* Allow picker to change option */}
                    {isPicker && (
                      <button
                        onClick={() => {
                          setSelectedSlot(hint.slot_number);
                          setSelectedTypeId(hint.hint_type_id);
                        }}
                        className="ml-1 p-1 text-amber-400 hover:bg-amber-500/20 rounded transition-colors"
                        title={t('changeHint')}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Empty slots for picker to add hints */}
                {isPicker && currentHints.length < MAX_HINTS && (
                  <button
                    onClick={() => {
                      const nextSlot = currentHints.length + 1;
                      setSelectedSlot(nextSlot);
                      setSelectedTypeId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addHint')}
                  </button>
                )}
                
                {currentHints.length === 0 && !isPicker && (
                  <p className="text-slate-400 text-sm">{t('noHintsYet')}</p>
                )}
              </div>
            </div>

            {/* Hint selection modal for picker */}
            {isPicker && selectedSlot !== null && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg border border-slate-700 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {selectedTypeId ? t('selectHintOption') : t('selectHintType')}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedSlot(null);
                        setSelectedTypeId(null);
                      }}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {!selectedTypeId ? (
                    // Step 1: Select hint type
                    <div className="grid grid-cols-2 gap-3">
                      {hintTypes.map((type) => {
                        // Check if this type is already used
                        const isUsed = currentHints.some(h => h.hint_type_id === type.id);
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedTypeId(type.id)}
                            disabled={isUsed}
                            className={`p-4 rounded-xl border transition-all text-left ${
                              isUsed
                                ? 'bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed'
                                : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50 hover:bg-amber-500/10'
                            }`}
                          >
                            <span className="text-2xl mb-2 block">{type.icon}</span>
                            <span className="font-medium text-white block">
                              {type[language === 'zh' ? 'name_zh' : 'name_en']}
                            </span>
                            {isUsed && (
                              <span className="text-xs text-slate-400">{t('alreadyUsed')}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // Step 2: Select hint option
                    <div>
                      <button
                        onClick={() => setSelectedTypeId(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 text-sm"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        {t('backToTypes')}
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {getOptionsForType(selectedTypeId).map((option) => {
                          const existingHint = currentHints.find(h => h.slot_number === selectedSlot);
                          const isSelected = existingHint?.hint_option_id === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={async () => {
                                if (existingHint) {
                                  await updateHint(selectedSlot!, option.id);
                                } else {
                                  await addHint(selectedSlot!, selectedTypeId, option.id);
                                }
                                setSelectedSlot(null);
                                setSelectedTypeId(null);
                              }}
                              className={`p-3 rounded-xl border transition-all ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50 text-white'
                              }`}
                            >
                              {option[language === 'zh' ? 'value_zh' : 'value_en']}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scoreboard during guessing */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-slate-800/60 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  {t('realTimeRanking')}
                </h3>
                <div className="space-y-2">
                  {[...players]
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => {
                      const isCorrect = guesses.some(g => g.user_id === player.user_id && g.is_correct);
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            isCorrect ? 'bg-green-500/10' : 'bg-slate-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-amber-500 text-white' :
                              index === 1 ? 'bg-slate-400 text-white' :
                              index === 2 ? 'bg-amber-700 text-white' :
                              'bg-slate-600 text-slate-300'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="text-white">{player.nickname}</span>
                            {player.user_id === currentRound?.picker_id && (
                              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{t('picker')}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {isCorrect && <Check className="w-4 h-4 text-green-400" />}
                            <span className="font-mono text-cyan-400">{player.score}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Round ended */}
        {currentRound?.status === 'ended' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('roundEnded')}</h2>
              <p className="text-slate-400 mb-4">{t('correctAnswer')}</p>
              <div className="text-4xl font-bold text-cyan-400 mb-8">
                {currentRound.word}
              </div>
              
              {myPlayer?.is_admin && (
                <button
                  onClick={nextRound}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto"
                >
                  <SkipForward className="w-5 h-5" />
                  {t('nextRound')}
                </button>
              )}
              
              {!myPlayer?.is_admin && (
                <p className="text-slate-400">{t('waitingForHost')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat sidebar */}
      <div className="w-80 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Send className="w-4 h-4" />
            {t('guessChat')}
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {guesses.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              <p>{t('noGuessesYet')}</p>
              <p className="text-sm mt-1">{t('beFirstToGuess')}</p>
            </div>
          )}
          {guesses.map((g) => (
            <div
              key={g.id}
              className={`p-3 rounded-xl ${
                g.is_correct
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium ${
                  g.is_correct ? 'text-green-400' : 'text-white'
                }`}>
                  {g.nickname}
                </span>
                {g.is_correct && (
                  <span className="text-xs bg-green-500/30 text-green-400 px-2 py-0.5 rounded-full">
                    +{g.points}
                  </span>
                )}
              </div>
              {g.is_correct ? (
                <p className="text-green-400 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {t('guessedCorrectly')}
                </p>
              ) : (
                <p className="text-slate-300">{g.guess}</p>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        {!isPicker && currentRound?.status === 'guessing' && !myCorrectGuess && (
          <form onSubmit={handleGuess} className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder={t('enterYourGuess')}
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!guess.trim()}
                className="p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {isPicker && currentRound?.status === 'guessing' && (
          <div className="p-4 border-t border-slate-700/50">
            <p className="text-center text-slate-400 text-sm">
              {t('youArePicker')}
            </p>
          </div>
        )}

        {myCorrectGuess && currentRound?.status === 'guessing' && (
          <div className="p-4 border-t border-slate-700/50">
            <p className="text-center text-green-400 text-sm">
              {t('youGuessedCorrectly')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
