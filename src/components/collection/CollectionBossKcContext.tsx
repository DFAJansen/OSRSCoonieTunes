import { formatNumber } from "@/lib/format";
import type { CollectionBossKcSummary } from "@/lib/collection-boss-kc";

export function CollectionBossKcContext({ summary }: { summary: CollectionBossKcSummary | null }) {
  if (!summary) return null;

  return (
    <section className="collectionBossKcContext">
      <span>KC Context</span>
      <strong>{summary.bossName}</strong>
      <div>
        {summary.players.map((player) => (
          <p className={player.isLeader ? "leader" : ""} key={player.player}>
            <b>{player.player}</b>
            {player.kc === null ? "Unknown" : formatNumber(player.kc)}
          </p>
        ))}
      </div>
    </section>
  );
}
