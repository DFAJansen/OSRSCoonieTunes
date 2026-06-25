import type { NormalizedCollection, NormalizedStats, PetSummary } from "./types";
import type { GodName } from "./favour";

export type AchievementCategory = "skills" | "bosses" | "collection" | "pets" | "gains" | "party" | "meme";
export type AchievementDifficulty = "easy" | "medium" | "hard" | "master" | "grandmaster";
export type AchievementStatus = "completed" | "in-progress" | "locked";
export type AchievementGod = Exclude<GodName, "Guthix">;

export type AchievementDefinition = {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  god: AchievementGod;
  difficulty: AchievementDifficulty;
  requirements: string;
  reward: string;
  nextTier: string;
  rewardTitle: string;
  favour: number;
  points: number;
  target: number;
  getValue: (player: AchievementPlayerData) => number;
};

export type AchievementPlayerData = {
  username: string;
  stats?: NormalizedStats;
  gains?: NormalizedStats;
  collection?: NormalizedCollection;
  pets?: PetSummary;
};

export type AchievementResult = AchievementDefinition & {
  player: string;
  current: number;
  progress: number;
  status: AchievementStatus;
};

export type Achievement = AchievementResult;

function level(player: AchievementPlayerData, skillName: string): number {
  return player.stats?.skills.find((skill) => skill.name === skillName)?.level ?? 0;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "bandos_boss_1000", name: "Warband Initiate", description: "Reach 1,000 total boss KC.", category: "bosses", god: "Bandos", difficulty: "medium", requirements: "1,000 total boss killcount", reward: "+150 Bandos favour", nextTier: "General's Butcher", rewardTitle: "Boss Hunter", favour: 150, points: 150, target: 1000, getValue: (player) => player.stats?.totalBossKc ?? 0 },
  { id: "bandos_boss_10000", name: "General's Butcher", description: "Reach 10,000 total boss KC.", category: "bosses", god: "Bandos", difficulty: "grandmaster", requirements: "10,000 total boss killcount", reward: "+600 Bandos favour", nextTier: "Bandos path complete", rewardTitle: "Boss Goblin", favour: 600, points: 600, target: 10000, getValue: (player) => player.stats?.totalBossKc ?? 0 },
  { id: "saradomin_woodcutting_99", name: "Sacred Lumber Rite", description: "Reach level 99 Woodcutting.", category: "skills", god: "Saradomin", difficulty: "hard", requirements: "Level 99 Woodcutting", reward: "+250 Saradomin favour", nextTier: "Temple Paragon", rewardTitle: "Master Lumberjack", favour: 250, points: 250, target: 99, getValue: (player) => level(player, "Woodcutting") },
  { id: "saradomin_total_2000", name: "Temple Paragon", description: "Reach total level 2000.", category: "skills", god: "Saradomin", difficulty: "master", requirements: "Total level 2,000", reward: "+350 Saradomin favour", nextTier: "Saradomin path complete", rewardTitle: "Elite Adventurer", favour: 350, points: 350, target: 2000, getValue: (player) => player.stats?.totalLevel ?? 0 },
  { id: "armadyl_collection_500", name: "Sky Archive Keeper", description: "Own 500 collection log items.", category: "collection", god: "Armadyl", difficulty: "hard", requirements: "500 collection log items", reward: "+300 Armadyl favour", nextTier: "Vault Curator", rewardTitle: "Archivist", favour: 300, points: 300, target: 500, getValue: (player) => player.collection?.finishedItems ?? 0 },
  { id: "armadyl_collection_1000", name: "Vault Curator", description: "Own 1,000 collection log items.", category: "collection", god: "Armadyl", difficulty: "grandmaster", requirements: "1,000 collection log items", reward: "+650 Armadyl favour", nextTier: "Armadyl path complete", rewardTitle: "Curator", favour: 650, points: 650, target: 1000, getValue: (player) => player.collection?.finishedItems ?? 0 },
  { id: "armadyl_pets_1", name: "First Familiar", description: "Get your first pet.", category: "pets", god: "Armadyl", difficulty: "easy", requirements: "Own 1 pet", reward: "+100 Armadyl favour", nextTier: "Menagerie Warden", rewardTitle: "Lucky", favour: 100, points: 100, target: 1, getValue: (player) => player.pets?.petCount ?? 0 },
  { id: "armadyl_pets_5", name: "Menagerie Warden", description: "Own 5 pets.", category: "pets", god: "Armadyl", difficulty: "master", requirements: "Own 5 pets", reward: "+500 Armadyl favour", nextTier: "Armadyl path complete", rewardTitle: "Menagerie Keeper", favour: 500, points: 500, target: 5, getValue: (player) => player.pets?.petCount ?? 0 },
  { id: "zamorak_gains_1m_week", name: "Chaos Surge", description: "Gain 1M XP in a week.", category: "gains", god: "Zamorak", difficulty: "hard", requirements: "Gain 1,000,000 XP this week", reward: "+250 Zamorak favour", nextTier: "Abyssal Idler", rewardTitle: "Unemployed Energy", favour: 250, points: 250, target: 1_000_000, getValue: (player) => player.gains?.totalXp ?? 0 },
  { id: "zamorak_bankstander", name: "Abyssal Idler", description: "Gain 0 XP in the selected week.", category: "meme", god: "Zamorak", difficulty: "easy", requirements: "Gain exactly 0 XP this week", reward: "+25 Zamorak favour", nextTier: "Chaos path complete", rewardTitle: "Professional Bankstander", favour: 25, points: 25, target: 1, getValue: (player) => player.gains && player.gains.totalXp <= 0 ? 1 : 0 }
];

export function evaluateAchievement(definition: AchievementDefinition, player: AchievementPlayerData): AchievementResult {
  const current = definition.getValue(player);
  const progress = Math.min(current / definition.target, 1);
  return {
    ...definition,
    player: player.username,
    current,
    progress,
    status: progress >= 1 ? "completed" : progress >= 0.5 ? "in-progress" : "locked"
  };
}

export function evaluateAchievements(players: AchievementPlayerData[]): AchievementResult[] {
  return players.flatMap((player) => ACHIEVEMENTS.map((achievement) => evaluateAchievement(achievement, player)));
}
