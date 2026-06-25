import { CollectionSyncNotice } from "@/components/collection/CollectionSyncNotice";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCollectionStatus } from "@/lib/collection";
import { buildCollectionMuseumData, categoryHref, MUSEUM_CATEGORIES, selectedCategory } from "@/lib/collection-museum";
import { loadCollections } from "@/lib/loaders";
import { formatNumber, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CollectionLogPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const activeCategory = selectedCategory(params?.category);
  const collectionResults = await loadCollections();
  const statuses = collectionResults.map(getCollectionStatus);
  const collections = collectionResults.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  const { exhibits, leader, museumCompletion, shared, unique, missing, bounties } = buildCollectionMuseumData(collections, activeCategory);

  return (
    <div className="collectionMuseum">
      <section className="museumHero">
        <div className="museumHeroCopy">
          <span className="eyebrow">Collection War // Museum of Spoils</span>
          <h1>{activeCategory.label} Wing</h1>
          <p>{activeCategory.question}</p>
        </div>
        <div className="museumHeroArtifact">
          <span>{activeCategory.short}</span>
          <strong>{leader ? leader.username : "Locked"}</strong>
          <p>{leader ? "Current curator" : "Sync collection logs to open this wing."}</p>
        </div>
      </section>

      <div className="museumLayout">
        <aside className="museumNav" aria-label="Collection War categories">
          <span>Categories</span>
          {MUSEUM_CATEGORIES.map((category) => (
            <a className={category.slug === activeCategory.slug ? "active" : ""} href={categoryHref(category.slug)} key={category.slug}>
              <i aria-hidden="true">{category.short}</i>
              <strong>{category.label}</strong>
              <small>{category.mood}</small>
            </a>
          ))}
        </aside>

        <main className="museumWing">
          <CollectionSyncNotice statuses={statuses} />

          {collections.length ? (
            <>
              <section className="exhibitOverview">
                <div className="exhibitTitle">
                  <span className="sectionKicker">Progress</span>
                  <h2>{activeCategory.mood}</h2>
                  <p>{leader ? `${leader.username} leads this exhibit. Browse the cases below to find the next flex.` : "No leader yet."}</p>
                </div>
                <div className="museumStatCard">
                  <span>Completion</span>
                  <strong>{formatPercent(museumCompletion)}</strong>
                  <ProgressBar value={museumCompletion ?? 0} />
                </div>
                <div className="museumStatCard">
                  <span>Rarity</span>
                  <strong>{leader ? formatNumber(leader.rarityScore) : "N/A"}</strong>
                  <p>Rarity pressure from owned category pieces.</p>
                </div>
                <div className="museumStatCard">
                  <span>Player Comparison</span>
                  <strong>{formatNumber(exhibits.filter((exhibit) => exhibit.totalCount > 0).length)} active</strong>
                  <p>Players with visible pieces in this wing.</p>
                </div>
              </section>

              <section className="museumSection">
                <div className="museumSectionHeader">
                  <span className="sectionKicker">Player Comparison</span>
                  <h2>Curator Race</h2>
                </div>
                <div className="curatorGrid">
                  {exhibits.map((exhibit, index) => (
                    <article className="curatorCard" key={exhibit.username}>
                      <div className="curatorTop">
                        <span className="rankBadge">#{index + 1}</span>
                        <div>
                          <h3>{exhibit.username}</h3>
                          <p>{exhibit.ownedCount ? `${formatNumber(exhibit.ownedCount)} ${exhibit.estimated ? "estimated" : "visible"} pieces claimed` : "No visible pieces in this wing yet"}</p>
                        </div>
                      </div>
                      <ProgressBar value={exhibit.completion ?? exhibit.globalCompletion ?? 0} />
                      <div className="curatorStats">
                        <span>Completion <b>{formatPercent(exhibit.completion)}</b></span>
                        <span>Rarity <b>{formatNumber(exhibit.rarityScore)}</b></span>
                        <span>Missing <b>{formatNumber(exhibit.missing.length)}</b></span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="museumSection">
                <div className="museumSectionHeader">
                  <span className="sectionKicker">Unique Items</span>
                  <h2>Private Exhibits</h2>
                </div>
                <div className="relicGrid">
                  {unique.map(({ player, items }) => (
                    <article className="relicCard" key={player}>
                      <span>{player}</span>
                      <strong>{items.length ? `${formatNumber(items.length)} exclusive pieces` : "No exclusive pieces"}</strong>
                      <div className="itemChips">
                        {items.slice(0, 6).map((item) => <b key={item}>{item}</b>)}
                        {!items.length ? <em>Nothing unique in this wing yet.</em> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="museumSplit">
                <article className="museumSection">
                  <div className="museumSectionHeader">
                    <span className="sectionKicker">Shared Items</span>
                    <h2>Common Display</h2>
                  </div>
                  <div className="itemChips large">
                    {shared.slice(0, 18).map((item) => <b key={item}>{item}</b>)}
                    {!shared.length ? <em>No shared pieces detected in this wing.</em> : null}
                  </div>
                </article>

                <article className="museumSection">
                  <div className="museumSectionHeader">
                    <span className="sectionKicker">Everybody Missing</span>
                    <h2>Empty Pedestals</h2>
                  </div>
                  <div className="itemChips large missing">
                    {missing.slice(0, 18).map((item) => <b key={item}>{item}</b>)}
                    {!missing.length ? <em>No universal missing pieces found.</em> : null}
                  </div>
                </article>
              </section>

              <section className="museumSection">
                <div className="museumSectionHeader">
                  <span className="sectionKicker">Collection Bounties</span>
                  <h2>Hunts Worth Logging In For</h2>
                </div>
                <div className="bountyGrid">
                  {bounties.map((bounty) => (
                    <article className="bountyCard" key={bounty.player}>
                      <span>+{formatNumber(bounty.points)} museum score</span>
                      <h3>{bounty.title}</h3>
                      <p>{bounty.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="museumLocked">
              <h2>Museum Locked</h2>
              <p>Sync at least one TempleOSRS collection log to open the exhibit halls, item comparisons and bounties.</p>
              <a className="osrsButton" href="https://templeosrs.com/collection-log/" target="_blank" rel="noreferrer">Open TempleOSRS Collection Log</a>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
