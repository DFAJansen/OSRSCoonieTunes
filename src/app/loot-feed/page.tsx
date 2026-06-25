import { ErrorPanel } from "@/components/ErrorPanel";
import { LootFeed } from "@/components/LootFeed";
import { OsrsPanel } from "@/components/OsrsPanel";
import { loadRecentItems } from "@/lib/loaders";
import { getServerActiveParty } from "@/lib/server-settings";

export const dynamic = "force-dynamic";

export default async function LootFeedPage() {
  const partySlots = await getServerActiveParty();
  const { results, merged } = await loadRecentItems(partySlots);

  return (
    <OsrsPanel title="Loot Feed">
      <ErrorPanel results={results} />
      <LootFeed items={merged} />
    </OsrsPanel>
  );
}
