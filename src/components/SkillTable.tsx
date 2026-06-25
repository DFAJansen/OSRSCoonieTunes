import { formatNumber } from "@/lib/format";
import { SKILLS } from "@/lib/normalizers-fixed";
import type { NormalizedStats } from "@/lib/types";

type SkillMode = "levels" | "xp" | "rank";

export function SkillTable({ players, mode = "levels" }: { players: NormalizedStats[]; mode?: SkillMode }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Skill</th>
            {players.map((player) => (
              <th key={player.username}>{player.username}</th>
            ))}
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {SKILLS.map((skillName) => {
            const rows = players.map((player) => player.skills.find((skill) => skill.name === skillName));
            const winner = [...players].sort(
              (a, b) =>
                (mode === "rank"
                  ? (a.skills.find((skill) => skill.name === skillName)?.rank ?? Number.MAX_SAFE_INTEGER) -
                    (b.skills.find((skill) => skill.name === skillName)?.rank ?? Number.MAX_SAFE_INTEGER)
                  : (b.skills.find((skill) => skill.name === skillName)?.[mode === "levels" ? "level" : "xp"] ?? -1) -
                    (a.skills.find((skill) => skill.name === skillName)?.[mode === "levels" ? "level" : "xp"] ?? -1))
            )[0];
            return (
              <tr key={skillName}>
                <th>{skillName}</th>
                {rows.map((skill, index) => (
                  <td key={`${players[index]?.username}-${skillName}`} className={players[index]?.username === winner?.username ? "winner" : ""}>
                    {mode === "levels" ? `Lvl ${formatNumber(skill?.level)}` : null}
                    {mode === "xp" ? `${formatNumber(skill?.xp)} XP` : null}
                    {mode === "rank" ? `Rank ${formatNumber(skill?.rank)}` : null}
                    <br />
                    <span className="muted">
                      {mode !== "levels" ? `Lvl ${formatNumber(skill?.level)}` : `${formatNumber(skill?.xp)} XP`}
                    </span>
                  </td>
                ))}
                <td className="winner">{winner?.username ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
