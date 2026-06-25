"use client";

import { formatCoonieNumber, type CoonieSettings, type NumberFormat } from "@/lib/settings";

const FORMATS: { id: NumberFormat; name: string }[] = [
  { id: "full", name: "Full" },
  { id: "compact", name: "Compact" }
];

export function NumberFormatSelector({ settings, setSettings }: { settings: CoonieSettings; setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void }) {
  return (
    <div className="settingBlock">
      <span className="sectionKicker">Number Format</span>
      <div className="segmentedGrid two">
        {FORMATS.map((format) => (
          <button className={settings.numberFormat === format.id ? "active" : ""} key={format.id} type="button" onClick={() => setSettings((current) => ({ ...current, numberFormat: format.id }))}>
            <strong>{format.name}</strong>
            <small>{formatCoonieNumber(1250000, { ...settings, numberFormat: format.id })}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
