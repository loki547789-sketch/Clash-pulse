import React, { useState } from 'react';
import { PlayerAccount, UpgradeItem } from '../types/clash';
import { 
  Hammer, 
  Crown, 
  FlaskConical, 
  Sparkles, 
  Swords, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  Gem,
  AlertTriangle
} from 'lucide-react';
import { formatDuration, calculateGemsForTime } from '../utils/gemCalculator';
import { BuilderTimelineChart } from './BuilderTimelineChart';

interface MultiAccountDashboardProps {
  accounts: PlayerAccount[];
  currentTime: number;
  onSelectAccount: (id: string) => void;
  onFinishUpgradeNow: (accountId: string, upgradeId: string) => void;
  onSpeedUpUpgrade: (accountId: string, upgradeId: string, seconds: number) => void;
  onApplyBuilderPotion: (accountId?: string) => void;
}

export const MultiAccountDashboard: React.FC<MultiAccountDashboardProps> = ({
  accounts,
  currentTime,
  onSelectAccount,
  onFinishUpgradeNow,
  onSpeedUpUpgrade,
  onApplyBuilderPotion
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  // Flatten all active upgrades with account metadata
  const allUpgrades: { upgrade: UpgradeItem; account: PlayerAccount; remainingSeconds: number }[] = [];

  accounts.forEach((acc) => {
    acc.upgrades.forEach((upg) => {
      const remainingSeconds = Math.max(0, Math.floor((upg.endTime - currentTime) / 1000));
      allUpgrades.push({
        upgrade: upg,
        account: acc,
        remainingSeconds
      });
    });
  });

  // Sort by time remaining ascending (soonest first)
  allUpgrades.sort((a, b) => a.remainingSeconds - b.remainingSeconds);

  // Apply filters
  const filteredUpgrades = allUpgrades.filter(({ upgrade, account }) => {
    if (filterAccount !== 'all' && account.id !== filterAccount) return false;
    if (filterCategory === 'all') return true;
    if (filterCategory === 'hero') return upgrade.category === 'hero' || upgrade.isPriorityHero;
    if (filterCategory === 'builder') return upgrade.category === 'builder';
    if (filterCategory === 'lab') return upgrade.category === 'lab';
    if (filterCategory === 'pet') return upgrade.category === 'pet';
    return true;
  });

  const totalBuilders = accounts.reduce((acc, a) => acc + a.homeBuildersTotal, 0);
  const totalBusy = accounts.reduce((acc, a) => acc + a.homeBuildersBusy, 0);
  const totalIdle = totalBuilders - totalBusy;
  const activeHeroUpgrades = allUpgrades.filter((u) => u.upgrade.category === 'hero' && u.remainingSeconds > 0).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner Section */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/coc_village_citadel_1792603418986.jpg"
            alt="Clash Fortress Village"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>Multi-Account Command Center</span>
              <span aria-hidden="true">·</span>
              <span>{accounts.length} Village Accounts Synced</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-100 tracking-tight">
              Real-Time Builder & Upgrade Engine
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed">
              Monitor active construction timers across all accounts, streamline Hero downtime, 
              and trigger instant alert dispatches the second any builder frees up.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onApplyBuilderPotion()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-md transition-all whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              <span>Empire Builder Boost (-9h All)</span>
            </button>
          </div>
        </div>

        {/* 4-Metric Grid Strip */}
        <div className="relative border-t border-stone-800/80 grid grid-cols-2 lg:grid-cols-4 bg-stone-900/60 backdrop-blur-sm divide-x divide-y lg:divide-y-0 divide-stone-800 text-xs">
          <div className="p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Hammer className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-stone-400 font-medium">Builders in Action</div>
              <div className="text-base font-bold text-stone-100 tabular-nums">
                {totalBusy} <span className="text-xs text-stone-400 font-normal">/ {totalBuilders} busy</span>
                {totalIdle > 0 && (
                  <span className="ml-2 text-rose-400 font-medium text-xs">({totalIdle} idle!)</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="text-stone-400 font-medium">Heroes Sleeping</div>
              <div className="text-base font-bold text-stone-100 tabular-nums">
                {activeHeroUpgrades} <span className="text-xs text-stone-400 font-normal">in upgrade</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-stone-400 font-medium">Earliest Completion</div>
              <div className="text-base font-bold text-amber-300 font-mono tabular-nums">
                {allUpgrades.length > 0 ? formatDuration(allUpgrades[0].remainingSeconds) : 'None'}
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Swords className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-stone-400 font-medium">Active Clan War</div>
              <div className="text-base font-bold text-stone-100 tabular-nums">
                76 <span className="text-xs text-stone-400">vs 71 ★ (6h left)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Chart: 7-Day Builder Availability Blocks */}
      <BuilderTimelineChart
        accounts={accounts}
        currentTime={currentTime}
        onSelectAccount={onSelectAccount}
      />

      {/* Unified Upgrades Queue Panel */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Unified Empire Construction Timers</span>
            </h2>
            <div className="text-xs text-stone-400 mt-0.5">
              Live sorted by completion time · Updates every second
            </div>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              {[
                { id: 'all', label: 'All Upgrades' },
                { id: 'hero', label: 'Heroes Only' },
                { id: 'builder', label: 'Defenses/Huts' },
                { id: 'lab', label: 'Lab' },
                { id: 'pet', label: 'Pets' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                    filterCategory === tab.id
                      ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Account Filter */}
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Accounts ({accounts.length})</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.tag})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upgrades Table / List */}
        <div className="divide-y divide-stone-800/80">
          {filteredUpgrades.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-sm">
              No matching active upgrades found for selected filters.
            </div>
          ) : (
            filteredUpgrades.map(({ upgrade, account, remainingSeconds }) => {
              const isFinished = remainingSeconds <= 0;
              const percent = upgrade.totalDurationSeconds > 0
                ? Math.min(100, Math.max(0, Math.floor(((upgrade.totalDurationSeconds - remainingSeconds) / upgrade.totalDurationSeconds) * 100)))
                : 100;
              const directGems = calculateGemsForTime(remainingSeconds);

              return (
                <div
                  key={`${account.id}-${upgrade.id}`}
                  className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-800/30 transition-colors px-2 rounded-lg"
                >
                  {/* Left: Building & Account Info */}
                  <div className="flex items-center gap-3.5 min-w-[280px]">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      upgrade.category === 'hero'
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-400'
                        : upgrade.category === 'lab'
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-400'
                        : upgrade.category === 'pet'
                        ? 'bg-teal-950/40 border-teal-500/40 text-teal-400'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                    }`}>
                      {upgrade.category === 'hero' ? (
                        <Crown className="w-5 h-5" />
                      ) : upgrade.category === 'lab' ? (
                        <FlaskConical className="w-5 h-5" />
                      ) : upgrade.category === 'pet' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Hammer className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-100 text-sm">
                          {upgrade.targetName}
                        </span>
                        <span className="text-xs font-semibold text-amber-400 tabular-nums">
                          Lv {upgrade.level} → {upgrade.targetLevel}
                        </span>
                        {upgrade.isPriorityHero && (
                          <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.2 rounded">
                            PRIORITY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span 
                          onClick={() => onSelectAccount(account.id)}
                          className="hover:text-amber-300 cursor-pointer font-medium text-stone-300"
                        >
                          {account.name} (TH{account.townHallLevel})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {upgrade.category === 'lab' 
                            ? 'Laboratory' 
                            : upgrade.category === 'pet' 
                            ? 'Pet House' 
                            : `Builder #${upgrade.builderIndex}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Live Progress Bar & Time */}
                  <div className="flex-1 max-w-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-400">
                        {isFinished ? (
                          <span className="text-emerald-400 font-sans font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Collect
                          </span>
                        ) : (
                          <span>Finishing in:</span>
                        )}
                      </span>
                      <span className={`font-bold tabular-nums ${
                        remainingSeconds < 3600 ? 'text-amber-400 animate-pulse' : 'text-stone-200'
                      }`}>
                        {formatDuration(remainingSeconds)}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                      <div
                        className={`h-full transition-all duration-1000 ${
                          isFinished
                            ? 'bg-emerald-500'
                            : upgrade.category === 'hero'
                            ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                            : 'bg-gradient-to-r from-amber-600 to-amber-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {!isFinished && (
                      <>
                        <button
                          onClick={() => onSpeedUpUpgrade(account.id, upgrade.id, 3600)}
                          title="Speed up 1 hour"
                          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-700 transition-colors whitespace-nowrap"
                        >
                          -1h
                        </button>

                        <button
                          onClick={() => onFinishUpgradeNow(account.id, upgrade.id)}
                          title={`Finish immediately with ${directGems} gems`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold rounded transition-colors whitespace-nowrap"
                        >
                          <Gem className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{directGems}</span>
                        </button>
                      </>
                    )}

                    {isFinished && (
                      <button
                        onClick={() => onFinishUpgradeNow(account.id, upgrade.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-bold rounded shadow transition-colors whitespace-nowrap"
                      >
                        Claim & Free Builder
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Account Profiles Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-stone-100">
          Synced Village Accounts ({accounts.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const idle = acc.homeBuildersTotal - acc.homeBuildersBusy;
            return (
              <div
                key={acc.id}
                onClick={() => onSelectAccount(acc.id)}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/40 flex items-center justify-center font-extrabold text-amber-400 text-sm">
                      {acc.townHallLevel}
                    </span>
                    <div>
                      <div className="font-bold text-stone-100 text-sm group-hover:text-amber-300 transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-xs text-stone-400">{acc.tag} · {acc.role}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-800/80">
                  <div>
                    <span className="text-stone-400">Builders:</span>{' '}
                    <span className="font-semibold text-stone-200 tabular-nums">
                      {acc.homeBuildersBusy}/{acc.homeBuildersTotal} busy
                    </span>
                    {idle > 0 && (
                      <span className="block text-rose-400 text-[11px] font-bold">
                        ⚠️ {idle} builder idle!
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-stone-400">Trophies:</span>{' '}
                    <span className="font-semibold text-amber-300 tabular-nums">
                      🏆 {acc.trophies}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400">Clan Games:</span>{' '}
                    <span className="font-semibold text-purple-300 tabular-nums">
                      {acc.clanGamesPoints}/4000
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400">Gems:</span>{' '}
                    <span className="font-semibold text-emerald-400 tabular-nums">
                      💎 {acc.gemsCount}
                    </span>
                  </div>
                </div>

                {acc.goldPassBoostPercent > 0 && (
                  <div className="text-[11px] font-medium text-amber-400/90 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                    ⚡ {acc.goldPassBoostPercent}% Gold Pass Builder Boost Active
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
