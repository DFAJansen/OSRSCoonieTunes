import type { NormalizedStats, RecentItem } from "./types";

export type PartyQuest = {
  title: string;
  target: number;
  progress: number;
  unit: string;
  reward: string;
  deadline: string;
};

export function buildPartyQuests(gains: NormalizedStats[], recentItems: RecentItem[]): PartyQuest[] {
  const weeklyXp = gains.reduce((sum, player) => sum + player.totalXp, 0);
  const weeklyBoss = gains.reduce((sum, player) => sum + player.totalBossKc, 0);
  const recentNotables = recentItems.filter((item) => item.notable).length;
  return [
    { title: "Gain 2M XP together this week", target: 2_000_000, progress: weeklyXp, unit: "XP", reward: "+250 Party Power", deadline: "Weekly reset" },
    { title: "Kill 500 bosses together", target: 500, progress: weeklyBoss, unit: "KC", reward: "Boss War momentum", deadline: "Weekly reset" },
    { title: "Unlock 3 notable drops", target: 3, progress: recentNotables, unit: "drops", reward: "Suspicious RNG title pressure", deadline: "Rolling feed" },
    { title: "Push one player over a title threshold", target: 1, progress: gains.some((player) => player.totalXp >= 1_000_000) ? 1 : 0, unit: "title", reward: "Weekly flex rights", deadline: "This week" }
  ];
}
