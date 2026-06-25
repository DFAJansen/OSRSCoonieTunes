"use client";

import { DangerZone } from "@/components/settings/DangerZone";
import { DensitySelector } from "@/components/settings/DensitySelector";
import { ExperimentalSettings } from "@/components/settings/ExperimentalSettings";
import { NumberFormatSelector } from "@/components/settings/NumberFormatSelector";
import { PartyConfiguration } from "@/components/settings/PartyConfiguration";
import { PartyPresets } from "@/components/settings/PartyPresets";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { useCoonieSettings } from "@/hooks/useCoonieSettings";

export default function WarCouncilPage() {
  const { settings, activeParty, mounted, setSettings, resetAllSettings } = useCoonieSettings();

  return (
    <div className="warCouncilPage">
      <section className="warHero councilHero">
        <div className="warHeroCopy">
          <span className="eyebrow">Local Command Settings</span>
          <h1>War Council</h1>
          <p>Configure the party, themes and rules of the war.</p>
          <strong>{settings.partyName} War Room</strong>
        </div>
        <div className="commanderAvatar" aria-hidden="true">WC</div>
      </section>

      <section className="briefingPanel councilSection">
        <div className="briefingHeader">
          <div>
            <span className="sectionKicker">Party Name</span>
            <h2>Warband Identity</h2>
          </div>
        </div>
        <label className="wideCouncilInput">
          <span>Party Name</span>
          <input
            maxLength={50}
            value={settings.partyName}
            onChange={(event) => setSettings((current) => ({ ...current, partyName: event.target.value }))}
          />
        </label>
        <div className="activePartyPreview">
          {activeParty.map((slot) => (
            <span key={slot.id}>
              {slot.slotName}{slot.isOverridden ? ` using ${slot.activeUsername}` : ""}
            </span>
          ))}
        </div>
        {!mounted ? <p className="muted">Loading local council settings...</p> : null}
      </section>

      <PartyConfiguration settings={settings} setSettings={setSettings} />
      <PartyPresets settings={settings} setSettings={setSettings} />
      <ThemeSelector settings={settings} setSettings={setSettings} />

      <section className="briefingPanel councilSection">
        <div className="briefingHeader">
          <div>
            <span className="sectionKicker">Layout & Display</span>
            <h2>Interface Rules</h2>
          </div>
        </div>
        <div className="displaySettingsGrid">
          <DensitySelector settings={settings} setSettings={setSettings} />
          <NumberFormatSelector settings={settings} setSettings={setSettings} />
        </div>
      </section>

      <ExperimentalSettings settings={settings} setSettings={setSettings} />
      <DangerZone setSettings={setSettings} resetAllSettings={resetAllSettings} />
    </div>
  );
}
