import type { Award, NormalizedCollection, NormalizedStats, PetSummary, RecentItem } from "./types";
import { formatNumber, formatPercent } from "./format";

function topBy<T>(items: T[], score: (item: T) => number): T | undefined {
  return [...items].sort((a, b) => score(b) - score(a))[0];
}

export function buildAwards(input: {
  stats?: NormalizedStats[];
  gains?: NormalizedStats[];
  collections?: NormalizedCollection[];
  pets?: PetSummary[];
  recentItems?: RecentItem[];
}): Award[] {
  const awards: Award[] = [];
  const stats = input.stats ?? [];

  const xp = topBy(stats, (player) => player.totalXp);
  if (xp) awards.push({ title: "Highest Total XP", player: xp.username, detail: `${formatNumber(xp.totalXp)} XP` });

  const level = topBy(stats, (player) => player.totalLevel);
  if (level) awards.push({ title: "Highest Total Level", player: level.username, detail: `${level.totalLevel} levels` });

  const boss = topBy(stats, (player) => player.totalBossKc);
  if (boss) awards.push({ title: "Boss Goblin", player: boss.username, detail: `${formatNumber(boss.totalBossKc)} total KC` });

  const woodcutting = topBy(stats, (player) => player.skills.find((skill) => skill.name === "Woodcutting")?.xp ?? -1);
  if (woodcutting) awards.push({ title: "Woodcutting King", player: woodcutting.username, detail: "Gielinor may need new trees." });

  const grinder = topBy(input.gains ?? [], (player) => player.totalXp);
  if (grinder) awards.push({ title: "Biggest Grinder", player: grinder.username, detail: `${formatNumber(grinder.totalXp)} XP gained` });

  const petLord = topBy(input.pets ?? [], (player) => player.petCount ?? -1);
  if (petLord) awards.push({ title: "Pet Lord", player: petLord.username, detail: `${formatNumber(petLord.petCount)} pets` });

  const clog = topBy(input.collections ?? [], (player) => player.percentage ?? -1);
  if (clog) awards.push({ title: "Collection Log Enjoyer", player: clog.username, detail: `${formatPercent(clog.percentage)} complete` });

  const spoonCounts = (input.recentItems ?? []).reduce<Record<string, number>>((acc, item) => {
    acc[item.player] = (acc[item.player] ?? 0) + (item.notable ? 2 : 1);
    return acc;
  }, {});
  const spoon = Object.entries(spoonCounts).sort((a, b) => b[1] - a[1])[0];
  if (spoon) awards.push({ title: "Biggest Spoon", player: spoon[0], detail: `${spoon[1]} suspicious loot points` });

  const lowGains = (input.gains ?? []).find((player) => player.totalXp <= 0);
  if (lowGains) awards.push({ title: "Bankstander Award", player: lowGains.username, detail: "Logged in mentally, not physically." });

  return awards;
}
