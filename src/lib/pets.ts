import { getCategoryComparison, type CollectionItemOwnership, type PartyCollectionModel } from "./collection";

export type PetTitle = {
  title: string;
  requiredPets: number;
};

export type PetPlayerSummary = {
  player: string;
  status: "synced" | "not-synced" | "error";
  ownedPets: number;
  missingPets: number;
  uniquePets: number;
  petScore: number;
  currentTitle: string;
  nextTitle: PetTitle | null;
  petsToNextTitle: number;
};

export type PetWarModel = {
  rows: CollectionItemOwnership[];
  leaderboard: PetPlayerSummary[];
  leader: PetPlayerSummary | null;
  nextRival: PetPlayerSummary | null;
  ownedByNobody: CollectionItemOwnership[];
  uniqueToOnePlayer: CollectionItemOwnership[];
  lockedPlayers: string[];
};

export const PET_TITLE_TIERS: PetTitle[] = [
  { title: "Lucky", requiredPets: 1 },
  { title: "Beast Friend", requiredPets: 3 },
  { title: "Menagerie Keeper", requiredPets: 5 },
  { title: "Pet Lord", requiredPets: 10 },
  { title: "Creature Collector", requiredPets: 15 },
  { title: "Zookeeper", requiredPets: 20 },
  { title: "Zookeeper Supreme", requiredPets: 25 },
  { title: "Noah of Gielinor", requiredPets: 30 }
];

export function getPetItemsFromCollectionModel(partyCollectionModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getCategoryComparison("other-pets", partyCollectionModel).items;
}

export function buildPetOwnershipRows(partyCollectionModel: PartyCollectionModel): CollectionItemOwnership[] {
  return getPetItemsFromCollectionModel(partyCollectionModel);
}

export function calculatePetScore(player: string, petRows: CollectionItemOwnership[]): number {
  const ownedPets = getPetsOwnedByPlayer(player, petRows).length;
  const uniquePets = petRows.filter((pet) => pet.ownedBy.length === 1 && pet.ownedBy[0] === player).length;
  return ownedPets * 500 + uniquePets * 250;
}

export function calculatePetLeader(petRows: CollectionItemOwnership[], players: string[]): PetPlayerSummary | null {
  return buildPetLeaderboard(petRows, players, new Set())[0] ?? null;
}

export function getPetsOwnedByPlayer(player: string, petRows: CollectionItemOwnership[]): CollectionItemOwnership[] {
  return petRows.filter((pet) => pet.ownedBy.includes(player));
}

export function getPetsMissingByPlayer(player: string, petRows: CollectionItemOwnership[]): CollectionItemOwnership[] {
  return petRows.filter((pet) => pet.missingBy.includes(player));
}

export function getPetsOwnedByNobody(petRows: CollectionItemOwnership[]): CollectionItemOwnership[] {
  return petRows.filter((pet) => pet.status === "nobody");
}

export function getPetsUniqueToOnePlayer(petRows: CollectionItemOwnership[]): CollectionItemOwnership[] {
  return petRows.filter((pet) => pet.status === "unique");
}

export function getNextPetAchievement(player: string, petRows: CollectionItemOwnership[]): PetTitle | null {
  const ownedPets = getPetsOwnedByPlayer(player, petRows).length;
  return PET_TITLE_TIERS.find((tier) => tier.requiredPets > ownedPets) ?? null;
}

export function buildPetWarModel(partyCollectionModel: PartyCollectionModel): PetWarModel {
  const rows = buildPetOwnershipRows(partyCollectionModel);
  const lockedPlayers = new Set(partyCollectionModel.lockedPlayers.map((player) => player.username));
  const leaderboard = buildPetLeaderboard(rows, partyCollectionModel.players.map((player) => player.username), lockedPlayers);

  return {
    rows,
    leaderboard,
    leader: leaderboard.find((player) => player.status === "synced") ?? null,
    nextRival: leaderboard.filter((player) => player.status === "synced")[1] ?? null,
    ownedByNobody: getPetsOwnedByNobody(rows),
    uniqueToOnePlayer: getPetsUniqueToOnePlayer(rows),
    lockedPlayers: [...lockedPlayers]
  };
}

function buildPetLeaderboard(petRows: CollectionItemOwnership[], players: string[], lockedPlayers: Set<string>): PetPlayerSummary[] {
  return players
    .map((player) => {
      const ownedPets = getPetsOwnedByPlayer(player, petRows).length;
      const uniquePets = petRows.filter((pet) => pet.ownedBy.length === 1 && pet.ownedBy[0] === player).length;
      const missingPets = lockedPlayers.has(player) ? 0 : getPetsMissingByPlayer(player, petRows).length;
      const nextTitle = getNextPetAchievement(player, petRows);
      const currentTitle = [...PET_TITLE_TIERS].reverse().find((tier) => ownedPets >= tier.requiredPets)?.title ?? "Unlucky";

      return {
        player,
        status: lockedPlayers.has(player) ? ("not-synced" as const) : ("synced" as const),
        ownedPets,
        missingPets,
        uniquePets,
        petScore: calculatePetScore(player, petRows),
        currentTitle,
        nextTitle,
        petsToNextTitle: nextTitle ? Math.max(0, nextTitle.requiredPets - ownedPets) : 0
      };
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "synced" ? -1 : 1;
      return b.petScore - a.petScore || b.ownedPets - a.ownedPets || a.player.localeCompare(b.player);
    });
}
