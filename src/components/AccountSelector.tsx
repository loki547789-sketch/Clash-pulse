import React from 'react';
import { PlayerAccount } from '../types/clash';
import { Users, Hammer, ShieldAlert, Zap } from 'lucide-react';
import { formatDuration } from '../utils/gemCalculator';

interface AccountSelectorProps {
  accounts: PlayerAccount[];
  selectedAccountId: string | 'all';
  onSelectAccount: (id: string | 'all') => void;
  nextFreeSeconds: number | null;
  onQuickBuilderPotion: () => void;
  onSimulateComplete: () => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  nextFreeSeconds,
  onQuickBuilderPotion,
  onSimulateComplete
}) => {
  const totalBuilders = accounts.reduce((acc, a) => acc + a.homeBuildersTotal, 0);
  const totalBusy = accounts.reduce((acc, a) => acc + a.homeBuildersBusy, 0);
  const totalIdle = totalBuilders - totalBusy;

  return (
    <div className="bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Account Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => onSelectAccount('all')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedAccountId === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Accounts ({accounts.length})</span>
          </button>

          {accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id;
            const idle = acc.homeBuildersTotal - acc.homeBuildersBusy;
            return (
              <button
                key={acc.id}
                onClick={() => onSelectAccount(acc.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  isSelected
                    ? 'bg-stone-800 border-amber-500/70 text-amber-300 shadow-sm'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span className="w-5 h-5 rounded bg-stone-950 border border-amber-400/30 flex items-center justify-center font-bold text-[10px] text-amber-400">
                  {acc.townHallLevel}
                </span>
                <span className="font-semibold text-stone-200">{acc.name}</span>
                <span className="text-[10px] text-stone-400">({acc.tag})</span>
                {idle > 0 ? (
                  <span className="text-[10px] font-semibold text-rose-400">
                    {idle} idle!
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400">
                    {acc.homeBuildersBusy}/{acc.homeBuildersTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Metric & Quick Action Strip */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0 text-xs">
          {/* Builder idle status pill */}
          <div className="flex items-center gap-2 text-stone-400">
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-medium text-stone-200">
              {totalBusy}/{totalBuilders} Busy
            </span>
            {totalIdle > 0 && (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {totalIdle} Idle
              </span>
            )}
          </div>

          <span className="text-stone-600">·</span>

          {/* Next free timer */}
          <div className="flex items-center gap-1 text-stone-300">
            <span className="text-stone-400">Next Free:</span>
            <span className="font-mono font-semibold text-amber-400 tabular-nums">
              {nextFreeSeconds !== null ? formatDuration(nextFreeSeconds) : 'All Idle'}
            </span>
          </div>

          <span className="text-stone-600">·</span>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onQuickBuilderPotion}
              title="Apply Builder Potion (-9 hours to all active builders)"
              className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-md transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Builder Potion</span>
            </button>
            
            <button
              onClick={onSimulateComplete}
              title="Instantly complete closest upgrade to test audio & alert notifications"
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md transition-colors font-medium text-[11px]"
            >
              Test Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
