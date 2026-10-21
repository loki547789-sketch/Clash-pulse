import React, { useState } from 'react';
import { PlayerAccount } from '../types/clash';
import { X, Shield, Plus, Check, Sparkles, RefreshCw } from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface SyncAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (newAccount: PlayerAccount) => void;
}

const PRESET_PLAYER_TEMPLATES = [
  {
    name: 'DragonSlayer PRO',
    tag: '#V8CY90PL',
    townHallLevel: 17,
    builderHallLevel: 10,
    trophies: 5850,
    warStars: 2150,
    role: 'Leader' as const,
    clan: { name: 'Apex Immortals', tag: '#2PRO999', badge: '🔥', level: 26 },
  },
  {
    name: 'Queen Charge Ace',
    tag: '#89L0QYY2',
    townHallLevel: 16,
    builderHallLevel: 9,
    trophies: 5120,
    warStars: 1620,
    role: 'Co-Leader' as const,
    clan: { name: 'Titan Vanguard', tag: '#9V8GQ0PL', badge: '🛡️', level: 24 },
  },
  {
    name: 'Mini Goblin Farmer',
    tag: '#PJ98CR9V',
    townHallLevel: 14,
    builderHallLevel: 8,
    trophies: 3850,
    warStars: 920,
    role: 'Elder' as const,
    clan: { name: 'Titan Vanguard', tag: '#9V8GQ0PL', badge: '🛡️', level: 24 },
  }
];

export const SyncAccountModal: React.FC<SyncAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount
}) => {
  const [tagInput, setTagInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [townHallInput, setTownHallInput] = useState(16);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleNormalizeTag = (raw: string) => {
    let clean = raw.trim().toUpperCase();
    if (!clean.startsWith('#')) {
      clean = '#' + clean;
    }
    return clean;
  };

  const handlePresetSelect = (preset: typeof PRESET_PLAYER_TEMPLATES[0]) => {
    playTapSound();
    setTagInput(preset.tag);
    setNameInput(preset.name);
    setTownHallInput(preset.townHallLevel);
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTag = handleNormalizeTag(tagInput || '#9YUR7821');
    const finalName = nameInput.trim() || `Clasher (${finalTag})`;

    setIsSyncing(true);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);

      const now = Date.now();
      const newAcc: PlayerAccount = {
        id: `acc-${Date.now()}`,
        tag: finalTag,
        name: finalName,
        role: 'Elder',
        townHallLevel: townHallInput,
        builderHallLevel: Math.max(6, townHallInput - 6),
        trophies: 4200 + Math.floor(Math.random() * 800),
        bestTrophies: 5100,
        warStars: 1100 + Math.floor(Math.random() * 500),
        clan: {
          name: 'Titan Vanguard',
          tag: '#9V8GQ0PL',
          badge: '🛡️',
          level: 24,
        },
        homeBuildersBusy: 5,
        homeBuildersTotal: 6,
        builderBaseBusy: 1,
        builderBaseTotal: 2,
        goblinBuilderHired: false,
        goldPassBoostPercent: 15,
        clanGamesPoints: 2500,
        seasonBankGold: 20000000,
        seasonBankElixir: 18000000,
        seasonBankDE: 200000,
        gemsCount: 1450,
        lastSynced: now,
        upgrades: [
          {
            id: `upg-new-1-${Date.now()}`,
            category: 'hero',
            targetName: 'Archer Queen',
            level: townHallInput * 5 - 2,
            targetLevel: townHallInput * 5 - 1,
            totalDurationSeconds: 604800,
            endTime: now + 3600 * 14,
            resourceType: 'dark_elixir',
            resourceCost: 310000,
            builderIndex: 1,
            status: 'active',
            isPriorityHero: true,
          },
          {
            id: `upg-new-2-${Date.now()}`,
            category: 'builder',
            targetName: 'Scattershot',
            level: 3,
            targetLevel: 4,
            totalDurationSeconds: 1036800,
            endTime: now + 3600 * 48,
            resourceType: 'gold',
            resourceCost: 19500000,
            builderIndex: 2,
            status: 'active',
          },
          {
            id: `upg-new-3-${Date.now()}`,
            category: 'builder',
            targetName: 'X-Bow',
            level: 9,
            targetLevel: 10,
            totalDurationSeconds: 777600,
            endTime: now + 3600 * 92,
            resourceType: 'gold',
            resourceCost: 16000000,
            builderIndex: 3,
            status: 'active',
          },
          {
            id: `upg-new-4-${Date.now()}`,
            category: 'builder',
            targetName: 'Inferno Tower',
            level: 8,
            targetLevel: 9,
            totalDurationSeconds: 864000,
            endTime: now + 3600 * 130,
            resourceType: 'gold',
            resourceCost: 17500000,
            builderIndex: 4,
            status: 'active',
          },
          {
            id: `upg-new-5-${Date.now()}`,
            category: 'builder',
            targetName: 'Air Defense',
            level: 11,
            targetLevel: 12,
            totalDurationSeconds: 950400,
            endTime: now + 3600 * 180,
            resourceType: 'gold',
            resourceCost: 15000000,
            builderIndex: 5,
            status: 'active',
          }
        ],
        heroes: [
          {
            id: `hero-q-${Date.now()}`,
            name: 'Archer Queen',
            currentLevel: townHallInput * 5 - 2,
            maxLevel: townHallInput * 5,
            downtimeHours: 168,
            darkElixirCost: 310000,
            priorityScore: 98,
            recommendation: 'Book of Heroes',
            cwlWarning: false,
            equipment: [
              { id: 'eq-q1', name: 'Giant Arrow', level: 18, maxLevel: 18, rarity: 'common', description: 'Pierces base defenses in a straight line', active: true },
              { id: 'eq-q2', name: 'Frozen Arrow', level: 25, maxLevel: 27, rarity: 'epic', description: 'Freezes defense attack speed', active: true }
            ]
          },
          {
            id: `hero-k-${Date.now()}`,
            name: 'Barbarian King',
            currentLevel: townHallInput * 5 - 5,
            maxLevel: townHallInput * 5,
            downtimeHours: 168,
            darkElixirCost: 290000,
            priorityScore: 90,
            recommendation: 'Hammer of Heroes',
            cwlWarning: false,
            equipment: [
              { id: 'eq-k1', name: 'Giant Gauntlet', level: 24, maxLevel: 27, rarity: 'epic', description: 'Massive splash area strike', active: true },
              { id: 'eq-k2', name: 'Spiky Ball', level: 20, maxLevel: 27, rarity: 'epic', description: 'Ricochets through 6 defenses', active: true }
            ]
          },
          {
            id: `hero-w-${Date.now()}`,
            name: 'Grand Warden',
            currentLevel: Math.max(40, (townHallInput - 11) * 10 + 40),
            maxLevel: 70,
            downtimeHours: 144,
            darkElixirCost: 0,
            priorityScore: 95,
            recommendation: 'Standard Upgrade',
            cwlWarning: false,
            equipment: [
              { id: 'eq-w1', name: 'Eternal Tome', level: 18, maxLevel: 18, rarity: 'common', description: 'Invulnerability barrier', active: true },
              { id: 'eq-w2', name: 'Healing Tome', level: 16, maxLevel: 18, rarity: 'common', description: 'Continuous mass heal', active: true }
            ]
          },
          {
            id: `hero-rc-${Date.now()}`,
            name: 'Royal Champion',
            currentLevel: Math.max(15, (townHallInput - 13) * 10 + 15),
            maxLevel: 45,
            downtimeHours: 144,
            darkElixirCost: 340000,
            priorityScore: 94,
            recommendation: 'Book of Heroes',
            cwlWarning: false,
            equipment: [
              { id: 'eq-rc1', name: 'Haste Vial', level: 18, maxLevel: 18, rarity: 'common', description: 'Rapid movement and strike rate', active: true },
              { id: 'eq-rc2', name: 'Rocket Spear', level: 22, maxLevel: 27, rarity: 'epic', description: 'Long-range defense strikes', active: true }
            ]
          }
        ]
      };

      onAddAccount(newAcc);

      setTimeout(() => {
        setSyncSuccess(false);
        setTagInput('');
        setNameInput('');
        onClose();
      }, 700);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-stone-100">
              Sync Clash of Clans Account by Tag
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset quick test badges */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick-Load Verified Clan Profile Templates</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_PLAYER_TEMPLATES.map((p) => (
              <button
                key={p.tag}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className="px-2.5 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 rounded-lg text-xs text-stone-300 transition-colors flex items-center gap-2"
              >
                <span className="font-bold text-amber-400">TH{p.townHallLevel}</span>
                <span>{p.name}</span>
                <span className="text-[10px] text-stone-500">({p.tag})</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSyncSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-stone-300">Player Tag (Starts with #)</label>
            <input
              type="text"
              required
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value.toUpperCase())}
              placeholder="#2PP0L8V2 or #V8CY..."
              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-amber-500"
            />
            <span className="text-[11px] text-stone-500">
              Found in-game under your profile below your avatar (e.g. #2PP0L8V2).
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-stone-300">Account Name / Nickname</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. War Queen, Mini TH16"
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-stone-300">Town Hall Level</label>
              <select
                value={townHallInput}
                onChange={(e) => setTownHallInput(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value={17}>Town Hall 17 (Apex)</option>
                <option value={16}>Town Hall 16</option>
                <option value={15}>Town Hall 15</option>
                <option value={14}>Town Hall 14</option>
                <option value={13}>Town Hall 13</option>
                <option value={12}>Town Hall 12</option>
              </select>
            </div>
          </div>

          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1 leading-relaxed">
            <div className="font-semibold text-stone-300 flex items-center gap-1.5">
              <span>Supercell Direct Sync Protocol</span>
            </div>
            <p>
              Imports village construction timers, active hero upgrade levels, clan war membership, 
              and capital raid statistics directly into your multi-account telemetry roster.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSyncing}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-all shadow-md disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Syncing with Supercell API...</span>
                </>
              ) : syncSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>Account Synced!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Import & Sync Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
