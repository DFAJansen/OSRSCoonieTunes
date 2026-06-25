import { AwardCard } from "@/components/AwardCard";
import { ErrorPanel } from "@/components/ErrorPanel";
import { OsrsPanel } from "@/components/OsrsPanel";
import { PetTable } from "@/components/PetTable";
import { buildAwards } from "@/lib/awards";
import { formatNumber } from "@/lib/format";
import { loadPets } from "@/lib/loaders";
import { calculateScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const results = await loadPets();
  const pets = results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  const petLord = buildAwards({ pets }).find((award) => award.title === "Pet Lord");
  const petLeaders = [...pets].sort((a, b) => calculateScore({ pets: b }).petScore - calculateScore({ pets: a }).petScore);

  return (
    <div className="dashboardStack">
      <section className="heroPanel compactHero">
        <div><span className="eyebrow">Pet War</span><h1>Pet War</h1><p>Pet Score is mostly pet count, because tiny followers are apparently worth political power.</p></div>
      </section>
      <OsrsPanel title="What Matters Here?">
        <div className="quietGuide">
          <p><strong>Pet Score</strong>Every pet is a huge swing in friend-war prestige.</p>
          <p><strong>Best next move</strong>Target missing pets or defend the Pet Lord title.</p>
        </div>
      </OsrsPanel>
      <OsrsPanel title="Pet Score Leaderboard">
        <div className="grid" style={{ marginBottom: 16 }}>
          {petLeaders.map((player, index) => (
            <div className="card" key={player.username}>
              <span className="rankBadge">#{index + 1}</span>
              <h3>{player.username}</h3>
              <div className="metric">{formatNumber(calculateScore({ pets: player }).petScore)}</div>
              <p className="muted">{formatNumber(player.petCount)} pets, {formatNumber(player.petHours)} pet hours</p>
            </div>
          ))}
        </div>
      </OsrsPanel>
      <OsrsPanel title="Pet Matrix">
        <ErrorPanel results={results} />
        <PetTable players={pets} />
      </OsrsPanel>
      {petLord ? (
        <div style={{ marginTop: 16 }}>
          <AwardCard award={petLord} />
        </div>
      ) : null}
    </div>
  );
}
