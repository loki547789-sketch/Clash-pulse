import { PlayerAccount, ClanWarData, ClanCapitalData } from '../types/clash';

const now = Date.now();

export const INITIAL_ACCOUNTS: PlayerAccount[] = [
  {
    id: 'acc-1',
    tag: '#2PP0L8V2',
    name: 'Chief Valkyrie',
    role: 'Leader',
    townHallLevel: 17,
    builderHallLevel: 10,
    trophies: 5420,
    bestTrophies: 5680,
    warStars: 1840,
    clan: {
      name: 'Titan Vanguard',
      tag: '#9V8GQ0PL',
      badge: '🛡️',
      level: 24,
    },
    homeBuildersBusy: 6,
    homeBuildersTotal: 6,
    builderBaseBusy: 1,
    builderBaseTotal: 2,
    goblinBuilderHired: true,
    goldPassBoostPercent: 20,
    clanGamesPoints: 4000,
    seasonBankGold: 30000000,
    seasonBankElixir: 30000000,
    seasonBankDE: 350000,
    gemsCount: 3840,
    lastSynced: now - 120000,
    upgrades: [
      {
        id: 'upg-1-1',
        category: 'hero',
        targetName: 'Archer Queen',
        level: 94,
        targetLevel: 95,
        totalDurationSeconds: 691200, // 8 days
        endTime: now + 42000, // finishing in ~42 seconds for live demo trigger!
        resourceType: 'dark_elixir',
        resourceCost: 360000,
        builderIndex: 1,
        status: 'active',
        isPriorityHero: true,
      },
      {
        id: 'upg-1-2',
        category: 'builder',
        targetName: 'Town Hall 17 (Giga Inferno)',
        level: 3,
        targetLevel: 4,
        totalDurationSeconds: 1209600, // 14 days
        endTime: now + 3600 * 18, // 18 hours left
        resourceType: 'gold',
        resourceCost: 21500000,
        builderIndex: 2,
        status: 'active',
      },
      {
        id: 'upg-1-3',
        category: 'builder',
        targetName: 'Ricochet Cannon',
        level: 2,
        targetLevel: 3,
        totalDurationSeconds: 1036800, // 12 days
        endTime: now + 3600 * 46, // 1d 22h left
        resourceType: 'gold',
        resourceCost: 19000000,
        builderIndex: 3,
        status: 'active',
      },
      {
        id: 'upg-1-4',
        category: 'hero',
        targetName: 'Minion Prince',
        level: 14,
        targetLevel: 15,
        totalDurationSeconds: 518400, // 6 days
        endTime: now + 3600 * 74, // 3d 2h left
        resourceType: 'dark_elixir',
        resourceCost: 240000,
        builderIndex: 4,
        status: 'active',
        isPriorityHero: true,
      },
      {
        id: 'upg-1-5',
        category: 'builder',
        targetName: 'Monolith',
        level: 3,
        targetLevel: 4,
        totalDurationSeconds: 1296000, // 15 days
        endTime: now + 3600 * 128, // 5d 8h left
        resourceType: 'dark_elixir',
        resourceCost: 390000,
        builderIndex: 5,
        status: 'active',
      },
      {
        id: 'upg-1-6',
        category: 'builder',
        targetName: 'Multi-Archer Tower',
        level: 2,
        targetLevel: 3,
        totalDurationSeconds: 1123200, // 13 days
        endTime: now + 3600 * 210, // 8d 18h left
        resourceType: 'gold',
        resourceCost: 18500000,
        builderIndex: 6,
        status: 'active',
      },
      {
        id: 'upg-1-lab',
        category: 'lab',
        targetName: 'Root Rider',
        level: 2,
        targetLevel: 3,
        totalDurationSeconds: 1036800,
        endTime: now + 3600 * 32,
        resourceType: 'elixir',
        resourceCost: 20000000,
        builderIndex: 0,
        status: 'active',
      },
      {
        id: 'upg-1-pet',
        category: 'pet',
        targetName: 'Spirit Fox',
        level: 9,
        targetLevel: 10,
        totalDurationSeconds: 691200,
        endTime: now + 3600 * 55,
        resourceType: 'dark_elixir',
        resourceCost: 290000,
        builderIndex: 0,
        status: 'active',
      }
    ],
    heroes: [
      {
        id: 'h-1',
        name: 'Archer Queen',
        currentLevel: 94,
        maxLevel: 95,
        downtimeHours: 192,
        darkElixirCost: 360000,
        priorityScore: 98,
        recommendation: 'Book of Heroes',
        cwlWarning: true,
        equipment: [
          { id: 'eq-1', name: 'Giant Arrow', level: 18, maxLevel: 18, rarity: 'common', description: 'Pierces through the entire village line', active: true },
          { id: 'eq-2', name: 'Frozen Arrow', level: 27, maxLevel: 27, rarity: 'epic', description: 'Freezes target building speed by 75%', active: true },
          { id: 'eq-3', name: 'Healer Puppet', level: 16, maxLevel: 18, rarity: 'common', description: 'Spawns 3 healers when ability triggers', active: false }
        ]
      },
      {
        id: 'h-2',
        name: 'Barbarian King',
        currentLevel: 90,
        maxLevel: 95,
        downtimeHours: 192,
        darkElixirCost: 340000,
        priorityScore: 92,
        recommendation: 'Hammer of Heroes',
        cwlWarning: false,
        equipment: [
          { id: 'eq-4', name: 'Giant Gauntlet', level: 27, maxLevel: 27, rarity: 'epic', description: 'Massive splash damage and 60% damage reduction', active: true },
          { id: 'eq-5', name: 'Spiky Ball', level: 24, maxLevel: 27, rarity: 'epic', description: 'Bounces across 6 defensive buildings', active: true },
          { id: 'eq-6', name: 'Rage Vial', level: 18, maxLevel: 18, rarity: 'common', description: 'Enrages king with 155% speed boost', active: false }
        ]
      },
      {
        id: 'h-3',
        name: 'Grand Warden',
        currentLevel: 70,
        maxLevel: 70,
        downtimeHours: 0,
        darkElixirCost: 0,
        priorityScore: 85,
        recommendation: 'Standard Upgrade',
        cwlWarning: false,
        equipment: [
          { id: 'eq-7', name: 'Eternal Tome', level: 18, maxLevel: 18, rarity: 'common', description: 'Makes all nearby troops invincible for 9.5s', active: true },
          { id: 'eq-8', name: 'Fireball', level: 26, maxLevel: 27, rarity: 'epic', description: 'Huge arcane blast wiping cluster defenses', active: true }
        ]
      },
      {
        id: 'h-4',
        name: 'Royal Champion',
        currentLevel: 44,
        maxLevel: 45,
        downtimeHours: 192,
        darkElixirCost: 380000,
        priorityScore: 95,
        recommendation: 'Book of Heroes',
        cwlWarning: true,
        equipment: [
          { id: 'eq-9', name: 'Rocket Spear', level: 25, maxLevel: 27, rarity: 'epic', description: 'Long-range spear strikes over walls', active: true },
          { id: 'eq-10', name: 'Haste Vial', level: 18, maxLevel: 18, rarity: 'common', description: 'Turbocharges attack speed and movespeed', active: true }
        ]
      },
      {
        id: 'h-5',
        name: 'Minion Prince',
        currentLevel: 14,
        maxLevel: 40,
        downtimeHours: 144,
        darkElixirCost: 240000,
        priorityScore: 88,
        recommendation: 'Builder Potion',
        cwlWarning: false,
        equipment: [
          { id: 'eq-11', name: 'Dark Orb', level: 15, maxLevel: 27, rarity: 'epic', description: 'Corrupts enemy defenses dealing continuous damage', active: true },
          { id: 'eq-12', name: 'Wing Flurry', level: 12, maxLevel: 18, rarity: 'common', description: 'Pushes air mines and launches dark volleys', active: true }
        ]
      }
    ]
  },
  {
    id: 'acc-2',
    tag: '#89Y0Q9LR',
    name: 'Iron Forge (Mini)',
    role: 'Co-Leader',
    townHallLevel: 15,
    builderHallLevel: 9,
    trophies: 4650,
    bestTrophies: 4890,
    warStars: 1280,
    clan: {
      name: 'Titan Vanguard',
      tag: '#9V8GQ0PL',
      badge: '🛡️',
      level: 24,
    },
    homeBuildersBusy: 5,
    homeBuildersTotal: 6,
    builderBaseBusy: 0,
    builderBaseTotal: 2,
    goblinBuilderHired: false,
    goldPassBoostPercent: 15,
    clanGamesPoints: 3450,
    seasonBankGold: 22000000,
    seasonBankElixir: 20000000,
    seasonBankDE: 220000,
    gemsCount: 1920,
    lastSynced: now - 340000,
    upgrades: [
      {
        id: 'upg-2-1',
        category: 'builder',
        targetName: 'Eagle Artillery',
        level: 5,
        targetLevel: 6,
        totalDurationSeconds: 1209600,
        endTime: now + 3600 * 9, // 9 hours left
        resourceType: 'gold',
        resourceCost: 19000000,
        builderIndex: 1,
        status: 'active',
      },
      {
        id: 'upg-2-2',
        category: 'hero',
        targetName: 'Grand Warden',
        level: 63,
        targetLevel: 64,
        totalDurationSeconds: 604800,
        endTime: now + 3600 * 30,
        resourceType: 'elixir',
        resourceCost: 16500000,
        builderIndex: 2,
        status: 'active',
        isPriorityHero: true,
      },
      {
        id: 'upg-2-3',
        category: 'builder',
        targetName: 'Inferno Tower',
        level: 8,
        targetLevel: 9,
        totalDurationSeconds: 950400,
        endTime: now + 3600 * 76,
        resourceType: 'gold',
        resourceCost: 17000000,
        builderIndex: 3,
        status: 'active',
      },
      {
        id: 'upg-2-4',
        category: 'builder',
        targetName: 'X-Bow',
        level: 9,
        targetLevel: 10,
        totalDurationSeconds: 864000,
        endTime: now + 3600 * 110,
        resourceType: 'gold',
        resourceCost: 16000000,
        builderIndex: 4,
        status: 'active',
      },
      {
        id: 'upg-2-5',
        category: 'builder',
        targetName: 'Clan Castle',
        level: 10,
        targetLevel: 11,
        totalDurationSeconds: 1036800,
        endTime: now + 3600 * 160,
        resourceType: 'gold',
        resourceCost: 18000000,
        builderIndex: 5,
        status: 'active',
      }
    ],
    heroes: [
      {
        id: 'h-2-1',
        name: 'Barbarian King',
        currentLevel: 82,
        maxLevel: 90,
        downtimeHours: 192,
        darkElixirCost: 290000,
        priorityScore: 89,
        recommendation: 'Book of Heroes',
        cwlWarning: false,
        equipment: []
      },
      {
        id: 'h-2-2',
        name: 'Archer Queen',
        currentLevel: 85,
        maxLevel: 90,
        downtimeHours: 192,
        darkElixirCost: 310000,
        priorityScore: 96,
        recommendation: 'Book of Heroes',
        cwlWarning: false,
        equipment: []
      },
      {
        id: 'h-2-3',
        name: 'Grand Warden',
        currentLevel: 63,
        maxLevel: 65,
        downtimeHours: 168,
        darkElixirCost: 0,
        priorityScore: 94,
        recommendation: 'Standard Upgrade',
        cwlWarning: true,
        equipment: []
      },
      {
        id: 'h-2-4',
        name: 'Royal Champion',
        currentLevel: 36,
        maxLevel: 40,
        downtimeHours: 168,
        darkElixirCost: 320000,
        priorityScore: 90,
        recommendation: 'Hammer of Heroes',
        cwlWarning: false,
        equipment: []
      }
    ]
  },
  {
    id: 'acc-3',
    tag: '#Q2LR89C0',
    name: 'Goblin Donator',
    role: 'Elder',
    townHallLevel: 13,
    builderHallLevel: 8,
    trophies: 3410,
    bestTrophies: 3820,
    warStars: 740,
    clan: {
      name: 'Titan Vanguard',
      tag: '#9V8GQ0PL',
      badge: '🛡️',
      level: 24,
    },
    homeBuildersBusy: 4,
    homeBuildersTotal: 5,
    builderBaseBusy: 1,
    builderBaseTotal: 2,
    goblinBuilderHired: false,
    goldPassBoostPercent: 0,
    clanGamesPoints: 1200,
    seasonBankGold: 5000000,
    seasonBankElixir: 5000000,
    seasonBankDE: 50000,
    gemsCount: 950,
    lastSynced: now - 820000,
    upgrades: [
      {
        id: 'upg-3-1',
        category: 'builder',
        targetName: 'Scattershot',
        level: 1,
        targetLevel: 2,
        totalDurationSeconds: 864000,
        endTime: now + 3600 * 5, // 5 hours left
        resourceType: 'gold',
        resourceCost: 14500000,
        builderIndex: 1,
        status: 'active',
      },
      {
        id: 'upg-3-2',
        category: 'hero',
        targetName: 'Royal Champion',
        level: 18,
        targetLevel: 19,
        totalDurationSeconds: 432000,
        endTime: now + 3600 * 22,
        resourceType: 'dark_elixir',
        resourceCost: 160000,
        builderIndex: 2,
        status: 'active',
        isPriorityHero: true,
      },
      {
        id: 'upg-3-3',
        category: 'builder',
        targetName: 'Air Defense',
        level: 10,
        targetLevel: 11,
        totalDurationSeconds: 604800,
        endTime: now + 3600 * 68,
        resourceType: 'gold',
        resourceCost: 11000000,
        builderIndex: 3,
        status: 'active',
      },
      {
        id: 'upg-3-4',
        category: 'builder',
        targetName: 'Army Camp',
        level: 10,
        targetLevel: 11,
        totalDurationSeconds: 777600,
        endTime: now + 3600 * 115,
        resourceType: 'elixir',
        resourceCost: 12000000,
        builderIndex: 4,
        status: 'active',
      }
    ],
    heroes: [
      {
        id: 'h-3-1',
        name: 'Barbarian King',
        currentLevel: 65,
        maxLevel: 75,
        downtimeHours: 144,
        darkElixirCost: 180000,
        priorityScore: 80,
        recommendation: 'Standard Upgrade',
        cwlWarning: false,
        equipment: []
      },
      {
        id: 'h-3-2',
        name: 'Archer Queen',
        currentLevel: 72,
        maxLevel: 75,
        downtimeHours: 144,
        darkElixirCost: 210000,
        priorityScore: 94,
        recommendation: 'Book of Heroes',
        cwlWarning: false,
        equipment: []
      },
      {
        id: 'h-3-3',
        name: 'Royal Champion',
        currentLevel: 18,
        maxLevel: 25,
        downtimeHours: 120,
        darkElixirCost: 160000,
        priorityScore: 91,
        recommendation: 'Standard Upgrade',
        cwlWarning: true,
        equipment: []
      }
    ]
  }
];

export const INITIAL_WAR_DATA: ClanWarData = {
  state: 'inWar',
  teamSize: 30,
  endTime: now + 3600 * 6 + 1800, // 6h 30m remaining
  clan: {
    name: 'Titan Vanguard',
    tag: '#9V8GQ0PL',
    stars: 76,
    destructionPercentage: 94.8,
    attacks: 26,
    maxAttacks: 30,
  },
  opponent: {
    name: 'Nordic Dragons',
    tag: '#2LR9YYVC',
    stars: 71,
    destructionPercentage: 91.2,
    attacks: 24,
    maxAttacks: 30,
  },
  attacks: [
    {
      id: 'atk-1',
      timestamp: now - 3600 * 2,
      attackerTag: '#2PP0L8V2',
      attackerName: 'Chief Valkyrie',
      defenderTag: '#ND02',
      defenderName: 'Ragnar TH17',
      stars: 3,
      destructionPercentage: 100,
      isClanAttack: true,
      armyUsed: 'Root Rider + Valkyrie + Overgrowth'
    },
    {
      id: 'atk-2',
      timestamp: now - 3600 * 1.4,
      attackerTag: '#ENEMY04',
      attackerName: 'Bjorn The Great',
      defenderTag: '#89Y0Q9LR',
      defenderName: 'Iron Forge (Mini)',
      stars: 2,
      destructionPercentage: 86,
      isClanAttack: false,
      armyUsed: 'Super Bowler Smash'
    },
    {
      id: 'atk-3',
      timestamp: now - 1800,
      attackerTag: '#89Y0Q9LR',
      attackerName: 'Iron Forge (Mini)',
      defenderTag: '#ND07',
      defenderName: 'Frostbite Base',
      stars: 3,
      destructionPercentage: 100,
      isClanAttack: true,
      armyUsed: 'Zap Titan Witch'
    },
    {
      id: 'atk-4',
      timestamp: now - 420,
      attackerTag: '#ENEMY01',
      attackerName: 'Jarl Harald',
      defenderTag: '#2PP0L8V2',
      defenderName: 'Chief Valkyrie',
      stars: 1,
      destructionPercentage: 68,
      isClanAttack: false,
      armyUsed: 'Dragon Rider Blizzard'
    }
  ]
};

export const INITIAL_CAPITAL_DATA: ClanCapitalData = {
  state: 'active',
  capitalHallLevel: 10,
  totalLoot: 846200,
  totalAttacks: 142,
  maxAttacks: 180,
  estimatedRaidMedals: 1540,
  raidEndsInSeconds: 3600 * 28, // 28 hours
  districts: [
    { id: 'cd-1', name: 'Capital Peak', destruction: 100, stars: 3, status: 'cleared', capitalGoldLooted: 240000 },
    { id: 'cd-2', name: 'Skeleton Park', destruction: 100, stars: 3, status: 'cleared', capitalGoldLooted: 184000 },
    { id: 'cd-3', name: 'Barbarian Camp', destruction: 82, stars: 2, status: 'under_attack', capitalGoldLooted: 142000 },
    { id: 'cd-4', name: 'Wizard Valley', destruction: 100, stars: 3, status: 'cleared', capitalGoldLooted: 160000 },
    { id: 'cd-5', name: 'Dragon Cliffs', destruction: 48, stars: 1, status: 'under_attack', capitalGoldLooted: 68000 },
    { id: 'cd-6', name: 'Golem Quarry', destruction: 0, stars: 0, status: 'open', capitalGoldLooted: 0 }
  ]
};
