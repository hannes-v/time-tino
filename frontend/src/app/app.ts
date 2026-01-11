import { Component, inject, signal } from "@angular/core";
import {
	Router,
	RouterLink,
	RouterLinkWithHref,
	RouterOutlet,
} from "@angular/router";
// biome-ignore lint/style/useImportType: <explanation>
import { MockItemService } from "./core/providers/MockItemService";
// biome-ignore lint/style/useImportType: <explanation>
import { Listentry } from "./features/listentry/listentry";
import { Tagselector } from "./features/tagselector/tagselector";
import { Timeinput } from "./features/timeinput/timeinput";
import { Overlay } from "./shared/components/overlay/overlay";
import type { Item } from "./shared/models/Item";

@Component({
	selector: "app-root",
	imports: [
		RouterOutlet,
		Listentry,
		Timeinput,
		Overlay,
		RouterLinkWithHref,
		RouterLink,
		Tagselector,
	],
	templateUrl: "./app.html",
	styleUrls: [],
})
export class App {
	protected readonly title = signal("time-tino");
	router = inject(Router);

	constructor(private itemService: MockItemService) {}
	allItems = signal<Item[]>([]);

	randomTags = signal<string[]>(["work", "exercise", "leisure", "other"]);

	onTagAdded = (tag: string) => {
		console.log("Tag added in App component:", typeof tag);
		if (!this.randomTags().includes(tag)) {
			this.randomTags.set([...this.randomTags(), tag]);
		}
	};
	onTagRemoved = (tag: string) => {
		this.randomTags.set(this.randomTags().filter((t) => t !== tag));
	};
	onTagSelected = (tag: any) => {
		console.log("Tag selected in App component:", tag);
	};

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

	openMoal() {
		console.log("Opening modal");
		this.router.navigate([{ outlets: { modal: ["modal/add-friend"] } }]);
	}

	closethatDialog() {
		console.log("Closing dialog");
		this.router.navigate(["/"]);
	}
}
