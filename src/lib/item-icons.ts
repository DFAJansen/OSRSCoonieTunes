export function getItemIconUrl(item: { itemId?: number; name: string; icon?: string; wikiIconName?: string }): string {
  if (item.icon) return item.icon;
  const fileName = item.wikiIconName ?? `${item.name}.png`;
  return `https://oldschool.runescape.wiki/images/Special:FilePath/${encodeURIComponent(fileName)}`;
}
