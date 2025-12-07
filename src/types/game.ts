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
  is_online: boolean;
  last_seen: string;
}

export interface Word {
  id: string;
  word: string;       // Chinese word
  word_en: string;    // English word
  category: string;   // Chinese category
  category_en: string; // English category
  length: number;
}

export interface Round {
  id: string;
  room_id: string;
  round_number: number;
  picker_id: string;
  word: string;           // Chinese word
  word_en: string;        // English word
  category: string;       // Chinese category
  category_en: string;    // English category
  word_length: number;    // Length in Chinese characters
  word_length_en: number; // Length in English (letter count or word count)
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

export interface RoundRating {
  id: string;
  round_id: string;
  picker_id: string;
  voter_id: string;
  rating: 'heart' | 'poop';
  created_at: string;
}

export interface PickerStats {
  picker_id: string;
  nickname: string;
  hearts: number;
  poops: number;
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
  { id: 'food', zh: '美食', en: 'Food', icon: '🍜' },
  { id: 'fruit', zh: '水果', en: 'Fruit', icon: '🍎' },
  { id: 'animal', zh: '动物', en: 'Animal', icon: '🐾' },
  { id: 'sports', zh: '体育运动', en: 'Sports', icon: '⚽' },
  { id: 'leisure', zh: '休闲活动', en: 'Leisure', icon: '🎣' },
  { id: 'nature', zh: '自然现象', en: 'Nature', icon: '🌈' },
  { id: 'landscape', zh: '自然景观', en: 'Landscape', icon: '🏔️' },
  { id: 'landmark', zh: '名胜古迹', en: 'Landmark', icon: '🏛️' },
  { id: 'building', zh: '建筑场所', en: 'Building', icon: '🏢' },
  { id: 'object', zh: '日常物品', en: 'Object', icon: '📦' },
  { id: 'vehicle', zh: '交通工具', en: 'Vehicle', icon: '🚗' },
] as const;

// Points for correct guesses (1st = 100, 2nd = 80, etc.)
export const POINTS_PER_RANK = [100, 80, 60, 40, 20];
export const ROUND_DURATION = 120; // seconds
export const MAX_HINTS = 5; // Maximum hints per round

