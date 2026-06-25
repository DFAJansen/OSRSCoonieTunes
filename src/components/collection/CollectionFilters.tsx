import { COLLECTION_FILTERS, type CollectionFilter } from "@/lib/collection-filters";

export function CollectionFilters({
  activeFilter,
  players,
  selectedPlayer,
  onFilterChange,
  onPlayerChange
}: {
  activeFilter: CollectionFilter;
  players: string[];
  selectedPlayer: string;
  onFilterChange: (filter: CollectionFilter) => void;
  onPlayerChange: (player: string) => void;
}) {
  return (
    <section className="collectionFilters" aria-label="Collection item filters">
      <div className="collectionFilterButtons">
        {COLLECTION_FILTERS.map((filter) => (
          <button className={filter.id === activeFilter ? "active" : ""} key={filter.id} onClick={() => onFilterChange(filter.id)} type="button">
            {filter.label}
          </button>
        ))}
      </div>
      <label>
        <span>Selected player</span>
        <select value={selectedPlayer} onChange={(event) => onPlayerChange(event.target.value)}>
          {players.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
