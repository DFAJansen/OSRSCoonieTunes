import Link from "next/link";
import { AwardCard } from "@/components/AwardCard";
import { ErrorPanel } from "@/components/ErrorPanel";
import { GainsTable } from "@/components/GainsTable";
import { OsrsPanel } from "@/components/OsrsPanel";
import { buildAwards } from "@/lib/awards";
import { formatNumber } from "@/lib/format";
import { loadGains } from "@/lib/loaders";
import { calculateScore, SCORE_EXPLANATIONS } from "@/lib/scoring";
import type { Period } from "@/lib/types";

export const dynamic = "force-dynamic";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Vandaag", value: "day" },
  { label: "Week", value: "week" },
  { label: "Maand", value: "month" },
  { label: "Jaar", value: "year" }
];

export default async function GainsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const period = (typeof params?.period === "string" ? params.period : "week") as Period;
  const results = await loadGains(period);
  const gains = results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  const grinder = buildAwards({ gains }).find((award) => award.title === "Biggest Grinder");
  const seasonLeaders = [...gains].sort((a, b) => calculateScore({ gains: b }).seasonScore - calculateScore({ gains: a }).seasonScore);

  return (
    <div className="dashboardStack">
      <section className="heroPanel compactHero">
        <div><span className="eyebrow">Season Race</span><h1>Season Race</h1><p>{SCORE_EXPLANATIONS.season}</p></div>
      </section>
      <OsrsPanel title="What Matters Here?">
        <div className="quietGuide">
          <p><strong>Season Score</strong>Recent XP and boss gains let active players beat older accounts.</p>
          <p><strong>Best next move</strong>Win the week, then let the main scoreboard catch up.</p>
        </div>
      </OsrsPanel>
      <OsrsPanel title="Season Score Leaderboard">
        <div className="controls">
          {PERIODS.map((item) => (
            <Link className="osrsButton" href={`/gains?period=${item.value}`} key={item.value}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="scoreboard compact">
          {seasonLeaders.map((player, index) => (
            <div className="scoreRow" key={player.username}>
              <span className="rankBadge">#{index + 1}</span><strong>{player.username}</strong>
              <div className="scoreBar"><span style={{ width: `${Math.min(100, calculateScore({ gains: player }).seasonScore / Math.max(calculateScore({ gains: seasonLeaders[0] }).seasonScore, 1) * 100)}%` }} /></div>
              <b>{formatNumber(calculateScore({ gains: player }).seasonScore)} pts</b>
            </div>
          ))}
        </div>
      </OsrsPanel>
      <OsrsPanel title="Progress Gains">
        <ErrorPanel results={results} />
        <GainsTable players={gains} />
      </OsrsPanel>
      {grinder ? (
        <div style={{ marginTop: 16 }}>
          <AwardCard award={{ ...grinder, title: "Grinder of the Week" }} />
        </div>
      ) : null}
    </div>
  );
}
