import { buildAwards } from "./awards";
import { formatNumber } from "./format";
import { getPlayerTitles } from "./titles";
import type { AchievementResult } from "./achievements";
import type { Award } from "./types";
import type { CommandCenter } from "./game";
import type { PlayerData } from "./player-data";

export type HallTitleEntry = ReturnType<typeof getPlayerTitles>[number] & {
  player: string;
};

export type HallFavourRank = {
  player: string;
  title: string;
  god: string;
  rank: string;
  score: number;
};

export type HallOfLegendsData = {
  titleEntries: HallTitleEntry[];
  favourRanks: HallFavourRank[];
  generals: HallFavourRank[];
  hiddenAchievements: AchievementResult[];
  awards: Award[];
  seasonWinners: Award[];
  hallOfFame: Award[];
  completedCount: number;
  totalFavour: number;
  monumentChampion?: CommandCenter["profiles"][number];
};

export function buildHallOfLegendsData(input: {
  players: PlayerData[];
  achievements: AchievementResult[];
  command: CommandCenter;
  stats: Parameters<typeof buildAwards>[0]["stats"];
  gains: Parameters<typeof buildAwards>[0]["gains"];
  collections: Parameters<typeof buildAwards>[0]["collections"];
  pets: Parameters<typeof buildAwards>[0]["pets"];
  recentItems: Parameters<typeof buildAwards>[0]["recentItems"];
}): HallOfLegendsData {
  const titleEntries = input.players.flatMap((player) =>
    getPlayerTitles(player).map((title) => ({ player: player.username, ...title }))
  ).sort((a, b) => b.prestige - a.prestige);
  const favourRanks = input.command.profiles.flatMap((profile) =>
    profile.favours.map((favour) => ({
      player: profile.username,
      title: `${favour.rank} of ${favour.god}`,
      god: favour.god,
      rank: favour.rank,
      score: favour.score
    }))
  ).sort((a, b) => b.score - a.score);
  const generals = favourRanks.filter((entry) => entry.rank === "General");
  const hiddenAchievements = input.achievements.filter((achievement) => achievement.category === "meme" || achievement.name.includes("Idler"));
  const awards = buildAwards({
    stats: input.stats,
    gains: input.gains,
    collections: input.collections,
    pets: input.pets,
    recentItems: input.recentItems
  });
  const seasonWinners = [
    input.command.weeklyChampion ? { title: "Season Champion", player: input.command.weeklyChampion.username, detail: `${formatNumber(input.command.weeklyChampion.seasonScore)} Season Score` } : null,
    ...awards.filter((award) => ["Biggest Grinder", "Biggest Spoon", "Bankstander Award"].includes(award.title))
  ].filter((entry): entry is Award => Boolean(entry));
  const hallOfFame = [
    ...awards,
    ...generals.slice(0, 6).map((general) => ({ title: general.title, player: general.player, detail: `${formatNumber(general.score)} favour` })),
    ...titleEntries.slice(0, 6).map((title) => ({ title: title.name, player: title.player, detail: `${formatNumber(title.prestige)} prestige` }))
  ];

  return {
    titleEntries,
    favourRanks,
    generals,
    hiddenAchievements,
    awards,
    seasonWinners,
    hallOfFame,
    completedCount: input.achievements.filter((achievement) => achievement.status === "completed").length,
    totalFavour: favourRanks.reduce((sum, favour) => sum + favour.score, 0),
    monumentChampion: input.command.profiles[0]
  };
}
