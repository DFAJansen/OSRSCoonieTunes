import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { NAV_ITEMS } from "@/lib/players";

export const metadata: Metadata = {
  title: "OSRS CoonieTunes",
  description: "Vergelijk OSRS vrienden via TempleOSRS."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>
        <div className="companionShell">
          <aside className="commandRail">
            <Link className="railBrand" href="/">
              <span>OSRS</span>
              <strong>CoonieTunes</strong>
            </Link>
            <nav className="railNav" aria-label="Command navigation">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="railStatus">
              <span>TempleOSRS Link</span>
              <strong>Party signal online</strong>
            </div>
          </aside>
          <main className="commandSurface">{children}</main>
        </div>
      </body>
    </html>
  );
}
