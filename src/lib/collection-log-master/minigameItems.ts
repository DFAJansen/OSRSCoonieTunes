import { itemDefinitions } from "./helpers";

// Curated seed lists; exact TempleOSRS category rows are merged at runtime.
export const minigameItems = [
  ...itemDefinitions("minigames-castle-wars", ["Decorative sword", "Decorative armour", "Decorative shield", "Castle wars hood", "Castle wars cloak"], false),
  ...itemDefinitions("minigames-guardians-of-the-rift", [
    "Abyssal needle",
    "Abyssal lantern",
    "Abyssal protector",
    "Hat of the eye",
    "Robe top of the eye",
    "Robe bottoms of the eye",
    "Boots of the eye",
    "Lost bag",
    "Abyssal red dye",
    "Abyssal blue dye",
    "Abyssal green dye"
  ]),
  ...itemDefinitions("minigames-last-man-standing", ["Swift blade", "Deadman's cape", "Deadman's chest", "Deadman's legs"], false),
  ...itemDefinitions("minigames-pest-control", ["Void knight top", "Void knight robe", "Void knight gloves", "Void melee helm", "Void ranger helm", "Void mage helm"], false),
  ...itemDefinitions("minigames-rogues-den", ["Rogue mask", "Rogue top", "Rogue trousers", "Rogue gloves", "Rogue boots"], false),
  ...itemDefinitions("minigames-soul-wars", ["Soul cape", "Ectoplasmator", "Lil' creator", "Spoils of war"], false),
  ...itemDefinitions("minigames-tempoross", ["Tiny tempor", "Fish barrel", "Tome of water", "Soaked page", "Dragon harpoon", "Big harpoonfish"]),
  ...itemDefinitions("minigames-wintertodt", ["Phoenix", "Tome of fire", "Burnt page", "Pyromancer hood", "Pyromancer garb", "Pyromancer robe", "Pyromancer boots", "Bruma torch", "Warm gloves"]),
  ...itemDefinitions("minigames-trouble-brewing", ["The stuff", "Blue naval shirt", "Blue tricorn hat", "Blue navy slacks", "Red naval shirt", "Red tricorn hat", "Red navy slacks"], false),
  ...itemDefinitions("minigames-barbarian-assault", ["Fighter hat", "Fighter torso", "Runner hat", "Healer hat", "Ranger hat", "Penance queen pet"], false),
  ...itemDefinitions("minigames-mage-training-arena", ["Infinity hat", "Infinity top", "Infinity bottoms", "Infinity boots", "Infinity gloves", "Master wand", "Mage's book"], false),
  ...itemDefinitions("minigames-tithe-farm", ["Farmer's strawhat", "Farmer's jacket", "Farmer's boro trousers", "Farmer's boots", "Seed box", "Herb sack", "Gricoller's can"], false),
  ...itemDefinitions("minigames-mahogany-homes", ["Amy's saw", "Plank sack", "Carpenter's helmet", "Carpenter's shirt", "Carpenter's trousers", "Carpenter's boots"], false),
  ...itemDefinitions("minigames-hallowed-sepulchre", ["Dark dye", "Ring of endurance", "Strange old lockpick", "Hallowed ring", "Hallowed mark"], false),
  ...itemDefinitions("minigames-forestry", ["Forestry kit", "Log basket", "Forestry top", "Forestry legs", "Forestry boots", "Forestry hat"], false)
];
