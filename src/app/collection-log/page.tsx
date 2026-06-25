import { CollectionLogShell } from "@/components/collection/CollectionLogShell";
import { buildPartyCollectionModel, getCollectionStatus } from "@/lib/collection";
import { loadCollections, loadRecentItems, loadStats } from "@/lib/loaders";
import { getServerActiveParty } from "@/lib/server-settings";

export const dynamic = "force-dynamic";

export default async function CollectionLogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const partySlots = await getServerActiveParty();
  const [collectionResults, recent, statsResults] = await Promise.all([loadCollections(partySlots), loadRecentItems(partySlots), loadStats(partySlots)]);
  const statuses = collectionResults.map(getCollectionStatus);
  const partyModel = buildPartyCollectionModel(statuses);
  const categoryParam = typeof params?.category === "string" ? params.category : undefined;
  const playerBossData = statsResults.flatMap((result) => (result.ok && result.data ? [result.data] : []));

  return <CollectionLogShell initialCategoryId={categoryParam} partyModel={partyModel} playerBossData={playerBossData} recentItems={recent.merged} statuses={statuses} />;
}
