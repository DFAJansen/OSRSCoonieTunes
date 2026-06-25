import Link from "next/link";
import { AwardCard } from "@/components/AwardCard";
import { ErrorPanel } from "@/components/ErrorPanel";
import { OsrsPanel } from "@/components/OsrsPanel";
import { SkillTable } from "@/components/SkillTable";
import { buildAwards } from "@/lib/awards";
import { formatNumber } from "@/lib/format";
import { loadStats } from "@/lib/loaders";
import { calculateScore, SCORE_EXPLANATIONS } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function SkillsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const mode = params?.mode === "xp" || params?.mode === "rank" ? params.mode : "levels";
  const results = await loadStats();
  const stats = results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  const awards = buildAwards({ stats }).filter((award) => ["Highest Total XP", "Highest Total Level", "Woodcutting King"].includes(award.title));
  const skillLeaders = [...stats].sort((a, b) => calculateScore({ stats: b }).skillScore - calculateScore({ stats: a }).skillScore);
  const closest99 = stats.flatMap((player) => player.skills.map((skill) => ({ player: player.username, skill: skill.name, level: skill.level ?? 0 })))
    .filter((entry) => entry.level < 99)
    .sort((a, b) => b.level - a.level)[0];

  return (
    <div className="dashboardStack">
      <section className="heroPanel compactHero">
        <div><span className="eyebrow">Skill War</span><h1>Skill War</h1><p>{SCORE_EXPLANATIONS.skill}</p></div>
      </section>
      <OsrsPanel title="What Matters Here?">
        <div className="quietGuide">
          <p><strong>Skill Score</strong>Total level, total XP, 99s and high-level skills decide this war.</p>
          <p><strong>Best next move</strong>Push the closest 99 or close the biggest XP gap.</p>
        </div>
      </OsrsPanel>
      <OsrsPanel title="Skill Score Leaderboard">
        <div className="scoreboard compact">
          {skillLeaders.map((player, index) => (
            <div className="scoreRow" key={player.username}>
              <span className="rankBadge">#{index + 1}</span><strong>{player.username}</strong>
              <div className="scoreBar"><span style={{ width: `${Math.min(100, calculateScore({ stats: player }).skillScore / Math.max(calculateScore({ stats: skillLeaders[0] }).skillScore, 1) * 100)}%` }} /></div>
              <b>{formatNumber(calculateScore({ stats: player }).skillScore)} pts</b>
            </div>
          ))}
        </div>
        {closest99 ? <p className="muted">Closest next 99: {closest99.player} is {99 - closest99.level} levels away from {closest99.skill}.</p> : null}
      </OsrsPanel>
      <OsrsPanel title="Skill-by-skill Comparison">
        <div className="controls">
          <Link className="osrsButton" href="/skills?mode=levels">Levels</Link>
          <Link className="osrsButton" href="/skills?mode=xp">XP</Link>
          <Link className="osrsButton" href="/skills?mode=rank">Rank</Link>
        </div>
        <ErrorPanel results={results} />
        <SkillTable players={stats} mode={mode} />
      </OsrsPanel>
      <div className="grid" style={{ marginTop: 16 }}>
        {awards.map((award) => (
          <AwardCard key={award.title} award={award} />
        ))}
      </div>
    </div>
  );
}
