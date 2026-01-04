import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { Router } from "@angular/router";
import type { Item } from "../item";
import { calculateItemDuration } from "../item-utils";

@Component({
	selector: "app-listentry",
	standalone: true,
	imports: [CommonModule],
	templateUrl: "./listentry.html",
	styleUrl: "./listentry.css",
})
export class Listentry {
	editOverlayVisible: boolean = false;
	@Input() item!: Item;
	router = inject(Router);

	showOverlay(): void {
		console.log("Showing overlay for item", this.item.id);
		this.router.navigate([""]);
	}

	get duration(): number | null {
		return calculateItemDuration(this.item);
	}
}
