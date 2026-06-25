import type { NormalizedCollection, NormalizedStats, PetSummary } from "./types";

export type ScoreBreakdown = {
  powerScore: number;
  skillScore: number;
  bossScore: number;
  collectionScore: number;
  petScore: number;
  seasonScore: number;
  skillParts: Record<string, number>;
  bossParts: Record<string, number>;
  collectionParts: Record<string, number>;
  petParts: Record<string, number>;
  seasonParts: Record<string, number>;
};

export type WarScore = ScoreBreakdown;

const ENDGAME_BOSSES = [
  "Chambers of Xeric",
  "Chambers of Xeric Challenge Mode",
  "Theatre of Blood",
  "Theatre of Blood Challenge Mode",
  "Tombs of Amascut",
  "Tombs of Amascut Expert",
  "The Corrupted Gauntlet",
  "The Gauntlet",
  "Nex",
  "Phosanis Nightmare",
  "The Nightmare",
  "TzKal-Zuk",
  "TzTok-Jad",
  "Colosseum Glory",
  "Sol Heredit"
];

function countSkills(stats: NormalizedStats | undefined, predicate: (level: number, xp: number) => boolean): number {
  return stats?.skills.filter((skill) => predicate(skill.level ?? 0, skill.xp ?? 0)).length ?? 0;
}

export function calculateScore(input: {
  stats?: NormalizedStats;
  gains?: NormalizedStats;
  collection?: NormalizedCollection;
  pets?: PetSummary;
}): ScoreBreakdown {
  const { stats, gains, collection, pets } = input;
  const maxedSkills = countSkills(stats, (level) => level >= 99);
  const skills90Plus = countSkills(stats, (level) => level >= 90);
  const skills80Plus = countSkills(stats, (level) => level >= 80);
  const bossDiversity = stats?.bosses.filter((boss) => boss.kc > 0).length ?? 0;
  const bosses100Plus = stats?.bosses.filter((boss) => boss.kc >= 100).length ?? 0;
  const bosses1000Plus = stats?.bosses.filter((boss) => boss.kc >= 1000).length ?? 0;
  const endgameBossKc = stats?.bosses.filter((boss) => ENDGAME_BOSSES.includes(boss.name)).reduce((sum, boss) => sum + boss.kc, 0) ?? 0;
  const notableItems = collection?.itemNames.filter((item) => /pet|jar|third age|twisted|scythe|shadow|tbow|elysian/i.test(item)).length ?? 0;
  const megaRareItems = collection?.itemNames.filter((item) => /twisted bow|scythe|tumeken|elysian|third age/i.test(item)).length ?? 0;

  const skillParts = {
    totalLevel: (stats?.totalLevel ?? 0) * 2,
    totalXp: (stats?.totalXp ?? 0) / 100000,
    maxedSkills: maxedSkills * 250,
    skills90Plus: skills90Plus * 75,
    skills80Plus: skills80Plus * 25
  };
  const bossParts = {
    totalBossKc: (stats?.totalBossKc ?? 0) / 100,
    bossDiversity: bossDiversity * 50,
    bosses100Plus: bosses100Plus * 100,
    bosses1000Plus: bosses1000Plus * 250,
    endgameBossKc: endgameBossKc / 10
  };
  const collectionParts = {
    ownedItems: (collection?.finishedItems ?? 0) * 10,
    completion: (collection?.percentage ?? 0) * 25,
    completedCategories: (collection?.finishedCategories ?? 0) * 100,
    notableItems: notableItems * 50,
    megaRareItems: megaRareItems * 250,
    pets: (pets?.petCount ?? 0) * 300
  };
  const petParts = {
    petCount: (pets?.petCount ?? 0) * 500
  };
  const seasonParts = {
    weeklyXpGain: (gains?.totalXp ?? 0) / 50000,
    weeklyBossGain: (gains?.totalBossKc ?? 0) * 5,
    weeklyCollectionGain: 0,
    weeklyPetGain: 0
  };
  const sum = (parts: Record<string, number>) => Object.values(parts).reduce((total, value) => total + value, 0);
  const skillScore = sum(skillParts);
  const bossScore = sum(bossParts);
  const collectionScore = sum(collectionParts);
  const petScore = sum(petParts);
  const seasonScore = sum(seasonParts);

  return {
    powerScore: skillScore + bossScore + collectionScore + petScore + seasonScore,
    skillScore,
    bossScore,
    collectionScore,
    petScore,
    seasonScore,
    skillParts,
    bossParts,
    collectionParts,
    petParts,
    seasonParts
  };
}

export const SCORE_EXPLANATIONS = {
  power: "Power Score = Skill Score + Boss Score + Collection Score + Pet Score + Season activity.",
  skill: "Skill War draait om total level, total XP, 99s en skill mastery.",
  boss: "Boss War draait om boss KC, boss diversity en endgame PvM.",
  collection: "Collection War draait om owned items, completion, categories, notables and pets.",
  season: "Season Score telt vooral recente progressie, zodat actieve spelers oudere accounts kunnen inhalen."
};
