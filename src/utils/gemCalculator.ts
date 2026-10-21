import { TraderItem } from '../types/clash';

/**
 * Supercell Official Gem Cost formula for time skipping
 * Accurately calculates how many gems Supercell charges for any upgrade duration
 */
export function calculateGemsForTime(durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  if (durationSeconds <= 60) return 1;

  if (durationSeconds <= 3600) {
    // 1m to 1h -> 1 to 20 gems
    return Math.max(1, Math.floor(1 + ((durationSeconds - 60) * 19) / 3540));
  }

  if (durationSeconds <= 86400) {
    // 1h to 24h -> 20 to 260 gems
    return Math.floor(20 + ((durationSeconds - 3600) * 240) / 82800);
  }

  if (durationSeconds <= 604800) {
    // 1 day to 7 days -> 260 to 1,000 gems
    return Math.floor(260 + ((durationSeconds - 86400) * 740) / 518400);
  }

  // > 7 days -> 1000 gems + ~123 gems per additional day
  const extraSeconds = durationSeconds - 604800;
  const extraDays = extraSeconds / 86400;
  return Math.floor(1000 + extraDays * 123.33);
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return 'Complete!';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || (d === 0 && h === 0)) parts.push(`${m}m`);
  if (d === 0 && h === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

export const TRADER_BENCHMARKS: TraderItem[] = [
  {
    id: 'book_of_heroes',
    name: 'Book of Heroes',
    type: 'Magic Book',
    costGems: 500,
    timeSavedHours: 192, // 8 days on average hero upgrade
    gemsPerHourSaved: 500 / 192, // ~2.6 gems/hr
    efficiencyTier: 'S',
    advice: 'Highest gem value in Clash. Saves 8+ days of hero downtime for only 500 gems.'
  },
  {
    id: 'builder_potion',
    name: 'Builder Potion',
    type: 'Magic Potion',
    costGems: 285,
    timeSavedHours: 54, // 9h saved per builder * 6 builders = 54 hours
    gemsPerHourSaved: 285 / 54, // ~5.27 gems/hr
    efficiencyTier: 'A',
    advice: 'High value when all 6 builders are actively constructing long upgrades.'
  },
  {
    id: 'research_potion',
    name: 'Research Potion',
    type: 'Magic Potion',
    costGems: 120,
    timeSavedHours: 23, // 24x speed for 1h = 23h saved
    gemsPerHourSaved: 120 / 23, // ~5.21 gems/hr
    efficiencyTier: 'A',
    advice: 'Great laboratory accelerator, significantly cheaper than direct lab gemming.'
  },
  {
    id: 'book_of_building',
    name: 'Book of Building',
    type: 'Magic Book',
    costGems: 925,
    timeSavedHours: 336, // 14 days on major defense/TH
    gemsPerHourSaved: 925 / 336, // ~2.75 gems/hr
    efficiencyTier: 'S',
    advice: 'Massive value on 14+ day Town Hall or Eagle/Scattershot upgrades.'
  },
  {
    id: 'training_potion',
    name: 'Training Potion',
    type: 'Magic Potion',
    costGems: 25,
    timeSavedHours: 3,
    gemsPerHourSaved: 8.3,
    efficiencyTier: 'B',
    advice: 'Fun for 1-hour fast farming sessions, but lower net builder progress.'
  },
  {
    id: 'direct_resource_purchase',
    name: 'Direct Gold/Elixir Fill',
    type: 'Resource Purchase',
    costGems: 1800,
    timeSavedHours: 0,
    gemsPerHourSaved: 999,
    efficiencyTier: 'F',
    advice: 'Extreme trap. Never buy resources with gems; farm with Sneaky Goblins instead.'
  }
];

export interface GemmingAnalysis {
  directGems: number;
  hours: number;
  gemsPerHour: number;
  recommendation: string;
  tier: 'S' | 'A' | 'B' | 'F';
}

export function analyzeGemmingChoice(secondsRemaining: number): GemmingAnalysis {
  const directGems = calculateGemsForTime(secondsRemaining);
  const hours = secondsRemaining / 3600;
  const gemsPerHour = hours > 0 ? directGems / hours : 0;

  let recommendation = '';
  let tier: 'S' | 'A' | 'B' | 'F' = 'B';

  if (hours <= 0.25) {
    recommendation = `Only 1-3 gems to finish! S-tier convenience to free a builder immediately for war or an overnight upgrade.`;
    tier = 'S';
  } else if (hours < 1) {
    recommendation = `Only ${directGems} gems. Good value to finish if you want to start an overnight upgrade right now.`;
    tier = 'A';
  } else if (hours > 120) {
    recommendation = `Direct gemming costs ${directGems} gems! Use a Book of Heroes (500 gems) or Hammer instead for 3x–4x better value.`;
    tier = 'F';
  } else if (hours > 24) {
    recommendation = `Consider a Builder Potion (285 gems) if multiple builders are busy rather than direct skipping.`;
    tier = 'B';
  } else {
    recommendation = `Direct gemming is moderate value (${Math.round(gemsPerHour)} gems/hr). Wait for natural completion if not urgent.`;
    tier = 'B';
  }

  return {
    directGems,
    hours: Math.round(hours * 10) / 10,
    gemsPerHour: Math.round(gemsPerHour * 10) / 10,
    recommendation,
    tier
  };
}
