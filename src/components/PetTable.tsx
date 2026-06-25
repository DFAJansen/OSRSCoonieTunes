import type { PetSummary } from "@/lib/types";

export function PetTable({ players }: { players: PetSummary[] }) {
  const petNames = Array.from(new Set(players.flatMap((player) => player.pets))).sort();

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Pet</th>
            {players.map((player) => (
              <th key={player.username}>{player.username}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {petNames.length ? (
            petNames.map((pet) => (
              <tr key={pet}>
                <th>{pet}</th>
                {players.map((player) => (
                  <td key={`${player.username}-${pet}`} className={player.pets.includes(pet) ? "winner" : ""}>
                    {player.pets.includes(pet) ? "Owned" : "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={players.length + 1}>Geen petdetails gevonden, maar pet counts staan hierboven.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
