import type { NormalizedCollection } from "@/lib/types";
import { formatNumber, formatPercent } from "@/lib/format";

export function CollectionLogTable({ players, query = "" }: { players: NormalizedCollection[]; query?: string }) {
  const needle = query.trim().toLowerCase();

  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Items</th>
            <th>Complete</th>
            <th>Categories</th>
            <th>Rank</th>
            <th>Matched Items</th>
            <th>Missing</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const matches = needle ? player.itemNames.filter((item) => item.toLowerCase().includes(needle)).slice(0, 6) : [];
            const missing = needle ? player.missingItemNames.filter((item) => item.toLowerCase().includes(needle)).slice(0, 6) : player.missingItemNames.slice(0, 3);
            return (
              <tr key={player.username}>
                <th>{player.username}</th>
                <td>
                  {formatNumber(player.finishedItems)} / {formatNumber(player.availableItems)}
                </td>
                <td className="winner">{formatPercent(player.percentage)}</td>
                <td>
                  {formatNumber(player.finishedCategories)} / {formatNumber(player.availableCategories)}
                </td>
                <td>{formatNumber(player.rank)}</td>
                <td>{matches.length ? matches.join(", ") : <span className="muted">Zoek op item</span>}</td>
                <td>{missing.length ? missing.join(", ") : <span className="muted">Geen match</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
