import React, { useState } from 'react';
import { PlayerAccount } from '../types/clash';
import { 
  Gem, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Info
} from 'lucide-react';
import { 
  calculateGemsForTime, 
  analyzeGemmingChoice, 
  TRADER_BENCHMARKS, 
  formatDuration 
} from '../utils/gemCalculator';

interface GemAnalyticsViewProps {
  accounts: PlayerAccount[];
  selectedAccount: PlayerAccount;
}

export const GemAnalyticsView: React.FC<GemAnalyticsViewProps> = ({
  accounts,
  selectedAccount
}) => {
  const [testDays, setTestDays] = useState<number>(7);
  const [testHours, setTestHours] = useState<number>(12);

  const testSeconds = testDays * 86400 + testHours * 3600;
  const analysis = analyzeGemmingChoice(testSeconds);

  // Gem income breakdown
  const monthlyGemSources = [
    { name: 'Village Obstacles (Spawn cycle)', gems: 65, frequency: 'Monthly average' },
    { name: 'Builder Base Gem Mine (Lv 10)', gems: 144, frequency: '4.8 gems / day' },
    { name: 'Clan Games Milestone Pick', gems: 150, frequency: 'Tier 1 & Tier 5 picks' },
    { name: 'Seasonal Events & Challenges', gems: 200, frequency: 'Monthly events' },
    { name: 'Gem Box & Clock Tower Boost', gems: 75, frequency: '1-2 spawns monthly' },
  ];

  const totalMonthlyGems = monthlyGemSources.reduce((sum, s) => sum + s.gems, 0);

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-stone-100">
              Gem Economy & Time-Value Analytics
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Calculate exact gem efficiency, compare Trader Shop alternatives, and avoid high-cost resource traps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-stone-950 border border-stone-800 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-stone-400">Current Gems ({selectedAccount.name}):</span>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums flex items-center gap-1">
              <Gem className="w-4 h-4" />
              {selectedAccount.gemsCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* "Should I Gem This?" Interactive Calculator */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>"Should I Gem This?" Upgrade Efficiency Calculator</span>
          </h3>
          <span className="text-xs text-stone-400">
            Based on official Supercell quadratic time decay algorithm
          </span>
        </div>

        {/* Inputs & Quick Duration Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="text-xs font-semibold text-stone-300">
              Remaining Upgrade Time
            </label>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-stone-400">Days</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={testDays}
                  onChange={(e) => setTestDays(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-stone-400">Hours</span>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={testHours}
                  onChange={(e) => setTestHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-stone-500">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '3 Hours', d: 0, h: 3 },
                  { label: '24 Hours', d: 1, h: 0 },
                  { label: '5 Days', d: 5, h: 0 },
                  { label: '8 Days (Hero)', d: 8, h: 0 },
                  { label: '14 Days (Eagle)', d: 14, h: 0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTestDays(preset.d);
                      setTestHours(preset.h);
                    }}
                    className="px-2 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded text-[11px] text-stone-300 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-2 bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b border-stone-900 pb-4 text-xs font-mono">
              <div>
                <div className="text-stone-400">Direct Gem Cost</div>
                <div className="text-2xl font-black text-amber-400 tabular-nums flex items-center gap-1 mt-0.5">
                  <Gem className="w-5 h-5 text-emerald-400" />
                  <span>{analysis.directGems.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-stone-500 font-sans">Supercell instant skip</div>
              </div>

              <div>
                <div className="text-stone-400">Time Saved</div>
                <div className="text-2xl font-black text-stone-200 tabular-nums mt-0.5">
                  {analysis.hours}h
                </div>
                <div className="text-[11px] text-stone-500 font-sans">Total duration skipped</div>
              </div>

              <div>
                <div className="text-stone-400">Burn Rate</div>
                <div className="text-2xl font-black text-purple-400 tabular-nums mt-0.5">
                  {analysis.gemsPerHour} <span className="text-xs font-normal text-stone-400">gems/hr</span>
                </div>
                <div className="text-[11px] text-stone-500 font-sans">Opportunity cost ratio</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                  analysis.tier === 'S' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                  analysis.tier === 'A' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                  analysis.tier === 'B' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  'bg-rose-950 text-rose-300 border border-rose-700'
                }`}>
                  Tier {analysis.tier} Efficiency
                </span>
                <span className="text-xs font-semibold text-stone-200">Recommendation</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {analysis.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trader Benchmark Leaderboard */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-md">
        <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Trader Magic Item Value Benchmark (Gems per Hour Saved)</span>
        </h3>

        <div className="divide-y divide-stone-800/80 text-xs">
          {TRADER_BENCHMARKS.map((item) => (
            <div
              key={item.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/20 px-2 rounded-lg transition-colors"
            >
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    item.efficiencyTier === 'S' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' :
                    item.efficiencyTier === 'A' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700' :
                    item.efficiencyTier === 'B' ? 'bg-amber-900/60 text-amber-300 border border-amber-700' :
                    'bg-rose-900/60 text-rose-300 border border-rose-700'
                  }`}>
                    {item.efficiencyTier}-Tier
                  </span>
                  <span className="font-bold text-stone-100 text-sm">{item.name}</span>
                  <span className="text-stone-500 font-mono">({item.costGems} Gems)</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  {item.advice}
                </p>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-auto font-mono text-right">
                <div>
                  <div className="text-stone-400 text-[11px]">Time Saved</div>
                  <div className="font-bold text-stone-200 tabular-nums">
                    {item.timeSavedHours > 0 ? `${item.timeSavedHours} hours` : 'None'}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Cost Efficiency</div>
                  <div className="font-bold text-emerald-400 tabular-nums">
                    {item.gemsPerHourSaved < 100 ? `${item.gemsPerHourSaved.toFixed(2)} gems/hr` : 'Negative ROI'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Gem Inflow Projection */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Monthly Free-to-Play Gem Production (~{totalMonthlyGems} Gems / Month)</span>
          </h3>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-1 rounded">
            +1 Free Book of Heroes every 26 days
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {monthlyGemSources.map((source) => (
            <div
              key={source.name}
              className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl space-y-1.5"
            >
              <div className="text-stone-400 text-[11px]">{source.name}</div>
              <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums flex items-center gap-1">
                <Gem className="w-4 h-4" />
                <span>+{source.gems}</span>
              </div>
              <div className="text-stone-500 text-[10px]">{source.frequency}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
