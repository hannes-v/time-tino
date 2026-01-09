import { Injectable } from "@angular/core";
import { delay, map, type Observable, of } from "rxjs";
import type { Item } from "../../shared/models/Item";
import type { ItemServiceModel } from "./ItemService.model";

@Injectable({ providedIn: "root" })
export class MockItemService implements ItemServiceModel {
	// Lokaler State für die Mock-Daten
	private mockItems: Item[] = [
		{ id: 1, tag: "Arbeit", startedAt: Date.now() - 3600000 }, // vor 1 Std
		{ id: 2, tag: "Lernen", startedAt: Date.now() - 1800000 }, // vor 30 Min
	];

	getItemById(id: number): Observable<Item> {
		const item = this.mockItems.find((i) => i.id === id);
		if (item) {
			return of(item).pipe(delay(200));
		}
		throw new Error(`Item mit ID ${id} nicht gefunden.`);
	}

	/**
	 * Gibt alle Items mit einer Verzögerung von 500ms zurück.
	 */
	getItems(): Observable<Item[]> {
		return of([...this.mockItems]).pipe(delay(500));
	}

	/**
	 * Simuliert das Erstellen. Erzeugt eine ID und setzt den Start-Timestamp.
	 */
	createItem(tag: string): Observable<Item> {
		const newItem: Item = {
			id: Math.floor(Math.random() * 10000),
			tag: tag,
			startedAt: Date.now(),
		};
		this.mockItems.push(newItem);
		return of(newItem).pipe(delay(400));
	}

	/**
	 * Simuliert ein Update (z.B. wenn endTime gesetzt wird).
	 */
	updateItem(item: Item): Observable<Item> {
		const index = this.mockItems.findIndex((i) => i.id === item.id);
		if (index !== -1) {
			this.mockItems[index] = { ...item };
			return of(this.mockItems[index]).pipe(delay(300));
		}
		throw new Error(`Item mit ID ${item.id} nicht gefunden.`);
	}

	/**
	 * Simuliert das Löschen und gibt true zurück, wenn das Item existierte (Status 204 Simulation).
	 */
	deleteItem(item: Item): Observable<boolean> {
		const initialLength = this.mockItems.length;
		this.mockItems = this.mockItems.filter((i) => i.id !== item.id);

		// Return true if something was deleted (simulates 204)
		const success = this.mockItems.length < initialLength;
		return of(success).pipe(delay(300));
	}
}
