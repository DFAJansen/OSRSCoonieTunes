import type { CollectionItemDefinition } from "../collection-log-structure";
import { collectionSlug } from "../collection-normalizers";

export function itemDefinitions(categoryId: string, names: string[], notable = true): CollectionItemDefinition[] {
  return names.map((name) => ({ id: `${categoryId}-${collectionSlug(name)}`, name, categoryId, notable }));
}
