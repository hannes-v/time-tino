import type { Item } from "./item";

export function calculateItemDuration(item: Item): number | null {
	if (!item.endedAt) {
		return null;
	}
	return item.endedAt.getTime() - item.startedAt.getTime();
}
