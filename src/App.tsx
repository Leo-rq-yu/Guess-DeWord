import { useState } from 'react';
import { useGame } from './context/GameContext';
import { NicknameModal } from './components/NicknameModal';
import { Lobby } from './components/Lobby';
import { GameRoom } from './components/GameRoom';
import './index.css';

type View = 'lobby' | 'room';

function GameApp() {
  const { nickname, setNickname, room } = useGame();
  const [view, setView] = useState<View>('lobby');

  // Show nickname modal if no nickname set
  if (!nickname) {
    return <NicknameModal onSubmit={setNickname} />;
  }

  // Show room if in one
  if (room || view === 'room') {
    return <GameRoom onLeave={() => setView('lobby')} />;
  }

  // Show lobby
  return <Lobby onJoinRoom={() => setView('room')} />;
}

function App() {
  return <GameApp />;
}

export default App;
