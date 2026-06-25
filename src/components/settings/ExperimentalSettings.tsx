"use client";

import type { CoonieSettings } from "@/lib/settings";

type BooleanKey = "animationsEnabled" | "aiCommandReportsEnabled" | "dynamicWarEventsEnabled" | "seasonalEventsEnabled";

const TOGGLES: { key: BooleanKey; label: string; detail: string }[] = [
  { key: "animationsEnabled", label: "Animations", detail: "Controls glow and motion intensity." },
  { key: "aiCommandReportsEnabled", label: "AI Command Reports", detail: "Stored for future use." },
  { key: "dynamicWarEventsEnabled", label: "Dynamic War Events", detail: "Stored for future use." },
  { key: "seasonalEventsEnabled", label: "Seasonal Events", detail: "Stored for future use." }
];

export function ExperimentalSettings({ settings, setSettings }: { settings: CoonieSettings; setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void }) {
  return (
    <section className="briefingPanel councilSection">
      <div className="briefingHeader">
        <div>
          <span className="sectionKicker">Experimental War Features</span>
          <h2>Future Rules</h2>
        </div>
      </div>
      <div className="toggleList">
        {TOGGLES.map((toggle) => (
          <label className="toggleRow" key={toggle.key}>
            <span>
              <strong>{toggle.label}</strong>
              <small>{toggle.detail}</small>
            </span>
            <input
              checked={settings[toggle.key]}
              type="checkbox"
              onChange={(event) => setSettings((current) => ({ ...current, [toggle.key]: event.target.checked }))}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
