"use client";

import type { CoonieSettings, ThemeId } from "@/lib/settings";

const THEMES: { id: ThemeId; name: string; detail: string }[] = [
  { id: "night-varrock", name: "Night at Varrock", detail: "Dark default. Black, gold and old stone." },
  { id: "falador", name: "Falador", detail: "Light stone, white, blue and soft gold." },
  { id: "ardougne", name: "Ardougne", detail: "Green, brown and medieval city gold." },
  { id: "bandos", name: "Bandos", detail: "Dark steel with red and aggressive green." },
  { id: "zamorak", name: "Zamorak", detail: "Black, red and purple chaos." },
  { id: "saradomin", name: "Saradomin", detail: "Blue, white and silver." },
  { id: "armadyl", name: "Armadyl", detail: "White, gold and light blue." },
  { id: "guthix", name: "Guthix", detail: "Green, nature and balance." }
];

export function ThemeSelector({ settings, setSettings }: { settings: CoonieSettings; setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void }) {
  return (
    <section className="briefingPanel councilSection">
      <div className="briefingHeader">
        <div>
          <span className="sectionKicker">Theme</span>
          <h2>War Paint</h2>
        </div>
      </div>
      <div className="themeGrid">
        {THEMES.map((theme) => (
          <button
            className={`themeChoice ${settings.theme === theme.id ? "active" : ""}`}
            key={theme.id}
            type="button"
            onClick={() => setSettings((current) => ({ ...current, theme: theme.id }))}
          >
            <span className={`themeSwatch ${theme.id}`} />
            <strong>{theme.name}</strong>
            <small>{theme.detail}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
