import type { NormalizedCollection, NormalizedStats, PetSummary } from "./types";

export type PlayerTitle = {
  name: string;
  type: "progression" | "skill" | "boss" | "collection" | "pet" | "meme" | "endgame";
  prestige: number;
};

function skill(stats: NormalizedStats | undefined, name: string) {
  return stats?.skills.find((entry) => entry.name === name);
}

export function getPlayerTitles(input: {
  stats?: NormalizedStats;
  collection?: NormalizedCollection;
  pets?: PetSummary;
  gains?: NormalizedStats;
}): PlayerTitle[] {
  const { stats, collection, pets, gains } = input;
  const titles: PlayerTitle[] = [];
  const totalLevel = stats?.totalLevel ?? 0;
  const totalXp = stats?.totalXp ?? 0;
  const bossKc = stats?.totalBossKc ?? 0;
  const petCount = pets?.petCount ?? 0;
  const woodcutting = skill(stats, "Woodcutting");
  const slayer = skill(stats, "Slayer");

  [
    [2277, "Maxed Menace", 100],
    [2200, "Near Max Menace", 90],
    [2000, "Elite Adventurer", 75],
    [1750, "Veteran", 55],
    [1500, "Seasoned Adventurer", 40],
    [1000, "Adventurer", 20]
  ].forEach(([target, name, prestige]) => totalLevel >= Number(target) && titles.push({ name: String(name), type: "progression", prestige: Number(prestige) }));

  [
    [4_600_000_000, "The End of Numbers", 120],
    [1_000_000_000, "One Billion Problem", 95],
    [500_000_000, "Experience Overlord", 80],
    [250_000_000, "XP Machine", 65],
    [100_000_000, "XP Addict", 45],
    [50_000_000, "XP Enjoyer", 30]
  ].forEach(([target, name, prestige]) => totalXp >= Number(target) && titles.push({ name: String(name), type: "progression", prestige: Number(prestige) }));

  if ((woodcutting?.level ?? 0) >= 99) titles.push({ name: "Master Lumberjack", type: "skill", prestige: 55 });
  if ((woodcutting?.xp ?? 0) >= 25_000_000) titles.push({ name: "Forest Tyrant", type: "skill", prestige: 70 });
  if ((slayer?.level ?? 0) >= 99) titles.push({ name: "Task Goblin", type: "skill", prestige: 55 });
  if ((slayer?.xp ?? 0) >= 50_000_000) titles.push({ name: "Contract Killer", type: "skill", prestige: 80 });

  [
    [100000, "The Unending", 120],
    [50000, "Reaper", 100],
    [25000, "Executioner", 85],
    [10000, "Boss Goblin", 70],
    [5000, "Boss Addict", 55],
    [1000, "Boss Hunter", 35],
    [100, "Boss Curious", 15]
  ].forEach(([target, name, prestige]) => bossKc >= Number(target) && titles.push({ name: String(name), type: "boss", prestige: Number(prestige) }));

  [
    [2000, "The Collection Log Itself", 120],
    [1500, "Living Museum", 95],
    [1000, "Curator", 75],
    [500, "Archivist", 55],
    [250, "Collector", 35],
    [100, "Seeker", 20],
    [50, "Finder", 10]
  ].forEach(([target, name, prestige]) => (collection?.finishedItems ?? 0) >= Number(target) && titles.push({ name: String(name), type: "collection", prestige: Number(prestige) }));

  [
    [40, "Jagex Bribery Suspect", 120],
    [30, "Noah of Gielinor", 100],
    [20, "Zookeeper", 80],
    [10, "Pet Lord", 55],
    [5, "Menagerie Keeper", 35],
    [3, "Beast Friend", 20],
    [1, "Lucky", 10]
  ].forEach(([target, name, prestige]) => petCount >= Number(target) && titles.push({ name: String(name), type: "pet", prestige: Number(prestige) }));

  if ((gains?.totalXp ?? 0) >= 5_000_000) titles.push({ name: "Touch Grass Warning", type: "meme", prestige: 65 });
  if (gains && gains.totalXp <= 0) titles.push({ name: "Professional Bankstander", type: "meme", prestige: 25 });
  if (bossKc > 5000 && petCount === 0) titles.push({ name: "Dry Victim", type: "meme", prestige: 45 });

  return titles.sort((a, b) => b.prestige - a.prestige);
}

export function getMainTitle(titles: PlayerTitle[]): string {
  return titles[0]?.name ?? "Unranked Adventurer";
}
