import { AchievementTag } from "@/components/achievements/AchievementTag";
import { AchievementTagList } from "@/components/achievements/AchievementTagList";
import { Drawer } from "@/components/ui/Drawer";
import type { AchievementResult } from "@/lib/achievements";
import { formatNumber } from "@/lib/format";
import type { PlayerGameProfile } from "@/lib/game";

function pickNextUnlock(achievements: AchievementResult[]): AchievementResult | undefined {
  const unfinished = achievements
    .filter((achievement) => achievement.status !== "completed")
    .sort((a, b) => b.progress - a.progress || b.points - a.points);

  if (unfinished[0]) return unfinished[0];

  return [...achievements].sort((a, b) => b.points - a.points)[0];
}

function formatUnlock(achievement?: AchievementResult): string {
  if (!achievement) return "Awaiting scout report";
  if (achievement.status === "completed") return achievement.rewardTitle;

  return `${achievement.rewardTitle} (${Math.round(achievement.progress * 100)}%)`;
}

export function PlayerSummaryCard({
  profile,
  achievements
}: {
  profile: PlayerGameProfile;
  achievements: AchievementResult[];
}) {
  const visibleAchievements = [...achievements]
    .sort((a, b) => {
      const statusWeight = { completed: 3, "in-progress": 2, locked: 1 };
      return statusWeight[b.status] - statusWeight[a.status] || b.points - a.points || b.progress - a.progress;
    })
    .slice(0, 3);
  const nextUnlock = pickNextUnlock(achievements);
  const strongestWar = profile.strongestCategory === "Collection" ? "Collection War" : `${profile.strongestCategory} War`;
  const weakestWar = profile.weakCategory === "Collection" ? "Collection War" : `${profile.weakCategory} War`;

  return (
    <article className="playerSummaryCard characterSheet">
      <div className="characterHeader">
        <div className="characterSigil" aria-hidden="true">{profile.username.slice(0, 1)}</div>
        <div className="characterIdentity">
          <span>Main Title</span>
          <h3>{profile.username}</h3>
          <p>{profile.mainTitle}</p>
        </div>
      </div>

      <div className="identityRows">
        <div className="identityRow">
          <span>God Rank</span>
          <strong>{profile.favour.rank} of {profile.favour.god}</strong>
        </div>
        <div className="identityRow">
          <span>Current Score</span>
          <strong>{formatNumber(profile.totalScore)}</strong>
        </div>
      </div>

      <div className="identityRows">
        <div className="identityRow">
          <span>Strongest Area</span>
          <strong>{strongestWar}</strong>
        </div>
        <div className="identityRow">
          <span>Weakest Area</span>
          <strong>{weakestWar}</strong>
        </div>
      </div>

      <div className="characterMission">
        <span>Next Goal</span>
        <strong>{profile.nextGoal}</strong>
      </div>

      <div className="characterTags">
        <span>Achievement Tags</span>
        <div className="achievementTags">
          {visibleAchievements.length ? visibleAchievements.map((achievement) => (
            <AchievementTag achievement={achievement} key={achievement.id} />
          )) : <span className="emptyTag">No tags yet</span>}
        </div>
      </div>

      <Drawer label="Open Character Sheet">
        <div className="detailGrid">
          <span>Power score <b>{formatNumber(profile.totalScore)}</b></span>
          <span>Skill score <b>{formatNumber(profile.score.skillScore)}</b></span>
          <span>Boss score <b>{formatNumber(profile.score.bossScore)}</b></span>
          <span>Collection score <b>{formatNumber(profile.score.collectionScore)}</b></span>
          <span>Pet score <b>{formatNumber(profile.score.petScore)}</b></span>
          <span>Season score <b>{formatNumber(profile.score.seasonScore)}</b></span>
          <span>Favorite skill <b>{profile.favoriteSkill}</b></span>
          <span>Weakest war <b>{profile.weakCategory === "Collection" ? "Collection War" : `${profile.weakCategory} War`}</b></span>
          <span>Favour rank <b>{profile.favour.rank} of {profile.favour.god}</b></span>
          <span>Needs to pass next rank <b>{profile.pointsToOvertake === null ? "Defend #1" : `${formatNumber(profile.pointsToOvertake)} pts`}</b></span>
          <span>Archetype <b>{profile.archetype}</b></span>
          <span>Next unlock <b>{formatUnlock(nextUnlock)}</b></span>
        </div>
        <div className="drawerAchievementBlock">
          <span>Full achievement dossier</span>
          <AchievementTagList achievements={achievements} />
        </div>
      </Drawer>
    </article>
  );
}
