import React, { useState } from 'react';
import { PlayerAccount, HeroData } from '../types/clash';
import { 
  Crown, 
  ShieldAlert, 
  Sparkles, 
  Swords, 
  Zap, 
  BookOpen, 
  Hammer, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { formatDuration } from '../utils/gemCalculator';

interface HeroOptimizerProps {
  accounts: PlayerAccount[];
  selectedAccount: PlayerAccount;
  currentTime: number;
  onUpgradeHero: (accountId: string, heroName: string) => void;
  onFinishHeroUpgrade: (accountId: string, upgradeId: string) => void;
}

export const HeroOptimizer: React.FC<HeroOptimizerProps> = ({
  accounts,
  selectedAccount,
  currentTime,
  onUpgradeHero,
  onFinishHeroUpgrade
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'equipment' | 'efficiency'>('roster');

  const heroes = selectedAccount.heroes;
  const activeUpgradingHeroes = selectedAccount.upgrades.filter(u => u.category === 'hero');

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/coc_hero_hall_1792603420421.jpg"
            alt="Hero Hall"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Crown className="w-4 h-4" />
              <span>Hero Upgrade Efficiency Optimizer</span>
              <span aria-hidden="true">·</span>
              <span>Town Hall {selectedAccount.townHallLevel} Meta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              Prioritize Heroes for Peak Clan Efficiency
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed">
              Heroes dictate 60%+ of offensive 3-star capability. Plan upgrades with Book and Hammer ROI, 
              stagger downtime to avoid CWL dropouts, and maximize hero equipment synergies.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-stone-950/80 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'roster' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Hero Roster
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'equipment' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Equipment Matrix
            </button>
            <button
              onClick={() => setActiveTab('efficiency')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'efficiency' ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Downtime Strategy
            </button>
          </div>
        </div>

        {/* Hero Efficiency KPI Bar */}
        <div className="relative border-t border-stone-800/80 grid grid-cols-2 lg:grid-cols-4 bg-stone-900/60 backdrop-blur-sm divide-x divide-y lg:divide-y-0 divide-stone-800 text-xs">
          <div className="p-4">
            <div className="text-stone-400 font-medium">Currently Upgrading</div>
            <div className="text-base font-bold text-rose-400 tabular-nums">
              {activeUpgradingHeroes.length} <span className="text-xs text-stone-400">/ {heroes.length} heroes sleeping</span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-stone-400 font-medium">Top Priority Hero</div>
            <div className="text-base font-bold text-amber-300">
              Archer Queen <span className="text-xs text-stone-400">(98/100 ROI)</span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-stone-400 font-medium">Recommended Fast-Pass</div>
            <div className="text-base font-bold text-emerald-400">
              Book of Heroes <span className="text-xs text-stone-400">(500 Gems)</span>
            </div>
          </div>
          <div className="p-4">
            <div className="text-stone-400 font-medium">CWL War Readiness</div>
            <div className="text-base font-bold text-stone-100">
              {activeUpgradingHeroes.length > 1 ? (
                <span className="text-rose-400 font-bold">⚠️ High Attack Penalty</span>
              ) : (
                <span className="text-emerald-400 font-bold">Nominal (1 hero max)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero View Switch */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Hero Upgrade Hierarchy & Priority Scores</span>
            </h2>
            <span className="text-xs text-stone-400">
              Ranked by strategic impact on 3-star war rates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroes.map((hero) => {
              const activeUpg = selectedAccount.upgrades.find(
                u => u.category === 'hero' && u.targetName.toLowerCase().includes(hero.name.toLowerCase())
              );
              const remaining = activeUpg ? Math.max(0, Math.floor((activeUpg.endTime - currentTime) / 1000)) : 0;
              const isSleeping = activeUpg && remaining > 0;
              const progressPct = hero.maxLevel > 0 ? Math.round((hero.currentLevel / hero.maxLevel) * 100) : 100;

              return (
                <div
                  key={hero.id}
                  className={`bg-stone-900 border rounded-xl p-5 shadow-sm space-y-4 transition-all ${
                    isSleeping 
                      ? 'border-rose-500/50 bg-rose-950/10' 
                      : 'border-stone-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-amber-400 text-lg font-black shrink-0">
                        {hero.name === 'Barbarian King' ? '👑' :
                         hero.name === 'Archer Queen' ? '🏹' :
                         hero.name === 'Grand Warden' ? '🔮' :
                         hero.name === 'Royal Champion' ? '🛡️' : '🦇'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-stone-100 text-base">
                            {hero.name}
                          </h3>
                          <span className="text-xs font-bold text-amber-400 tabular-nums">
                            Lv {hero.currentLevel} / {hero.maxLevel}
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>Priority Index: {hero.priorityScore}/100</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-400 font-medium">{hero.recommendation}</span>
                        </div>
                      </div>
                    </div>

                    {isSleeping ? (
                      <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Asleep
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        Battle Ready
                      </span>
                    )}
                  </div>

                  {/* Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Max Cap Progress</span>
                      <span className="font-mono text-stone-200 tabular-nums">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Active Timer or Upgrade Cost */}
                  {isSleeping && activeUpg ? (
                    <div className="bg-stone-950/70 p-3 rounded-lg border border-rose-900/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-rose-400" />
                          <span>Upgrading to Level {activeUpg.targetLevel}</span>
                        </span>
                        <span className="font-mono font-bold text-amber-400 tabular-nums">
                          {formatDuration(remaining)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-stone-400 text-[11px]">
                          Clan War attacks impaired while asleep
                        </span>
                        <button
                          onClick={() => onFinishHeroUpgrade(selectedAccount.id, activeUpg.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded text-xs transition-colors"
                        >
                          Use Book of Heroes (Skip)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-stone-950/40 p-3 rounded-lg border border-stone-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="text-stone-300 font-medium">Next Upgrade Cost:</div>
                        <div className="text-amber-400 font-bold tabular-nums">
                          {hero.darkElixirCost > 0 
                            ? `${hero.darkElixirCost.toLocaleString()} Dark Elixir`
                            : '18,000,000 Elixir'}
                        </div>
                      </div>
                      <button
                        onClick={() => onUpgradeHero(selectedAccount.id, hero.name)}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold rounded-lg border border-stone-700 transition-colors"
                      >
                        Start Upgrade
                      </button>
                    </div>
                  )}

                  {/* Equipment Mini Badges */}
                  {hero.equipment && hero.equipment.length > 0 && (
                    <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-stone-500">Active Gear:</span>
                      {hero.equipment.filter(e => e.active).map(eq => (
                        <span
                          key={eq.id}
                          className={`px-2 py-0.5 rounded font-semibold border ${
                            eq.rarity === 'epic' 
                              ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' 
                              : 'bg-stone-800 border-stone-700 text-stone-200'
                          }`}
                        >
                          {eq.name} (Lv {eq.level})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Equipment Matrix View */}
      {activeTab === 'equipment' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Hero Equipment & Ores Efficiency Loadout</span>
            </h2>
            <span className="text-xs text-stone-400">
              Ores economy: Shiny, Glowy, and Starry Ores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {heroes.flatMap(h => h.equipment || []).map((eq) => (
              <div
                key={eq.id}
                className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200 text-sm">{eq.name}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    eq.rarity === 'epic' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' : 'bg-stone-800 text-stone-300'
                  }`}>
                    {eq.rarity}
                  </span>
                </div>
                <p className="text-xs text-stone-400">{eq.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-xs">
                  <span className="text-stone-400">Level {eq.level} / {eq.maxLevel}</span>
                  <span className={eq.active ? 'text-emerald-400 font-semibold' : 'text-stone-500'}>
                    {eq.active ? 'Equipped' : 'Stashed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Downtime Strategy View */}
      {activeTab === 'efficiency' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Optimal Hero Upgrade Strategy for Clan Wars</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <BookOpen className="w-4 h-4" />
                <span>The 500-Gem Rule</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Always save gems exclusively for the weekly Trader <strong className="text-stone-200">Book of Heroes</strong> (500 gems). 
                Skipping an 8-day Queen upgrade normally costs 1,123 gems direct, giving you a 225% value multiplier.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>CWL Stagger Protocol</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                During Clan War Leagues (first 7 days of month), keep all heroes awake. 
                Use Hammer of Heroes or Books to finish upgrades instantly so you never fight without your Grand Warden or Queen.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Builder Potion Sync</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Align 2 hero upgrades simultaneously with 4 defense upgrades before popping 3-5 Builder Potions. 
                This extracts 54+ builder hours per potion for maximum efficiency.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
