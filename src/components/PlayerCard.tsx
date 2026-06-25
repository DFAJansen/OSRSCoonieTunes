import type { NormalizedStats, PlayerInfo } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/format";

export function PlayerCard({
  player,
  info,
  stats,
  collectionPercent,
  petCount,
  status = "success"
}: {
  player: string;
  info?: PlayerInfo;
  stats?: NormalizedStats;
  collectionPercent?: number | null;
  petCount?: number | null;
  status?: "success" | "partial" | "error";
}) {
  const name = info?.formattedName || stats?.username || info?.username || player;

  return (
    <div className="card playerCard">
      <div className="cardTop">
        <h3>{name}</h3>
        <span className={`statusBadge ${status}`}>{status}</span>
      </div>
      <div className="metric">{formatNumber(stats?.totalLevel)}</div>
      <p className="muted">Total level</p>
      <div className="miniStats">
        <span><b>{formatNumber(stats?.totalXp)}</b> XP</span>
        <span><b>{formatNumber(stats?.totalBossKc)}</b> boss KC</span>
        <span><b>{formatPercent(collectionPercent)}</b> clog</span>
        <span><b>{formatNumber(petCount)}</b> pets</span>
      </div>
      {info?.lastChecked ? <p className="muted tiny">Last checked {info.lastChecked}</p> : null}
    </div>
  );
}
