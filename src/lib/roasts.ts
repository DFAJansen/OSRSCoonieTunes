import type { NormalizedStats, PetSummary } from "./types";

export function generateRoast(stats: NormalizedStats[] = [], pets: PetSummary[] = []): string {
  const idle = stats.find((player) => player.totalXp <= 0);
  if (idle) return `${idle.username} logged in mentally, but not physically.`;

  const woodcutting = [...stats].sort(
    (a, b) =>
      (b.skills.find((skill) => skill.name === "Woodcutting")?.xp ?? -1) -
      (a.skills.find((skill) => skill.name === "Woodcutting")?.xp ?? -1)
  )[0];
  if (woodcutting) return `${woodcutting.username} is single-handedly responsible for deforestation in Gielinor.`;

  const petLord = [...pets].sort((a, b) => (b.petCount ?? -1) - (a.petCount ?? -1))[0];
  if (petLord && (petLord.petCount ?? 0) > 0) return `${petLord.username} has apparently bribed Jagex.`;

  const bossDry = [...stats].sort((a, b) => b.totalBossKc - a.totalBossKc)[0];
  if (bossDry) return `${bossDry.username} is not dry, he is fossilized.`;

  return "The squad assembled, the XP appeared nervous, and TempleOSRS started sweating.";
}
