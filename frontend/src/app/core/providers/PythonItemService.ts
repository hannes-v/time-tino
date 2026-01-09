// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { map, of } from "rxjs";
import type { Item } from "../../shared/models/Item";
import type { ItemServiceModel } from "./ItemService.model";

export function calculateItemDuration(item: Item): number | null {
	if (!item.endedAt) {
		return null;
	}
	return item.endedAt - item.startedAt;
}

@Injectable({ providedIn: "root" })
export class PythonItemService implements ItemServiceModel {
	private apiUrl = "/items/";

	constructor(private http: HttpClient) {}

	/**
	 * @deprecated all Items should be fetched via getItems()
	 */
	getItemById(id: number): Observable<Item> {
		return this.http.get<Item>(`${this.apiUrl}${id}/`);
	}

	updateItem(item: Item): Observable<Item> {
		return of(item);
	}

	public createItem(tag: string): Observable<Item> {
		const newItem: Partial<Item> = {
			tag: tag,
		};
		return this.http.post<Item>(this.apiUrl, newItem);
	}

	public getItems() {
		return this.http.get<Item[]>(this.apiUrl);
	}

	public deleteItem(item: Item): Observable<boolean> {
		return this.http
			.delete(`${this.apiUrl}${item.id}/`, {
				observe: "response", // collecting the whole response bject
			})
			.pipe(map((response) => response.status === 204));
	}
}
