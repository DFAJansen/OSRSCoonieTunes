import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/format";
import type { PlayerGameProfile } from "@/lib/game";
import { SCORE_EXPLANATIONS } from "@/lib/scoring";

export function DashboardLeaderboard({ profiles }: { profiles: PlayerGameProfile[] }) {
  const topScore = profiles[0]?.totalScore ?? 1;

  return (
    <div className="calmLeaderboard">
      <div className="leaderboardTitle">
        <p className="infoText">Power Score <InfoTooltip text={SCORE_EXPLANATIONS.power} /></p>
      </div>
      {profiles.map((profile) => (
        <div className="calmRankRow" key={profile.username}>
          <span className="rankBadge">#{profile.rank}</span>
          <div>
            <strong>{profile.username}</strong>
            <p className="muted">{profile.mainTitle} - strongest in {profile.strongestCategory}</p>
          </div>
          <ProgressBar value={(profile.totalScore / topScore) * 100} />
          <b>{formatNumber(profile.totalScore)}</b>
        </div>
      ))}
    </div>
  );
}
