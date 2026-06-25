import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CoonieTunesLogo } from "@/components/branding/CoonieTunesLogo";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { COUNCIL_NAV_ITEM, NAV_ITEMS } from "@/lib/players";

export const metadata: Metadata = {
  title: "OSRS CoonieTunes",
  description: "Friendship tracker. RNG detector. Roast generator.",
  icons: {
    icon: "/faviconcoones.png",
    shortcut: "/faviconcoones.png",
    apple: "/faviconcoones.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>
        <SettingsProvider>
          <div className="companionShell">
            <aside className="commandRail">
              <Link className="railBrand" href="/">
                <CoonieTunesLogo size="small" showText />
              </Link>
              <nav className="railNav" aria-label="Command navigation">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <div className="railNavDivider" aria-hidden="true" />
                <Link href={COUNCIL_NAV_ITEM.href}>{COUNCIL_NAV_ITEM.label}</Link>
              </nav>
              <div className="railStatus">
                <span>TempleOSRS Link</span>
                <strong>Party signal online</strong>
              </div>
            </aside>
            <main className="commandSurface">{children}</main>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
