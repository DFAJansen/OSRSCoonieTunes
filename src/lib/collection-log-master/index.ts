import { bossItems } from "./bossItems";
import { clueItems } from "./clueItems";
import { minigameItems } from "./minigameItems";
import { otherItems } from "./otherItems";
import { petItems } from "./petItems";
import { raidItems } from "./raidItems";

export const collectionLogMasterItems = [
  ...bossItems,
  ...raidItems,
  ...clueItems,
  ...minigameItems,
  ...petItems,
  ...otherItems
];
