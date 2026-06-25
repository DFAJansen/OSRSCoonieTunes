import type { CollectionSubCategory } from "@/lib/collection-log-structure";

export function CollectionCategoryList({
  categories,
  activeCategory,
  onSelect
}: {
  categories: CollectionSubCategory[];
  activeCategory: CollectionSubCategory;
  onSelect: (category: CollectionSubCategory) => void;
}) {
  return (
    <>
      <aside className="collectionCategoryList" aria-label="Collection Log subcategories">
        {categories.map((category) => (
          <button className={category.id === activeCategory.id ? "active" : ""} key={category.id} onClick={() => onSelect(category)} type="button">
            {category.label}
          </button>
        ))}
      </aside>
      <label className="collectionCategorySelect">
        <span>Subcategory</span>
        <select value={activeCategory.id} onChange={(event) => onSelect(categories.find((category) => category.id === event.target.value) ?? activeCategory)}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
