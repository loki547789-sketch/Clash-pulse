import React, { useState, useEffect, useRef } from 'react';
import { PlayerAccount, UpgradeItem, ClanWarData, ClanCapitalData } from './types/clash';
import { INITIAL_ACCOUNTS, INITIAL_WAR_DATA, INITIAL_CAPITAL_DATA } from './utils/initialData';
import { Header } from './components/Header';
import { AccountSelector } from './components/AccountSelector';
import { MultiAccountDashboard } from './components/MultiAccountDashboard';
import { BuilderProgressTracker } from './components/BuilderProgressTracker';
import { HeroOptimizer } from './components/HeroOptimizer';
import { ClanWarRaidTracker } from './components/ClanWarRaidTracker';
import { EventsTracker } from './components/EventsTracker';
import { GemAnalyticsView } from './components/GemAnalyticsView';
import { SyncAccountModal } from './components/SyncAccountModal';
import { 
  triggerUpgradeNotification, 
  triggerWarAlertNotification, 
  hasNotificationPermission, 
  requestNotificationPermission 
} from './utils/notifications';
import { playTapSound, playUpgradeCompleteSound } from './utils/audio';
import confetti from 'canvas-confetti';
import { Bell, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export default function App() {
  // Load saved accounts from localStorage or initial defaults
  const [accounts, setAccounts] = useState<PlayerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('clash_pulse_accounts_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACCOUNTS;
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string | 'all'>('all');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [toastAlert, setToastAlert] = useState<{ title: string; message: string; type: 'upgrade' | 'war' } | null>(null);

  const [warData, setWarData] = useState<ClanWarData>(() => {
    try {
      const saved = localStorage.getItem('clash_pulse_war_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_WAR_DATA;
  });

  const [capitalData, setCapitalData] = useState<ClanCapitalData>(() => {
    try {
      const saved = localStorage.getItem('clash_pulse_capital_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CAPITAL_DATA;
  });

  // Keep localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem('clash_pulse_accounts_v1', JSON.stringify(accounts));
    } catch {}
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('clash_pulse_war_v1', JSON.stringify(warData));
    } catch {}
  }, [warData]);

  // Check notification permission on mount
  useEffect(() => {
    if (hasNotificationPermission()) {
      setNotificationsEnabled(true);
    }
  }, []);

  // Live 1-second clock loop & upgrade completion detector
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Check if any active upgrade has finished
      setAccounts((prevAccounts) => {
        let changed = false;

        const updated = prevAccounts.map((account) => {
          let accountChanged = false;
          const updatedUpgrades = account.upgrades.map((upg) => {
            if (upg.status === 'active' && upg.endTime <= now && !upg.notified) {
              changed = true;
              accountChanged = true;

              // Fire alert & audio sound!
              triggerUpgradeNotification({
                buildingName: upg.targetName,
                level: upg.targetLevel,
                playerName: account.name,
                isHero: upg.category === 'hero'
              });

              setToastAlert({
                title: upg.category === 'hero' ? '⚔️ Hero Upgrade Finished!' : '🔨 Builder Finished Upgrade!',
                message: `${account.name} completed ${upg.targetName} Level ${upg.targetLevel}. Free builder ready!`,
                type: 'upgrade'
              });

              try {
                confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
              } catch {}

              return {
                ...upg,
                status: 'completed' as const,
                notified: true
              };
            }
            return upg;
          });

          if (!accountChanged) return account;

          const busyHome = updatedUpgrades.filter(u => (u.category === 'builder' || u.category === 'hero') && u.status === 'active').length;
          return {
            ...account,
            homeBuildersBusy: busyHome,
            upgrades: updatedUpgrades
          };
        });

        return changed ? updated : prevAccounts;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute next free builder duration in seconds across all accounts
  let nextFreeSeconds: number | null = null;
  accounts.forEach((acc) => {
    acc.upgrades.forEach((upg) => {
      if (upg.status === 'active') {
        const secs = Math.max(0, Math.floor((upg.endTime - currentTime) / 1000));
        if (nextFreeSeconds === null || secs < nextFreeSeconds) {
          nextFreeSeconds = secs;
        }
      }
    });
  });

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  // Actions
  const handleSelectAccount = (id: string | 'all') => {
    playTapSound();
    setSelectedAccountId(id);
    if (id !== 'all' && currentTab === 'dashboard') {
      // Keep on dashboard or allow user to toggle
    }
  };

  const handleFinishUpgradeNow = (accountId: string, upgradeId: string) => {
    playUpgradeCompleteSound();
    try {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    } catch {}

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const targetUpg = acc.upgrades.find(u => u.id === upgradeId);
        const filtered = acc.upgrades.filter((u) => u.id !== upgradeId);
        
        // Update hero level if it was a hero upgrade
        let updatedHeroes = acc.heroes;
        if (targetUpg && targetUpg.category === 'hero') {
          updatedHeroes = acc.heroes.map((h) => {
            if (h.name.toLowerCase().includes(targetUpg.targetName.toLowerCase())) {
              return { ...h, currentLevel: Math.min(h.maxLevel, h.currentLevel + 1) };
            }
            return h;
          });
        }

        const busyCount = filtered.filter(u => (u.category === 'builder' || u.category === 'hero') && u.status === 'active').length;

        setToastAlert({
          title: '🔨 Builder Freed Up!',
          message: `${targetUpg?.targetName || 'Upgrade'} was claimed. Builder is ready for a new order.`,
          type: 'upgrade'
        });

        return {
          ...acc,
          homeBuildersBusy: busyCount,
          heroes: updatedHeroes,
          upgrades: filtered,
        };
      })
    );
  };

  const handleSpeedUpUpgrade = (accountId: string, upgradeId: string, seconds: number) => {
    playTapSound();
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        return {
          ...acc,
          upgrades: acc.upgrades.map((u) => {
            if (u.id === upgradeId) {
              const newEndTime = Math.max(currentTime, u.endTime - seconds * 1000);
              return { ...u, endTime: newEndTime };
            }
            return u;
          }),
        };
      })
    );
  };

  const handleApplyBuilderPotion = (targetAccountId?: string) => {
    playUpgradeCompleteSound();
    const speedSeconds = 3600 * 9; // 9 hours off per builder

    setAccounts((prev) =>
      prev.map((acc) => {
        if (targetAccountId && acc.id !== targetAccountId) return acc;
        return {
          ...acc,
          upgrades: acc.upgrades.map((u) => {
            if (u.category === 'builder' || u.category === 'hero') {
              return { ...u, endTime: Math.max(currentTime, u.endTime - speedSeconds * 1000) };
            }
            return u;
          }),
        };
      })
    );

    setToastAlert({
      title: '⚡ Builder Potion Activated!',
      message: 'Construction speed accelerated 10x! 9 hours instantly cut from all active builders.',
      type: 'upgrade'
    });
  };

  const handleAddUpgrade = (accountId: string, newUpgData: Omit<UpgradeItem, 'id'>) => {
    playTapSound();
    const newUpg: UpgradeItem = {
      ...newUpgData,
      id: `upg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const newUpgrades = [...acc.upgrades, newUpg];
        const busy = newUpgrades.filter(u => (u.category === 'builder' || u.category === 'hero') && u.status === 'active').length;
        return {
          ...acc,
          homeBuildersBusy: busy,
          upgrades: newUpgrades,
        };
      })
    );

    setToastAlert({
      title: '🔨 Construction Commenced',
      message: `Builder #${newUpg.builderIndex} started upgrading ${newUpg.targetName} to Level ${newUpg.targetLevel}.`,
      type: 'upgrade'
    });
  };

  const handleCancelUpgrade = (accountId: string, upgradeId: string) => {
    playTapSound();
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== accountId) return acc;
        const filtered = acc.upgrades.filter((u) => u.id !== upgradeId);
        const busy = filtered.filter(u => (u.category === 'builder' || u.category === 'hero') && u.status === 'active').length;
        return {
          ...acc,
          homeBuildersBusy: busy,
          upgrades: filtered,
        };
      })
    );
  };

  const handleUpgradeHero = (accountId: string, heroName: string) => {
    playTapSound();
    const durationSec = 604800; // 7 days
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;

    // Find free builder
    const busyIndices = new Set(acc.upgrades.filter(u => u.category === 'builder' || u.category === 'hero').map(u => u.builderIndex));
    const freeSlot = [1, 2, 3, 4, 5, 6].find(idx => !busyIndices.has(idx)) || 1;

    const hero = acc.heroes.find(h => h.name === heroName);
    const targetLevel = (hero?.currentLevel || 50) + 1;

    handleAddUpgrade(accountId, {
      category: 'hero',
      targetName: heroName,
      level: hero?.currentLevel || 50,
      targetLevel,
      totalDurationSeconds: durationSec,
      endTime: Date.now() + durationSec * 1000,
      resourceType: 'dark_elixir',
      resourceCost: hero?.darkElixirCost || 320000,
      builderIndex: freeSlot,
      status: 'active',
      isPriorityHero: true,
    });
  };

  const handleSimulateWarAttack = () => {
    const isEnemy = Math.random() > 0.4;
    const stars = Math.random() > 0.3 ? 3 : 2;
    const destruction = stars === 3 ? 100 : Math.floor(75 + Math.random() * 24);
    const attacker = isEnemy ? 'Jarl Harald (Enemy #2)' : 'Chief Valkyrie';
    const defender = isEnemy ? 'Iron Forge (Mini Base #4)' : 'Nordic Dragons Base #1';

    const newAttack = {
      id: `atk-${Date.now()}`,
      timestamp: Date.now(),
      attackerTag: isEnemy ? '#EN99' : '#2PP0L8V2',
      attackerName: attacker,
      defenderTag: isEnemy ? '#89Y0Q9LR' : '#ND01',
      defenderName: defender,
      stars,
      destructionPercentage: destruction,
      isClanAttack: !isEnemy,
      armyUsed: isEnemy ? 'Super Archer Blimp + Hydra' : 'Root Rider Overgrowth Smash'
    };

    setWarData(prev => ({
      ...prev,
      clan: {
        ...prev.clan,
        stars: !isEnemy ? prev.clan.stars + stars : prev.clan.stars,
        attacks: !isEnemy ? prev.clan.attacks + 1 : prev.clan.attacks
      },
      opponent: {
        ...prev.opponent,
        stars: isEnemy ? prev.opponent.stars + stars : prev.opponent.stars,
        attacks: isEnemy ? prev.opponent.attacks + 1 : prev.opponent.attacks
      },
      attacks: [newAttack, ...prev.attacks]
    }));

    // Trigger notification + audio
    triggerWarAlertNotification({
      clanName: 'Titan Vanguard',
      message: `${attacker} scored ${stars} ★ (${destruction}%) against ${defender}!`,
      stars
    });

    setToastAlert({
      title: `⚔️ Clan War Attack: ${stars} Stars!`,
      message: `${attacker} achieved ${stars} ★ (${destruction}%) on ${defender}.`,
      type: 'war'
    });
  };

  const handleTestAlert = () => {
    // Find closest upgrade across all accounts and set endTime to now
    let found = false;
    for (const acc of accounts) {
      for (const upg of acc.upgrades) {
        if (upg.status === 'active') {
          handleSpeedUpUpgrade(acc.id, upg.id, upg.totalDurationSeconds + 1000);
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      triggerUpgradeNotification({
        buildingName: 'Town Hall 17 (Giga Inferno)',
        level: 5,
        playerName: selectedAccount.name,
      });
      setToastAlert({
        title: '🔨 Test Notification Dispatched!',
        message: 'Audio chime sounded and desktop push notification dispatched.',
        type: 'upgrade'
      });
    }
  };

  const handleAddSyncedAccount = (newAcc: PlayerAccount) => {
    playUpgradeCompleteSound();
    setAccounts(prev => [newAcc, ...prev]);
    setSelectedAccountId(newAcc.id);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}
    setToastAlert({
      title: '🛡️ Account Synced Successfully!',
      message: `${newAcc.name} (${newAcc.tag}) is now synced with real-time builder tracking.`,
      type: 'upgrade'
    });
  };

  const handleUpdateClanGamesPoints = (accountId: string, points: number) => {
    setAccounts(prev =>
      prev.map(acc => (acc.id === accountId ? { ...acc, clanGamesPoints: points } : acc))
    );
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        setNotificationsEnabled(true);
        triggerUpgradeNotification({
          buildingName: 'Clash Alert Service',
          level: 1,
          playerName: selectedAccount.name
        });
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          playTapSound();
          setCurrentTab(tab);
        }}
        onOpenSyncModal={() => {
          playTapSound();
          setIsSyncModalOpen(true);
        }}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={handleToggleNotifications}
      />

      {/* Account Switcher Bar */}
      <AccountSelector
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={handleSelectAccount}
        nextFreeSeconds={nextFreeSeconds}
        onQuickBuilderPotion={() => handleApplyBuilderPotion()}
        onSimulateComplete={handleTestAlert}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Render Active View */}
        {currentTab === 'dashboard' && (
          selectedAccountId === 'all' ? (
            <MultiAccountDashboard
              accounts={accounts}
              currentTime={currentTime}
              onSelectAccount={(id) => {
                setSelectedAccountId(id);
                setCurrentTab('builders');
              }}
              onFinishUpgradeNow={handleFinishUpgradeNow}
              onSpeedUpUpgrade={handleSpeedUpUpgrade}
              onApplyBuilderPotion={handleApplyBuilderPotion}
            />
          ) : (
            <BuilderProgressTracker
              account={selectedAccount}
              currentTime={currentTime}
              onFinishUpgradeNow={handleFinishUpgradeNow}
              onSpeedUpUpgrade={handleSpeedUpUpgrade}
              onAddUpgrade={handleAddUpgrade}
              onCancelUpgrade={handleCancelUpgrade}
              onApplyBuilderPotion={handleApplyBuilderPotion}
            />
          )
        )}

        {currentTab === 'builders' && (
          <BuilderProgressTracker
            account={selectedAccount}
            currentTime={currentTime}
            onFinishUpgradeNow={handleFinishUpgradeNow}
            onSpeedUpUpgrade={handleSpeedUpUpgrade}
            onAddUpgrade={handleAddUpgrade}
            onCancelUpgrade={handleCancelUpgrade}
            onApplyBuilderPotion={handleApplyBuilderPotion}
          />
        )}

        {currentTab === 'heroes' && (
          <HeroOptimizer
            accounts={accounts}
            selectedAccount={selectedAccount}
            currentTime={currentTime}
            onUpgradeHero={handleUpgradeHero}
            onFinishHeroUpgrade={handleFinishUpgradeNow}
          />
        )}

        {currentTab === 'war' && (
          <ClanWarRaidTracker
            warData={warData}
            capitalData={capitalData}
            currentTime={currentTime}
            onSimulateWarAttack={handleSimulateWarAttack}
          />
        )}

        {currentTab === 'events' && (
          <EventsTracker
            accounts={accounts}
            selectedAccount={selectedAccount}
            onUpdateClanGamesPoints={handleUpdateClanGamesPoints}
          />
        )}

        {currentTab === 'gems' && (
          <GemAnalyticsView
            accounts={accounts}
            selectedAccount={selectedAccount}
          />
        )}
      </main>

      {/* In-App Toast Notification */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-stone-900 border border-amber-500/50 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            {toastAlert.type === 'war' ? <Bell className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </div>
          <div className="flex-1 space-y-0.5 text-xs">
            <h4 className="font-bold text-stone-100">{toastAlert.title}</h4>
            <p className="text-stone-300 leading-relaxed">{toastAlert.message}</p>
          </div>
          <button
            onClick={() => setToastAlert(null)}
            className="text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sync Account Modal */}
      <SyncAccountModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onAddAccount={handleAddSyncedAccount}
      />
    </div>
  );
}
