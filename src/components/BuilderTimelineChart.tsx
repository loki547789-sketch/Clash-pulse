import React, { useState, useMemo } from 'react';
import { PlayerAccount, UpgradeItem } from '../types/clash';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Hammer, 
  Clock, 
  Coins, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Layers
} from 'lucide-react';
import { formatDuration } from '../utils/gemCalculator';

interface BuilderTimelineChartProps {
  accounts: PlayerAccount[];
  currentTime: number;
  onSelectAccount?: (id: string) => void;
}

interface DayAvailability {
  dayIndex: number;
  dateLabel: string;
  weekday: string;
  fullDate: string;
  startMs: number;
  endMs: number;
  buildersFreeingUp: number;
  cumulativeFree: number;
  busyBuilders: number;
  finishingUpgrades: {
    accountName: string;
    accountId: string;
    targetName: string;
    targetLevel: number;
    category: string;
    resourceType: string;
    resourceCost: number;
    exactTime: string;
    remainingHours: number;
  }[];
}

export const BuilderTimelineChart: React.FC<BuilderTimelineChartProps> = ({
  accounts,
  currentTime,
  onSelectAccount
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [filterAccountId, setFilterAccountId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'chart' | 'blocks'>('chart');

  // Filter accounts if selected
  const activeAccounts = useMemo(() => {
    if (filterAccountId === 'all') return accounts;
    return accounts.filter(a => a.id === filterAccountId);
  }, [accounts, filterAccountId]);

  const totalBuilders = useMemo(() => {
    return activeAccounts.reduce((sum, a) => sum + a.homeBuildersTotal, 0);
  }, [activeAccounts]);

  // Generate 7-day projection data
  const timelineData = useMemo(() => {
    const days: DayAvailability[] = [];
    const now = new Date(currentTime);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // Collect all active builder/hero upgrades
    const relevantUpgrades: { upgrade: UpgradeItem; account: PlayerAccount }[] = [];
    activeAccounts.forEach(acc => {
      acc.upgrades.forEach(upg => {
        if (upg.status === 'active' && (upg.category === 'builder' || upg.category === 'hero')) {
          relevantUpgrades.push({ upgrade: upg, account: acc });
        }
      });
    });

    let runningCumulativeFree = 0;

    for (let i = 0; i < 7; i++) {
      const dayStart = startOfToday + i * 86400 * 1000;
      const dayEnd = dayStart + 86400 * 1000;
      const dateObj = new Date(dayStart);

      const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const weekday = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekdayNames[dateObj.getDay()];
      const dateLabel = i === 0 ? 'Today' : `${weekdayNames[dateObj.getDay()]} ${dateObj.getDate()}`;
      const fullDate = `${weekdayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`;

      // Upgrades finishing on this day
      const finishing = relevantUpgrades.filter(item => {
        return item.upgrade.endTime >= dayStart && item.upgrade.endTime < dayEnd;
      });

      const buildersFreeToday = finishing.length;
      runningCumulativeFree += buildersFreeToday;
      const cumulativeFreeClamped = Math.min(totalBuilders, runningCumulativeFree);
      const busyBuilders = Math.max(0, totalBuilders - cumulativeFreeClamped);

      days.push({
        dayIndex: i,
        dateLabel,
        weekday,
        fullDate,
        startMs: dayStart,
        endMs: dayEnd,
        buildersFreeingUp: buildersFreeToday,
        cumulativeFree: cumulativeFreeClamped,
        busyBuilders,
        finishingUpgrades: finishing.map(f => {
          const finishDate = new Date(f.upgrade.endTime);
          const hours = finishDate.getHours().toString().padStart(2, '0');
          const minutes = finishDate.getMinutes().toString().padStart(2, '0');
          const remainingSecs = Math.max(0, Math.floor((f.upgrade.endTime - currentTime) / 1000));
          return {
            accountName: f.account.name,
            accountId: f.account.id,
            targetName: f.upgrade.targetName,
            targetLevel: f.upgrade.targetLevel,
            category: f.upgrade.category,
            resourceType: f.upgrade.resourceType,
            resourceCost: f.upgrade.resourceCost,
            exactTime: `${hours}:${minutes}`,
            remainingHours: Math.round((remainingSecs / 3600) * 10) / 10
          };
        })
      });
    }

    return days;
  }, [activeAccounts, currentTime, totalBuilders]);

  const selectedDayData = timelineData[selectedDayIndex] || timelineData[0];

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DayAvailability;
      return (
        <div className="bg-stone-900 border border-stone-700/80 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="font-bold text-amber-300 border-b border-stone-800 pb-1">
            {data.fullDate} ({data.weekday})
          </div>
          <div className="flex justify-between text-stone-300">
            <span>Freeing Up:</span>
            <span className="font-bold text-amber-400 font-mono">+{data.buildersFreeingUp} builder(s)</span>
          </div>
          <div className="flex justify-between text-stone-300">
            <span>Available Capacity:</span>
            <span className="font-bold text-emerald-400 font-mono">{data.cumulativeFree} / {totalBuilders} free</span>
          </div>
          <div className="flex justify-between text-stone-400 text-[11px]">
            <span>Still Busy:</span>
            <span className="font-mono">{data.busyBuilders} active</span>
          </div>
          {data.finishingUpgrades.length > 0 && (
            <div className="pt-1 border-t border-stone-800/80 text-[11px] text-stone-300">
              <span className="text-stone-400 block font-semibold mb-0.5">Finishing:</span>
              {data.finishingUpgrades.slice(0, 3).map((u, idx) => (
                <div key={idx} className="truncate text-amber-200">
                  • {u.targetName} Lv{u.targetLevel} ({u.exactTime})
                </div>
              ))}
              {data.finishingUpgrades.length > 3 && (
                <div className="text-stone-500">+{data.finishingUpgrades.length - 3} more...</div>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 shadow-lg space-y-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-stone-100">
              7-Day Builder Availability & Upgrade Planner
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Visualize when builder slots open up to schedule Dark Elixir farming & defense rotations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Account Filter */}
          <select
            value={filterAccountId}
            onChange={(e) => setFilterAccountId(e.target.value)}
            className="bg-stone-950 border border-stone-800 text-stone-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Accounts ({accounts.length})</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.tag})
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-950 rounded-lg border border-stone-800 text-xs">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'chart' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Capacity Chart
            </button>
            <button
              onClick={() => setViewMode('blocks')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === 'blocks' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Gantt Blocks
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Recharts Visual Timeline */}
      {viewMode === 'chart' ? (
        <div className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={timelineData}
                margin={{ top: 10, right: 15, left: -20, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activeTooltipIndex !== undefined) {
                    setSelectedDayIndex(e.activeTooltipIndex);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis 
                  dataKey="dateLabel" 
                  stroke="#78716c" 
                  tick={{ fill: '#a8a29e', fontSize: 11 }}
                  axisLine={{ stroke: '#44403c' }}
                />
                <YAxis 
                  stroke="#78716c" 
                  tick={{ fill: '#a8a29e', fontSize: 11 }}
                  axisLine={{ stroke: '#44403c' }}
                  domain={[0, Math.max(totalBuilders, 6)]}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Freeing up on day - Bar */}
                <Bar 
                  dataKey="buildersFreeingUp" 
                  name="Builders Freeing Up" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={42}
                >
                  {timelineData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === selectedDayIndex ? '#f59e0b' : '#d97706'} 
                      opacity={entry.buildersFreeingUp > 0 ? 0.9 : 0.3}
                      className="cursor-pointer transition-opacity hover:opacity-100"
                    />
                  ))}
                </Bar>

                {/* Cumulative Available Line */}
                <Line
                  type="monotone"
                  dataKey="cumulativeFree"
                  name="Total Free Capacity"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 1.5, stroke: '#064e3b' }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 px-2 pt-1 border-t border-stone-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                <span>Builders Freeing Up (Daily)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
                <span>Available Capacity Line</span>
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              Click any bar to inspect scheduled upgrade openings
            </span>
          </div>
        </div>
      ) : (
        /* 7-Day Visual Gantt Blocks Grid */
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {timelineData.map((day) => {
            const isSelected = day.dayIndex === selectedDayIndex;
            const hasOpenings = day.buildersFreeingUp > 0;

            return (
              <button
                key={day.dayIndex}
                onClick={() => setSelectedDayIndex(day.dayIndex)}
                className={`p-3 rounded-xl border text-left transition-all space-y-2 ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                    : hasOpenings
                    ? 'bg-stone-950 border-stone-800 hover:border-amber-500/40'
                    : 'bg-stone-950/40 border-stone-900 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-200">{day.weekday}</span>
                  <span className="font-mono text-[10px] text-stone-500">
                    {day.dateLabel}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-extrabold font-mono tabular-nums text-amber-400">
                    +{day.buildersFreeingUp}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {day.buildersFreeingUp === 1 ? 'builder opens' : 'builders open'}
                  </div>
                </div>

                <div className="pt-1 border-t border-stone-800/80 text-[10px] text-emerald-400 font-medium">
                  {day.cumulativeFree}/{totalBuilders} total free
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Day Upgrade Openings & Preparation Blueprint */}
      <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-900 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-stone-100 text-sm">
              Openings Scheduled for {selectedDayData.fullDate} ({selectedDayData.weekday})
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {selectedDayData.buildersFreeingUp} builder opening(s) on this date
          </span>
        </div>

        {selectedDayData.finishingUpgrades.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-500 space-y-1">
            <p>No builders scheduled to finish on this day.</p>
            <p className="text-[11px] text-stone-600">
              All active builders are working on longer construction cycles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDayData.finishingUpgrades.map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-stone-100 text-sm">{item.targetName}</span>
                      <span className="text-xs font-semibold text-amber-400 tabular-nums">
                        Lv {item.targetLevel}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400">
                      {item.accountName}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                    {item.exactTime}
                  </span>
                </div>

                <div className="pt-1 border-t border-stone-800/80 text-xs flex items-center justify-between text-stone-400">
                  <span>Resource Prep Needed:</span>
                  <span className="text-stone-200 font-semibold tabular-nums">
                    {item.resourceCost > 0 ? (
                      item.resourceType === 'dark_elixir' 
                        ? `${(item.resourceCost / 1000).toFixed(0)}k DE`
                        : `${(item.resourceCost / 1000000).toFixed(1)}M ${item.resourceType}`
                    ) : 'Free Slot'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
