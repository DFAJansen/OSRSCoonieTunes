import { ActiveQuestsCompact } from "@/components/dashboard/ActiveQuestsCompact";
import { DashboardLeaderboard } from "@/components/dashboard/DashboardLeaderboard";
import { WeeklyAwardsStrip } from "@/components/dashboard/WeeklyAwardsStrip";
import { DebugPanel } from "@/components/DebugPanel";
import { ErrorPanel } from "@/components/ErrorPanel";
import { LootFeed } from "@/components/LootFeed";
import { PlayerSummaryCard } from "@/components/player/PlayerSummaryCard";
import { formatNumber } from "@/lib/format";
import type { CommandCenter } from "@/lib/game";
import type { PartyQuest } from "@/lib/quests";
import type { AchievementResult } from "@/lib/achievements";
import type { ApiResult, Award, NormalizedCollection, NormalizedStats, PetSummary, PlayerInfo, RecentItem } from "@/lib/types";

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

  return (
    <div className="warRoom">
      <section className="warHero">
        <div>
          <span className="eyebrow">War Room // Live Party Command</span>
          <h1>OSRS CoonieTunes</h1>
          <p>Friendship tracker. RNG detector. Roast generator.</p>
          <strong>Identify the leader. Assign the mission. Move the party.</strong>
        </div>
        <a className="osrsButton" href="/">Refresh Intel</a>
      </section>

      <section className="briefingSection currentWar">
        <div>
          <span className="sectionKicker">Current War</span>
          <h2>Who is winning?</h2>
          {winner ? (
            <>
              <p><strong>{winner.username}</strong> holds command with <strong>{formatNumber(winner.totalScore)}</strong> Power Score.</p>
              <p className="muted">{winner.mainTitle} - strongest area: {winner.strongestCategory}.</p>
            </>
          ) : <p className="muted">No commander identified yet.</p>}
        </div>
        {winner ? <div className="warEmblem">#{winner.rank}</div> : null}
      </section>

      <section className="briefingSection currentMission">
        <div>
          <span className="sectionKicker">Current Mission</span>
          <h2>Why play today?</h2>
          {currentMission ? (
            <>
              <p><strong>{currentMission.title}</strong></p>
              <p className="muted">{formatNumber(currentMission.progress)} / {formatNumber(currentMission.target)} {currentMission.unit} - reward: {currentMission.reward}</p>
            </>
          ) : <p className="muted">No mission assigned.</p>}
        </div>
        <div className="missionMeter"><span style={{ width: `${missionProgress}%` }} /></div>
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Main Leaderboard</span><h2>Who must be overtaken?</h2></div>
          <a className="textAction" href="/journey">Open Journey</a>
        </div>
        <DashboardLeaderboard profiles={command.profiles} />
      </section>

      <section className="briefingSection">
        <div>
          <span className="sectionKicker">Current Rivalry</span>
          <h2>Where is the front line?</h2>
          {command.rivalry ? (
            <>
              <p><strong>{command.rivalry.left}</strong> vs <strong>{command.rivalry.right}</strong></p>
              <p className="muted">{command.rivalry.status}. {formatNumber(command.rivalry.scoreGapPercent, 1)}% gap. {command.rivalry.detail}</p>
            </>
          ) : <p className="muted">No active duel detected.</p>}
        </div>
        <a className="textAction" href="/journey">View Orders</a>
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Player Cards</span><h2>Who am I?</h2></div>
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
          <div><span className="sectionKicker">Party Quests</span><h2>What are the active orders?</h2></div>
          <a className="textAction" href="/journey">Mission Board</a>
        </div>
        <ActiveQuestsCompact quests={command.quests} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Weekly Headlines</span><h2>Who gets the medals?</h2></div>
          <a className="textAction" href="/achievements">Hall of Legends</a>
        </div>
        <WeeklyAwardsStrip awards={awards} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Recent Loot</span><h2>What just changed?</h2></div>
          <a className="textAction" href="/loot-feed">Full Feed</a>
        </div>
        <LootFeed items={recentItems.slice(0, 5)} />
      </section>

      <section className="briefingPanel">
        <div className="briefingHeader">
          <div><span className="sectionKicker">Roast Console</span><h2>What is command saying?</h2></div>
        </div>
        <div className="console compactConsole">
          {roasts.slice(0, 3).map((roast) => <p key={roast}><span>::</span> {roast}</p>)}
        </div>
      </section>

      <DebugPanel label="war room results" data={{ command, infoResults, statsResults, petsResults, gainsResults, collectionResults, recentItems: recentItems.slice(0, 3) }} />
    </div>
  );
}
