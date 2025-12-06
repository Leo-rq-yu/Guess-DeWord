import { useState } from 'react';
import { 
  SignInButton, 
  SignUpButton, 
  SignedIn, 
  SignedOut, 
  UserButton,
  useUser 
} from '@insforge/react';
import { insforge } from '../lib/insforge';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Gamepad2 } from 'lucide-react';

export function UserMenu() {
  const { t } = useLanguage();
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<{ totalScore: number; gamesPlayed: number } | null>(null);

  // Fetch user stats when user is available
  const fetchStats = async () => {
    if (user?.id) {
      const { data } = await insforge.database
        .from('users')
        .select('total_score, games_played')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setStats({
          totalScore: data.total_score || 0,
          gamesPlayed: data.games_played || 0
        });
      }
    }
  };

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Show when signed out */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
            {t('login')}
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors">
            {t('register')}
          </button>
        </SignUpButton>
      </SignedOut>

      {/* Show when signed in */}
      <SignedIn>
        {/* Stats display */}
        {stats && (
          <div className="hidden sm:flex items-center gap-4 mr-2">
            <div className="flex items-center gap-1 text-amber-400">
              <Trophy className="w-4 h-4" />
              <span className="font-mono text-sm">{stats.totalScore}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400">
              <Gamepad2 className="w-4 h-4" />
              <span className="font-mono text-sm">{stats.gamesPlayed}</span>
            </div>
          </div>
        )}
        
        {/* UserButton with custom styling */}
        <div onMouseEnter={fetchStats}>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
                userButtonPopoverCard: "bg-slate-800 border-slate-700",
                userButtonPopoverActions: "bg-slate-800",
                userButtonPopoverActionButton: "hover:bg-slate-700",
                userButtonPopoverFooter: "hidden"
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}
