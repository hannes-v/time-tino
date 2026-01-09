/**
 * this is an Item for a time tracking entry
 */
export interface Item {
	id: number;
	tag: string;
	startedAt: number;
	endedAt?: number;
}
