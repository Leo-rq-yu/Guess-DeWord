export interface Room {
  id: string;
  name: string;
  code: string;
  is_public: boolean;
  status: 'waiting' | 'playing' | 'finished';
  current_round: number;
  current_picker_order: number;
  max_players: number;
  created_by: string;
  created_at: string;
}

export interface Player {
  id: string;
  room_id: string;
  user_id: string;
  nickname: string;
  avatar?: string;
  is_ready: boolean;
  is_admin: boolean;
  score: number;
  player_order: number;
  joined_at: string;
}

export interface Word {
  id: string;
  word: string;
  category: string;
  length: number;
}

export interface Round {
  id: string;
  room_id: string;
  round_number: number;
  picker_id: string;
  word: string;
  category: string;
  word_length: number;
  status: 'selecting' | 'guessing' | 'ended';
  started_at: string | null;
  ended_at: string | null;
}

export interface Guess {
  id: string;
  round_id: string;
  user_id: string;
  nickname: string;
  guess: string;
  is_correct: boolean;
  points: number;
  guess_order: number | null;
  guessed_at: string;
}

// Hint system types
export interface HintType {
  id: string;
  name_zh: string;
  name_en: string;
  icon: string;
  sort_order: number;
}

export interface HintOption {
  id: string;
  type_id: string;
  value_zh: string;
  value_en: string;
  sort_order: number;
}

export interface RoundHint {
  id: string;
  round_id: string;
  hint_type_id: string;
  hint_option_id: string;
  slot_number: number; // 1-5
  created_at: string;
  updated_at: string;
  // Joined data
  hint_type?: HintType;
  hint_option?: HintOption;
}

export interface GameState {
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

// Word categories
export const WORD_CATEGORIES = [
  { id: 'food', zh: '食物', en: 'Food', icon: '🍜' },
  { id: 'animal', zh: '动物', en: 'Animal', icon: '🐾' },
  { id: 'plant', zh: '植物', en: 'Plant', icon: '🌿' },
  { id: 'place', zh: '地点', en: 'Place', icon: '📍' },
  { id: 'object', zh: '物品', en: 'Object', icon: '📦' },
  { id: 'activity', zh: '活动', en: 'Activity', icon: '⚽' },
  { id: 'culture', zh: '文化', en: 'Culture', icon: '🎭' },
  { id: 'nature', zh: '自然', en: 'Nature', icon: '🌈' },
  { id: 'vehicle', zh: '交通', en: 'Vehicle', icon: '🚗' },
] as const;

// Points for correct guesses (1st = 100, 2nd = 80, etc.)
export const POINTS_PER_RANK = [100, 80, 60, 40, 20];
export const ROUND_DURATION = 120; // seconds
export const MAX_HINTS = 5; // Maximum hints per round

