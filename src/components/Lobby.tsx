import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useRealtime } from '../hooks/useRealtime';
import { insforge } from '../lib/insforge';
import { LanguageSwitcher } from './LanguageSwitcher';
import { UserMenu } from './UserMenu';
import { Plus, Users, Lock, Globe, ArrowRight, Hash, RefreshCw, Wifi } from 'lucide-react';
import type { Room } from '../types/game';

interface LobbyProps {
  onJoinRoom: () => void;
}

const AVATARS = ['🐱', '🐶', '🐼', '🦊', '🐰', '🐻', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸'];

export function Lobby({ onJoinRoom }: LobbyProps) {
  const { t } = useLanguage();
  const { createRoom, joinRoom, loading, isLoggedIn } = useGame();
  const [publicRooms, setPublicRooms] = useState<(Room & { player_count?: number })[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Nickname state for joining rooms
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  // Real-time handlers for lobby channel
  const lobbyHandlers = {
    // New room created
    INSERT_room: (msg: { payload?: Room } & Partial<Room>) => {
      const payload = msg.payload || msg;
      console.log('[Lobby] New room:', payload);
      setPublicRooms(prev => {
        // Avoid duplicates
        if (prev.some(r => r.id === payload.id)) return prev;
        return [{ 
          ...payload, 
          player_count: (payload as Room & { player_count?: number }).player_count || 1 
        } as Room & { player_count?: number }, ...prev];
      });
    },
    // Room updated (status change, etc)
    UPDATE_room: (msg: { payload?: Partial<Room> } & Partial<Room>) => {
      const payload = msg.payload || msg;
      console.log('[Lobby] Room updated:', payload);
      setPublicRooms(prev => 
        prev
          .map(r => r.id === payload.id ? { ...r, ...payload } : r)
          .filter(r => r.status === 'waiting') // Remove non-waiting rooms
      );
    },
    // Room player count changed
    room_player_count: (msg: { payload?: { room_id: string; player_count: number } } & { room_id?: string; player_count?: number }) => {
      const payload = msg.payload || msg;
      console.log('[Lobby] Player count:', payload);
      setPublicRooms(prev =>
        prev.map(r => r.id === payload.room_id 
          ? { ...r, player_count: payload.player_count } 
          : r
        )
      );
    }
  };

  // Subscribe to lobby channel for real-time updates (only when logged in)
  const { isConnected } = useRealtime(isLoggedIn ? 'lobby' : null, lobbyHandlers);

  // Initial fetch of public rooms (only when logged in)
  const fetchRooms = useCallback(async () => {
    if (!isLoggedIn) return;
    
    setRefreshing(true);
    try {
      const { data } = await insforge.database
        .from('rooms')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'waiting')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        // Fetch player counts separately
        const roomsWithCount = await Promise.all(
          data.map(async (room: Room) => {
            const { data: players } = await insforge.database
              .from('room_players')
              .select('id')
              .eq('room_id', room.id);
            return {
              ...room,
              player_count: players?.length || 0
            };
          })
        );
        setPublicRooms(roomsWithCount);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
    setRefreshing(false);
  }, [isLoggedIn]);

  // Fetch rooms on mount when logged in
  useEffect(() => {
    const loadRooms = async () => {
      if (isLoggedIn) {
        await fetchRooms();
      } else {
        setPublicRooms([]); // Clear rooms when logged out
      }
    };
    loadRooms();
  }, [isLoggedIn, fetchRooms]);

  const handleCreate = async () => {
    if (!newRoomName.trim() || !nickname.trim()) return;
    const fullNickname = `${selectedAvatar} ${nickname.trim()}`;
    const room = await createRoom(newRoomName.trim(), isPublic, fullNickname);
    if (room) {
      setShowCreateModal(false);
      setNewRoomName('');
      setNickname('');
      onJoinRoom();
    }
  };

  const handleJoin = async (code?: string) => {
    const targetCode = code || joinCode;
    if (!targetCode.trim() || !nickname.trim()) return;
    const fullNickname = `${selectedAvatar} ${nickname.trim()}`;
    const success = await joinRoom(targetCode.trim(), fullNickname);
    if (success) {
      setShowJoinModal(false);
      setJoinCode('');
      setNickname('');
      onJoinRoom();
    }
  };

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
          <LanguageSwitcher />
          <UserMenu />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-4">
            {t('appName')}
          </h1>
          <p className="text-slate-400 text-lg">{t('welcome')}！</p>
          {!isLoggedIn && (
            <p className="text-amber-400/70 text-sm mt-2">{t('loginToSaveScore')}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group p-6 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-2xl hover:border-cyan-400/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl group-hover:bg-cyan-500/30 transition-colors">
                <Plus className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">{t('createRoom')}</h3>
                <p className="text-sm text-slate-400">{t('createNewRoom')}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="group p-6 bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-2xl hover:border-pink-400/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/20 rounded-xl group-hover:bg-pink-500/30 transition-colors">
                <Hash className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white">{t('enterRoomCode')}</h3>
                <p className="text-sm text-slate-400">{t('joinByCode')}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Public rooms list */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">{t('publicRooms')}</h2>
              {/* Real-time connection indicator - only show when logged in */}
              {isLoggedIn && (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                  isConnected 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  <Wifi className="w-3 h-3" />
                  {isConnected ? 'Live' : t('connecting')}
                </div>
              )}
            </div>
            {isLoggedIn && (
              <button
                onClick={fetchRooms}
                disabled={refreshing}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-700/50">
            {!isLoggedIn ? (
              // Show login prompt for anonymous users
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔐</div>
                <p className="text-slate-300 font-medium mb-2">{t('loginToSeeLobby')}</p>
                <p className="text-slate-500 text-sm">{t('loginToSeeLobbyHint')}</p>
              </div>
            ) : publicRooms.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-slate-400">{t('noPublicRooms')}</p>
                <p className="text-slate-500 text-sm mt-1">{t('createRoomHint')}</p>
              </div>
            ) : (
              publicRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 hover:bg-slate-700/30 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-2xl">
                        🎯
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{room.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {room.player_count || 0}/{room.max_players}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="font-mono text-cyan-400">{room.code}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoin(room.code)}
                      disabled={loading || (room.player_count || 0) >= room.max_players}
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group-hover:bg-cyan-500/30"
                    >
                      {t('join')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">{t('createRoom')}</h2>
            
            <div className="space-y-4">
              {/* Avatar selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('selectAvatar')}</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all ${
                        selectedAvatar === avatar 
                          ? 'bg-cyan-500/30 ring-2 ring-cyan-500 scale-110' 
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nickname input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('nickname')}</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('enterNickname')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={12}
                  autoFocus
                />
              </div>

              {/* Room name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('roomName')}</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder={t('enterRoomName')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  maxLength={20}
                />
              </div>

              {/* Room type */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">{t('roomType')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      isPublic 
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                        : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Globe className="w-6 h-6" />
                    <span className="font-medium">{t('public')}</span>
                    <span className="text-xs opacity-70">{t('visibleInLobby')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      !isPublic 
                        ? 'bg-pink-500/20 border-pink-500 text-pink-400' 
                        : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Lock className="w-6 h-6" />
                    <span className="font-medium">{t('private')}</span>
                    <span className="text-xs opacity-70">{t('inviteOnly')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowCreateModal(false); setNickname(''); setNewRoomName(''); }}
                className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={!newRoomName.trim() || !nickname.trim() || loading}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {t('create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">{t('enterRoomCode')}</h2>
            
            <div className="space-y-4">
              {/* Avatar selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('selectAvatar')}</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all ${
                        selectedAvatar === avatar 
                          ? 'bg-pink-500/30 ring-2 ring-pink-500 scale-110' 
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nickname input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('nickname')}</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('enterNickname')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  maxLength={12}
                  autoFocus
                />
              </div>

              {/* Room code */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t('roomCode')}</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder={t('enter6DigitCode')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white text-center text-2xl tracking-widest font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowJoinModal(false); setNickname(''); setJoinCode(''); }}
                className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleJoin()}
                disabled={joinCode.length !== 6 || !nickname.trim() || loading}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all disabled:opacity-50"
              >
                {t('join')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
