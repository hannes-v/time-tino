import { Component, inject, signal } from "@angular/core";
import {
	Router,
	RouterLink,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
import type { Item } from "./item";
// biome-ignore lint/style/useImportType: <explanation>
import { ItemService } from "./item-utils";
import { Listentry } from "./listentry/listentry";
import { Overlay } from "./overlay/overlay";
import { Timeinput } from "./timeinput/timeinput";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		Listentry,
		Timeinput,
		Overlay,
		RouterLinkWithHref,
		RouterLink,
	],
	templateUrl: "./app.html",
	styleUrls: [],
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

	closethatDialog() {
		console.log("Closing dialog");
		this.router.navigate(["/"]);
	}
}
