import { ErrorPanel } from "@/components/ErrorPanel";
import { LootFeed } from "@/components/LootFeed";
import { OsrsPanel } from "@/components/OsrsPanel";
import { loadRecentItems } from "@/lib/loaders";

export const dynamic = "force-dynamic";

export default async function LootFeedPage() {
  const { results, merged } = await loadRecentItems();

  return (
    <OsrsPanel title="Loot Feed">
      <ErrorPanel results={results} />
      <LootFeed items={merged} />
    </OsrsPanel>
  );
}
