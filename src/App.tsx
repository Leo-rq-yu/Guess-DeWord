import { useState } from 'react';
import { useGame } from './context/GameContext';
import { Lobby } from './components/Lobby';
import { GameRoom } from './components/GameRoom';
import { HowToPlay } from './components/HowToPlay';
import './index.css';

type View = 'lobby' | 'room' | 'howtoplay';

function GameApp() {
  const { room } = useGame();
  const [view, setView] = useState<View>('lobby');

  // Show room if in one
  if (room || view === 'room') {
    return <GameRoom onLeave={() => setView('lobby')} />;
  }

  // Show how to play
  if (view === 'howtoplay') {
    return <HowToPlay onBack={() => setView('lobby')} />;
  }

  // Show lobby
  return (
    <Lobby 
      onJoinRoom={() => setView('room')} 
      onHowToPlay={() => setView('howtoplay')}
    />
  );
}

function App() {
  return <GameApp />;
}

export default App;
