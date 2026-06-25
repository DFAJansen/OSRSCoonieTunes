import type { AchievementResult } from "./achievements";
import type { PlayerGameProfile, Rivalry } from "./game";
import type { NormalizedCollection, NormalizedStats, PetSummary } from "./types";

export type JourneyMission = {
  player: string;
  title: string;
  chapter: "Account" | "Rivalry" | "Achievement" | "Collection" | "Favour";
  why: string;
  reward: string;
  estimatedTime: string;
  progress: number;
  favour: string;
  titleReward: string;
  achievement: string;
  status: "active" | "near" | "locked";
  icon: string;
};

export type JourneyGoal = JourneyMission;

function skillLevel(stats: NormalizedStats | undefined, skillName: string): number {
  return stats?.skills.find((skill) => skill.name === skillName)?.level ?? 0;
}

function bestSkillPush(stats: NormalizedStats | undefined): { skill: string; levels: number; progress: number } {
  const slayer = skillLevel(stats, "Slayer");
  if (slayer > 0 && slayer < 99) {
    return { skill: "Slayer", levels: Math.min(3, 99 - slayer), progress: (slayer / 99) * 100 };
  }

  const candidate = stats?.skills
    .filter((skill) => (skill.level ?? 0) < 99)
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))[0];

  if (!candidate) return { skill: "Total", levels: 0, progress: 100 };

  const level = candidate.level ?? 1;
  return {
    skill: candidate.name,
    levels: Math.min(3, 99 - level),
    progress: (level / 99) * 100
  };
}

function collectionTarget(collection: NormalizedCollection | undefined): { target: string; progress: number; rewardTitle: string } {
  const owned = collection?.finishedItems ?? 0;
  const available = collection?.availableItems ?? 0;
  const barrowsOwned = collection?.itemNames.filter((item) => /barrows|ahrim|dharok|guthan|karil|torag|verac/i.test(item)).length ?? 0;
  const barrowsMissing = collection?.missingItemNames.filter((item) => /barrows|ahrim|dharok|guthan|karil|torag|verac/i.test(item)).length ?? 0;
  const barrowsTotal = barrowsOwned + barrowsMissing;

  if (barrowsTotal > 0 && barrowsMissing > 0) {
    return {
      target: "Complete Barrows",
      progress: Math.round((barrowsOwned / barrowsTotal) * 100),
      rewardTitle: "Crypt Curator"
    };
  }

  if (owned < 500) {
    return {
      target: `${Math.max(0, 500 - owned)} collection pieces to Archivist`,
      progress: Math.min(100, (owned / 500) * 100),
      rewardTitle: "Archivist"
    };
  }

  return {
    target: "Hunt a rare museum piece",
    progress: available ? Math.min(100, (owned / available) * 100) : 0,
    rewardTitle: "Living Museum"
  };
}

function favourMission(profile: PlayerGameProfile): JourneyMission {
  const target = profile.favours
    .filter((favour) => favour.rank !== "General")
    .sort((a, b) => b.score - a.score)[0] ?? profile.favour;
  const nextRank = target.score >= 2500 ? "General" : target.score >= 1200 ? "Commander" : target.score >= 500 ? "Captain" : target.score >= 150 ? "Veteran" : "Soldier";
  const nextThreshold = target.score >= 2500 ? 5000 : target.score >= 1200 ? 2500 : target.score >= 500 ? 1200 : target.score >= 150 ? 500 : 150;

  return {
    player: profile.username,
    title: `Unlock ${nextRank} of ${target.god}`,
    chapter: "Favour",
    why: `${target.god} is the cleanest divine promotion path for this account right now.`,
    reward: `${nextRank} rank and stronger character identity.`,
    estimatedTime: target.score >= nextThreshold ? "Complete" : "2-4 sessions",
    progress: Math.min(100, (target.score / nextThreshold) * 100),
    favour: `${Math.max(0, Math.round(nextThreshold - target.score))} favour needed`,
    titleReward: `${nextRank} of ${target.god}`,
    achievement: `${target.god} favour path`,
    status: target.score >= nextThreshold ? "near" : "active",
    icon: target.god.slice(0, 2).toUpperCase()
  };
}

function achievementMission(profile: PlayerGameProfile, achievements: AchievementResult[]): JourneyMission {
  const close = [...achievements]
    .filter((achievement) => achievement.player === profile.username && achievement.status !== "completed")
    .sort((a, b) => b.progress - a.progress || b.favour - a.favour)[0];

  if (!close) return favourMission(profile);

  return {
    player: profile.username,
    title: `Finish ${close.name}`,
    chapter: "Achievement",
    why: `${Math.round(close.progress * 100)}% complete and directly tied to ${close.god} favour.`,
    reward: close.reward,
    estimatedTime: close.progress >= 0.8 ? "Tonight" : close.progress >= 0.5 ? "1-2 sessions" : "Long-term",
    progress: close.progress * 100,
    favour: `+${close.favour} ${close.god} favour`,
    titleReward: close.rewardTitle,
    achievement: close.name,
    status: close.progress >= 0.75 ? "near" : "active",
    icon: close.god.slice(0, 2).toUpperCase()
  };
}

function accountMission(profile: PlayerGameProfile, stats?: NormalizedStats): JourneyMission {
  const push = bestSkillPush(stats);

  return {
    player: profile.username,
    title: push.levels ? `Gain ${push.levels} ${push.skill} level${push.levels === 1 ? "" : "s"}` : profile.nextGoal,
    chapter: "Account",
    why: profile.pointsToOvertake === null ? "You are defending the top spot. Small gains force everyone else to chase." : `${Math.ceil(profile.pointsToOvertake)} Power Score closes the next rank gap.`,
    reward: "More Power Score and better daily momentum.",
    estimatedTime: push.levels <= 1 ? "Tonight" : "1-3 sessions",
    progress: push.progress,
    favour: "+Saradomin favour pressure",
    titleReward: profile.mainTitle,
    achievement: "Account progression",
    status: "active",
    icon: "XP"
  };
}

function rivalryMission(profile: PlayerGameProfile, rivalry?: Rivalry): JourneyMission | null {
  if (!rivalry || ![rivalry.left, rivalry.right].includes(profile.username)) return null;
  const rival = rivalry.left === profile.username ? rivalry.right : rivalry.left;

  return {
    player: profile.username,
    title: `Break ${rival}`,
    chapter: "Rivalry",
    why: rivalry.detail,
    reward: "Rank pressure and bragging rights in the War Room.",
    estimatedTime: rivalry.scoreGapPercent < 3 ? "Tonight" : "2-3 sessions",
    progress: Math.max(10, 100 - rivalry.scoreGapPercent * 10),
    favour: `Push ${profile.favour.god} dominance`,
    titleReward: profile.mainTitle,
    achievement: rivalry.status,
    status: rivalry.scoreGapPercent < 3 ? "near" : "active",
    icon: "VS"
  };
}

function collectionMission(profile: PlayerGameProfile, collection?: NormalizedCollection, pets?: PetSummary): JourneyMission {
  const target = collectionTarget(collection);
  const petCount = pets?.petCount ?? 0;

  return {
    player: profile.username,
    title: petCount < 1 ? "Unlock first pet" : target.target,
    chapter: "Collection",
    why: petCount < 1 ? "A first pet changes the account identity and boosts the Menagerie path." : "Collection progress feeds Armadyl favour, museum prestige and title unlocks.",
    reward: petCount < 1 ? "First companion and pet-score spike." : "Collection score, museum progress and visible flex pieces.",
    estimatedTime: petCount < 1 ? "RNG mission" : target.progress > 80 ? "1-2 sessions" : "Long-term",
    progress: petCount < 1 ? 0 : target.progress,
    favour: "+Armadyl favour",
    titleReward: petCount < 1 ? "Lucky" : target.rewardTitle,
    achievement: petCount < 1 ? "First Familiar" : "Collection path",
    status: target.progress > 80 ? "near" : "active",
    icon: petCount < 1 ? "PT" : "CL"
  };
}

function priorityScore(mission: JourneyMission): number {
  const status = mission.status === "near" ? 50 : mission.status === "active" ? 25 : 0;
  const chapter = mission.chapter === "Rivalry" ? 20 : mission.chapter === "Achievement" ? 18 : mission.chapter === "Favour" ? 15 : 10;
  return status + chapter + mission.progress / 10;
}

export function buildQuestLog(input: {
  profile: PlayerGameProfile;
  achievements: AchievementResult[];
  stats?: NormalizedStats;
  collection?: NormalizedCollection;
  pets?: PetSummary;
  rivalry?: Rivalry;
}): JourneyMission[] {
  const missions = [
    rivalryMission(input.profile, input.rivalry),
    accountMission(input.profile, input.stats),
    achievementMission(input.profile, input.achievements),
    collectionMission(input.profile, input.collection, input.pets),
    favourMission(input.profile)
  ].filter((mission): mission is JourneyMission => Boolean(mission));

  const unique = new Map<string, JourneyMission>();
  missions
    .sort((a, b) => priorityScore(b) - priorityScore(a))
    .forEach((mission) => {
      if (!unique.has(mission.title)) unique.set(mission.title, mission);
    });

  return [...unique.values()].slice(0, 3);
}
