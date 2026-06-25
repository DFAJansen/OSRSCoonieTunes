import type { PlayerGameProfile, Rivalry } from "./game";

export function findClosestRivalry(profiles: PlayerGameProfile[]): Rivalry | undefined {
  const pairs = profiles.flatMap((left, leftIndex) =>
    profiles.slice(leftIndex + 1).map((right) => {
      const high = Math.max(left.totalScore, right.totalScore, 1);
      return { left, right, gap: (Math.abs(left.totalScore - right.totalScore) / high) * 100 };
    })
  );
  const closest = pairs.sort((a, b) => a.gap - b.gap)[0];
  if (!closest) return undefined;

  const leftDomains = [
    ["Skills", closest.left.score.skillScore - closest.right.score.skillScore],
    ["Bossing", closest.left.score.bossScore - closest.right.score.bossScore],
    ["Collection", closest.left.score.collectionScore - closest.right.score.collectionScore],
    ["Pets", closest.left.score.petScore - closest.right.score.petScore]
  ];
  const leftBest = leftDomains.sort((a, b) => Number(b[1]) - Number(a[1]))[0][0];
  const rightBest = leftDomains.sort((a, b) => Number(a[1]) - Number(b[1]))[0][0];

  return {
    left: closest.left.username,
    right: closest.right.username,
    scoreGapPercent: closest.gap,
    status: closest.gap < 3 ? "Neck and neck" : closest.gap < 8 ? "Slowly pulling ahead" : "Open warfare",
    detail: `${closest.left.username} is ahead in ${leftBest}, but ${closest.right.username} can answer in ${rightBest}.`
  };
}
