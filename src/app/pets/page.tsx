import { PetWarShell } from "@/components/pets/PetWarShell";
import { buildPartyCollectionModel, getCollectionStatus } from "@/lib/collection";
import { loadCollections } from "@/lib/loaders";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const collectionResults = await loadCollections();
  const partyModel = buildPartyCollectionModel(collectionResults.map(getCollectionStatus));

  return <PetWarShell partyModel={partyModel} />;
}
