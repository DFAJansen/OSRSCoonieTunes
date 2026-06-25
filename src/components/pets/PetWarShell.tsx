"use client";

import { useMemo, useState } from "react";
import type { CollectionItemOwnership, PartyCollectionModel } from "@/lib/collection";
import { filterCollectionItems, type CollectionFilter } from "@/lib/collection-filters";
import { PET_TITLE_TIERS, buildPetWarModel } from "@/lib/pets";
import { formatNumber } from "@/lib/format";
import { CollectionFilters } from "@/components/collection/CollectionFilters";
import { PetDetailDrawer } from "./PetDetailDrawer";
import { PetMatrix } from "./PetMatrix";

export function PetWarShell({ partyModel }: { partyModel: PartyCollectionModel }) {
  const petWar = useMemo(() => buildPetWarModel(partyModel), [partyModel]);
  const players = partyModel.players.map((player) => player.username);
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("all");
  const [selectedPlayer, setSelectedPlayer] = useState(players[0] ?? "");
  const [openPet, setOpenPet] = useState<CollectionItemOwnership | null>(null);
  const filteredPets = useMemo(() => filterCollectionItems(petWar.rows, activeFilter, selectedPlayer), [activeFilter, petWar.rows, selectedPlayer]);

  if (!partyModel.syncedPlayers.length) {
    return (
      <div className="dashboardStack menageriePage">
        <MenagerieHero />
        <section className="collectionLockedState">
          <span>Menagerie locked</span>
          <h2>Sync your TempleOSRS Collection Log to compare pets.</h2>
          <a className="osrsButton" href="https://templeosrs.com/collection-log/" target="_blank" rel="noreferrer">
            Open TempleOSRS Collection Log
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboardStack menageriePage">
      <MenagerieHero />

      <section className="petGuide panel">
        <h2>What Matters Here?</h2>
        <div className="quietGuide">
          <p><strong>Pet Score</strong>Pet Score is mostly pet count, with a bonus for pets only you own in the party.</p>
          <p><strong>Unknown pets</strong>Unsynced players are shown as unknown, not missing.</p>
          <p><strong>Prestige</strong>Every pet counts as Armadyl/Zamorak-flavoured flex power.</p>
        </div>
      </section>

      <section className="petLordCard">
        <span>Current Pet Lord</span>
        <h2>{petWar.leader?.player ?? "Locked"}</h2>
        <div className="petLordStats">
          <strong>{formatNumber(petWar.leader?.ownedPets ?? 0)} pets</strong>
          <strong>{formatNumber(petWar.leader?.uniquePets ?? 0)} unique</strong>
          <strong>{petWar.nextRival ? `${petWar.nextRival.player} chasing` : "No rival yet"}</strong>
        </div>
        <p>{petWar.leader?.currentTitle ?? "Pet data is based on synced TempleOSRS collection logs."}</p>
      </section>

      {petWar.lockedPlayers.length ? (
        <section className="petNotice">
          Pet data is based on synced TempleOSRS collection logs. Locked players are unknown, not missing. Pet count endpoint unavailable states are ignored in favor of collection log data.
        </section>
      ) : null}

      <section className="panel petLeaderboardPanel">
        <h2>Pet Score Leaderboard</h2>
        <div className="petLeaderboard">
          {petWar.leaderboard.map((player, index) => (
            <article className={player.status === "synced" ? "" : "locked"} key={player.player}>
              <span>#{index + 1}</span>
              <strong>{player.player}</strong>
              <b>{formatNumber(player.petScore)}</b>
              <small>{player.status === "synced" ? `${player.ownedPets} pets, ${player.uniquePets} unique, ${player.missingPets} missing` : "Unknown until collection log sync"}</small>
              <progress max={player.nextTitle?.requiredPets ?? Math.max(1, player.ownedPets)} value={player.ownedPets} />
              <em>{player.nextTitle ? `${player.petsToNextTitle} pets to ${player.nextTitle.title}` : player.currentTitle}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="panel petMatrixPanel">
        <h2>Pet Matrix</h2>
        <CollectionFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onPlayerChange={setSelectedPlayer}
          players={players}
          selectedPlayer={selectedPlayer}
        />
        <PetMatrix onOpenPet={setOpenPet} pets={filteredPets} players={players} />
      </section>

      <section className="panel petTitlesPanel">
        <h2>Pet Achievements / Titles</h2>
        <div className="petTitlesGrid">
          {PET_TITLE_TIERS.map((tier) => (
            <article key={tier.title}>
              <strong>{tier.title}</strong>
              <span>{tier.requiredPets} pets</span>
            </article>
          ))}
        </div>
        <div className="petTitleProgress">
          {petWar.leaderboard.map((player) => (
            <p key={player.player}>
              <strong>{player.player}</strong>
              {player.status === "synced" ? `${player.currentTitle} · ${player.nextTitle ? `${player.petsToNextTitle} to ${player.nextTitle.title}` : "max title reached"}` : "locked"}
            </p>
          ))}
        </div>
      </section>

      <PetDetailDrawer onClose={() => setOpenPet(null)} pet={openPet} />
    </div>
  );
}

function MenagerieHero() {
  return (
    <section className="heroPanel compactHero">
      <div>
        <span className="eyebrow">Pet War</span>
        <h1>Menagerie</h1>
        <p>Tiny followers. Massive friend-war prestige.</p>
      </div>
    </section>
  );
}
