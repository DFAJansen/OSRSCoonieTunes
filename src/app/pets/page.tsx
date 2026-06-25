import { PetWarShell } from "@/components/pets/PetWarShell";
import { buildPartyCollectionModel, getCollectionStatus } from "@/lib/collection";
import { loadCollections } from "@/lib/loaders";
import { getServerActiveParty } from "@/lib/server-settings";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const partySlots = await getServerActiveParty();
  const collectionResults = await loadCollections(partySlots);
  const partyModel = buildPartyCollectionModel(collectionResults.map(getCollectionStatus));

  return <PetWarShell partyModel={partyModel} />;
}
