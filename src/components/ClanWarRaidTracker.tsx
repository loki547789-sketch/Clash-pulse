import React, { useState } from 'react';
import { ClanWarData, ClanCapitalData } from '../types/clash';
import { 
  Swords, 
  Shield, 
  Flame, 
  Coins, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Crosshair,
  Award,
  AlertTriangle,
  Play
} from 'lucide-react';
import { formatDuration } from '../utils/gemCalculator';

interface ClanWarRaidTrackerProps {
  warData: ClanWarData;
  capitalData: ClanCapitalData;
  currentTime: number;
  onSimulateWarAttack: () => void;
}

export const ClanWarRaidTracker: React.FC<ClanWarRaidTrackerProps> = ({
  warData,
  capitalData,
  currentTime,
  onSimulateWarAttack
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'war' | 'capital'>('war');
  const [attackFilter, setAttackFilter] = useState<'all' | 'clan' | 'opponent'>('all');

  const warRemainingSeconds = Math.max(0, Math.floor((warData.endTime - currentTime) / 1000));
  const isWinning = warData.clan.stars > warData.opponent.stars || 
    (warData.clan.stars === warData.opponent.stars && warData.clan.destructionPercentage > warData.opponent.destructionPercentage);

  const filteredAttacks = warData.attacks.filter(a => {
    if (attackFilter === 'clan') return a.isClanAttack;
    if (attackFilter === 'opponent') return !a.isClanAttack;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* War Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/coc_war_arena_1792603422301.jpg"
            alt="Clan War Arena"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Swords className="w-4 h-4" />
              <span>Real-Time War & Capital Command</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-bold">
                {isWinning ? 'Victory Pace (+5 Stars)' : 'Tied / Trailing'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              Clan War & Capital Raid Telemetry
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed">
              Track live war destruction, star margins, remaining attacks, and receive instant 
              alert notifications when teammates or enemy rivals complete key attacks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onSimulateWarAttack}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md transition-all whitespace-nowrap"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Simulate Live War Attack Alert</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative border-t border-stone-800/80 px-6 py-2.5 bg-stone-900/60 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveSubTab('war')}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                activeSubTab === 'war' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Clan War Scoreboard
            </button>
            <button
              onClick={() => setActiveSubTab('capital')}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                activeSubTab === 'capital' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Capital Raid Weekend
            </button>
          </div>

          <div className="text-xs text-stone-400 font-mono">
            War Ends in: <span className="text-amber-400 font-bold tabular-nums">{formatDuration(warRemainingSeconds)}</span>
          </div>
        </div>
      </div>

      {activeSubTab === 'war' && (
        <div className="space-y-6">
          {/* Main War Matchup Scoreboard */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Home Clan */}
              <div className="text-center md:text-left space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-100 text-lg">
                      {warData.clan.name}
                    </h3>
                    <div className="text-xs text-stone-400">{warData.clan.tag} · Level 24</div>
                  </div>
                </div>

                <div className="text-4xl font-black text-amber-400 font-mono tabular-nums">
                  {warData.clan.stars} <span className="text-sm font-sans text-stone-400">★</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Destruction</span>
                    <span className="font-bold text-stone-200 tabular-nums">
                      {warData.clan.destructionPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${warData.clan.destructionPercentage}%` }} 
                    />
                  </div>
                  <div className="text-stone-400 pt-0.5">
                    Attacks Used: <span className="text-stone-200 font-bold tabular-nums">{warData.clan.attacks} / {warData.clan.maxAttacks}</span>
                  </div>
                </div>
              </div>

              {/* VS Center Pillar */}
              <div className="flex flex-col items-center justify-center space-y-2 py-4 border-y md:border-y-0 md:border-x border-stone-800">
                <span className="text-xs font-bold text-stone-500 tracking-wider">30 vs 30 WAR</span>
                <div className="text-2xl font-black text-stone-300">VS</div>
                <div className="text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30 tabular-nums">
                  {formatDuration(warRemainingSeconds)} Left
                </div>
                <span className="text-[11px] text-stone-400">
                  {warData.clan.maxAttacks - warData.clan.attacks} attacks remaining for victory
                </span>
              </div>

              {/* Opponent Clan */}
              <div className="text-center md:text-right space-y-2">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <div>
                    <h3 className="font-extrabold text-stone-100 text-lg">
                      {warData.opponent.name}
                    </h3>
                    <div className="text-xs text-stone-400">{warData.opponent.tag} · Rival</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold">
                    ⚔️
                  </div>
                </div>

                <div className="text-4xl font-black text-stone-300 font-mono tabular-nums">
                  {warData.opponent.stars} <span className="text-sm font-sans text-stone-400">★</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>Destruction</span>
                    <span className="font-bold text-stone-200 tabular-nums">
                      {warData.opponent.destructionPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${warData.opponent.destructionPercentage}%` }} 
                    />
                  </div>
                  <div className="text-stone-400 pt-0.5">
                    Attacks Used: <span className="text-stone-200 font-bold tabular-nums">{warData.opponent.attacks} / {warData.opponent.maxAttacks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Attack Feed */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Live Battle Log & Push Event Ticker</span>
              </h3>

              <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
                <button
                  onClick={() => setAttackFilter('all')}
                  className={`px-3 py-1 rounded font-medium ${attackFilter === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  All ({warData.attacks.length})
                </button>
                <button
                  onClick={() => setAttackFilter('clan')}
                  className={`px-3 py-1 rounded font-medium ${attackFilter === 'clan' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  Our Clan
                </button>
                <button
                  onClick={() => setAttackFilter('opponent')}
                  className={`px-3 py-1 rounded font-medium ${attackFilter === 'opponent' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
                >
                  Enemy Attacks
                </button>
              </div>
            </div>

            <div className="divide-y divide-stone-800/80">
              {filteredAttacks.map((atk) => (
                <div
                  key={atk.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${
                      atk.isClanAttack 
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' 
                        : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                    }`}>
                      {atk.isClanAttack ? 'DEF' : 'ATK'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-100 text-sm">{atk.attackerName}</span>
                        <span className="text-xs text-stone-400">attacked</span>
                        <span className="font-bold text-stone-300 text-sm">{atk.defenderName}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Army: {atk.armyUsed}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto">
                    <div className="text-amber-400 font-bold flex items-center gap-0.5">
                      {'★'.repeat(atk.stars)}
                      <span className="text-stone-600">{'☆'.repeat(3 - atk.stars)}</span>
                    </div>
                    <span className="text-stone-300 font-bold tabular-nums">
                      {atk.destructionPercentage}%
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {Math.floor((currentTime - atk.timestamp) / 60000)}m ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'capital' && (
        <div className="space-y-6">
          {/* Capital Raid Summary Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-stone-800 text-xs">
              <div className="p-2 space-y-1">
                <div className="text-stone-400">Capital Hall Level</div>
                <div className="text-xl font-bold text-amber-400 tabular-nums">
                  Level {capitalData.capitalHallLevel}
                </div>
                <div className="text-stone-500">Max Defense & Troops</div>
              </div>

              <div className="p-2 md:pl-6 space-y-1">
                <div className="text-stone-400">Capital Gold Looted</div>
                <div className="text-xl font-bold text-stone-100 tabular-nums flex items-center gap-1.5">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>{capitalData.totalLoot.toLocaleString()}</span>
                </div>
                <div className="text-stone-500">Across all weekend raids</div>
              </div>

              <div className="p-2 md:pl-6 space-y-1">
                <div className="text-stone-400">Raid Attacks Used</div>
                <div className="text-xl font-bold text-stone-100 tabular-nums">
                  {capitalData.totalAttacks} <span className="text-xs text-stone-400">/ {capitalData.maxAttacks}</span>
                </div>
                <div className="text-stone-500">6 attacks per member cap</div>
              </div>

              <div className="p-2 md:pl-6 space-y-1">
                <div className="text-stone-400">Estimated Raid Medals</div>
                <div className="text-xl font-bold text-purple-400 tabular-nums flex items-center gap-1.5">
                  <Award className="w-5 h-5" />
                  <span>~{capitalData.estimatedRaidMedals} Medals</span>
                </div>
                <div className="text-stone-500">Buy 3 Research Potions / Pet Potions</div>
              </div>
            </div>
          </div>

          {/* District Conquest Grid */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <span>Capital Districts Status (Enemy Clan Village)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {capitalData.districts.map((district) => (
                <div
                  key={district.id}
                  className={`bg-stone-950 border rounded-xl p-4 space-y-3 ${
                    district.status === 'cleared'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : district.status === 'under_attack'
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 text-sm">{district.name}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      district.status === 'cleared'
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : district.status === 'under_attack'
                        ? 'bg-amber-900/60 text-amber-300'
                        : 'bg-stone-800 text-stone-400'
                    }`}>
                      {district.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Destruction</span>
                      <span className="font-bold text-stone-200 tabular-nums">{district.destruction}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                      <div
                        className={`h-full ${district.status === 'cleared' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${district.destruction}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                    <span>Loot: {district.capitalGoldLooted.toLocaleString()}</span>
                    <span className="text-amber-400 font-bold">
                      {'★'.repeat(district.stars)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
