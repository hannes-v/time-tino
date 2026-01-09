import type { Observable } from "rxjs";
import type { Item } from "../../shared/models/Item";

export interface ItemServiceModel {
	getItems(): Observable<Item[]>;

	deleteItem(item: Item): Observable<boolean>;
	updateItem(item: Item): Observable<Item>;
	createItem(tag: string): Observable<Item>;
}
