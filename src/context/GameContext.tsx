import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@insforge/react';
import { insforge } from '../lib/insforge';
import { useRealtime } from '../hooks/useRealtime';
import type { Room, Player, Round, Guess, Word, HintType, HintOption, RoundHint, PickerStats } from '../types/game';

interface GameState {
  room: Room | null;
  players: Player[];
  currentRound: Round | null;
  guesses: Guess[];
  myPlayer: Player | null;
  wordChoices: Word[];
  timeLeft: number;
  // Hint system
  hintTypes: HintType[];
  hintOptions: HintOption[];
  currentHints: RoundHint[];
}

interface GameContextType extends GameState {
  // User info
  isLoggedIn: boolean;
  userId: string | null;
  
  // Room actions
  createRoom: (name: string, isPublic: boolean, nickname: string) => Promise<Room | null>;
  joinRoom: (code: string, nickname: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  toggleReady: () => Promise<void>;
  startGame: () => Promise<void>;
  
  // Game actions
  selectWord: (word: Word) => Promise<void>;
  submitGuess: (guess: string) => Promise<void>;
  nextRound: () => Promise<void>;
  
  // Hint actions
  addHint: (slotNumber: number, typeId: string, optionId: string) => Promise<void>;
  updateHint: (slotNumber: number, optionId: string) => Promise<void>;
  getOptionsForType: (typeId: string) => HintOption[];
  
  // Rating actions
  rateRound: (rating: 'heart' | 'poop') => Promise<void>;
  myRating: 'heart' | 'poop' | null;
  pickerStats: PickerStats[];
  
  // Loading states
  loading: boolean;
  refreshData: () => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  // User ID from authentication
  const userId = user?.id || null;

  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [wordChoices, setWordChoices] = useState<Word[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);
  
  // Hint system state
  const [hintTypes, setHintTypes] = useState<HintType[]>([]);
  const [hintOptions, setHintOptions] = useState<HintOption[]>([]);
  const [currentHints, setCurrentHints] = useState<RoundHint[]>([]);

  // Rating system state
  const [myRating, setMyRating] = useState<'heart' | 'poop' | null>(null);
  const [pickerStats, setPickerStats] = useState<PickerStats[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate my player
  const myPlayer = players.find(p => p.user_id === userId) || null;

  // Real-time event handlers
  const realtimeHandlers = {
    room_update: (msg: any) => {
      const payload = msg.payload || msg;
      setRoom(prev => prev ? { ...prev, ...payload } : null);
    },
    player_joined: (msg: any) => {
      const payload = msg.payload || msg;
      setPlayers(prev => {
        const exists = prev.find(p => p.id === payload.player_id);
        if (exists) {
          return prev.map(p => p.id === payload.player_id ? { ...p, ...payload, id: payload.player_id } : p);
        }
        return [...prev, { ...payload, id: payload.player_id }];
      });
    },
    player_update: (msg: any) => {
      const payload = msg.payload || msg;
      setPlayers(prev => 
        prev.map(p => p.id === payload.player_id ? { ...p, ...payload } : p)
      );
    },
    player_left: (msg: any) => {
      const payload = msg.payload || msg;
      setPlayers(prev => prev.filter(p => p.id !== payload.player_id));
    },
    round_started: (msg: any) => {
      const payload = msg.payload || msg;
      setCurrentRound({
        id: payload.round_id,
        room_id: room?.id || '',
        round_number: payload.round_number,
        picker_id: payload.picker_id,
        word: '',
        word_en: '',
        category: payload.category || '',
        category_en: payload.category_en || '',
        word_length: payload.word_length || 0,
        word_length_en: payload.word_length_en || 0,
        status: payload.status,
        started_at: payload.started_at,
        ended_at: payload.ended_at
      });
      setGuesses([]);
      setCurrentHints([]); // Clear hints for new round
      if (payload.status === 'guessing') {
        setTimeLeft(120);
      }
    },
    round_update: (msg: any) => {
      const payload = msg.payload || msg;
      setCurrentRound(prev => prev ? { 
        ...prev, 
        status: payload.status,
        word_length: payload.word_length || prev.word_length,
        category: payload.category || prev.category,
        started_at: payload.started_at || prev.started_at,
        ended_at: payload.ended_at
      } : null);
      
      if (payload.status === 'guessing') {
        setTimeLeft(120);
      }
    },
    new_guess: (msg: any) => {
      const payload = msg.payload || msg;
      setGuesses(prev => {
        // Avoid duplicates
        if (prev.some(g => g.id === payload.guess_id)) return prev;
        return [...prev, {
          id: payload.guess_id,
          round_id: currentRound?.id || '',
          user_id: payload.user_id,
          nickname: payload.nickname,
          guess: payload.guess,
          is_correct: payload.is_correct,
          points: payload.points,
          guess_order: payload.guess_order,
          guessed_at: payload.guessed_at
        }];
      });
    },
    word_choices: (msg: any) => {
      const payload = msg.payload || msg;
      // Only picker should receive word choices
      if (payload.picker_id === userId) {
        setWordChoices(payload.words || []);
      }
    },
    game_ended: () => {
      setCurrentRound(null);
      setGuesses([]);
      setWordChoices([]);
      setCurrentHints([]);
    },
    // Hint realtime handlers
    hint_added: (msg: any) => {
      const payload = msg.payload || msg;
      setCurrentHints(prev => {
        if (prev.some(h => h.slot_number === payload.slot_number)) return prev;
        return [...prev, payload].sort((a, b) => a.slot_number - b.slot_number);
      });
    },
    hint_updated: (msg: any) => {
      const payload = msg.payload || msg;
      setCurrentHints(prev => 
        prev.map(h => h.slot_number === payload.slot_number ? payload : h)
      );
    }
  };

  // Use realtime hook
  const { publish } = useRealtime(
    room ? `room:${room.id}` : null,
    realtimeHandlers
  );

  // Fetch room data (fallback polling for reliability)
  const refreshData = useCallback(async () => {
    if (!room?.id) return;

    try {
      // Fetch players
      const { data: playersData } = await insforge.database
        .from('room_players')
        .select()
        .eq('room_id', room.id)
        .order('player_order', { ascending: true });
      
      if (playersData) {
        setPlayers(playersData);
      }

      // Fetch room status
      const { data: roomData } = await insforge.database
        .from('rooms')
        .select()
        .eq('id', room.id)
        .single();
      
      if (roomData) {
        setRoom(roomData);

        // Fetch current round if game is playing
        if (roomData.status === 'playing') {
          const { data: roundData } = await insforge.database
            .from('rounds')
            .select()
            .eq('room_id', room.id)
            .eq('round_number', roomData.current_round)
            .single();
          
          if (roundData) {
            setCurrentRound(roundData);

            // Fetch guesses for current round
            const { data: guessesData } = await insforge.database
              .from('guesses')
              .select()
              .eq('round_id', roundData.id)
              .order('guessed_at', { ascending: true });
            
            if (guessesData) {
              setGuesses(guessesData);
            }

            // Fetch hints for current round
            const { data: hintsData } = await insforge.database
              .from('round_hints')
              .select('*, hint_types(*), hint_options(*)')
              .eq('round_id', roundData.id)
              .order('slot_number', { ascending: true });
            
            if (hintsData) {
              setCurrentHints(hintsData.map((h: any) => ({
                ...h,
                hint_type: h.hint_types,
                hint_option: h.hint_options
              })));
            }
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [room?.id]);

  // Auto-rejoin room after page refresh
  useEffect(() => {
    if (!userId || room) return; // Only try if logged in and not already in a room
    
    const savedRoomCode = localStorage.getItem('current_room_code');
    if (!savedRoomCode) return;

    // Try to rejoin the saved room
    const tryRejoin = async () => {
      const { data: roomData } = await insforge.database
        .from('rooms')
        .select()
        .eq('code', savedRoomCode)
        .single();

      if (!roomData || roomData.status === 'finished') {
        // Room doesn't exist or game is finished, clear localStorage
        localStorage.removeItem('current_room_code');
        return;
      }

      // Check if we're still in the room
      const { data: existingPlayers } = await insforge.database
        .from('room_players')
        .select()
        .eq('room_id', roomData.id);

      const myPlayerData = existingPlayers?.find(p => p.user_id === userId);
      if (myPlayerData) {
        // Update online status
        await insforge.database
          .from('room_players')
          .update({ 
            is_online: true, 
            last_seen: new Date().toISOString() 
          })
          .eq('id', myPlayerData.id);

        // Update local state with online status
        const updatedPlayers = existingPlayers?.map(p => 
          p.id === myPlayerData.id ? { ...p, is_online: true } : p
        ) || [];

        setRoom(roomData);
        setPlayers(updatedPlayers);
        console.log('[Auto-rejoin] Rejoined room:', roomData.code);
      } else {
        // We were removed from the room
        localStorage.removeItem('current_room_code');
      }
    };

    tryRejoin();
  }, [userId, room]);

  // Polling effect (backup for realtime - less frequent since realtime handles most updates)
  useEffect(() => {
    if (!room?.id) return;

    // Initial fetch
    refreshData();

    // Poll every 5 seconds as backup (realtime handles instant updates)
    pollRef.current = setInterval(refreshData, 5000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [room?.id, refreshData]);

  // Mark player as offline when leaving/refreshing page
  useEffect(() => {
    if (!room?.id || !myPlayer?.id) return;

    const markOffline = async () => {
      try {
        await insforge.database
          .from('room_players')
          .update({ is_online: false, last_seen: new Date().toISOString() })
          .eq('id', myPlayer.id);
      } catch {
        // Ignore errors during page unload
      }
    };

    const markOnline = async () => {
      try {
        await insforge.database
          .from('room_players')
          .update({ is_online: true, last_seen: new Date().toISOString() })
          .eq('id', myPlayer.id);
      } catch {
        // Ignore errors
      }
    };

    const handleBeforeUnload = () => {
      markOffline();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        markOffline();
      } else if (document.visibilityState === 'visible') {
        markOnline();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [room?.id, myPlayer?.id]);

  // Heartbeat - update last_seen every 30 seconds
  useEffect(() => {
    if (!room?.id || !myPlayer?.id) return;

    const heartbeat = async () => {
      try {
        await insforge.database
          .from('room_players')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', myPlayer.id);
      } catch (e) {
        console.error('[Heartbeat] Failed:', e);
      }
    };

    // Initial heartbeat
    heartbeat();

    // Heartbeat every 30 seconds
    const interval = setInterval(heartbeat, 30000);

    return () => clearInterval(interval);
  }, [room?.id, myPlayer?.id]);

  // Load hint types and options on mount
  useEffect(() => {
    const loadHintData = async () => {
      try {
        const [typesRes, optionsRes] = await Promise.all([
          insforge.database.from('hint_types').select().order('sort_order', { ascending: true }),
          insforge.database.from('hint_options').select().order('sort_order', { ascending: true })
        ]);
        
        if (typesRes.data) setHintTypes(typesRes.data);
        if (optionsRes.data) setHintOptions(optionsRes.data);
      } catch (error) {
        console.error('Failed to load hint data:', error);
      }
    };
    
    loadHintData();
  }, []);

  // Timer effect
  useEffect(() => {
    if (currentRound?.status === 'guessing' && currentRound.started_at) {
      const startTime = new Date(currentRound.started_at).getTime();
      
      const updateTimer = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 120 - elapsed);
        setTimeLeft(remaining);
        
        if (remaining === 0 && myPlayer?.is_admin && currentRound.status === 'guessing') {
          endRoundDueToTimeout();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [currentRound?.status, currentRound?.started_at, myPlayer?.is_admin]);

  // End round due to timeout
  const endRoundDueToTimeout = async () => {
    if (!currentRound) return;

    await insforge.database
      .from('rounds')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', currentRound.id);
  };

  // Create room
  const createRoom = useCallback(async (name: string, isPublic: boolean, nickname: string): Promise<Room | null> => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('rooms')
        .insert({
          name,
          is_public: isPublic,
          created_by: userId
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Failed to create room:', error);
        return null;
      }

      // Join as admin
      const { data: playerData, error: playerError } = await insforge.database
        .from('room_players')
        .insert({
          room_id: data.id,
          user_id: userId,
          nickname: nickname,
          is_admin: true,
          player_order: 0,
          is_online: true,
          last_seen: new Date().toISOString()
        })
        .select()
        .single();

      if (playerError) {
        console.error('Failed to join room:', playerError);
        return null;
      }

      setRoom(data);
      setPlayers([playerData]);
      // Save to localStorage for auto-rejoin after refresh
      localStorage.setItem('current_room_code', data.code);
      return data;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Join room
  const joinRoom = useCallback(async (code: string, nickname: string): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      // Find room by code
      const { data: roomData, error: roomError } = await insforge.database
        .from('rooms')
        .select()
        .eq('code', code.toUpperCase())
        .single();

      if (roomError || !roomData) {
        console.error('Room not found:', roomError);
        return false;
      }

      // Check player count
      const { data: existingPlayers } = await insforge.database
        .from('room_players')
        .select()
        .eq('room_id', roomData.id);

      // Check if already in room (allow rejoin even if game is playing)
      const alreadyIn = existingPlayers?.find(p => p.user_id === userId);
      if (alreadyIn) {
        // Update online status on reconnect
        await insforge.database
          .from('room_players')
          .update({ 
            is_online: true, 
            last_seen: new Date().toISOString() 
          })
          .eq('id', alreadyIn.id);
        
        // Update local state with online status
        const updatedPlayers = existingPlayers?.map(p => 
          p.id === alreadyIn.id ? { ...p, is_online: true } : p
        ) || [];
        
        setRoom(roomData);
        setPlayers(updatedPlayers);
        // Save to localStorage for auto-rejoin after refresh
        localStorage.setItem('current_room_code', roomData.code);
        console.log('[Reconnect] Rejoined room:', roomData.code);
        return true;
      }

      // New players can only join waiting rooms
      if (roomData.status !== 'waiting') {
        console.error('Room is not accepting new players');
        return false;
      }

      if (existingPlayers && existingPlayers.length >= roomData.max_players) {
        console.error('Room is full');
        return false;
      }

      // Join room
      const nextOrder = existingPlayers ? existingPlayers.length : 0;
      const { data: playerData, error: playerError } = await insforge.database
        .from('room_players')
        .insert({
          room_id: roomData.id,
          user_id: userId,
          nickname: nickname,
          is_admin: false,
          player_order: nextOrder,
          is_online: true,
          last_seen: new Date().toISOString()
        })
        .select()
        .single();

      if (playerError) {
        console.error('Failed to join room:', playerError);
        return false;
      }

      setRoom(roomData);
      setPlayers([...(existingPlayers || []), playerData]);
      return true;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!room || !myPlayer) return;

    await insforge.database
      .from('room_players')
      .delete()
      .eq('id', myPlayer.id);

    // Clear localStorage
    localStorage.removeItem('current_room_code');

    setRoom(null);
    setPlayers([]);
    setCurrentRound(null);
    setGuesses([]);
    setWordChoices([]);
  }, [room, myPlayer]);

  // Toggle ready
  const toggleReady = useCallback(async () => {
    if (!myPlayer) return;

    await insforge.database
      .from('room_players')
      .update({ is_ready: !myPlayer.is_ready })
      .eq('id', myPlayer.id);

    setPlayers(prev =>
      prev.map(p => p.id === myPlayer.id ? { ...p, is_ready: !p.is_ready } : p)
    );
  }, [myPlayer]);

  // Start game (admin only)
  const startGame = useCallback(async () => {
    if (!room || !myPlayer?.is_admin) return;

    // Check if all players are ready
    const allReady = players.every(p => p.is_ready || p.is_admin);
    if (!allReady || players.length < 2) {
      console.error('Not all players are ready or not enough players');
      return;
    }

    // Get 3 random words for the first picker
    const { data: words } = await insforge.database
      .from('words')
      .select()
      .limit(100);

    if (words && words.length >= 3) {
      const shuffled = words.sort(() => Math.random() - 0.5);
      const choices = shuffled.slice(0, 3);
      
      // Create first round
      const firstPicker = players.find(p => p.player_order === 0);
      if (firstPicker) {
        const { data: roundData } = await insforge.database
          .from('rounds')
          .insert({
            room_id: room.id,
            round_number: 1,
            picker_id: firstPicker.user_id,
            word: '',
            category: '',
            word_length: 0,
            status: 'selecting'
          })
          .select()
          .single();

        if (roundData) {
          setCurrentRound(roundData);
          
          // Set word choices for picker
          if (firstPicker.user_id === userId) {
            setWordChoices(choices);
          }
          
          // Publish word choices via realtime
          await publish('word_choices', {
            picker_id: firstPicker.user_id,
            words: choices
          });
        }
      }

      // Update room status
      await insforge.database
        .from('rooms')
        .update({ 
          status: 'playing',
          current_round: 1,
          current_picker_order: 0
        })
        .eq('id', room.id);

      setRoom(prev => prev ? { ...prev, status: 'playing', current_round: 1, current_picker_order: 0 } : null);
    }
  }, [room, myPlayer, players, userId, publish]);

  // Select word (picker only)
  const selectWord = useCallback(async (word: Word) => {
    if (!currentRound || currentRound.picker_id !== userId) return;

    // Calculate English word length (number of letters, excluding spaces)
    const wordLengthEn = word.word_en.replace(/\s/g, '').length;

    await insforge.database
      .from('rounds')
      .update({
        word: word.word,
        word_en: word.word_en,
        category: word.category,
        category_en: word.category_en,
        word_length: word.length,
        word_length_en: wordLengthEn,
        status: 'guessing',
        started_at: new Date().toISOString()
      })
      .eq('id', currentRound.id);

    setCurrentRound(prev => prev ? {
      ...prev,
      word: word.word,
      word_en: word.word_en,
      category: word.category,
      category_en: word.category_en,
      word_length: word.length,
      word_length_en: wordLengthEn,
      status: 'guessing',
      started_at: new Date().toISOString()
    } : null);
    
    setWordChoices([]);
    setTimeLeft(120);
  }, [currentRound, userId]);

  // Submit guess or message (picker sends messages, others guess)
  const submitGuess = useCallback(async (guess: string) => {
    if (!currentRound) return;
    if (currentRound.status !== 'guessing') return;

    const isPicker = currentRound.picker_id === userId;
    
    // Non-pickers who already guessed correctly cannot send more messages
    if (!isPicker) {
      const alreadyCorrect = guesses.find(g => g.user_id === userId && g.is_correct);
      if (alreadyCorrect) return;
    }
    
    let isCorrect = false;
    let points = 0;
    let guessOrder = null;

    // Only check correctness for non-pickers
    if (!isPicker) {
      // Get current round word (both languages)
      const { data: roundData } = await insforge.database
        .from('rounds')
        .select('word, word_en')
        .eq('id', currentRound.id)
        .single();

      if (!roundData) return;

      // Check if correct - match against both languages
      const guessLower = guess.trim().toLowerCase();
      const wordZh = roundData.word?.toLowerCase() || '';
      const wordEn = roundData.word_en?.toLowerCase() || '';
      isCorrect = guessLower === wordZh || guessLower === wordEn;
      
      if (isCorrect) {
        const correctCount = guesses.filter(g => g.is_correct).length;
        const POINTS = [100, 80, 60, 40, 20];
        points = POINTS[correctCount] || 10;
        guessOrder = correctCount + 1;

        // Update player score in room
        if (myPlayer) {
          await insforge.database
            .from('room_players')
            .update({ score: myPlayer.score + points })
            .eq('id', myPlayer.id);
        }

        // Update user's total score if logged in
        if (isSignedIn && user?.id) {
          const { data: userData } = await insforge.database
            .from('users')
            .select('total_score')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            await insforge.database
              .from('users')
              .update({ total_score: (userData.total_score || 0) + points })
              .eq('id', user.id);
          }
        }
      }
    }

    // Insert guess/message
    const { data: guessData } = await insforge.database
      .from('guesses')
      .insert({
        round_id: currentRound.id,
        user_id: userId,
        nickname: myPlayer?.nickname || 'Player',
        guess: guess,
        is_correct: isCorrect,
        points: points,
        guess_order: guessOrder
      })
      .select()
      .single();

    if (guessData) {
      setGuesses(prev => [...prev, guessData]);
    }

    // Check if all non-pickers have guessed correctly (only if this was a correct guess)
    if (isCorrect) {
      const nonPickers = players.filter(p => p.user_id !== currentRound.picker_id);
      const correctGuesses = [...guesses.filter(g => g.is_correct), { user_id: userId }];
      const allCorrect = nonPickers.every(p => 
        correctGuesses.some(g => g.user_id === p.user_id)
      );

      if (allCorrect) {
        // End round early
        await insforge.database
          .from('rounds')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString()
          })
          .eq('id', currentRound.id);

        setCurrentRound(prev => prev ? { ...prev, status: 'ended' } : null);
      }
    }
  }, [currentRound, userId, guesses, players, myPlayer, isSignedIn, user?.id]);

  // Next round
  const nextRound = useCallback(async () => {
    if (!room || !myPlayer?.is_admin || !currentRound) return;

    // Calculate and apply picker's score for the ended round
    const currentPicker = players.find(p => p.user_id === currentRound.picker_id);
    if (currentPicker) {
      // Get non-picker players
      const guessers = players.filter(p => p.user_id !== currentRound.picker_id);
      const totalGuessers = guessers.length;
      
      // Count how many guessed correctly
      const correctGuessUserIds = new Set(guesses.filter(g => g.is_correct).map(g => g.user_id));
      const correctGuessCount = guessers.filter(p => correctGuessUserIds.has(p.user_id)).length;
      
      // Picker score = (correctGuessCount / totalGuessers) * 100
      // More people guess correctly = higher picker score (encourages good hints!)
      // All correct = 100 points, none correct = 0 points
      const pickerScore = totalGuessers > 0 
        ? Math.round((correctGuessCount / totalGuessers) * 100) 
        : 0;
      
      if (pickerScore > 0) {
        // Update picker's room score
        await insforge.database
          .from('room_players')
          .update({ score: currentPicker.score + pickerScore })
          .eq('id', currentPicker.id);
        
        // Update picker's total score if logged in
        if (currentPicker.user_id) {
          const { data: userData } = await insforge.database
            .from('users')
            .select('total_score')
            .eq('id', currentPicker.user_id)
            .single();
          
          if (userData) {
            await insforge.database
              .from('users')
              .update({ total_score: (userData.total_score || 0) + pickerScore })
              .eq('id', currentPicker.user_id);
          }
        }
        
        // Update local state
        setPlayers(prev => prev.map(p => 
          p.id === currentPicker.id ? { ...p, score: p.score + pickerScore } : p
        ));
      }
    }

    const nextRoundNumber = currentRound.round_number + 1;
    const nextPickerOrder = (room.current_picker_order + 1) % players.length;
    const nextPicker = players.find(p => p.player_order === nextPickerOrder);

    if (!nextPicker) return;

    // Check if game should end (all players have been picker once)
    if (nextRoundNumber > players.length) {
      // Update games_played for logged in users
      if (isSignedIn && user?.id) {
        const { data: userData } = await insforge.database
          .from('users')
          .select('games_played')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          await insforge.database
            .from('users')
            .update({ games_played: (userData.games_played || 0) + 1 })
            .eq('id', user.id);
        }
      }

      // End game
      await insforge.database
        .from('rooms')
        .update({ status: 'finished' })
        .eq('id', room.id);
      
      setRoom(prev => prev ? { ...prev, status: 'finished' } : null);
      return;
    }

    // Get new word choices
    const { data: words } = await insforge.database
      .from('words')
      .select()
      .limit(100);

    if (words && words.length >= 3) {
      const shuffled = words.sort(() => Math.random() - 0.5);
      const choices = shuffled.slice(0, 3);

      // Create next round
      const { data: roundData } = await insforge.database
        .from('rounds')
        .insert({
          room_id: room.id,
          round_number: nextRoundNumber,
          picker_id: nextPicker.user_id,
          word: '',
          category: '',
          word_length: 0,
          status: 'selecting'
        })
        .select()
        .single();

      if (roundData) {
        setCurrentRound(roundData);
        setGuesses([]);
        
        // Set word choices for picker
        if (nextPicker.user_id === userId) {
          setWordChoices(choices);
        }
        
        // Publish word choices via realtime
        await publish('word_choices', {
          picker_id: nextPicker.user_id,
          words: choices
        });
      }

      // Update room
      await insforge.database
        .from('rooms')
        .update({
          current_round: nextRoundNumber,
          current_picker_order: nextPickerOrder
        })
        .eq('id', room.id);

      setRoom(prev => prev ? {
        ...prev,
        current_round: nextRoundNumber,
        current_picker_order: nextPickerOrder
      } : null);
    }
  }, [room, myPlayer, currentRound, players, userId, publish, isSignedIn, user?.id]);

  // Hint helper: Get options for a specific hint type
  const getOptionsForType = useCallback((typeId: string): HintOption[] => {
    return hintOptions.filter(opt => opt.type_id === typeId);
  }, [hintOptions]);

  // Hint action: Add a new hint to a slot
  const addHint = useCallback(async (slotNumber: number, typeId: string, optionId: string) => {
    if (!currentRound || !myPlayer) return;
    
    // Only picker can add hints
    if (currentRound.picker_id !== userId) return;
    
    // Validate slot number (1-5)
    if (slotNumber < 1 || slotNumber > 5) return;
    
    // Check if slot already has a hint
    const existingHint = currentHints.find(h => h.slot_number === slotNumber);
    if (existingHint) {
      console.log('Slot already has a hint, use updateHint instead');
      return;
    }
    
    const { data, error } = await insforge.database
      .from('round_hints')
      .insert({
        round_id: currentRound.id,
        hint_type_id: typeId,
        hint_option_id: optionId,
        slot_number: slotNumber
      })
      .select('*, hint_types(*), hint_options(*)')
      .single();
    
    if (error) {
      console.error('Failed to add hint:', error);
      return;
    }
    
    if (data) {
      const newHint: RoundHint = {
        ...data,
        hint_type: data.hint_types,
        hint_option: data.hint_options
      };
      setCurrentHints(prev => [...prev, newHint].sort((a, b) => a.slot_number - b.slot_number));
      
      // Publish realtime event
      publish('hint_added', newHint);
    }
  }, [currentRound, myPlayer, userId, currentHints, publish]);

  // Hint action: Update an existing hint (only option, not type)
  const updateHint = useCallback(async (slotNumber: number, optionId: string) => {
    if (!currentRound || !myPlayer) return;
    
    // Only picker can update hints
    if (currentRound.picker_id !== userId) return;
    
    const existingHint = currentHints.find(h => h.slot_number === slotNumber);
    if (!existingHint) {
      console.log('No hint in this slot');
      return;
    }
    
    // Verify the new option is of the same type
    const newOption = hintOptions.find(o => o.id === optionId);
    if (!newOption || newOption.type_id !== existingHint.hint_type_id) {
      console.log('Option must be of the same type');
      return;
    }
    
    const { data, error } = await insforge.database
      .from('round_hints')
      .update({
        hint_option_id: optionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingHint.id)
      .select('*, hint_types(*), hint_options(*)')
      .single();
    
    if (error) {
      console.error('Failed to update hint:', error);
      return;
    }
    
    if (data) {
      const updatedHint: RoundHint = {
        ...data,
        hint_type: data.hint_types,
        hint_option: data.hint_options
      };
      setCurrentHints(prev => 
        prev.map(h => h.slot_number === slotNumber ? updatedHint : h)
      );
      
      // Publish realtime event
      publish('hint_updated', updatedHint);
    }
  }, [currentRound, myPlayer, userId, currentHints, hintOptions, publish]);

  // Rate the current round's picker
  const rateRound = useCallback(async (rating: 'heart' | 'poop') => {
    if (!currentRound || !userId) return;
    // Can't rate yourself
    if (currentRound.picker_id === userId) return;
    // Round must be ended
    if (currentRound.status !== 'ended') return;

    try {
      // Upsert rating (update if exists, insert if not)
      const { error } = await insforge.database
        .from('round_ratings')
        .upsert({
          round_id: currentRound.id,
          picker_id: currentRound.picker_id,
          voter_id: userId,
          rating: rating
        }, { onConflict: 'round_id,voter_id' });

      if (!error) {
        setMyRating(rating);
      }
    } catch (e) {
      console.error('Failed to rate round:', e);
    }
  }, [currentRound, userId]);

  // Fetch picker stats when game ends
  useEffect(() => {
    if (room?.status !== 'finished') {
      setPickerStats([]);
      return;
    }

    const fetchPickerStats = async () => {
      // Get all rounds for this room
      const { data: rounds } = await insforge.database
        .from('rounds')
        .select('id, picker_id')
        .eq('room_id', room.id);

      if (!rounds || rounds.length === 0) return;

      // Get all ratings for these rounds
      const roundIds = rounds.map(r => r.id);
      const { data: ratings } = await insforge.database
        .from('round_ratings')
        .select('picker_id, rating')
        .in('round_id', roundIds);

      if (!ratings) return;

      // Calculate stats per picker
      const statsMap = new Map<string, { hearts: number; poops: number }>();
      
      ratings.forEach(r => {
        const current = statsMap.get(r.picker_id) || { hearts: 0, poops: 0 };
        if (r.rating === 'heart') {
          current.hearts++;
        } else {
          current.poops++;
        }
        statsMap.set(r.picker_id, current);
      });

      // Convert to array with nicknames
      const stats: PickerStats[] = [];
      statsMap.forEach((value, pickerId) => {
        const player = players.find(p => p.user_id === pickerId);
        stats.push({
          picker_id: pickerId,
          nickname: player?.nickname || 'Unknown',
          hearts: value.hearts,
          poops: value.poops
        });
      });

      setPickerStats(stats);
    };

    fetchPickerStats();
  }, [room?.status, room?.id, players]);

  // Reset myRating when round changes
  useEffect(() => {
    if (currentRound?.status === 'ended' && userId) {
      // Check if I already rated this round
      const checkExistingRating = async () => {
        const { data } = await insforge.database
          .from('round_ratings')
          .select('rating')
          .eq('round_id', currentRound.id)
          .eq('voter_id', userId)
          .single();
        
        if (data) {
          setMyRating(data.rating as 'heart' | 'poop');
        } else {
          setMyRating(null);
        }
      };
      checkExistingRating();
    } else {
      setMyRating(null);
    }
  }, [currentRound?.id, currentRound?.status, userId]);

  const value: GameContextType = {
    isLoggedIn: isSignedIn || false,
    userId,
    room,
    players,
    currentRound,
    guesses,
    myPlayer,
    wordChoices,
    timeLeft,
    // Hint system
    hintTypes,
    hintOptions,
    currentHints,
    loading,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
    selectWord,
    submitGuess,
    nextRound,
    // Hint actions
    addHint,
    updateHint,
    getOptionsForType,
    // Rating actions
    rateRound,
    myRating,
    pickerStats,
    refreshData
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
