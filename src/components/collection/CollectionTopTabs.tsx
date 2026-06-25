import type { CollectionTopTab } from "@/lib/collection-log-structure";

export function CollectionTopTabs({
  tabs,
  activeTab,
  onSelect
}: {
  tabs: CollectionTopTab[];
  activeTab: CollectionTopTab;
  onSelect: (tab: CollectionTopTab) => void;
}) {
  return (
    <div className="collectionTopTabs" role="tablist" aria-label="Collection Log top categories">
      {tabs.map((tab) => (
        <button aria-selected={tab === activeTab} className={tab === activeTab ? "active" : ""} key={tab} onClick={() => onSelect(tab)} role="tab" type="button">
          {tab}
        </button>
      ))}
    </div>
  );
}
