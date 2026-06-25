import type { PlayerCollectionStatus } from "@/lib/collection";

export function CollectionSyncNotice({ statuses }: { statuses: PlayerCollectionStatus[] }) {
  const locked = statuses.filter((status) => status.status !== "synced");
  if (!locked.length) return null;

  return (
    <div className="syncNotice">
      <div>
        <h3>Collection log data is locked for {locked.length} player{locked.length === 1 ? "" : "s"}</h3>
        <p>
          TempleOSRS collection log data only works after a player has synced their log. Until then,
          CoonieTunes can still compare skills, bosses and gains, but collection battles are locked.
        </p>
      </div>
      <a className="osrsButton" href="https://templeosrs.com/collection-log/" target="_blank" rel="noreferrer">
        Open TempleOSRS Collection Log
      </a>
    </div>
  );
}
