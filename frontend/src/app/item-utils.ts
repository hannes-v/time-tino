// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { of } from "rxjs";
import type { Item } from "./item";

export function calculateItemDuration(item: Item): number | null {
	if (!item.endedAt) {
		return null;
	}
	return item.endedAt.getTime() - item.startedAt.getTime();
}

@Injectable({ providedIn: "root" })
export class ItemService {
	private apiUrl = "/items/";

	constructor(private http: HttpClient) {}

	getItems(): Observable<Item[]> {
		return of([
			{ id: 1, tag: "Sample Item", startedAt: new Date(), endedAt: new Date() },
			{
				id: 2,
				tag: "Another Item",
				startedAt: new Date(),
				endedAt: null,
			},
		]);
	}

	// getItems() {
	// 	return this.http.get<Item[]>(this.apiUrl);
	// }

	deleteItem(id: number): Observable<void> {
		// TODO: Implement deleteItem method
		throw new Error("Method not implemented.");
		// return this.http.delete<void>(`${this.apiUrl}${id}/`);
	}
}
