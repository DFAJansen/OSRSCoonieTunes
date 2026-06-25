import type { NormalizedStats } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export function BossTable({ players, bossNames: providedBossNames }: { players: NormalizedStats[]; bossNames?: string[] }) {
  const bossNames = providedBossNames ?? Array.from(new Set(players.flatMap((player) => player.bosses.map((boss) => boss.name)))).sort();

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Boss</th>
            {players.map((player) => (
              <th key={player.username}>{player.username}</th>
            ))}
            <th>Highest KC</th>
          </tr>
        </thead>
        <tbody>
          {bossNames.map((bossName) => {
            const winner = [...players].sort(
              (a, b) =>
                (b.bosses.find((boss) => boss.name === bossName)?.kc ?? 0) -
                (a.bosses.find((boss) => boss.name === bossName)?.kc ?? 0)
            )[0];
            const winnerKc = winner?.bosses.find((boss) => boss.name === bossName)?.kc ?? 0;
            return (
              <tr key={bossName}>
                <th>{bossName}</th>
                {players.map((player) => {
                  const kc = player.bosses.find((boss) => boss.name === bossName)?.kc ?? 0;
                  return (
                    <td key={`${player.username}-${bossName}`} className={player.username === winner?.username && kc > 0 ? "winner" : ""}>
                      {formatNumber(kc)}
                    </td>
                  );
                })}
                <td className={winnerKc > 0 ? "winner" : ""}>{winnerKc > 0 ? winner?.username : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
