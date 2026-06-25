"use client";

import { useEffect, useMemo, useState } from "react";
import type { CategoryComparison, CollectionItemOwnership, PartyCollectionModel, PlayerCollectionStatus } from "@/lib/collection";
import { getCategoryComparison } from "@/lib/collection";
import { filterCollectionItems, type CollectionFilter } from "@/lib/collection-filters";
import {
  getDefaultSubCategory,
  getSubCategoriesByTopTab,
  getSubCategoryById,
  getTopTabs,
  type CollectionSubCategory,
  type CollectionTopTab
} from "@/lib/collection-log-structure";
import type { RecentItem } from "@/lib/types";
import type { NormalizedStats } from "@/lib/types";
import { buildCollectionBossKcSummary } from "@/lib/collection-boss-kc";
import { CollectionBossKcContext } from "./CollectionBossKcContext";
import { CollectionCategoryList } from "./CollectionCategoryList";
import { CollectionCategorySummary } from "./CollectionCategorySummary";
import { CollectionDebugPanel } from "./CollectionDebugPanel";
import { CollectionFilters } from "./CollectionFilters";
import { CollectionItemDrawer } from "./CollectionItemDrawer";
import { CollectionItemGrid } from "./CollectionItemGrid";
import { CollectionLockedState } from "./CollectionLockedState";
import { CollectionPlayerSummary } from "./CollectionPlayerSummary";
import { CollectionSyncNotice } from "./CollectionSyncNotice";
import { CollectionTopTabs } from "./CollectionTopTabs";

export function CollectionLogShell({
  initialCategoryId,
  partyModel,
  statuses,
  recentItems,
  playerBossData = []
}: {
  initialCategoryId?: string;
  partyModel: PartyCollectionModel;
  statuses: PlayerCollectionStatus[];
  recentItems: RecentItem[];
  playerBossData?: NormalizedStats[];
}) {
  const initialCategory = getSubCategoryById(initialCategoryId);
  const [activeTab, setActiveTab] = useState<CollectionTopTab>(initialCategory.topTab);
  const [activeCategory, setActiveCategory] = useState<CollectionSubCategory>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<CollectionFilter>("all");
  const [selectedPlayer, setSelectedPlayer] = useState(partyModel.players[0]?.username ?? "");
  const [openItem, setOpenItem] = useState<CollectionItemOwnership | null>(null);

  const categories = useMemo(() => getSubCategoriesByTopTab(activeTab), [activeTab]);
  const comparison: CategoryComparison = useMemo(() => getCategoryComparison(activeCategory.id, partyModel), [activeCategory.id, partyModel]);
  const filteredItems = useMemo(() => filterCollectionItems(comparison.items, activeFilter, selectedPlayer), [activeFilter, comparison.items, selectedPlayer]);
  const players = partyModel.players.map((player) => player.username);
  const emptyState = getCollectionEmptyState(comparison, activeFilter);
  const bossKcSummary = activeCategory.topTab === "Bosses" ? buildCollectionBossKcSummary(activeCategory.id, playerBossData) : null;

  useEffect(() => {
    const nextCategory = getSubCategoryById(initialCategoryId);
    setActiveTab(nextCategory.topTab);
    setActiveCategory(nextCategory);
    setActiveFilter("all");
    setOpenItem(null);
  }, [initialCategoryId]);

  function selectTab(tab: CollectionTopTab) {
    const nextCategory = getDefaultSubCategory(tab);
    setActiveTab(tab);
    setActiveCategory(nextCategory);
    setActiveFilter("all");
    setOpenItem(null);
  }

  function selectCategory(category: CollectionSubCategory) {
    setActiveCategory(category);
    setActiveTab(category.topTab);
    setActiveFilter("all");
    setOpenItem(null);
  }

  if (!partyModel.syncedPlayers.length) {
    return (
      <div className="collectionLogShell">
        <header className="collectionLogHeader">
          <span>Collection Log</span>
          <h1>Collection War</h1>
        </header>
        <CollectionLockedState />
      </div>
    );
  }

  return (
    <div className="collectionLogShell">
      <header className="collectionLogHeader">
        <span>Collection Log</span>
        <h1>Collection War</h1>
      </header>

      <CollectionTopTabs activeTab={activeTab} onSelect={selectTab} tabs={getTopTabs()} />

      <div className="collectionLogLayout">
        <CollectionCategoryList activeCategory={activeCategory} categories={categories} onSelect={selectCategory} />

        <main className="collectionLogMain">
          <CollectionSyncNotice statuses={statuses} />
          <CollectionCategorySummary comparison={comparison} />
          <CollectionBossKcContext summary={bossKcSummary} />
          <CollectionPlayerSummary comparison={comparison} />
          <CollectionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onPlayerChange={setSelectedPlayer}
            players={players}
            selectedPlayer={selectedPlayer}
          />
          <CollectionItemGrid emptyMessage={emptyState.message} emptyTitle={emptyState.title} items={filteredItems} onOpenItem={setOpenItem} players={players} />
          <CollectionDebugPanel debug={comparison.debug} />
        </main>
      </div>

      <CollectionItemDrawer bossKcSummary={bossKcSummary} category={activeCategory} item={openItem} onClose={() => setOpenItem(null)} recentItems={recentItems} />
    </div>
  );
}

function getCollectionEmptyState(comparison: CategoryComparison, activeFilter: CollectionFilter): { title: string; message: string } {
  if (!comparison.hasDefinitions) {
    return {
      title: "No item definitions available yet",
      message: "This subcategory is not mapped to Collection War item definitions or TempleOSRS category rows yet."
    };
  }

  if (!comparison.hasSyncedData) {
    return {
      title: "Collection ownership unknown",
      message: "Items are listed, but ownership is unknown until players sync their TempleOSRS collection log."
    };
  }

  if (activeFilter !== "all") {
    return {
      title: "No items match this filter",
      message: "The selected filter has no rows for this subcategory right now."
    };
  }

  if (comparison.matchedTempleItemCount === 0) {
    return {
      title: "No synced ownership data for this category",
      message: "The item structure is available, but synced TempleOSRS logs do not include owned items for this category yet."
    };
  }

  return {
    title: "No players own items in this category yet",
    message: "Synced players are missing every mapped item in this subcategory."
  };
}
