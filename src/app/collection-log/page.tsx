import { CollectionLogShell } from "@/components/collection/CollectionLogShell";
import { buildPartyCollectionModel, getCollectionStatus } from "@/lib/collection";
import { loadCollections, loadRecentItems } from "@/lib/loaders";

export const dynamic = "force-dynamic";

export default async function CollectionLogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [collectionResults, recent] = await Promise.all([loadCollections(), loadRecentItems()]);
  const statuses = collectionResults.map(getCollectionStatus);
  const partyModel = buildPartyCollectionModel(statuses);
  const categoryParam = typeof params?.category === "string" ? params.category : undefined;

  return <CollectionLogShell initialCategoryId={categoryParam} partyModel={partyModel} recentItems={recent.merged} statuses={statuses} />;
}
