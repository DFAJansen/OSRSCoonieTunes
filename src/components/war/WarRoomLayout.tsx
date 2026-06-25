import { ActiveQuestsCompact } from "@/components/dashboard/ActiveQuestsCompact";
import { DashboardLeaderboard } from "@/components/dashboard/DashboardLeaderboard";
import { WeeklyAwardsStrip } from "@/components/dashboard/WeeklyAwardsStrip";
import { DebugPanel } from "@/components/DebugPanel";
import { ErrorPanel } from "@/components/ErrorPanel";
import { PlayerSummaryCard } from "@/components/player/PlayerSummaryCard";
import { formatNumber } from "@/lib/format";
import type { CommandCenter, PlayerGameProfile } from "@/lib/game";
import type { PartyQuest } from "@/lib/quests";
import type { AchievementResult } from "@/lib/achievements";
import type { ApiResult, Award, NormalizedCollection, NormalizedStats, PetSummary, PlayerInfo, RecentItem } from "@/lib/types";

type PowerPart = {
  label: string;
  value: number;
  percent: number;
};

function warName(area: string): string {
  return area === "Collection" ? "Collection War" : `${area} War`;
}

function powerBreakdown(profile: PlayerGameProfile): PowerPart[] {
  const total = Math.max(profile.score.skillScore + profile.score.bossScore + profile.score.collectionScore, 1);
  return [
    { label: "Boss Power", value: profile.score.bossScore, percent: (profile.score.bossScore / total) * 100 },
    { label: "Skill Power", value: profile.score.skillScore, percent: (profile.score.skillScore / total) * 100 },
    { label: "Collection Power", value: profile.score.collectionScore, percent: (profile.score.collectionScore / total) * 100 }
  ];
}

function explainLeader(profile?: PlayerGameProfile, awards: Award[] = []): string[] {
  if (!profile) return ["No commander has enough intel to hold the room yet."];
  const parts = powerBreakdown(profile).sort((a, b) => b.value - a.value);
  const medals = awards.filter((award) => award.player === profile.username).length;
  return [
    `Controls the war because ${parts[0].label.toLowerCase()} is the largest part of their score.`,
    `Strongest front: ${warName(profile.strongestCategory)}.`,
    `Current title pressure: ${profile.mainTitle}.`,
    `God rank advantage: ${profile.favour.rank} of ${profile.favour.god}.`,
    medals ? `Holds ${medals} weekly medal${medals === 1 ? "" : "s"}.` : `Still has medal room to convert this lead into prestige.`
  ];
}

function missionWhy(quest?: PartyQuest): string {
  if (!quest) return "Command has no active order yet.";
  if (/xp/i.test(quest.unit)) return "XP gains move the whole party and create pressure in Skill War.";
  if (/kc/i.test(quest.unit)) return "Boss KC is the fastest way to make the front line move today.";
  if (/drop|item|slot/i.test(`${quest.unit} ${quest.title}`)) return "Collection progress creates permanent power and bragging rights.";
  return "This order gives the party a clean target for today's session.";
}

function dangerLine(profile: PlayerGameProfile): string {
  if (profile.rank === 1) return `${profile.mainTitle} - defending command through ${warName(profile.strongestCategory)}.`;
  const chase = profile.pointsToOvertake ? `${formatNumber(profile.pointsToOvertake)} power behind the next target` : "ready to defend position";
  return `${profile.mainTitle} - dangerous in ${warName(profile.strongestCategory)}, ${chase}.`;
}

function frontLineStory(command: CommandCenter): string {
  if (!command.rivalry) return "No active front line detected. The war room is watching for the next close duel.";
  const left = command.profiles.find((profile) => profile.username === command.rivalry?.left);
  const right = command.profiles.find((profile) => profile.username === command.rivalry?.right);
  if (!left || !right) return `${command.rivalry.left} vs ${command.rivalry.right}: ${command.rivalry.detail}`;
  const leader = left.totalScore >= right.totalScore ? left : right;
  const chaser = leader.username === left.username ? right : left;
  return `${leader.username} defends the line through ${warName(leader.strongestCategory)}, but ${chaser.username} can answer through ${warName(chaser.strongestCategory)}.`;
}

function buildHeadlines(command: CommandCenter, awards: Award[], recentItems: RecentItem[]): string[] {
  const headlines = [
    command.profiles[0] ? `${command.profiles[0].username} holds command as ${command.profiles[0].mainTitle}.` : "",
    command.rivalry ? `${command.rivalry.left} and ${command.rivalry.right} are separated by a ${formatNumber(command.rivalry.scoreGapPercent, 1)}% war gap.` : "",
    recentItems[0] ? `${recentItems[0].player} triggered loot intel: ${recentItems[0].itemName}.` : "",
    awards[0] ? `${awards[0].player} earns the ${awards[0].title} medal.` : "",
    command.weeklyChampion ? `${command.weeklyChampion.username} has the strongest weekly momentum.` : ""
  ].filter(Boolean);
  return headlines.slice(0, 5);
}

function commandBriefing(command: CommandCenter, mission?: PartyQuest): string[] {
  const leader = command.profiles[0];
  const chaser = command.profiles[1];
  return [
    leader ? `${leader.username} currently controls the war room with ${formatNumber(leader.totalScore)} CoonieTunes power.` : "Command has incomplete leader intel.",
    chaser ? `${chaser.username} is the primary threat, strongest in ${warName(chaser.strongestCategory)}.` : "No second commander has been identified yet.",
    command.rivalry ? frontLineStory(command) : "No active rivalry is close enough to trigger a front-line alert.",
    mission ? `Today's order is ${mission.title.toLowerCase()} for ${mission.reward}.` : "No daily order is active yet."
  ];
}

export function WarRoomLayout({
  command,
  achievements,
  awards,
  roasts,
  recentItems,
  infoResults,
  statsResults,
  petsResults,
  gainsResults,
  collectionResults
}: {
  command: CommandCenter;
  achievements: AchievementResult[];
  awards: Award[];
  roasts: string[];
  recentItems: RecentItem[];
  infoResults: ApiResult<PlayerInfo>[];
  statsResults: ApiResult<NormalizedStats>[];
  petsResults: ApiResult<PetSummary>[];
  gainsResults: ApiResult<NormalizedStats>[];
  collectionResults: ApiResult<NormalizedCollection>[];
}) {
  const winner = command.profiles[0];
  const currentMission: PartyQuest | undefined = command.quests[0];
  const missionProgress = currentMission ? Math.min(100, (currentMission.progress / currentMission.target) * 100) : 0;
  const leaderReasons = explainLeader(winner, awards);
  const headlines = buildHeadlines(command, awards, recentItems);
  const briefing = commandBriefing(command, currentMission);

  return (
    <div className="warRoom">
      <section className="warHero">
        <div className="warHeroCopy">
          <span className="eyebrow">Who is winning the war?</span>
          <h1>{winner?.username ?? "No Supreme Commander"}</h1>
          {winner ? (
            <>
              <p>Current Supreme Commander</p>
              <strong className="heroPowerScore">{formatNumber(winner.totalScore)} Power Score</strong>
              <div className="heroCommandMeta">
                <span>{winner.mainTitle}</span>
                <span>{winner.favour.rank} of {winner.favour.god}</span>
              </div>
              <div className="powerBreakdown">
                {powerBreakdown(winner).map((part) => (
                  <div className="powerRow" key={part.label}>
                    <span>{part.label}</span>
                    <div className="powerTrack"><i style={{ width: `${part.percent}%` }} /></div>
                    <b>{Math.round(part.percent)}%</b>
                  </div>
                ))}
              </div>
            </>
          ) : <p>No commander identified yet.</p>}
        </div>
        {winner ? (
          <aside className="commanderCard" aria-label="Supreme Commander dossier">
            <span className="sectionKicker">Commander Card</span>
            <div className="commanderCardRows">
              <p><span>Rank</span><strong>#{winner.rank}</strong></p>
              <p><span>Current God</span><strong>{winner.favour.god}</strong></p>
              <p><span>Military Rank</span><strong>{winner.favour.rank}</strong></p>
              <p><span>Main Title</span><strong>{winner.mainTitle}</strong></p>
              <p><span>Current Status</span><strong>Holding command</strong></p>
            </div>
          </aside>
        ) : null}
        <a className="osrsButton" href="/">Refresh Intel</a>
      </section>

      <section className="briefingSection currentWar">
        <div>
          <span className="sectionKicker">Why is this player winning?</span>
          <h2>Command Advantage</h2>
          <ul className="briefingBullets">
            {leaderReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
        {winner ? <div className="warEmblem">#{winner.rank}</div> : null}
      </section>

      <section className="briefingSection currentMission">
        <div>
          <span className="sectionKicker">Why play today?</span>
          <h2>Why play today?</h2>
          {currentMission ? (
            <>
              <p><strong>{currentMission.title}</strong></p>
              <p className="muted">{missionWhy(currentMission)} Reward: {currentMission.reward}</p>
              <p className="muted">{formatNumber(currentMission.progress)} / {formatNumber(currentMission.target)} {currentMission.unit}</p>
            </>
          ) : <p className="muted">No mission assigned.</p>}
        </div>
        <div className="missionMeter"><span style={{ width: `${missionProgress}%` }} /></div>
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Who must be overtaken?</span><h2>Threat Board</h2></div>
          <a className="textAction" href="/journey">Open Journey</a>
        </div>
        <DashboardLeaderboard profiles={command.profiles} />
        <div className="threatIntel">
          {command.profiles.map((profile) => <p key={profile.username}>{dangerLine(profile)}</p>)}
        </div>
      </section>

      <section className="briefingSection">
        <div>
          <span className="sectionKicker">Where is the front line?</span>
          <h2>Where is the front line?</h2>
          {command.rivalry ? (
            <>
              <p><strong>{command.rivalry.left}</strong> vs <strong>{command.rivalry.right}</strong></p>
              <p className="muted">{frontLineStory(command)}</p>
              <p className="muted">{command.rivalry.status}. Difference: {formatNumber(command.rivalry.scoreGapPercent, 1)}% war gap.</p>
            </>
          ) : <p className="muted">No active duel detected.</p>}
        </div>
        <a className="textAction" href="/journey">View Orders</a>
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Who am I?</span><h2>Character Sheets</h2></div>
        </div>
        <div className="summaryGrid">
          {command.profiles.map((profile) => (
            <PlayerSummaryCard
              key={profile.username}
              profile={profile}
              achievements={achievements.filter((achievement) => achievement.player === profile.username)}
            />
          ))}
        </div>
        <ErrorPanel results={[...infoResults, ...statsResults]} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">What are the active orders?</span><h2>Party Orders</h2></div>
          <a className="textAction" href="/journey">Mission Board</a>
        </div>
        <ActiveQuestsCompact quests={command.quests} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Who gets the medals?</span><h2>Weekly Medals</h2></div>
          <a className="textAction" href="/achievements">Hall of Legends</a>
        </div>
        <WeeklyAwardsStrip awards={awards} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">What just changed?</span><h2>War Headlines</h2></div>
          <a className="textAction" href="/loot-feed">Full Feed</a>
        </div>
        <div className="headlineList">
          {headlines.length ? headlines.map((headline) => <p key={headline}>{headline}</p>) : <p className="muted">No new battlefield reports yet.</p>}
        </div>
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">What is command saying?</span><h2>Command Briefing</h2></div>
        </div>
        <div className="console compactConsole">
          {briefing.map((line) => <p key={line}><span>::</span> {line}</p>)}
          {roasts.slice(0, 1).map((roast) => <p key={roast}><span>::</span> {roast}</p>)}
        </div>
      </section>

      <DebugPanel label="war room results" data={{ command, infoResults, statsResults, petsResults, gainsResults, collectionResults, recentItems: recentItems.slice(0, 3) }} />
    </div>
  );
}
