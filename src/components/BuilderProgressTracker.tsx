import React, { useState } from 'react';
import { PlayerAccount, UpgradeItem, UpgradeCategory, ResourceType } from '../types/clash';
import { 
  Hammer, 
  Plus, 
  Clock, 
  FlaskConical, 
  Sparkles, 
  Crown, 
  Zap, 
  CheckCircle2, 
  Gem, 
  Layers,
  X,
  AlertCircle
} from 'lucide-react';
import { formatDuration, calculateGemsForTime } from '../utils/gemCalculator';
import { BuilderTimelineChart } from './BuilderTimelineChart';

interface BuilderProgressTrackerProps {
  account: PlayerAccount;
  currentTime: number;
  onFinishUpgradeNow: (accountId: string, upgradeId: string) => void;
  onSpeedUpUpgrade: (accountId: string, upgradeId: string, seconds: number) => void;
  onAddUpgrade: (accountId: string, upgrade: Omit<UpgradeItem, 'id'>) => void;
  onCancelUpgrade: (accountId: string, upgradeId: string) => void;
  onApplyBuilderPotion: (accountId: string) => void;
}

const COMMON_UPGRADES_PRESETS = [
  { name: 'Eagle Artillery', category: 'builder', defaultLevel: 6, maxLevel: 7, days: 14, cost: 21000000, resource: 'gold' },
  { name: 'Monolith', category: 'builder', defaultLevel: 3, maxLevel: 4, days: 15, cost: 390000, resource: 'dark_elixir' },
  { name: 'Ricochet Cannon', category: 'builder', defaultLevel: 2, maxLevel: 3, days: 12, cost: 19000000, resource: 'gold' },
  { name: 'Multi-Archer Tower', category: 'builder', defaultLevel: 2, maxLevel: 3, days: 13, cost: 18500000, resource: 'gold' },
  { name: 'Scattershot', category: 'builder', defaultLevel: 4, maxLevel: 5, days: 14, cost: 20500000, resource: 'gold' },
  { name: 'Inferno Tower', category: 'builder', defaultLevel: 9, maxLevel: 10, days: 13, cost: 19500000, resource: 'gold' },
  { name: 'Archer Queen', category: 'hero', defaultLevel: 94, maxLevel: 95, days: 8, cost: 360000, resource: 'dark_elixir' },
  { name: 'Barbarian King', category: 'hero', defaultLevel: 91, maxLevel: 95, days: 8, cost: 340000, resource: 'dark_elixir' },
  { name: 'Grand Warden', category: 'hero', defaultLevel: 68, maxLevel: 70, days: 7, cost: 18000000, resource: 'elixir' },
  { name: 'Royal Champion', category: 'hero', defaultLevel: 44, maxLevel: 45, days: 8, cost: 380000, resource: 'dark_elixir' },
  { name: 'Minion Prince', category: 'hero', defaultLevel: 15, maxLevel: 40, days: 6, cost: 250000, resource: 'dark_elixir' },
  { name: 'Root Rider', category: 'lab', defaultLevel: 2, maxLevel: 3, days: 12, cost: 20000000, resource: 'elixir' },
  { name: 'Spirit Fox', category: 'pet', defaultLevel: 9, maxLevel: 10, days: 8, cost: 290000, resource: 'dark_elixir' },
];

export const BuilderProgressTracker: React.FC<BuilderProgressTrackerProps> = ({
  account,
  currentTime,
  onFinishUpgradeNow,
  onSpeedUpUpgrade,
  onAddUpgrade,
  onCancelUpgrade,
  onApplyBuilderPotion
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBuilderForNew, setSelectedBuilderForNew] = useState<number>(1);
  const [newTargetName, setNewTargetName] = useState('Ricochet Cannon');
  const [newCategory, setNewCategory] = useState<UpgradeCategory>('builder');
  const [newCurrentLevel, setNewCurrentLevel] = useState(2);
  const [newTargetLevel, setNewTargetLevel] = useState(3);
  const [newDays, setNewDays] = useState(12);
  const [newHours, setNewHours] = useState(0);
  const [newResourceType, setNewResourceType] = useState<ResourceType>('gold');
  const [newResourceCost, setNewResourceCost] = useState(19000000);

  // Group upgrades by builder slots
  const builderSlots = [1, 2, 3, 4, 5, 6];
  const builderUpgrades = account.upgrades.filter(u => u.category === 'builder' || u.category === 'hero');
  const labUpgrade = account.upgrades.find(u => u.category === 'lab');
  const petUpgrade = account.upgrades.find(u => u.category === 'pet');

  const handlePresetSelect = (preset: typeof COMMON_UPGRADES_PRESETS[0]) => {
    setNewTargetName(preset.name);
    setNewCategory(preset.category as UpgradeCategory);
    setNewCurrentLevel(preset.defaultLevel);
    setNewTargetLevel(preset.defaultLevel + 1);
    setNewDays(preset.days);
    setNewHours(0);
    setNewResourceType(preset.resource as ResourceType);
    setNewResourceCost(preset.cost);
  };

  const handleSubmitNewUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSecs = newDays * 86400 + newHours * 3600;
    if (durationSecs <= 0) return;

    onAddUpgrade(account.id, {
      category: newCategory,
      targetName: newTargetName,
      level: newCurrentLevel,
      targetLevel: newTargetLevel,
      totalDurationSeconds: durationSecs,
      endTime: Date.now() + durationSecs * 1000,
      resourceType: newResourceType,
      resourceCost: newResourceCost,
      builderIndex: selectedBuilderForNew,
      status: 'active',
      isPriorityHero: newCategory === 'hero'
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Account Village Header Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-500/30 bg-stone-950 shrink-0">
            <img
              src="/src/assets/images/coc_builder_hut_1792603422189.jpg"
              alt="Builder Workshop"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-stone-100">
                {account.name} · Town Hall {account.townHallLevel}
              </h2>
              <span className="text-xs font-mono text-stone-400">({account.tag})</span>
            </div>
            <div className="text-xs text-stone-400 flex items-center gap-2 mt-1">
              <span>{account.clan.name} ({account.role})</span>
              <span aria-hidden="true">·</span>
              <span>Home Village: {account.homeBuildersBusy}/{account.homeBuildersTotal} Builders Busy</span>
              <span aria-hidden="true">·</span>
              <span>Builder Base: {account.builderBaseBusy}/{account.builderBaseTotal} Busy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onApplyBuilderPotion(account.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Use Builder Potion (-9h)</span>
          </button>

          <button
            onClick={() => {
              // Find first free builder
              const busyIndices = new Set(builderUpgrades.map(u => u.builderIndex));
              const firstFree = builderSlots.find(idx => !busyIndices.has(idx)) || 1;
              setSelectedBuilderForNew(firstFree);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Upgrade</span>
          </button>
        </div>
      </div>

      {/* 6 Home Village Builders Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Hammer className="w-4 h-4 text-amber-400" />
            <span>Home Village Construction Huts (5 + 1 B.O.B Hut)</span>
          </h3>
          <span className="text-xs text-stone-400">
            {account.homeBuildersTotal - account.homeBuildersBusy === 0 ? (
              <span className="text-emerald-400 font-semibold">100% Efficiency · All Builders Busy</span>
            ) : (
              <span className="text-rose-400 font-semibold">
                ⚠️ {account.homeBuildersTotal - account.homeBuildersBusy} Builders Sleeping!
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builderSlots.map((slotIndex) => {
            const activeUpg = builderUpgrades.find(u => u.builderIndex === slotIndex);
            const remaining = activeUpg ? Math.max(0, Math.floor((activeUpg.endTime - currentTime) / 1000)) : 0;
            const isCompleted = activeUpg && remaining <= 0;
            const percent = activeUpg && activeUpg.totalDurationSeconds > 0
              ? Math.min(100, Math.max(0, Math.floor(((activeUpg.totalDurationSeconds - remaining) / activeUpg.totalDurationSeconds) * 100)))
              : 0;
            const directGems = calculateGemsForTime(remaining);

            if (!activeUpg) {
              return (
                <div
                  key={slotIndex}
                  className="bg-stone-900/60 border border-dashed border-stone-800 hover:border-amber-500/50 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-3 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-600 group-hover:text-amber-400 group-hover:border-amber-500/40 transition-colors">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-300 text-sm">
                      Builder #{slotIndex} is Sleeping!
                    </div>
                    <div className="text-xs text-rose-400/90 font-medium mt-0.5">
                      Idle builder reduces base progression
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBuilderForNew(slotIndex);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 transition-colors"
                  >
                    + Assign Builder #{slotIndex}
                  </button>
                </div>
              );
            }

            return (
              <div
                key={slotIndex}
                className={`bg-stone-900 border rounded-xl p-4 shadow-sm space-y-3 transition-all ${
                  isCompleted 
                    ? 'border-emerald-500/50 bg-emerald-950/20' 
                    : activeUpg.category === 'hero'
                    ? 'border-rose-900/50 hover:border-rose-500/50'
                    : 'border-stone-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${
                      activeUpg.category === 'hero'
                        ? 'bg-rose-950/50 border-rose-500/40 text-rose-400'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                    }`}>
                      {activeUpg.category === 'hero' ? <Crown className="w-5 h-5" /> : <Hammer className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-100 text-sm">
                          {activeUpg.targetName}
                        </span>
                        <span className="text-xs font-bold text-amber-400 tabular-nums">
                          Lv {activeUpg.level} → {activeUpg.targetLevel}
                        </span>
                      </div>
                      <div className="text-xs text-stone-400">
                        Builder #{slotIndex} · {activeUpg.category === 'hero' ? 'Hero Upgrade' : 'Defense/Building'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    {activeUpg.resourceType.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress & Countdown */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {isCompleted ? 'Finished' : 'Remaining:'}
                    </span>
                    <span className={`font-bold tabular-nums ${
                      isCompleted ? 'text-emerald-400' : 'text-stone-100'
                    }`}>
                      {formatDuration(remaining)}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : activeUpg.category === 'hero'
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                          : 'bg-gradient-to-r from-amber-500 to-amber-300'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="pt-1 flex items-center justify-between text-xs border-t border-stone-800/80">
                  <button
                    onClick={() => onCancelUpgrade(account.id, activeUpg.id)}
                    className="text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    Cancel
                  </button>

                  <div className="flex items-center gap-1.5">
                    {!isCompleted ? (
                      <>
                        <button
                          onClick={() => onSpeedUpUpgrade(account.id, activeUpg.id, 3600)}
                          className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors"
                        >
                          -1h
                        </button>
                        <button
                          onClick={() => onFinishUpgradeNow(account.id, activeUpg.id)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 rounded font-semibold transition-colors"
                        >
                          <Gem className="w-3 h-3 text-emerald-400" />
                          <span>{directGems}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onFinishUpgradeNow(account.id, activeUpg.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded shadow transition-colors"
                      >
                        Claim & Free Builder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Upgrades: Laboratory & Pet House */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Laboratory */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-stone-100 text-sm">Laboratory Research</div>
                <div className="text-xs text-stone-400">Troop, Spell & Siege Engine Research</div>
              </div>
            </div>
            {labUpgrade && (
              <span className="text-xs text-purple-400 font-bold tabular-nums">
                Lv {labUpgrade.level} → {labUpgrade.targetLevel}
              </span>
            )}
          </div>

          {labUpgrade ? (
            <div className="space-y-2 bg-stone-950/50 p-3 rounded-lg border border-stone-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">{labUpgrade.targetName}</span>
                <span className="font-mono text-purple-300 tabular-nums">
                  {formatDuration(Math.max(0, Math.floor((labUpgrade.endTime - currentTime) / 1000)))}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 w-3/4" />
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => onSpeedUpUpgrade(account.id, labUpgrade.id, 86400)}
                  className="text-stone-400 hover:text-stone-200"
                >
                  Use Research Potion (-23h)
                </button>
                <button
                  onClick={() => onFinishUpgradeNow(account.id, labUpgrade.id)}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Finish Lab
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-lg">
              Laboratory is idle. Start researching to stay battle-ready!
            </div>
          )}
        </div>

        {/* Pet House */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-950/40 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-stone-100 text-sm">Pet House Training</div>
                <div className="text-xs text-stone-400">Hero Companion Upgrades</div>
              </div>
            </div>
            {petUpgrade && (
              <span className="text-xs text-teal-400 font-bold tabular-nums">
                Lv {petUpgrade.level} → {petUpgrade.targetLevel}
              </span>
            )}
          </div>

          {petUpgrade ? (
            <div className="space-y-2 bg-stone-950/50 p-3 rounded-lg border border-stone-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">{petUpgrade.targetName}</span>
                <span className="font-mono text-teal-300 tabular-nums">
                  {formatDuration(Math.max(0, Math.floor((petUpgrade.endTime - currentTime) / 1000)))}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-stone-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 w-2/3" />
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  onClick={() => onSpeedUpUpgrade(account.id, petUpgrade.id, 86400)}
                  className="text-stone-400 hover:text-stone-200"
                >
                  Use Pet Potion (-24h)
                </button>
                <button
                  onClick={() => onFinishUpgradeNow(account.id, petUpgrade.id)}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Finish Pet
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-lg">
              Pet House is free. Train your Unicorn, Diggy, or Spirit Fox.
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Builder Availability Schedule for this account */}
      <BuilderTimelineChart
        accounts={[account]}
        currentTime={currentTime}
      />

      {/* Add Upgrade Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-stone-100">
                  Assign Construction Upgrade
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-400">Quick Clash Presets</label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_UPGRADES_PRESETS.slice(0, 6).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className="px-2 py-1 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded text-[11px] text-stone-300 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitNewUpgrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Assign To Builder</label>
                  <select
                    value={selectedBuilderForNew}
                    onChange={(e) => setSelectedBuilderForNew(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    {builderSlots.map(s => (
                      <option key={s} value={s}>Builder Hut #{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as UpgradeCategory)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="builder">Defense / Building</option>
                    <option value="hero">Hero Upgrade</option>
                    <option value="lab">Laboratory</option>
                    <option value="pet">Pet House</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-stone-300">Target Name</label>
                <input
                  type="text"
                  required
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  placeholder="e.g. Town Hall 17, Eagle Artillery, Queen"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Current Level</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newCurrentLevel}
                    onChange={(e) => setNewCurrentLevel(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Target Level</label>
                  <input
                    type="number"
                    min="2"
                    max="101"
                    value={newTargetLevel}
                    onChange={(e) => setNewTargetLevel(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Duration (Days)</label>
                  <input
                    type="number"
                    min="0"
                    max="21"
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Resource Type</label>
                  <select
                    value={newResourceType}
                    onChange={(e) => setNewResourceType(e.target.value as ResourceType)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="gold">Gold</option>
                    <option value="elixir">Elixir</option>
                    <option value="dark_elixir">Dark Elixir</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-stone-300">Resource Cost</label>
                  <input
                    type="number"
                    min="0"
                    value={newResourceCost}
                    onChange={(e) => setNewResourceCost(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-colors shadow"
                >
                  Start Upgrade & Start Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
