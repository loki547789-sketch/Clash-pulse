import React, { useState } from 'react';
import { PlayerAccount, ClanGameChallenge } from '../types/clash';
import { 
  Trophy, 
  Gift, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  Percent, 
  Coins, 
  Plus, 
  ShieldCheck,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventsTrackerProps {
  accounts: PlayerAccount[];
  selectedAccount: PlayerAccount;
  onUpdateClanGamesPoints: (accountId: string, points: number) => void;
}

const DEFAULT_CHALLENGES: ClanGameChallenge[] = [
  { id: 'cg-1', title: 'Destroy 5 Eagle Artilleries in Multiplayer', points: 600, durationMinutes: 60, progress: 3, goal: 5, unit: 'artilleries', completed: false },
  { id: 'cg-2', title: 'Earn 6 Stars against Town Hall 16 or 17', points: 800, durationMinutes: 120, progress: 6, goal: 6, unit: 'stars', completed: true },
  { id: 'cg-3', title: 'Collect 1,500,000 Elixir from Battles', points: 400, durationMinutes: 45, progress: 950000, goal: 1500000, unit: 'elixir', completed: false },
  { id: 'cg-4', title: 'Win 3 Battles using 4 Root Riders', points: 500, durationMinutes: 90, progress: 2, goal: 3, unit: 'wins', completed: false },
  { id: 'cg-5', title: 'Destroy 250 Walls with Super Wall Breakers', points: 400, durationMinutes: 60, progress: 180, goal: 250, unit: 'walls', completed: false },
  { id: 'cg-6', title: 'Loot 25,000 Dark Elixir in Titan League', points: 1000, durationMinutes: 180, progress: 25000, goal: 25000, unit: 'DE', completed: true }
];

const CLAN_GAMES_TIERS = [
  { tier: 1, points: 3000, rewards: '20 Gems, 1 Resource Potion, 1 Clock Tower Potion' },
  { tier: 2, points: 7500, rewards: '1 Power Potion, 1 Training Potion, 50,000 Dark Elixir' },
  { tier: 3, points: 12000, rewards: '40 Gems, 2 Research Potions, 1 Shovel of Obstacles' },
  { tier: 4, points: 18000, rewards: '1 Super Potion, 1 Builder Potion, 2,500,000 Gold' },
  { tier: 5, points: 30000, rewards: '2 Builder Potions, 1 Rune of Builder Gold, 60 Gems' },
  { tier: 6, points: 50000, rewards: '1 Book of Heroes / Building, 1 Rune of Dark Elixir, 100 Gems' }
];

export const EventsTracker: React.FC<EventsTrackerProps> = ({
  accounts,
  selectedAccount,
  onUpdateClanGamesPoints
}) => {
  const [challenges, setChallenges] = useState<ClanGameChallenge[]>(DEFAULT_CHALLENGES);

  // Total clan games score across clan (approx)
  const totalClanScore = accounts.reduce((sum, a) => sum + a.clanGamesPoints, 38500);

  const handleCompleteChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === challengeId) {
        if (!ch.completed) {
          const newPoints = Math.min(4000, selectedAccount.clanGamesPoints + ch.points);
          onUpdateClanGamesPoints(selectedAccount.id, newPoints);
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
          } catch {}
          return { ...ch, completed: true, progress: ch.goal };
        }
      }
      return ch;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-stone-100">
              Clan Games & Season Pass Reward Radar
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Track individual 4,000 cap points across all your accounts and verify tier unlocks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800 text-stone-300">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Clan Games Ends in: <strong className="text-amber-400">3d 14h</strong></span>
        </div>
      </div>

      {/* Clan Games Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span>Clan Games Milestone Progression ({totalClanScore.toLocaleString()} / 50,000 Pts)</span>
            </h3>
            <div className="text-xs text-stone-400">
              Tier 6 unlocks the coveted Book of Building & Rune of Dark Elixir
            </div>
          </div>

          <div className="text-xs bg-purple-950/40 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-lg font-bold">
            {totalClanScore >= 50000 ? '🎉 All 6 Tiers Unlocked!' : 'Tier 5 Active · 1,500 Pts to Tier 6'}
          </div>
        </div>

        {/* Tier Milestones Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {CLAN_GAMES_TIERS.map((tier) => {
            const isReached = totalClanScore >= tier.points;
            return (
              <div
                key={tier.tier}
                className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                  isReached
                    ? 'bg-amber-950/20 border-amber-500/40 text-stone-200'
                    : 'bg-stone-950/60 border-stone-800/80 text-stone-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Tier {tier.tier}</span>
                  {isReached && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="font-mono text-[11px] tabular-nums font-semibold">
                  {tier.points.toLocaleString()} pts
                </div>
                <p className="text-[11px] text-stone-400 leading-tight">
                  {tier.rewards}
                </p>
              </div>
            );
          })}
        </div>

        {/* Multi-Account Personal Cap Tracker */}
        <div className="border-t border-stone-800 pt-5 space-y-3">
          <h4 className="text-sm font-bold text-stone-200 flex items-center justify-between">
            <span>Multi-Account Personal 4,000 Point Progress</span>
            <span className="text-xs text-stone-400 font-normal">
              Reach 4,000 pts on an account to pick an EXTRA tier reward!
            </span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {accounts.map((acc) => {
              const isCapped = acc.clanGamesPoints >= 4000;
              const pct = Math.min(100, Math.floor((acc.clanGamesPoints / 4000) * 100));
              return (
                <div
                  key={acc.id}
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    isCapped 
                      ? 'bg-emerald-950/20 border-emerald-500/40' 
                      : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-200">{acc.name}</span>
                    <span className={`font-mono font-bold tabular-nums ${isCapped ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {acc.clanGamesPoints} / 4000 pts
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                    <div
                      className={`h-full ${isCapped ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{isCapped ? '✅ Bonus Reward Earned' : `${4000 - acc.clanGamesPoints} pts to cap`}</span>
                    {!isCapped && (
                      <button
                        onClick={() => onUpdateClanGamesPoints(acc.id, Math.min(4000, acc.clanGamesPoints + 500))}
                        className="text-amber-400 hover:underline font-semibold"
                      >
                        +500 Pts
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Challenges List */}
        <div className="border-t border-stone-800 pt-5 space-y-3">
          <h4 className="text-sm font-bold text-stone-200">
            Active Challenges ({selectedAccount.name})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-stone-950 border border-stone-800 rounded-xl p-3.5 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-stone-200">{ch.title}</div>
                  <div className="text-stone-400 flex items-center gap-2 text-[11px]">
                    <span className="text-amber-400 font-bold">+{ch.points} Points</span>
                    <span aria-hidden="true">·</span>
                    <span>Progress: {ch.progress} / {ch.goal} {ch.unit}</span>
                  </div>
                </div>

                <div>
                  {ch.completed ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteChallenge(ch.id)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-colors shadow"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gold Pass & Season Bank Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100">
              Gold Pass Perks & Season Bank Storage
            </h3>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Season Ends in: <strong className="text-stone-200">9 Days</strong>
          </span>
        </div>

        {/* 4 Active Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-stone-950 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-200">20% Builder Boost</div>
              <div className="text-stone-400 text-[11px]">Cuts 2.8 days off 14d timers</div>
            </div>
          </div>

          <div className="bg-stone-950 border border-purple-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-200">20% Research Boost</div>
              <div className="text-stone-400 text-[11px]">Speeds up Laboratory</div>
            </div>
          </div>

          <div className="bg-stone-950 border border-cyan-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-200">1-Gem Donations</div>
              <div className="text-stone-400 text-[11px]">Donate max troops for 1 gem</div>
            </div>
          </div>

          <div className="bg-stone-950 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-200">Auto-Forge Boost</div>
              <div className="text-stone-400 text-[11px]">+50% Capital Gold rate</div>
            </div>
          </div>
        </div>

        {/* Season Bank Overflow Capacity */}
        <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-200">
              Season Bank Payout ({selectedAccount.name})
            </span>
            <span className="text-emerald-400 font-bold">
              Full Capacity Reached (Paid out at season reset)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Gold Bank</span>
                <span className="text-amber-400 font-bold tabular-nums">30,000,000 / 30M</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                <div className="h-full bg-amber-500 w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Elixir Bank</span>
                <span className="text-purple-400 font-bold tabular-nums">30,000,000 / 30M</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                <div className="h-full bg-purple-500 w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-stone-400">
                <span>Dark Elixir Bank</span>
                <span className="text-rose-400 font-bold tabular-nums">350,000 / 350k</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-900 overflow-hidden">
                <div className="h-full bg-rose-500 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
