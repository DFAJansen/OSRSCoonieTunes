import type { ScoreBreakdown } from "./scoring";

export type GodName = "Bandos" | "Saradomin" | "Armadyl" | "Zamorak" | "Guthix";
export type FavourRank = "Recruit" | "Soldier" | "Veteran" | "Captain" | "Commander" | "General";

export type GodFavour = {
  god: GodName;
  rank: FavourRank;
  score: number;
};

export type Favour = GodFavour;

function rank(score: number): FavourRank {
  if (score >= 5000) return "General";
  if (score >= 2500) return "Commander";
  if (score >= 1200) return "Captain";
  if (score >= 500) return "Veteran";
  if (score >= 150) return "Soldier";
  return "Recruit";
}

export function calculateFavour(score: ScoreBreakdown): GodFavour[] {
  const favours: GodFavour[] = [
    { god: "Bandos", score: score.bossScore, rank: rank(score.bossScore) },
    { god: "Saradomin", score: score.skillScore, rank: rank(score.skillScore) },
    { god: "Armadyl", score: score.collectionScore + score.petScore, rank: rank(score.collectionScore + score.petScore) },
    { god: "Zamorak", score: score.seasonScore, rank: rank(score.seasonScore) }
  ];
  const allGeneral = favours.every((favour) => favour.rank === "General");
  return allGeneral ? [{ god: "Guthix", score: favours.reduce((sum, favour) => sum + favour.score, 0), rank: "General" }, ...favours] : favours;
}

export function mainFavour(favours: GodFavour[]): GodFavour {
  return [...favours].sort((a, b) => b.score - a.score)[0] ?? { god: "Saradomin", rank: "Recruit", score: 0 };
}
