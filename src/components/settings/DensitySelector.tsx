"use client";

import type { CoonieSettings, Density } from "@/lib/settings";

const DENSITIES: { id: Density; name: string; detail: string }[] = [
  { id: "compact", name: "Compact", detail: "Tighter council table, faster scanning." },
  { id: "comfortable", name: "Comfortable", detail: "Default CoonieTunes spacing." },
  { id: "spacious", name: "Spacious", detail: "More air between war reports." }
];

export function DensitySelector({ settings, setSettings }: { settings: CoonieSettings; setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void }) {
  return (
    <div className="settingBlock">
      <span className="sectionKicker">Layout Density</span>
      <div className="segmentedGrid">
        {DENSITIES.map((density) => (
          <button className={settings.density === density.id ? "active" : ""} key={density.id} type="button" onClick={() => setSettings((current) => ({ ...current, density: density.id }))}>
            <strong>{density.name}</strong>
            <small>{density.detail}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
