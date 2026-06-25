import { itemDefinitions } from "./helpers";

export const otherItems = [
  ...itemDefinitions("other-skilling-outfits", [
    "Angler hat",
    "Angler top",
    "Angler waders",
    "Angler boots",
    "Prospector helmet",
    "Prospector jacket",
    "Prospector legs",
    "Prospector boots",
    "Lumberjack hat",
    "Lumberjack top",
    "Lumberjack legs",
    "Lumberjack boots",
    "Graceful hood",
    "Graceful top",
    "Graceful legs",
    "Graceful gloves",
    "Graceful boots",
    "Graceful cape"
  ], false),
  ...itemDefinitions("other-random-events", [
    "Stale baguette",
    "Mime mask",
    "Mime top",
    "Mime legs",
    "Mime gloves",
    "Mime boots",
    "Zombie mask",
    "Zombie shirt",
    "Zombie trousers",
    "Zombie gloves",
    "Zombie boots",
    "Lederhosen hat",
    "Lederhosen top",
    "Lederhosen shorts"
  ], false),
  ...itemDefinitions("other-champions-challenge", [
    "Champion's cape",
    "Imp champion scroll",
    "Goblin champion scroll",
    "Skeleton champion scroll",
    "Zombie champion scroll",
    "Giant champion scroll",
    "Hobgoblin champion scroll",
    "Ghoul champion scroll",
    "Earth warrior champion scroll",
    "Jogre champion scroll",
    "Lesser demon champion scroll"
  ]),
  ...itemDefinitions("other-capes", ["Fire cape", "Infernal cape", "Mythical cape", "Quest point cape", "Music cape", "Achievement diary cape"], false),
  ...itemDefinitions("other-jars", ["Jar of dirt", "Jar of sand", "Jar of swamp", "Jar of souls", "Jar of miasma", "Jar of darkness", "Jar of stone", "Jar of chemicals"]),
  ...itemDefinitions("other-other-unlocks", ["Dragon defender", "Fighter torso", "Void knight top", "Void knight robe", "Mage's book", "Master wand"], false),
  ...itemDefinitions("other-miscellaneous", ["Shield left half", "Dragon spear", "Dragon full helm", "Chewed bones", "Enhanced crystal teleport seed", "Broken zombie axe"], false)
];
