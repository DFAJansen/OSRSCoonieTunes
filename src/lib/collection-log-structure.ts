import { collectionLogMasterItems } from "./collection-log-master";
import { collectionSlug, normalizeCollectionName } from "./collection-normalizers";

export type CollectionTopTab = "Bosses" | "Raids" | "Clues" | "Minigames" | "Other";

export type CollectionSubCategory = {
  id: string;
  label: string;
  topTab: CollectionTopTab;
  aliases?: string[];
};

export type CollectionItemDefinition = {
  id: string;
  name: string;
  categoryId: string;
  itemId?: number;
  aliases?: string[];
  notable?: boolean;
};

export const COLLECTION_TOP_TABS: CollectionTopTab[] = ["Bosses", "Raids", "Clues", "Minigames", "Other"];

const bossCategories = [
  "Abyssal Sire",
  "Alchemical Hydra",
  "Amoxliatl",
  "Araxxor",
  "Barrows Chests",
  "Brutus",
  "Bryophyta",
  "Callisto and Artio",
  "Cerberus",
  "Chaos Elemental",
  "Chaos Fanatic",
  "Commander Zilyana",
  "Corporeal Beast",
  "Crazy Archaeologist",
  "Dagannoth Kings",
  "Deranged Archaeologist",
  "Doom of Mokhaiotl",
  "Duke Sucellus",
  "The Fight Caves",
  "Fortis Colosseum",
  "The Gauntlet",
  "General Graardor",
  "Giant Mole",
  "Grotesque Guardians",
  "Hespori",
  "The Hueycoatl",
  "The Inferno",
  "Kalphite Queen",
  "King Black Dragon",
  "Kraken",
  "Kree'arra",
  "K'ril Tsutsaroth",
  "The Leviathan",
  "Moons of Peril",
  "Nex",
  "The Nightmare",
  "Obor",
  "Phantom Muspah",
  "Royal Titans",
  "Sarachnis",
  "Scorpia",
  "Scurrius",
  "Skotizo",
  "Tempoross",
  "Thermonuclear Smoke Devil",
  "Vardorvis",
  "Venenatis and Spindel",
  "Vet'ion and Calvar'ion",
  "Vorkath",
  "Wintertodt",
  "Yama",
  "Yal-Kal",
  "Zulrah"
];

const extraAliases: Record<string, string[]> = {
  "Barrows Chests": ["barrows", "ahrim", "dharok", "guthan", "karil", "torag", "verac"],
  "Callisto and Artio": ["callisto", "artio"],
  "Commander Zilyana": ["zilyana", "saradomin"],
  "Dagannoth Kings": ["dagannoth", "rex", "prime", "supreme", "berserker ring", "archers ring", "seers ring", "warrior ring"],
  "Fortis Colosseum": ["fortis", "colosseum", "sol heredit"],
  "General Graardor": ["graardor", "bandos"],
  "Grotesque Guardians": ["grotesque", "dusk", "dawn"],
  "Kree'arra": ["kree", "armadyl"],
  "K'ril Tsutsaroth": ["kril", "k'ril", "zamorak"],
  "Moons of Peril": ["blood moon", "blue moon", "eclipse moon", "moons of peril"],
  "The Fight Caves": ["fight caves", "tzrek-jad", "fire cape", "jad"],
  "The Gauntlet": ["gauntlet", "crystal armour", "enhanced crystal"],
  "The Hueycoatl": ["hueycoatl", "huey"],
  "The Inferno": ["inferno", "zuk", "infernal cape", "jal-nib-rek"],
  "The Leviathan": ["leviathan", "venator"],
  "The Nightmare": ["nightmare", "phosani", "inquisitor", "harmonised", "volatile", "eldritch"],
  "Thermonuclear Smoke Devil": ["thermonuclear", "smoke devil", "occult"],
  "Venenatis and Spindel": ["venenatis", "spindel"],
  "Vet'ion and Calvar'ion": ["vet'ion", "vetion", "calvarion", "calvar'ion"],
  "Yal-Kal": ["yal-kal", "zuk", "tzkal"],
  "Beginner Treasure Trails": ["beginner_treasure_trails", "beginner clue scrolls", "beginner clues", "treasure trails beginner", "clue scroll beginner"],
  "Easy Treasure Trails": ["easy_treasure_trails", "easy clue scrolls", "easy clues", "treasure trails easy", "clue scroll easy"],
  "Medium Treasure Trails": ["medium_treasure_trails", "medium clue scrolls", "medium clues", "treasure trails medium", "clue scroll medium"],
  "Hard Treasure Trails": ["hard_treasure_trails", "hard clue scrolls", "hard clues", "treasure trails hard", "clue scroll hard"],
  "Elite Treasure Trails": ["elite_treasure_trails", "elite clue scrolls", "elite clues", "treasure trails elite", "clue scroll elite"],
  "Master Treasure Trails": ["master_treasure_trails", "master clue scrolls", "master clues", "treasure trails master", "clue scroll master"],
  "All Clues": ["clues", "treasure trails", "clue rewards"],
  "Guardians of the Rift": ["guardians_of_the_rift", "gotr", "rift guardian", "abyssal pearls"],
  "Last Man Standing": ["last_man_standing", "lms"],
  "Pest Control": ["pest_control", "void knight"],
  "Rogues' Den": ["rogues_den", "rogue outfit"],
  "Soul Wars": ["soul_wars"],
  "Trouble Brewing": ["trouble_brewing"],
  "Barbarian Assault": ["barbarian_assault", "penance"],
  "Mage Training Arena": ["mage_training_arena", "mta"],
  "Tithe Farm": ["tithe_farm"],
  "Mahogany Homes": ["mahogany_homes"],
  "Hallowed Sepulchre": ["hallowed_sepulchre", "sepulchre"],
  "Skilling Outfits": ["skilling outfits", "skilling_outfits", "mining", "woodcutting", "fishing", "farming", "graceful"],
  "Random Events": ["random_events", "mime", "zombie", "lederhosen"],
  "Champion's Challenge": ["champions_challenge", "champion scroll", "champion's challenge"],
  "Capes": ["capes", "cape"],
  "Jars": ["jars", "jar"],
  "Other Unlocks": ["other unlocks", "unlocks"],
  "Pets": ["pets", "pet", "kitten", "olmlet", "tangleroot", "rocky", "heron", "beaver", "squirrel", "phoenix"]
};

function slugify(value: string): string {
  return collectionSlug(value);
}

function category(label: string, topTab: CollectionTopTab, aliases: string[] = []): CollectionSubCategory {
  return {
    id: `${slugify(topTab)}-${slugify(label)}`,
    label,
    topTab,
    aliases: [label, ...aliases, ...(extraAliases[label] ?? [])]
  };
}

export const COLLECTION_SUB_CATEGORIES: CollectionSubCategory[] = [
  ...bossCategories.map((label) => category(label, "Bosses")),
  category("Chambers of Xeric", "Raids", ["cox", "olm", "xeric", "twisted bow", "ancestral", "dexterous", "arcane prayer"]),
  category("Theatre of Blood", "Raids", ["tob", "verzik", "scythe", "sanguinesti", "justiciar", "ghrazi"]),
  category("Tombs of Amascut", "Raids", ["toa", "amascut", "tumeken", "masori", "fang", "lightbearer"]),
  category("Beginner Treasure Trails", "Clues", ["beginner clue"]),
  category("Easy Treasure Trails", "Clues", ["easy clue"]),
  category("Medium Treasure Trails", "Clues", ["medium clue", "ranger boots"]),
  category("Hard Treasure Trails", "Clues", ["hard clue"]),
  category("Elite Treasure Trails", "Clues", ["elite clue"]),
  category("Master Treasure Trails", "Clues", ["master clue"]),
  category("All Clues", "Clues", ["clue", "trimmed", "gilded", "blessed", "ornament kit", "3rd age", "third age"]),
  category("Castle Wars", "Minigames", ["castle wars"]),
  category("Guardians of the Rift", "Minigames", ["guardians of the rift", "rift guardian", "abyssal pearls"]),
  category("Last Man Standing", "Minigames", ["last man standing", "lms"]),
  category("Pest Control", "Minigames", ["pest control", "void"]),
  category("Rogues' Den", "Minigames", ["rogue"]),
  category("Soul Wars", "Minigames", ["soul wars"]),
  category("Trouble Brewing", "Minigames"),
  category("Barbarian Assault", "Minigames"),
  category("Mage Training Arena", "Minigames"),
  category("Tithe Farm", "Minigames"),
  category("Mahogany Homes", "Minigames"),
  category("Hallowed Sepulchre", "Minigames"),
  category("Forestry", "Minigames"),
  category("Tempoross", "Minigames", ["tempoross", "fish barrel", "tome of water"]),
  category("Wintertodt", "Minigames", ["wintertodt", "pyromancer", "tome of fire"]),
  category("Pets", "Other", ["pet", "kitten", "olmlet", "tangleroot", "rocky", "heron", "beaver", "squirrel", "phoenix"]),
  category("Skilling Outfits", "Other"),
  category("Random Events", "Other"),
  category("Champion's Challenge", "Other"),
  category("Capes", "Other"),
  category("Jars", "Other"),
  category("Slayer", "Other", ["slayer", "abyssal", "hydra", "cerberus", "basilisk", "gargoyle", "superior"]),
  category("Other Unlocks", "Other"),
  category("Miscellaneous", "Other", [])
];

export const COLLECTION_ITEM_DEFINITIONS: CollectionItemDefinition[] = collectionLogMasterItems;

export function getTopTabs(): CollectionTopTab[] {
  return COLLECTION_TOP_TABS;
}

export function getSubCategoriesByTopTab(tab: CollectionTopTab): CollectionSubCategory[] {
  return COLLECTION_SUB_CATEGORIES.filter((categoryItem) => categoryItem.topTab === tab);
}

export function getItemsBySubCategory(categoryId: string): CollectionItemDefinition[] {
  return COLLECTION_ITEM_DEFINITIONS.filter((item) => item.categoryId === categoryId);
}

export function findCategoryByTempleName(name: string): CollectionSubCategory | undefined {
  const normalized = normalizeSearch(name);
  return COLLECTION_SUB_CATEGORIES.find((categoryItem) =>
    (categoryItem.aliases ?? [categoryItem.label]).some((alias) => normalized.includes(normalizeSearch(alias)))
  );
}

export function findItemByNameOrAlias(name: string): CollectionItemDefinition | undefined {
  const normalized = normalizeSearch(name);
  return COLLECTION_ITEM_DEFINITIONS.find((item) =>
    [item.name, ...(item.aliases ?? [])].some((alias) => normalizeSearch(alias) === normalized)
  );
}

export function getDefaultSubCategory(tab: CollectionTopTab): CollectionSubCategory {
  return getSubCategoriesByTopTab(tab)[0] ?? COLLECTION_SUB_CATEGORIES[0];
}

export function getSubCategoryById(categoryId: string | undefined): CollectionSubCategory {
  return COLLECTION_SUB_CATEGORIES.find((categoryItem) => categoryItem.id === categoryId) ?? COLLECTION_SUB_CATEGORIES[0];
}

export function itemMatchesCategory(itemName: string, categoryItem: CollectionSubCategory): boolean {
  const normalized = normalizeSearch(itemName);
  const aliases = categoryItem.aliases ?? [categoryItem.label];

  if (categoryItem.id === "other-miscellaneous") {
    return !COLLECTION_SUB_CATEGORIES.some((candidate) => candidate.id !== "other-miscellaneous" && itemMatchesCategory(itemName, candidate));
  }

  return aliases.some((alias) => normalized.includes(normalizeSearch(alias)));
}

export function categoryKeyMatchesCategory(categoryKey: string | undefined, categoryItem: CollectionSubCategory): boolean {
  if (!categoryKey) return false;
  const normalized = normalizeSearch(categoryKey);
  const aliases = categoryItem.aliases ?? [categoryItem.label];

  if (categoryItem.id === "clues-all-clues") {
    return getSubCategoriesByTopTab("Clues")
      .filter((candidate) => candidate.id !== categoryItem.id)
      .some((candidate) => categoryKeyMatchesCategory(categoryKey, candidate));
  }

  if (categoryItem.id === "other-miscellaneous") {
    return !COLLECTION_SUB_CATEGORIES.some((candidate) => candidate.id !== "other-miscellaneous" && categoryKeyMatchesCategory(categoryKey, candidate));
  }

  return aliases.some((alias) => normalized.includes(normalizeSearch(alias)));
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}
