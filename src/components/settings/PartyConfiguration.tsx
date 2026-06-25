"use client";

import { sanitizeUsername, type CoonieSettings } from "@/lib/settings";

type Props = {
  settings: CoonieSettings;
  setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void;
};

export function PartyConfiguration({ settings, setSettings }: Props) {
  return (
    <section className="briefingPanel councilSection">
      <div className="briefingHeader">
        <div>
          <span className="sectionKicker">Party Configuration</span>
          <h2>Account Sources</h2>
        </div>
      </div>
      <div className="partySlotGrid">
        {settings.partySlots.map((slot) => {
          const activeUsername = sanitizeUsername(slot.overrideUsername) || slot.defaultUsername;
          return (
            <article className="partySlotCard" key={slot.id}>
              <div>
                <span className="eyebrow">{slot.slotName}</span>
                <h3>{slot.slotName}</h3>
                <p className="muted">Default account: {slot.defaultUsername}</p>
              </div>
              <label>
                <span>Override account</span>
                <input
                  maxLength={30}
                  placeholder={slot.defaultUsername}
                  value={slot.overrideUsername ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSettings((current) => ({
                      ...current,
                      selectedPresetId: "custom",
                      partySlots: current.partySlots.map((item) => item.id === slot.id ? { ...item, overrideUsername: value } : item)
                    }));
                  }}
                />
              </label>
              <p className="trackingLine">
                Currently tracking: <strong>{activeUsername}</strong>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
