import { formatNumber } from "@/lib/format";
import { buildHallOfLegendsData } from "@/lib/hall-of-legends";
import { loadCorePlayerData } from "@/lib/player-data";

export const dynamic = "force-dynamic";

function statusLabel(status: string): string {
  if (status === "completed") return "Unlocked";
  if (status === "in-progress") return "Awakening";
  return "Sealed";
}

export default async function AchievementsPage() {
  const { stats, gains, collections, pets, recent, players, command, achievements: allAchievements } = await loadCorePlayerData();
  const {
    titleEntries,
    favourRanks,
    generals,
    hiddenAchievements,
    seasonWinners,
    hallOfFame,
    completedCount,
    totalFavour,
    monumentChampion
  } = buildHallOfLegendsData({
    players,
    achievements: allAchievements,
    command,
    stats,
    gains,
    collections,
    pets,
    recentItems: recent.merged
  });

  return (
    <div className="hallMonumentPage">
      <section className="monumentHero">
        <div>
          <span className="eyebrow">Hall of Legends // Monument of CoonieTunes</span>
          <h1>Hall of Legends</h1>
          <p>Titles carved in gold. Favour ranks preserved. Seasons remembered.</p>
        </div>
        <div className="monumentCrown">
          <span>Legend</span>
          <strong>{monumentChampion?.username ?? "Unknown"}</strong>
          <p>{monumentChampion?.mainTitle ?? "Awaiting inscription"}</p>
        </div>
      </section>

      <section className="monumentStats" aria-label="Hall totals">
        <div><span>Titles</span><strong>{formatNumber(titleEntries.length)}</strong></div>
        <div><span>Achievements</span><strong>{formatNumber(allAchievements.length)}</strong></div>
        <div><span>Unlocked</span><strong>{formatNumber(completedCount)}</strong></div>
        <div><span>Total Favour</span><strong>{formatNumber(totalFavour)}</strong></div>
      </section>

      <section className="monumentWing titleWing">
        <div className="monumentHeading">
          <span className="sectionKicker">Every Title</span>
          <h2>Inscribed Titles</h2>
        </div>
        <div className="titleRelicGrid">
          {titleEntries.map((title) => (
            <article className="titleRelic" key={`${title.player}-${title.name}`}>
              <span>{title.type}</span>
              <strong>{title.name}</strong>
              <p>{title.player} - {formatNumber(title.prestige)} prestige</p>
            </article>
          ))}
        </div>
      </section>

      <section className="monumentWing">
        <div className="monumentHeading">
          <span className="sectionKicker">Every Achievement</span>
          <h2>Rites of Glory</h2>
        </div>
        <div className="riteWall">
          {allAchievements.map((achievement) => (
            <article className={`riteStone ${achievement.status}`} key={`${achievement.player}-${achievement.id}`}>
              <span>{achievement.god} - {achievement.difficulty}</span>
              <strong>{achievement.name}</strong>
              <p>{achievement.player} - {statusLabel(achievement.status)} - {formatNumber(achievement.current)} / {formatNumber(achievement.target)}</p>
              <small>{achievement.rewardTitle} - +{formatNumber(achievement.favour)} favour</small>
            </article>
          ))}
        </div>
      </section>

      <section className="monumentSplit">
        <div className="monumentWing">
          <div className="monumentHeading">
            <span className="sectionKicker">Every Favour Rank</span>
            <h2>Divine Allegiance</h2>
          </div>
          <div className="favourPillars">
            {favourRanks.map((favour) => (
              <article className="favourPillar" key={`${favour.player}-${favour.god}`}>
                <span>{favour.god}</span>
                <strong>{favour.rank}</strong>
                <p>{favour.player} - {formatNumber(favour.score)} favour</p>
              </article>
            ))}
          </div>
        </div>

        <div className="monumentWing generalWing">
          <div className="monumentHeading">
            <span className="sectionKicker">Every General</span>
            <h2>General's Dais</h2>
          </div>
          <div className="generalGrid">
            {generals.map((general) => (
              <article className="generalSeal" key={`${general.player}-${general.god}`}>
                <span>{general.god.slice(0, 2).toUpperCase()}</span>
                <strong>{general.player}</strong>
                <p>{general.title}</p>
              </article>
            ))}
            {!generals.length ? <p className="muted">No Generals have been crowned yet.</p> : null}
          </div>
        </div>
      </section>

      <section className="monumentWing hiddenWing">
        <div className="monumentHeading">
          <span className="sectionKicker">Every Hidden Achievement</span>
          <h2>Sealed Chamber</h2>
        </div>
        <div className="hiddenGrid">
          {hiddenAchievements.map((achievement) => (
            <article className={`hiddenRelic ${achievement.status}`} key={`${achievement.player}-${achievement.id}`}>
              <span>Hidden</span>
              <strong>{achievement.name}</strong>
              <p>{achievement.player} - {statusLabel(achievement.status)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="monumentSplit">
        <div className="monumentWing">
          <div className="monumentHeading">
            <span className="sectionKicker">Every Season Winner</span>
            <h2>Season Thrones</h2>
          </div>
          <div className="seasonThrones">
            {seasonWinners.map((winner) => (
              <article className="seasonThrone" key={`${winner.title}-${winner.player}`}>
                <span>{winner.title}</span>
                <strong>{winner.player}</strong>
                <p>{winner.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="monumentWing">
          <div className="monumentHeading">
            <span className="sectionKicker">Every Hall of Fame Entry</span>
            <h2>Hall of Fame</h2>
          </div>
          <div className="fameLedger">
            {hallOfFame.map((entry, index) => (
              <article className="fameEntry" key={`${entry.title}-${entry.player}-${index}`}>
                <span>#{index + 1}</span>
                <strong>{entry.title}</strong>
                <p>{entry.player} - {entry.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
