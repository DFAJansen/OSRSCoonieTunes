import type { RecentItem } from "@/lib/types";

export function LootFeed({ items }: { items: RecentItem[] }) {
  return (
    <div>
      {items.slice(0, 80).map((item, index) => (
        <div className="lootItem" key={`${item.player}-${item.itemName}-${item.date}-${index}`}>
          <strong>{item.player}</strong>
          <span className={item.notable ? "notable" : ""}>
            {item.player === "RNG Goblin"
              ? `${item.player} found something suspiciously lucky: ${item.itemName}`
              : `${item.player} has received a drop: ${item.itemName}`}
          </span>
          <span className="muted">{item.date || "Date unavailable from TempleOSRS"}</span>
        </div>
      ))}
    </div>
  );
}
