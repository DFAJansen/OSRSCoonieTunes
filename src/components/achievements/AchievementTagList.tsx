import { AchievementTag } from "./AchievementTag";
import { Drawer } from "@/components/ui/Drawer";
import type { AchievementResult } from "@/lib/achievements";

function interestScore(achievement: AchievementResult): number {
  const difficulty = { easy: 1, medium: 2, hard: 3, master: 4, grandmaster: 5 }[achievement.difficulty];
  const status = achievement.status === "completed" ? 3 : achievement.status === "in-progress" ? 4 : 1;
  const meme = achievement.category === "meme" ? 2 : 0;
  return difficulty * 10 + status + meme + achievement.progress * 5;
}

export function AchievementTagList({ achievements, max = 4 }: { achievements: AchievementResult[]; max?: number }) {
  const sorted = [...achievements].sort((a, b) => interestScore(b) - interestScore(a));
  const visible = sorted.slice(0, max);
  const hidden = sorted.slice(max);

  return (
    <div className="achievementTags">
      {visible.map((achievement) => (
        <AchievementTag achievement={achievement} key={achievement.id} />
      ))}
      {hidden.length ? (
        <Drawer label={`+${hidden.length} more`}>
          <div className="achievementTags expanded">
            {hidden.map((achievement) => (
              <AchievementTag achievement={achievement} key={achievement.id} />
            ))}
          </div>
        </Drawer>
      ) : null}
    </div>
  );
}
