"use client";

import { useState } from "react";
import { CUSTOM_PRESET, MAIN_ACCOUNTS_PRESET, sanitizeUsername, type CoonieSettings, type PartyPreset } from "@/lib/settings";

type Props = {
  settings: CoonieSettings;
  setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void;
};

function presetSummary(preset: PartyPreset): string {
  return preset.slots
    .map((slot) => `${slot.slotName} -> ${sanitizeUsername(slot.overrideUsername) || slot.defaultUsername}`)
    .join(", ");
}

export function PartyPresets({ settings, setSettings }: Props) {
  const [presetName, setPresetName] = useState("");
  const currentPreset: PartyPreset = { ...CUSTOM_PRESET, slots: settings.partySlots };
  const presets = [MAIN_ACCOUNTS_PRESET, currentPreset, ...settings.savedPresets];

  function applyPreset(preset: PartyPreset) {
    setSettings((current) => ({
      ...current,
      selectedPresetId: preset.id,
      partySlots: current.partySlots.map((slot) => {
        const presetSlot = preset.slots.find((item) => item.id === slot.id);
        return { ...slot, overrideUsername: presetSlot?.overrideUsername };
      })
    }));
  }

  function savePreset() {
    const name = presetName.trim();
    if (!name) return;
    const preset: PartyPreset = {
      id: `preset-${Date.now()}`,
      name: name.slice(0, 40),
      slots: settings.partySlots.map((slot) => ({ ...slot, overrideUsername: sanitizeUsername(slot.overrideUsername) }))
    };
    setSettings((current) => ({ ...current, selectedPresetId: preset.id, savedPresets: [...current.savedPresets, preset] }));
    setPresetName("");
  }

  return (
    <section className="briefingPanel councilSection">
      <div className="briefingHeader">
        <div>
          <span className="sectionKicker">Party Presets</span>
          <h2>Saved Rosters</h2>
        </div>
      </div>
      <div className="presetComposer">
        <input maxLength={40} placeholder="Preset name" value={presetName} onChange={(event) => setPresetName(event.target.value)} />
        <button className="osrsButton" type="button" onClick={savePreset}>Save current party as preset</button>
      </div>
      <div className="presetList">
        {presets.map((preset) => (
          <article className="presetCard" key={preset.id}>
            <div>
              <strong>{preset.name}</strong>
              <p className="muted">{presetSummary(preset)}</p>
            </div>
            <div className="presetActions">
              <button className="osrsButton" type="button" onClick={() => applyPreset(preset)}>Apply preset</button>
              {preset.id.startsWith("preset-") ? (
                <button
                  className="textAction dangerAction"
                  type="button"
                  onClick={() => setSettings((current) => ({ ...current, savedPresets: current.savedPresets.filter((item) => item.id !== preset.id) }))}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
