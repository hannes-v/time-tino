import { Component, inject, signal } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import type { Item } from "./item";
// biome-ignore lint/style/useImportType: <explanation>
import { ItemService } from "./item-utils";
import { Listentry } from "./listentry/listentry";
import { Overlay } from "./overlay/overlay";
import { Timeinput } from "./timeinput/timeinput";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, Listentry, Timeinput, Overlay],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("time-tino");
	router = inject(Router);

	constructor(private itemService: ItemService) {}
	allItems = signal<Item[]>([]);

	ngOnInit(): void {
		this.itemService.getItems().subscribe({
			next: (items) => {
				console.log("Fetched items:", items);
				this.allItems.set(items);
			},
			error: (error) => {
				console.error("Error fetching items:", error);
			},
		});
	}

	isModalOpen = signal(true);

	// Saubere Methoden für die Logik
	showOverlay() {
		this.isModalOpen.set(true);
	}

	hideOverlay() {
		this.isModalOpen.set(false);
	}

	/**
	 * @deprecated Use allItems signal directly instead
	 */
	getItems(): Item[] {
		return this.allItems();
	}

	closeDialog() {
		this.router.navigate(["/"]);
	}
}
