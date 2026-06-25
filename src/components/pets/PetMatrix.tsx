import type { CollectionItemOwnership } from "@/lib/collection";
import { getItemIconUrl } from "@/lib/item-icons";
import { PetCell } from "./PetCell";

export function PetMatrix({
  pets,
  players,
  onOpenPet
}: {
  pets: CollectionItemOwnership[];
  players: string[];
  onOpenPet: (pet: CollectionItemOwnership) => void;
}) {
  if (!pets.length) {
    return (
      <section className="collectionEmptyGrid">
        <h2>No pets match this view</h2>
        <p>Try another filter, or sync TempleOSRS collection logs to reveal more pet ownership.</p>
      </section>
    );
  }

  return (
    <div className="collectionGridWrap petMatrixWrap">
      <table className="collectionItemGrid petMatrix">
        <thead>
          <tr>
            <th scope="col">Pet</th>
            {players.map((player) => (
              <th key={player} scope="col">{player}</th>
            ))}
            <th scope="col">Owned by</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <th scope="row">
                <button className="petNameButton" onClick={() => onOpenPet(pet)} type="button">
                  <img alt="" src={getItemIconUrl(pet)} />
                  <span>{pet.name}</span>
                </button>
              </th>
              {players.map((player) => (
                <PetCell key={`${pet.id}-${player}`} pet={pet} player={player} />
              ))}
              <td>{pet.ownedCount} / {pet.syncedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
