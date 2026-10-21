export type UpgradeCategory = 'builder' | 'hero' | 'lab' | 'pet' | 'forge' | 'builder_base';

export type ResourceType = 'gold' | 'elixir' | 'dark_elixir' | 'capital_gold';

export interface UpgradeItem {
  id: string;
  category: UpgradeCategory;
  targetName: string;
  level: number;
  targetLevel: number;
  totalDurationSeconds: number;
  endTime: number; // unix timestamp in ms
  resourceType: ResourceType;
  resourceCost: number;
  builderIndex: number; // 1 to 6
  status: 'active' | 'completed' | 'paused';
  isPriorityHero?: boolean;
  notified?: boolean;
  icon?: string;
}

export interface HeroEquipment {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  rarity: 'common' | 'epic';
  description: string;
  active: boolean;
}

export interface HeroData {
  id: string;
  name: 'Barbarian King' | 'Archer Queen' | 'Grand Warden' | 'Royal Champion' | 'Minion Prince';
  currentLevel: number;
  maxLevel: number;
  downtimeHours: number;
  darkElixirCost: number;
  equipment: HeroEquipment[];
  priorityScore: number; // 1-100
  recommendation: 'Book of Heroes' | 'Hammer of Heroes' | 'Builder Potion' | 'Standard Upgrade';
  cwlWarning: boolean;
  activeUpgrade?: UpgradeItem;
}

export interface WarAttackLog {
  id: string;
  timestamp: number;
  attackerTag: string;
  attackerName: string;
  defenderTag: string;
  defenderName: string;
  stars: number;
  destructionPercentage: number;
  isClanAttack: boolean;
  armyUsed: string;
}

export interface ClanWarData {
  state: 'inWar' | 'preparation' | 'warEnded';
  clan: {
    name: string;
    tag: string;
    stars: number;
    destructionPercentage: number;
    attacks: number;
    maxAttacks: number;
  };
  opponent: {
    name: string;
    tag: string;
    stars: number;
    destructionPercentage: number;
    attacks: number;
    maxAttacks: number;
  };
  teamSize: number;
  endTime: number;
  attacks: WarAttackLog[];
}

export interface CapitalDistrict {
  id: string;
  name: string;
  destruction: number;
  stars: number;
  status: 'cleared' | 'under_attack' | 'open';
  capitalGoldLooted: number;
}

export interface ClanCapitalData {
  state: 'active' | 'ended';
  capitalHallLevel: number;
  totalLoot: number;
  totalAttacks: number;
  maxAttacks: number;
  districts: CapitalDistrict[];
  estimatedRaidMedals: number;
  raidEndsInSeconds: number;
}

export interface ClanGameChallenge {
  id: string;
  title: string;
  points: number;
  durationMinutes: number;
  progress: number;
  goal: number;
  unit: string;
  completed: boolean;
}

export interface PlayerAccount {
  id: string;
  tag: string;
  name: string;
  role: 'Leader' | 'Co-Leader' | 'Elder' | 'Member';
  townHallLevel: number;
  builderHallLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  clan: {
    name: string;
    tag: string;
    badge: string;
    level: number;
  };
  homeBuildersBusy: number;
  homeBuildersTotal: number;
  builderBaseBusy: number;
  builderBaseTotal: number;
  goblinBuilderHired: boolean;
  goldPassBoostPercent: number; // 0, 10, 15, 20
  upgrades: UpgradeItem[];
  heroes: HeroData[];
  clanGamesPoints: number; // e.g. 0 to 4000
  seasonBankGold: number;
  seasonBankElixir: number;
  seasonBankDE: number;
  gemsCount: number;
  lastSynced: number;
}

export interface TraderItem {
  id: string;
  name: string;
  type: string;
  costGems: number;
  timeSavedHours: number;
  gemsPerHourSaved: number;
  efficiencyTier: 'S' | 'A' | 'B' | 'F';
  advice: string;
}
