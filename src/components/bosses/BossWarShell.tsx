"use client";

import { useMemo, useState } from "react";
import { BossTable } from "@/components/BossTable";
import { BOSS_NAMES, getBossGroup } from "@/lib/bosses";
import { formatNumber } from "@/lib/format";
import { buildBossDebugInfo, buildBossDna, buildBossInsights, filterBossesByTab, findClosestKcRace, type BossWarTab } from "@/lib/boss-war";
import type { NormalizedStats } from "@/lib/types";

const TABS: BossWarTab[] = ["Bosses", "Raids", "Challenges"];
const COMPACT_BOSS_ROWS = 8;

function bossNamesByKc(players: NormalizedStats[]): string[] {
  return Array.from(new Set(players.flatMap((player) => player.bosses.map((boss) => boss.name)))).sort((a, b) => {
    const totalA = players.reduce((sum, player) => sum + (player.bosses.find((boss) => boss.name === a)?.kc ?? 0), 0);
    const totalB = players.reduce((sum, player) => sum + (player.bosses.find((boss) => boss.name === b)?.kc ?? 0), 0);
    return totalB - totalA || a.localeCompare(b);
  });
}

function limitBossRows(players: NormalizedStats[], limit: number): NormalizedStats[] {
  const visibleBosses = new Set(bossNamesByKc(players).slice(0, limit));
  return players.map((player) => ({
    ...player,
    bosses: player.bosses.filter((boss) => visibleBosses.has(boss.name))
  }));
}

function bossNamesForTab(tab: BossWarTab): string[] {
  const group = tab === "Raids" ? "raids" : tab === "Challenges" ? "challenges" : "bosses";
  return BOSS_NAMES.filter((bossName) => getBossGroup(bossName) === group).sort();
}

export function BossWarShell({ players }: { players: NormalizedStats[] }) {
  const [activeTab, setActiveTab] = useState<BossWarTab>("Bosses");
  const [showAll, setShowAll] = useState(false);
  const insights = useMemo(() => buildBossInsights(players), [players]);
  const dna = useMemo(() => buildBossDna(players), [players]);
  const race = useMemo(() => findClosestKcRace(players), [players]);
  const debug = useMemo(() => buildBossDebugInfo(players), [players]);
  const filteredPlayers = useMemo(() => filterBossesByTab(players, activeTab), [players, activeTab]);
  const bossCount = useMemo(() => bossNamesByKc(filteredPlayers).length, [filteredPlayers]);
  const matrixPlayers = useMemo(
    () => (showAll ? filteredPlayers : limitBossRows(filteredPlayers, COMPACT_BOSS_ROWS)),
    [filteredPlayers, showAll]
  );
  const fullBossNames = useMemo(() => bossNamesForTab(activeTab), [activeTab]);

  return (
    <>
      <section className="bossInsights">
        {insights.map((insight) => (
          <article key={insight.title}>
            <span>{insight.title}</span>
            <strong>{insight.value}</strong>
            <p>{insight.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel bossDnaPanel">
        <h2>Bossing DNA</h2>
        <div className="bossDnaGrid">
          {dna.map((player) => (
            <article key={player.player}>
              <strong>{player.player}</strong>
              {player.groups.map((group) => (
                <span className={`dnaChip ${group.level}`} key={group.group}>
                  {group.group}: {group.level}
                </span>
              ))}
            </article>
          ))}
        </div>
      </section>

      {race ? (
        <section className="panel bossRacePanel">
          <h2>Closest KC Race</h2>
          <p>
            <strong>{race.bossName}</strong> - {race.left.player}: {formatNumber(race.left.kc)} KC - {race.right.player}: {formatNumber(race.right.kc)} KC - Gap: {formatNumber(race.gap)} KC
          </p>
        </section>
      ) : null}

      <section className="panel">
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">Boss List</span>
            <h2>Boss Matrix</h2>
          </div>
          <button className="osrsButton" onClick={() => setShowAll((value) => !value)} type="button">
            {showAll ? "Show less" : "View all"}
          </button>
        </div>
        <div className="bossSubtabs" role="tablist" aria-label="Boss War list filters">
          {TABS.map((tab) => (
            <button className={tab === activeTab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </div>
        <BossTable players={matrixPlayers} bossNames={showAll ? fullBossNames : undefined} />
        {!showAll && bossCount > COMPACT_BOSS_ROWS ? (
          <p className="mutedText">Showing top {COMPACT_BOSS_ROWS} of {bossCount} {activeTab.toLowerCase()}.</p>
        ) : null}
      </section>

      {process.env.NODE_ENV !== "production" ? (
        <details className="collectionDebugPanel">
          <summary>Show boss debug</summary>
          <div className="collectionDebugList">
            <strong>Accepted</strong>
            {debug.accepted.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="collectionDebugList">
            <strong>Rejected</strong>
            {debug.rejected.map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="collectionDebugList">
            <strong>Unmapped numeric</strong>
            {debug.unmapped.map((item) => <span key={item}>{item}</span>)}
          </div>
        </details>
      ) : null}
    </>
  );
}
