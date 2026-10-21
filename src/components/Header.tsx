import React from 'react';
import { Shield, Bell, BellOff } from 'lucide-react';
import { hasNotificationPermission, requestNotificationPermission } from '../utils/notifications';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSyncModal: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenSyncModal,
  notificationsEnabled,
  onToggleNotifications
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Empire' },
    { id: 'builders', label: 'Builders' },
    { id: 'heroes', label: 'Hero Optimizer' },
    { id: 'war', label: 'War & Capital' },
    { id: 'events', label: 'Events & Pass' },
    { id: 'gems', label: 'Gem Economy' },
  ];

  const handleRequestPermission = async () => {
    if (!hasNotificationPermission()) {
      const res = await requestNotificationPermission();
      if (res === 'granted') {
        onToggleNotifications();
      }
    } else {
      onToggleNotifications();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-inner border border-amber-400/40">
            <Shield className="w-5 h-5 text-stone-950 fill-stone-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-amber-100">
            Clash Pulse
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line text nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentTab === item.id
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action with secondary notification toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRequestPermission}
            title={notificationsEnabled ? 'Desktop alerts active' : 'Click to enable alerts'}
            className={`p-2 rounded-lg border transition-colors ${
              notificationsEnabled
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-400 hover:bg-amber-900/40'
                : 'bg-stone-800/60 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            {notificationsEnabled ? (
              <Bell className="w-4 h-4 fill-amber-400/20" />
            ) : (
              <BellOff className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onOpenSyncModal}
            className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            + Sync Account
          </button>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t border-stone-800/80 bg-stone-900 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded ${
              currentTab === item.id
                ? 'bg-amber-500/20 text-amber-300 font-semibold'
                : 'text-stone-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
