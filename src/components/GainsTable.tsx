import type { NormalizedStats } from "@/lib/types";
import { formatNumber } from "@/lib/format";

export function GainsTable({ players }: { players: NormalizedStats[] }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>XP Gain</th>
            <th>EHP</th>
            <th>EHB</th>
            <th>Biggest Skill Gain</th>
            <th>Boss KC Gain</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const bestSkill = [...player.skills].sort((a, b) => (b.xp ?? -1) - (a.xp ?? -1))[0];
            return (
              <tr key={player.username}>
                <th>{player.username}</th>
                <td>{formatNumber(player.totalXp)}</td>
                <td>{formatNumber(player.ehp, 2)}</td>
                <td>{formatNumber(player.ehb, 2)}</td>
                <td>
                  {bestSkill?.name ?? "-"} ({formatNumber(bestSkill?.xp)})
                </td>
                <td>{formatNumber(player.totalBossKc)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
