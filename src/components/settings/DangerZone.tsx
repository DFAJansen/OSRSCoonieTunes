"use client";

import { resetPartyOverrides, type CoonieSettings } from "@/lib/settings";

export function DangerZone({
  setSettings,
  resetAllSettings
}: {
  setSettings: (updater: (settings: CoonieSettings) => CoonieSettings) => void;
  resetAllSettings: () => void;
}) {
  return (
    <section className="briefingPanel councilSection dangerZone">
      <div className="briefingHeader">
        <div>
          <span className="sectionKicker">Danger Zone</span>
          <h2>Reset Orders</h2>
        </div>
      </div>
      <div className="dangerActionsGrid">
        <div>
          <strong>Restore default party</strong>
          <p className="muted">Clears override usernames and returns selected preset to Main Accounts. Theme and display settings stay untouched.</p>
          <button className="osrsButton" type="button" onClick={() => setSettings((current) => resetPartyOverrides(current))}>
            Restore default party
          </button>
        </div>
        <div>
          <strong>Reset all War Council settings</strong>
          <p className="muted">Deletes all local War Council settings and returns everything to DEFAULT_SETTINGS.</p>
          <button
            className="osrsButton dangerButton"
            type="button"
            onClick={() => {
              if (window.confirm("Reset all War Council settings? This removes presets, overrides, theme and display preferences.")) resetAllSettings();
            }}
          >
            Reset all War Council settings
          </button>
        </div>
      </div>
    </section>
  );
}
