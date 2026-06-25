import { calculateScore } from "./scoring";
import { getBossGroup, isAllowedBossMetric, isBlockedBossMetric, resolveBossName } from "./bosses";
import { getNestedValue, isRecord, safeNumber } from "./format";
import type { BossStat, NormalizedStats } from "./types";

export type BossWarTab = "Bosses" | "Raids" | "Challenges";

export type BossInsight = {
  title: string;
  value: string;
  detail: string;
};

export type BossRace = {
  bossName: string;
  left: { player: string; kc: number };
  right: { player: string; kc: number };
  gap: number;
} | null;

export type BossDebugInfo = {
  accepted: string[];
  rejected: string[];
  unmapped: string[];
};

const DNA_GROUPS: Record<string, string[]> = {
  "God Wars": ["General Graardor", "Commander Zilyana", "Kree'arra", "K'ril Tsutsaroth", "Nex"],
  "Slayer Bosses": ["Abyssal Sire", "Alchemical Hydra", "Araxxor", "Cerberus", "Grotesque Guardians", "Kraken", "Thermonuclear Smoke Devil"],
  Raids: ["Chambers of Xeric", "Chambers of Xeric: Challenge Mode", "Theatre of Blood", "Theatre of Blood: Hard Mode", "Tombs of Amascut", "Tombs of Amascut: Expert Mode"],
  Wilderness: ["Callisto", "Artio", "Chaos Elemental", "Chaos Fanatic", "Scorpia", "Venenatis", "Spindel", "Vet'ion", "Calvar'ion"],
  "DT2 / Modern": ["Duke Sucellus", "The Leviathan", "Vardorvis", "Phantom Muspah", "Scurrius", "The Hueycoatl", "Yama", "Amoxliatl"],
  Challenges: ["TzTok-Jad", "TzKal-Zuk", "Fortis Colosseum", "Sol Heredit", "The Gauntlet", "Corrupted Gauntlet"]
};

export function getBossWarTab(bossName: string): BossWarTab {
  const group = getBossGroup(bossName);
  if (group === "raids") return "Raids";
  if (group === "challenges") return "Challenges";
  return "Bosses";
}

export function filterBossesByTab(players: NormalizedStats[], tab: BossWarTab): NormalizedStats[] {
  return players.map((player) => ({
    ...player,
    bosses: player.bosses.filter((boss) => getBossWarTab(boss.name) === tab),
    totalBossKc: player.bosses.filter((boss) => getBossWarTab(boss.name) === tab).reduce((sum, boss) => sum + boss.kc, 0)
  }));
}

export function buildBossInsights(players: NormalizedStats[]): BossInsight[] {
  const bossKing = [...players].sort((a, b) => calculateScore({ stats: b }).bossScore - calculateScore({ stats: a }).bossScore)[0];
  const allKc = players.flatMap((player) => player.bosses.map((boss) => ({ player: player.username, boss: boss.name, kc: boss.kc })));
  const mostKc = [...allKc].sort((a, b) => b.kc - a.kc)[0];
  const raidLeader = [...players]
    .map((player) => ({ player: player.username, kc: raidTotal(player.bosses) }))
    .sort((a, b) => b.kc - a.kc)[0];
  const closest = closestBossScoreGap(players);

  return [
    { title: "Boss King", value: bossKing?.username ?? "Locked", detail: bossKing ? `${Math.round(calculateScore({ stats: bossKing }).bossScore)} Boss Score` : "No boss data" },
    { title: "Most KC", value: mostKc ? mostKc.boss : "Locked", detail: mostKc ? `${mostKc.player}: ${mostKc.kc.toLocaleString()} KC` : "No boss KC" },
    { title: "Raid Leader", value: raidLeader?.player ?? "Locked", detail: raidLeader ? `${raidLeader.kc.toLocaleString()} raid KC` : "No raid KC" },
    { title: "Closest Rival", value: closest ? `${closest.left} vs ${closest.right}` : "Locked", detail: closest ? `${Math.round(closest.gap)} Boss Score gap` : "No rivalry" }
  ];
}

export function buildBossDna(players: NormalizedStats[]) {
  return players.map((player) => ({
    player: player.username,
    groups: Object.entries(DNA_GROUPS).map(([group, bossNames]) => {
      const kc = player.bosses.filter((boss) => bossNames.includes(boss.name)).reduce((sum, boss) => sum + boss.kc, 0);
      return { group, kc, level: kc >= 1000 ? "high" : kc >= 250 ? "medium" : kc > 0 ? "low" : "none" };
    })
  }));
}

export function findClosestKcRace(players: NormalizedStats[]): BossRace {
  const bossNames = Array.from(new Set(players.flatMap((player) => player.bosses.map((boss) => boss.name))));
  const races = bossNames.flatMap((bossName) => {
    const entries = players
      .map((player) => ({ player: player.username, kc: player.bosses.find((boss) => boss.name === bossName)?.kc ?? 0 }))
      .filter((entry) => entry.kc > 0)
      .sort((a, b) => b.kc - a.kc);
    if (entries.length < 2) return [];
    return [{ bossName, left: entries[0], right: entries[1], gap: entries[0].kc - entries[1].kc }];
  });

  return races.sort((a, b) => a.gap - b.gap)[0] ?? null;
}

export function buildBossDebugInfo(rawResults: unknown[]): BossDebugInfo {
  const accepted = new Set<string>();
  const rejected = new Set<string>();
  const unmapped = new Set<string>();

  rawResults.forEach((raw) => {
    if (isRecord(raw) && isRecord(raw.bossDebug)) {
      const player = typeof raw.username === "string" ? raw.username : "Unknown";
      const debug = raw.bossDebug;
      if (Array.isArray(debug.accepted)) {
        debug.accepted.forEach((candidate) => {
          if (!isRecord(candidate)) return;
          const rawKey = String(candidate.rawKey ?? "");
          const normalizedKey = String(candidate.normalizedKey ?? "");
          const value = safeNumber(candidate.value) ?? 0;
          accepted.add(`${player}: ${rawKey} -> ${resolveBossName(rawKey) ?? normalizedKey} (${value.toLocaleString()})`);
        });
      }
      if (Array.isArray(debug.rejected)) {
        debug.rejected.forEach((candidate) => {
          if (!isRecord(candidate)) return;
          const rawKey = String(candidate.rawKey ?? "");
          const normalizedKey = String(candidate.normalizedKey ?? "");
          const value = safeNumber(candidate.value) ?? 0;
          rejected.add(`${player}: ${rawKey} (${normalizedKey}) = ${value.toLocaleString()}`);
        });
      }
      if (Array.isArray(debug.unmapped)) {
        debug.unmapped.forEach((candidate) => {
          if (!isRecord(candidate)) return;
          const rawKey = String(candidate.rawKey ?? "");
          const normalizedKey = String(candidate.normalizedKey ?? "");
          const value = safeNumber(candidate.value) ?? 0;
          unmapped.add(`${player}: ${rawKey} (${normalizedKey}) = ${value.toLocaleString()}`);
        });
      }
      return;
    }

    const record = unwrapData(raw);
    if (Array.isArray(record.bosses)) {
      record.bosses.forEach((boss) => {
        if (isRecord(boss) && typeof boss.name === "string") accepted.add(boss.name);
      });
      return;
    }
    Object.entries(record).forEach(([key, value]) => {
      if (safeNumber(value) === null) return;
      if (isAllowedBossMetric(key)) accepted.add(`${key} -> ${resolveBossName(key)}`);
      else if (isBlockedBossMetric(key) || key.endsWith("_rank") || key.endsWith("_level")) rejected.add(key);
      else if (safeNumber(value)! > 0) unmapped.add(key);
    });
  });

  return {
    accepted: [...accepted].slice(0, 50),
    rejected: [...rejected].slice(0, 50),
    unmapped: [...unmapped].slice(0, 50)
  };
}

function raidTotal(bosses: BossStat[]): number {
  return bosses.filter((boss) => getBossGroup(boss.name) === "raids").reduce((sum, boss) => sum + boss.kc, 0);
}

function closestBossScoreGap(players: NormalizedStats[]) {
  const scores = players
    .map((player) => ({ player: player.username, score: calculateScore({ stats: player }).bossScore }))
    .sort((a, b) => b.score - a.score);
  const pairs = scores.slice(0, -1).map((left, index) => ({ left: left.player, right: scores[index + 1].player, gap: Math.abs(left.score - scores[index + 1].score) }));
  return pairs.sort((a, b) => a.gap - b.gap)[0] ?? null;
}

function unwrapData(value: unknown): Record<string, unknown> {
  const record = isRecord(value) ? value : {};
  return isRecord(record.data) ? record.data : record;
}
