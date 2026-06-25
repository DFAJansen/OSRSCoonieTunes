export function normalizeCollectionName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[''`’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function collectionSlug(value: string): string {
  return normalizeCollectionName(value).replace(/\s+/g, "-");
}
