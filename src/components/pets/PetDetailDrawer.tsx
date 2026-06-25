"use client";

import type { CollectionItemOwnership } from "@/lib/collection";
import { getItemIconUrl } from "@/lib/item-icons";

function statusLabel(status: CollectionItemOwnership["status"]): string {
  switch (status) {
    case "everyone":
      return "everyone owns";
    case "nobody":
      return "nobody owns";
    case "unique":
      return "unique";
    case "contested":
      return "contested";
    case "unknown":
    default:
      return "unknown";
  }
}

export function PetDetailDrawer({ pet, onClose }: { pet: CollectionItemOwnership | null; onClose: () => void }) {
  if (!pet) return null;

  return (
    <div className="collectionDrawerBackdrop" role="presentation" onClick={onClose}>
      <aside aria-label={`${pet.name} details`} className="collectionItemDrawer petDrawer" role="dialog" onClick={(event) => event.stopPropagation()}>
        <button aria-label="Close pet details" className="drawerClose" onClick={onClose} type="button">
          {"\u00d7"}
        </button>
        <img alt="" className="petDrawerIcon" src={getItemIconUrl(pet)} />
        <span>Menagerie / Pet War</span>
        <h2>{pet.name}</h2>
        <dl>
          <div>
            <dt>Party ownership</dt>
            <dd>{pet.ownedCount} / {pet.syncedCount}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{statusLabel(pet.status)}</dd>
          </div>
          <div>
            <dt>Related title</dt>
            <dd>{pet.status === "unique" ? "Unique Familiar" : pet.status === "everyone" ? "Party Familiar" : "Pet Hunter"}</dd>
          </div>
        </dl>
        <div className="drawerList">
          <strong>Owned by</strong>
          {pet.ownedBy.length ? pet.ownedBy.map((player) => <b key={player}>{player}</b>) : <em>No synced player owns this.</em>}
        </div>
        <div className="drawerList">
          <strong>Missing by</strong>
          {pet.missingBy.length ? pet.missingBy.map((player) => <b key={player}>{player}</b>) : <em>No confirmed missing players.</em>}
        </div>
        {pet.unknownFor.length ? (
          <div className="drawerList locked">
            <strong>Unknown</strong>
            {pet.unknownFor.map((player) => <b key={player}>{player}</b>)}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
