import { Badge } from "@/components/ui/Badge";
import type { AchievementResult } from "@/lib/achievements";
import { formatNumber } from "@/lib/format";

function toneFor(achievement: AchievementResult) {
  if (achievement.difficulty === "grandmaster") return "purple";
  if (achievement.category === "meme") return "green";
  if (achievement.status === "completed") return "gold";
  if (achievement.status === "in-progress") return "blue";
  return "muted";
}

export function AchievementTag({ achievement }: { achievement: AchievementResult }) {
  const label =
    achievement.status === "in-progress"
      ? `${achievement.name} ${Math.round(achievement.progress * 100)}%`
      : achievement.name;

  return (
    <Badge tone={toneFor(achievement)} title={`${achievement.description} ${formatNumber(achievement.current)} / ${formatNumber(achievement.target)}`}>
      {label}
    </Badge>
  );
}
