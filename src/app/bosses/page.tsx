import { AwardCard } from "@/components/AwardCard";
import { BossWarShell } from "@/components/bosses/BossWarShell";
import { ErrorPanel } from "@/components/ErrorPanel";
import { OsrsPanel } from "@/components/OsrsPanel";
import { buildAwards } from "@/lib/awards";
import { formatNumber } from "@/lib/format";
import { loadStats } from "@/lib/loaders";
import { calculateScore, SCORE_EXPLANATIONS } from "@/lib/scoring";
import { getServerActiveParty } from "@/lib/server-settings";

export const dynamic = "force-dynamic";

export default async function BossesPage() {
  const partySlots = await getServerActiveParty();
  const results = await loadStats(partySlots);
  const stats = results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  const awards = buildAwards({ stats }).filter((award) => ["Boss Goblin"].includes(award.title));
  const touchGrass = [...stats].sort((a, b) => b.totalBossKc - a.totalBossKc)[0];
  const bossLeaders = [...stats].sort((a, b) => calculateScore({ stats: b }).bossScore - calculateScore({ stats: a }).bossScore);

  return (
    <div className="dashboardStack">
      <section className="heroPanel compactHero">
        <div><span className="eyebrow">Boss War</span><h1>Boss War</h1><p>{SCORE_EXPLANATIONS.boss}</p></div>
      </section>
      <OsrsPanel title="What Matters Here?">
        <div className="quietGuide">
          <p><strong>Boss Score</strong>Total KC, boss diversity, 100+ KC bosses and endgame kills matter most.</p>
          <p><strong>Best next move</strong>Find bosses where one short grind can overtake another player.</p>
        </div>
      </OsrsPanel>
      <OsrsPanel title="Boss Score Leaderboard">
        <div className="grid" style={{ marginBottom: 16 }}>
          {bossLeaders.map((player, index) => (
            <div className="card" key={player.username}>
              <span className="rankBadge">#{index + 1}</span>
              <h3>{player.username}</h3>
              <div className="metric">{formatNumber(calculateScore({ stats: player }).bossScore)}</div>
              <p className="muted">{player.bosses.length} bosses with KC, {formatNumber(player.totalBossKc)} total KC</p>
            </div>
          ))}
        </div>
      </OsrsPanel>
      <OsrsPanel title="Boss KC Comparison">
        <div className="grid" style={{ marginBottom: 16 }}>
          {stats.map((player) => (
            <div className="card" key={player.username}>
              <h3>{player.username}</h3>
              <div className="metric">{formatNumber(player.totalBossKc)}</div>
              <p className="muted">Total boss KC</p>
            </div>
          ))}
        </div>
        <ErrorPanel results={results} />
        <BossWarShell players={stats} />
      </OsrsPanel>
      <div className="grid">
        {awards.map((award) => (
          <AwardCard key={award.title} award={award} />
        ))}
        {touchGrass ? <AwardCard award={{ title: "Touch Grass Award", player: touchGrass.username, detail: `${formatNumber(touchGrass.totalBossKc)} total KC` }} /> : null}
      </div>
    </div>
  );
}
