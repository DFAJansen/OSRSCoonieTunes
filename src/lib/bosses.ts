import { normalizeCollectionName } from "./collection-normalizers";

export type BossGroup = "bosses" | "raids" | "challenges";

export const BOSS_NAMES = [
  "Abyssal Sire",
  "Alchemical Hydra",
  "Amoxliatl",
  "Araxxor",
  "Barrows Chests",
  "Bryophyta",
  "Callisto",
  "Artio",
  "Cerberus",
  "Chaos Elemental",
  "Chaos Fanatic",
  "Commander Zilyana",
  "Corporeal Beast",
  "Crazy Archaeologist",
  "Dagannoth Rex",
  "Dagannoth Prime",
  "Dagannoth Supreme",
  "Deranged Archaeologist",
  "Doom of Mokhaiotl",
  "Duke Sucellus",
  "The Gauntlet",
  "Corrupted Gauntlet",
  "General Graardor",
  "Giant Mole",
  "Grotesque Guardians",
  "Hespori",
  "The Hueycoatl",
  "Kalphite Queen",
  "King Black Dragon",
  "Kraken",
  "Kree'arra",
  "K'ril Tsutsaroth",
  "The Leviathan",
  "Moons of Peril",
  "Nex",
  "The Nightmare",
  "Phosani's Nightmare",
  "Obor",
  "Phantom Muspah",
  "Sarachnis",
  "Scorpia",
  "Scurrius",
  "Skotizo",
  "Tempoross",
  "Thermonuclear Smoke Devil",
  "TzKal-Zuk",
  "TzTok-Jad",
  "Vardorvis",
  "Venenatis",
  "Spindel",
  "Vet'ion",
  "Calvar'ion",
  "Vorkath",
  "Wintertodt",
  "Yama",
  "Yal-Kal",
  "Zulrah",
  "Chambers of Xeric",
  "Chambers of Xeric: Challenge Mode",
  "Theatre of Blood",
  "Theatre of Blood: Hard Mode",
  "Tombs of Amascut",
  "Tombs of Amascut: Expert Mode",
  "Fortis Colosseum",
  "Sol Heredit"
] as const;

export const BLOCKED_BOSS_METRICS = [
  "Sailing",
  "Clue Scrolls",
  "Beginner Clues",
  "Easy Clues",
  "Medium Clues",
  "Hard Clues",
  "Elite Clues",
  "Master Clues",
  "LMS",
  "Soul Wars",
  "Bounty Hunter",
  "League Points",
  "Collection Log",
  "Ehp",
  "Ehb",
  "Overall",
  "Total",
  "Skills",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecrafting",
  "Hunter",
  "Construction",
  "Guardians of the Rift",
  "Trouble Brewing",
  "Castle Wars",
  "Pest Control"
];

export const BOSS_ALIASES: Record<string, string> = {
  "abyssal sire": "Abyssal Sire",
  "alchemical hydra": "Alchemical Hydra",
  amoxliatl: "Amoxliatl",
  araxxor: "Araxxor",
  barrows: "Barrows Chests",
  "barrows chests": "Barrows Chests",
  bryophyta: "Bryophyta",
  callisto: "Callisto",
  artio: "Artio",
  cerberus: "Cerberus",
  "chaos elemental": "Chaos Elemental",
  "chaos fanatic": "Chaos Fanatic",
  "commander zilyana": "Commander Zilyana",
  zilyana: "Commander Zilyana",
  "corporeal beast": "Corporeal Beast",
  corp: "Corporeal Beast",
  "crazy archaeologist": "Crazy Archaeologist",
  "dagannoth rex": "Dagannoth Rex",
  "dagannoth prime": "Dagannoth Prime",
  "dagannoth supreme": "Dagannoth Supreme",
  "deranged archaeologist": "Deranged Archaeologist",
  "doom of mokhaiotl": "Doom of Mokhaiotl",
  "duke sucellus": "Duke Sucellus",
  cg: "Corrupted Gauntlet",
  gauntlet: "The Gauntlet",
  "the gauntlet": "The Gauntlet",
  "corrupted gauntlet": "Corrupted Gauntlet",
  "general graardor": "General Graardor",
  graardor: "General Graardor",
  "giant mole": "Giant Mole",
  "grotesque guardians": "Grotesque Guardians",
  hespori: "Hespori",
  hueycoatl: "The Hueycoatl",
  "the hueycoatl": "The Hueycoatl",
  "kalphite queen": "Kalphite Queen",
  "king black dragon": "King Black Dragon",
  kbd: "King Black Dragon",
  kraken: "Kraken",
  kreearra: "Kree'arra",
  kree: "Kree'arra",
  "kril tsutsaroth": "K'ril Tsutsaroth",
  kril: "K'ril Tsutsaroth",
  "k ril tsutsaroth": "K'ril Tsutsaroth",
  "the leviathan": "The Leviathan",
  leviathan: "The Leviathan",
  "moons of peril": "Moons of Peril",
  nex: "Nex",
  nightmare: "The Nightmare",
  "the nightmare": "The Nightmare",
  "phosanis nightmare": "Phosani's Nightmare",
  "phosani nightmare": "Phosani's Nightmare",
  obor: "Obor",
  "phantom muspah": "Phantom Muspah",
  muspah: "Phantom Muspah",
  sarachnis: "Sarachnis",
  scorpia: "Scorpia",
  scurrius: "Scurrius",
  skotizo: "Skotizo",
  tempoross: "Tempoross",
  "thermonuclear smoke devil": "Thermonuclear Smoke Devil",
  "smoke devil": "Thermonuclear Smoke Devil",
  "tzkal zuk": "TzKal-Zuk",
  zuk: "TzKal-Zuk",
  "tztok jad": "TzTok-Jad",
  jad: "TzTok-Jad",
  vardorvis: "Vardorvis",
  venenatis: "Venenatis",
  spindel: "Spindel",
  vetion: "Vet'ion",
  "vet ion": "Vet'ion",
  calvarion: "Calvar'ion",
  vorkath: "Vorkath",
  wintertodt: "Wintertodt",
  yama: "Yama",
  "yal kal": "Yal-Kal",
  yalkal: "Yal-Kal",
  zulrah: "Zulrah",
  cox: "Chambers of Xeric",
  "chambers of xeric": "Chambers of Xeric",
  "chambers of xeric challenge mode": "Chambers of Xeric: Challenge Mode",
  "cox cm": "Chambers of Xeric: Challenge Mode",
  tob: "Theatre of Blood",
  "theatre of blood": "Theatre of Blood",
  "theatre of blood hard mode": "Theatre of Blood: Hard Mode",
  "tob hard mode": "Theatre of Blood: Hard Mode",
  "tob hm": "Theatre of Blood: Hard Mode",
  toa: "Tombs of Amascut",
  "tombs of amascut": "Tombs of Amascut",
  "tombs of amascut expert mode": "Tombs of Amascut: Expert Mode",
  "toa expert": "Tombs of Amascut: Expert Mode",
  "fortis colosseum": "Fortis Colosseum",
  "sol heredit": "Sol Heredit"
};

const EXTRA_ALIASES: Record<string, string> = {
  "corrupted gauntlet": "Corrupted Gauntlet",
  "the corrupted gauntlet": "Corrupted Gauntlet",
  "the gauntlet": "The Gauntlet",
  "fight caves": "TzTok-Jad",
  "the fight caves": "TzTok-Jad",
  inferno: "TzKal-Zuk",
  "the inferno": "TzKal-Zuk",
  colosseum: "Fortis Colosseum",
  "the colosseum": "Fortis Colosseum",
  "fortis colosseum": "Fortis Colosseum",
  "chambers of xeric challenge mode": "Chambers of Xeric: Challenge Mode",
  "theatre of blood hard mode": "Theatre of Blood: Hard Mode",
  "tombs of amascut expert": "Tombs of Amascut: Expert Mode",
  "tombs of amascut expert mode": "Tombs of Amascut: Expert Mode",
  "kree arra": "Kree'arra",
  "kril tsutsaroth": "K'ril Tsutsaroth",
  "calvar ion": "Calvar'ion"
};

const BOSS_LOOKUP = new Map(BOSS_NAMES.map((name) => [normalizeMetricName(name), name]));
const BLOCKED_LOOKUP = new Set(BLOCKED_BOSS_METRICS.map((name) => normalizeMetricName(name)));
const ALIAS_LOOKUP = new Map(
  Object.entries({ ...BOSS_ALIASES, ...EXTRA_ALIASES }).map(([alias, boss]) => [normalizeMetricName(alias), boss])
);

export function normalizeMetricName(value: string): string {
  return normalizeCollectionName(value)
    .replace(/\bthe\s+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeBossName(name: string): string {
  return resolveBossName(name) ?? name.replace(/_/g, " ").replace(/-/g, " ").trim();
}

export function resolveBossName(value: string): string | null {
  const normalized = normalizeMetricName(value);
  if (BLOCKED_LOOKUP.has(normalized)) return null;

  const exact = BOSS_LOOKUP.get(normalized);
  if (exact) return exact;

  const alias = ALIAS_LOOKUP.get(normalized);
  if (alias) return alias;

  const withThe = BOSS_LOOKUP.get(`the ${normalized}`) ?? ALIAS_LOOKUP.get(`the ${normalized}`);
  return withThe ?? null;
}

export function isBlockedBossMetric(value: string): boolean {
  return BLOCKED_LOOKUP.has(normalizeMetricName(value));
}

export function isAllowedBossMetric(value: string): boolean {
  return resolveBossName(value) !== null;
}

export function isBossMetric(name: string): boolean {
  const normalized = normalizeMetricName(name);
  if (BLOCKED_LOOKUP.has(normalized)) return false;
  return isAllowedBossMetric(name);
}

export function getBossGroup(bossName: string): BossGroup {
  const resolved = resolveBossName(bossName) ?? bossName;
  if (
    [
      "Chambers of Xeric",
      "Chambers of Xeric: Challenge Mode",
      "Theatre of Blood",
      "Theatre of Blood: Hard Mode",
      "Tombs of Amascut",
      "Tombs of Amascut: Expert Mode"
    ].includes(resolved)
  ) return "raids";
  if (["The Gauntlet", "Corrupted Gauntlet", "TzTok-Jad", "TzKal-Zuk", "Fortis Colosseum", "Sol Heredit"].includes(resolved)) return "challenges";
  return "bosses";
}
