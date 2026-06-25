export type PartySlotId =
  | "raccoonie"
  | "lethalrubbin"
  | "rng-goblin"
  | "rodamoetdood";

export type ThemeId =
  | "night-varrock"
  | "falador"
  | "ardougne"
  | "bandos"
  | "zamorak"
  | "saradomin"
  | "armadyl"
  | "guthix";

export type Density = "compact" | "comfortable" | "spacious";

export type NumberFormat = "full" | "compact";

export type PartySlotSettings = {
  id: PartySlotId;
  slotName: string;
  defaultUsername: string;
  overrideUsername?: string;
};

export type PartyPreset = {
  id: string;
  name: string;
  slots: PartySlotSettings[];
};

export type CoonieSettings = {
  version: 1;
  partyName: string;
  partySlots: PartySlotSettings[];
  selectedPresetId?: string;
  savedPresets: PartyPreset[];
  theme: ThemeId;
  density: Density;
  numberFormat: NumberFormat;
  animationsEnabled: boolean;
  aiCommandReportsEnabled: boolean;
  dynamicWarEventsEnabled: boolean;
  seasonalEventsEnabled: boolean;
};

export type ActivePartySlot = {
  id: PartySlotId;
  slotName: string;
  displayName: string;
  defaultUsername: string;
  activeUsername: string;
  trackingLabel: string;
  isOverridden: boolean;
};

export const SETTINGS_STORAGE_KEY = "coonietunes.settings.v1";
export const ACTIVE_PARTY_COOKIE = "coonietunes.activeParty.v1";

export const DEFAULT_SETTINGS: CoonieSettings = {
  version: 1,
  partyName: "The Coonie Crew",
  partySlots: [
    { id: "raccoonie", slotName: "Raccoonie", defaultUsername: "Raccoonie" },
    { id: "lethalrubbin", slotName: "LethalRubbin", defaultUsername: "LethalRubbin" },
    { id: "rng-goblin", slotName: "RNG Goblin", defaultUsername: "RNG Goblin" },
    { id: "rodamoetdood", slotName: "Rodamoetdood", defaultUsername: "Rodamoetdood" }
  ],
  selectedPresetId: "main",
  savedPresets: [],
  theme: "night-varrock",
  density: "comfortable",
  numberFormat: "full",
  animationsEnabled: true,
  aiCommandReportsEnabled: true,
  dynamicWarEventsEnabled: true,
  seasonalEventsEnabled: true
};

export const MAIN_ACCOUNTS_PRESET: PartyPreset = {
  id: "main",
  name: "Main Accounts",
  slots: DEFAULT_SETTINGS.partySlots
};

export const CUSTOM_PRESET: PartyPreset = {
  id: "custom",
  name: "Custom",
  slots: DEFAULT_SETTINGS.partySlots
};

const VALID_THEMES: ThemeId[] = ["night-varrock", "falador", "ardougne", "bandos", "zamorak", "saradomin", "armadyl", "guthix"];
const VALID_DENSITIES: Density[] = ["compact", "comfortable", "spacious"];
const VALID_NUMBER_FORMATS: NumberFormat[] = ["full", "compact"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function sanitizeUsername(value: string | undefined): string | undefined {
  const cleaned = value?.trim().slice(0, 30);
  return cleaned || undefined;
}

export function mergeSettings(value: unknown): CoonieSettings {
  if (!isRecord(value) || value.version !== 1) return DEFAULT_SETTINGS;
  const incomingSlots = Array.isArray(value.partySlots) ? value.partySlots : [];
  const partySlots = DEFAULT_SETTINGS.partySlots.map((defaultSlot) => {
    const incoming = incomingSlots.find((slot) => isRecord(slot) && slot.id === defaultSlot.id);
    return {
      ...defaultSlot,
      overrideUsername: isRecord(incoming) ? sanitizeUsername(typeof incoming.overrideUsername === "string" ? incoming.overrideUsername : undefined) : undefined
    };
  });

  return {
    ...DEFAULT_SETTINGS,
    partyName: typeof value.partyName === "string" && value.partyName.trim() ? value.partyName.trim().slice(0, 50) : DEFAULT_SETTINGS.partyName,
    partySlots,
    selectedPresetId: typeof value.selectedPresetId === "string" ? value.selectedPresetId : DEFAULT_SETTINGS.selectedPresetId,
    savedPresets: Array.isArray(value.savedPresets) ? value.savedPresets.flatMap(parsePreset).slice(0, 12) : [],
    theme: VALID_THEMES.includes(value.theme as ThemeId) ? value.theme as ThemeId : DEFAULT_SETTINGS.theme,
    density: VALID_DENSITIES.includes(value.density as Density) ? value.density as Density : DEFAULT_SETTINGS.density,
    numberFormat: VALID_NUMBER_FORMATS.includes(value.numberFormat as NumberFormat) ? value.numberFormat as NumberFormat : DEFAULT_SETTINGS.numberFormat,
    animationsEnabled: typeof value.animationsEnabled === "boolean" ? value.animationsEnabled : DEFAULT_SETTINGS.animationsEnabled,
    aiCommandReportsEnabled: typeof value.aiCommandReportsEnabled === "boolean" ? value.aiCommandReportsEnabled : DEFAULT_SETTINGS.aiCommandReportsEnabled,
    dynamicWarEventsEnabled: typeof value.dynamicWarEventsEnabled === "boolean" ? value.dynamicWarEventsEnabled : DEFAULT_SETTINGS.dynamicWarEventsEnabled,
    seasonalEventsEnabled: typeof value.seasonalEventsEnabled === "boolean" ? value.seasonalEventsEnabled : DEFAULT_SETTINGS.seasonalEventsEnabled
  };
}

function parsePreset(value: unknown): PartyPreset[] {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string" || !Array.isArray(value.slots)) return [];
  const presetSlots = value.slots;
  const slots = DEFAULT_SETTINGS.partySlots.map((defaultSlot) => {
    const presetSlot = presetSlots.find((slot: unknown) => isRecord(slot) && slot.id === defaultSlot.id);
    return {
      ...defaultSlot,
      overrideUsername: isRecord(presetSlot) ? sanitizeUsername(typeof presetSlot.overrideUsername === "string" ? presetSlot.overrideUsername : undefined) : undefined
    };
  });
  return [{ id: value.id, name: value.name.trim().slice(0, 40) || "Untitled preset", slots }];
}

export function getActiveParty(settings: CoonieSettings): ActivePartySlot[] {
  return settings.partySlots.map((slot) => {
    const activeUsername = sanitizeUsername(slot.overrideUsername) || slot.defaultUsername;
    return {
      id: slot.id,
      slotName: slot.slotName,
      displayName: slot.slotName,
      defaultUsername: slot.defaultUsername,
      activeUsername,
      trackingLabel: activeUsername,
      isOverridden: activeUsername !== slot.defaultUsername
    };
  });
}

export function getDefaultActiveParty(): ActivePartySlot[] {
  return getActiveParty(DEFAULT_SETTINGS);
}

export function serializeActiveParty(settings: CoonieSettings): string {
  return encodeURIComponent(JSON.stringify(getActiveParty(settings)));
}

export function parseActivePartyCookie(value?: string): ActivePartySlot[] {
  if (!value) return getDefaultActiveParty();
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(parsed)) return getDefaultActiveParty();
    return DEFAULT_SETTINGS.partySlots.map((defaultSlot) => {
      const incoming = parsed.find((slot) => isRecord(slot) && slot.id === defaultSlot.id);
      const activeUsername = isRecord(incoming) ? sanitizeUsername(typeof incoming.activeUsername === "string" ? incoming.activeUsername : undefined) : undefined;
      return {
        id: defaultSlot.id,
        slotName: defaultSlot.slotName,
        displayName: defaultSlot.slotName,
        defaultUsername: defaultSlot.defaultUsername,
        activeUsername: activeUsername || defaultSlot.defaultUsername,
        trackingLabel: activeUsername || defaultSlot.defaultUsername,
        isOverridden: Boolean(activeUsername && activeUsername !== defaultSlot.defaultUsername)
      };
    });
  } catch {
    return getDefaultActiveParty();
  }
}

export function resetPartyOverrides(settings: CoonieSettings): CoonieSettings {
  return {
    ...settings,
    selectedPresetId: "main",
    partySlots: settings.partySlots.map((slot) => ({ ...slot, overrideUsername: undefined }))
  };
}

export function formatCoonieNumber(value: number, settings: CoonieSettings): string {
  if (!Number.isFinite(value)) return "N/A";
  if (settings.numberFormat === "compact") {
    return Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 2 }).format(value);
  }
  return value.toLocaleString();
}
