import { ProgressBar } from "@/components/ui/ProgressBar";
import { buildQuestLog } from "@/lib/journey";
import { PLAYER_NAMES } from "@/lib/players";
import { formatNumber } from "@/lib/format";
import { loadCorePlayerData } from "@/lib/player-data";

export const dynamic = "force-dynamic";

function activePlayer(value: string | string[] | undefined): string {
  return typeof value === "string" && (PLAYER_NAMES as readonly string[]).includes(value) ? value : PLAYER_NAMES[0];
}

function journeyHref(player: string): string {
  return `/journey?player=${encodeURIComponent(player)}`;
}

export default async function JourneyPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const selectedPlayer = activePlayer(params?.player);
  const { command, achievements, stats, collections, pets } = await loadCorePlayerData();
  const profile = command.profiles.find((entry) => entry.username === selectedPlayer) ?? command.profiles[0];
  const selectedStats = stats.find((player) => player.username === profile.username);
  const selectedCollection = collections.find((player) => player.username === profile.username);
  const selectedPets = pets.find((player) => player.username === profile.username);
  const missions = buildQuestLog({
    profile,
    achievements,
    stats: selectedStats,
    collection: selectedCollection,
    pets: selectedPets,
    rivalry: command.rivalry
  });

  return (
    <div className="questLogPage">
      <section className="questLogHero">
        <div>
          <span className="eyebrow">Journey // Personal Quest Log</span>
          <h1>{profile.username}</h1>
          <p>{profile.mainTitle} · Rank #{profile.rank} · {profile.favour.rank} of {profile.favour.god}</p>
          <strong>Three quests have been selected for today.</strong>
        </div>
        <div className="questBookRelic">
          <span>{profile.favour.god.slice(0, 2).toUpperCase()}</span>
          <strong>{formatNumber(profile.totalScore)}</strong>
          <p>Power Score</p>
        </div>
      </section>

      <section className="adventurerSelect" aria-label="Choose adventurer">
        {command.profiles.map((entry) => (
          <a className={entry.username === profile.username ? "active" : ""} href={journeyHref(entry.username)} key={entry.username}>
            <span>{entry.username.slice(0, 1)}</span>
            <strong>{entry.username}</strong>
            <small>#{entry.rank} · {entry.mainTitle}</small>
          </a>
        ))}
      </section>

      <section className="questLogLayout">
        <aside className="adventurerSheet">
          <span className="sectionKicker">Account Scan</span>
          <h2>{profile.archetype}</h2>
          <div className="sheetRows">
            <span>Main title <b>{profile.mainTitle}</b></span>
            <span>Current god <b>{profile.favour.god}</b></span>
            <span>Favour rank <b>{profile.favour.rank}</b></span>
            <span>Strongest war <b>{profile.strongestCategory}</b></span>
            <span>Weakest war <b>{profile.weakCategory}</b></span>
            <span>Next rival gap <b>{profile.pointsToOvertake === null ? "Defend #1" : `${formatNumber(profile.pointsToOvertake)} score`}</b></span>
          </div>
        </aside>

        <main className="questListPanel">
          <div className="questListHeader">
            <span className="sectionKicker">Active Quest Log</span>
            <h2>No guessing. Start here.</h2>
          </div>

          <div className="questScroll">
            {missions.map((mission, index) => (
              <article className={`journeyQuest ${mission.status}`} key={`${mission.player}-${mission.title}`}>
                <div className="questMarker">
                  <span>{mission.icon}</span>
                  <strong>Quest {index + 1}</strong>
                </div>
                <div className="questBody">
                  <div className="questTitleRow">
                    <div>
                      <span>{mission.chapter}</span>
                      <h3>{mission.title}</h3>
                    </div>
                    <strong>{mission.estimatedTime}</strong>
                  </div>
                  <p>{mission.why}</p>
                  <ProgressBar value={mission.progress} />
                  <div className="questRewardGrid">
                    <span>Waarom <b>{mission.why}</b></span>
                    <span>Beloning <b>{mission.reward}</b></span>
                    <span>Geschatte tijd <b>{mission.estimatedTime}</b></span>
                    <span>Progress <b>{formatNumber(mission.progress, 1)}%</b></span>
                    <span>Favour <b>{mission.favour}</b></span>
                    <span>Titel <b>{mission.titleReward}</b></span>
                    <span>Achievement <b>{mission.achievement}</b></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </section>
    </div>
  );
}
