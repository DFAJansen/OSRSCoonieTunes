export const PLAYERS = [
  { username: "Raccoonie", nickname: "Raccoonie" },
  { username: "LethalRubbin", nickname: "LethalRubbin" },
  { username: "RNG Goblin", nickname: "RNG Goblin" },
  { username: "Rodamoetdood", nickname: "Rodamoetdood" }
] as const;

export const PLAYER_NAMES = PLAYERS.map((player) => player.username);

export type PlayerName = (typeof PLAYERS)[number]["username"];

export const NAV_ITEMS = [
  { href: "/", label: "War Room" },
  { href: "/journey", label: "Journey" },
  { href: "/skills", label: "Skill War" },
  { href: "/bosses", label: "Boss War" },
  { href: "/collection-log", label: "Collection War" },
  { href: "/pets", label: "Menagerie" },
  { href: "/achievements", label: "Hall of Legends" },
  { href: "/gains", label: "Season" },
  { href: "/loot-feed", label: "Loot Feed" }
];

export const COUNCIL_NAV_ITEM = { href: "/war-council", label: "War Council" };
