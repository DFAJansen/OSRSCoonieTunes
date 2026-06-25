import type { NormalizedCollection, NormalizedStats, PetSummary, RecentItem } from "./types";
import { calculateScore, type ScoreBreakdown } from "./scoring";
import { getMainTitle, getPlayerTitles } from "./titles";
import { findClosestRivalry } from "./rivalries";
import { buildPartyQuests, type PartyQuest } from "./quests";
import { calculateFavour, mainFavour, type GodFavour } from "./favour";

export type PlayerGameProfile = {
  username: string;
  totalScore: number;
  seasonScore: number;
  bossScore: number;
  collectionScore: number;
  petScore: number;
  progressScore: number;
  score: ScoreBreakdown;
  rank: number;
  archetype: string;
  mainTitle: string;
  favour: GodFavour;
  favours: GodFavour[];
  favoriteSkill: string;
  strongestCategory: string;
  achievements: string[];
  weakCategory: string;
  nextGoal: string;
  pointsToOvertake: number | null;
};

export type Rivalry = {
  left: string;
  right: string;
  scoreGapPercent: number;
  status: string;
  detail: string;
};

export type PartyPower = {
  score: number;
  percent: number;
  level: number;
  label: string;
};

export const SEASONS = [
  { id: "season-1", label: "Season 1", durationDays: 30, status: "active" },
  { id: "season-2", label: "Season 2", durationDays: 30, status: "queued" },
  { id: "season-3", label: "Season 3", durationDays: 90, status: "queued" }
] as const;

export type CommandCenter = {
  profiles: PlayerGameProfile[];
  rivalry?: Rivalry;
  partyPower: PartyPower;
  quests: PartyQuest[];
  weeklyChampion?: PlayerGameProfile;
};

function byName<T extends { username: string }>(items: T[], name: string): T | undefined {
  return items.find((item) => item.username.toLowerCase() === name.toLowerCase());
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function bestSkill(stats?: NormalizedStats): string {
  return (
    stats?.skills
      .filter((skill) => skill.xp !== null)
      .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))[0]?.name ?? "Unscouted"
  );
}

function archetype(stats?: NormalizedStats, collection?: NormalizedCollection, pets?: PetSummary): string {
  const favorite = bestSkill(stats);
  if ((pets?.petCount ?? 0) >= 5) return "The Pet Baron";
  if ((collection?.finishedItems ?? 0) >= 500) return "The Collection Addict";
  if ((stats?.totalBossKc ?? 0) >= 10000) return "The Boss Accountant";
  if (favorite === "Woodcutting") return "The Lumber Tyrant";
  if ((stats?.totalBossKc ?? 0) > (stats?.totalLevel ?? 0)) return "The RNG Criminal";
  return "The Balanced Menace";
}

function achievements(stats?: NormalizedStats, collection?: NormalizedCollection, pets?: PetSummary, gains?: NormalizedStats): string[] {
  const list: string[] = [];
  const woodcutting = stats?.skills.find((skill) => skill.name === "Woodcutting");
  if ((stats?.totalBossKc ?? 0) >= 10000) list.push("Boss Addict");
  if ((pets?.petCount ?? 0) >= 5) list.push("Pet Hunter");
  if ((woodcutting?.level ?? 0) >= 99) list.push("Woodchipper");
  if ((collection?.finishedItems ?? 0) >= 500) list.push("Collection Enjoyer");
  if ((gains?.totalXp ?? 0) >= 1_000_000) list.push("Unemployed");
  if ((gains?.totalXp ?? 0) <= 0 && gains) list.push("Professional Bankstander");
  return list.slice(0, 5);
}

function nextGoal(stats?: NormalizedStats, collection?: NormalizedCollection, pets?: PetSummary): string {
  const closestSkill = stats?.skills
    .filter((skill) => (skill.level ?? 0) < 99)
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))[0];
  if (closestSkill && (closestSkill.level ?? 0) >= 90) return `${99 - (closestSkill.level ?? 0)} levels to ${closestSkill.name} 99`;
  if ((pets?.petCount ?? 0) < 1) return "Get first pet for +500 Pet Score";
  if ((collection?.finishedItems ?? 0) < 500) return `${500 - (collection?.finishedItems ?? 0)} clog items to Archivist`;
  return "Push season gains to steal weekly champion";
}

export function buildCommandCenter(input: {
  players: readonly string[];
  stats: NormalizedStats[];
  gains: NormalizedStats[];
  collections: NormalizedCollection[];
  pets: PetSummary[];
  recentItems: RecentItem[];
}): CommandCenter {
  const profiles = input.players
    .map((username) => {
      const stats = byName(input.stats, username);
      const gains = byName(input.gains, username);
      const collection = byName(input.collections, username);
      const pets = byName(input.pets, username);

      const score = calculateScore({ stats, gains, collection, pets });
      const titles = getPlayerTitles({ stats, gains, collection, pets });
      const favours = calculateFavour(score);
      const strongestCategory = [
        ["Skills", score.skillScore],
        ["Bossing", score.bossScore],
        ["Collection", score.collectionScore],
        ["Pets", score.petScore],
        ["Season", score.seasonScore]
      ].sort((a, b) => Number(b[1]) - Number(a[1]))[0][0] as string;
      const weakCategory = [
        ["Skills", score.skillScore],
        ["Bossing", score.bossScore],
        ["Collection", score.collectionScore],
        ["Pets", score.petScore],
        ["Season", score.seasonScore]
      ].sort((a, b) => Number(a[1]) - Number(b[1]))[0][0] as string;

      return {
        username,
        totalScore: score.powerScore,
        seasonScore: score.seasonScore,
        bossScore: score.bossScore,
        collectionScore: score.collectionScore,
        petScore: score.petScore,
        progressScore: score.seasonScore,
        score,
        rank: 0,
        archetype: archetype(stats, collection, pets),
        mainTitle: getMainTitle(titles),
        favour: mainFavour(favours),
        favours,
        favoriteSkill: bestSkill(stats),
        strongestCategory,
        weakCategory,
        achievements: achievements(stats, collection, pets, gains),
        nextGoal: nextGoal(stats, collection, pets),
        pointsToOvertake: null
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((profile, index, sorted) => ({
      ...profile,
      rank: index + 1,
      pointsToOvertake: index > 0 ? Math.max(0, sorted[index - 1].totalScore - profile.totalScore + 1) : null
    }));

  const season = [...profiles].sort((a, b) => b.seasonScore - a.seasonScore);
  const rivalry = findClosestRivalry(profiles);

  const partyScore = profiles.reduce((sum, profile) => sum + profile.totalScore, 0);
  const percent = clamp(Math.round((partyScore / Math.max(input.players.length * 5000, 1)) * 100), 0, 100);
  const partyPower = {
    score: partyScore,
    percent,
    level: Math.max(1, Math.floor(percent / 20) + 1),
    label: percent > 80 ? "Raid-ready menace" : percent > 55 ? "Dangerous midgame council" : "Hungry little warband"
  };

  const quests = buildPartyQuests(input.gains, input.recentItems);

  return { profiles, rivalry, partyPower, quests, weeklyChampion: season[0] };
}
