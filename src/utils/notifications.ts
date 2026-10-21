import { playUpgradeCompleteSound, playWarAlertSound } from './audio';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return Notification.permission;
  }
}

export function hasNotificationPermission(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

export function triggerUpgradeNotification(options: {
  buildingName: string;
  level: number;
  playerName: string;
  isHero?: boolean;
}) {
  // Play triumphant chime
  playUpgradeCompleteSound();

  const title = options.isHero 
    ? `⚔️ Hero Upgrade Finished: ${options.buildingName}!`
    : `🔨 Upgrade Complete: ${options.buildingName} Level ${options.level}!`;
  
  const body = `${options.playerName} has a builder ready for the next assignment. Upgrade was completed just now.`;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `upgrade-${options.buildingName}-${Date.now()}`
      });
    } catch {
      // In case iframe sandbox restricts Notification instantiation
      console.warn('Browser desktop notification could not be dispatched.');
    }
  }

  return { title, body };
}

export function triggerWarAlertNotification(options: {
  clanName: string;
  message: string;
  stars?: number;
}) {
  playWarAlertSound();

  const title = `🛡️ Clan War Alert: ${options.clanName}`;
  const body = options.message;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `war-alert-${Date.now()}`
      });
    } catch {
      console.warn('Browser desktop notification could not be dispatched.');
    }
  }

  return { title, body };
}
