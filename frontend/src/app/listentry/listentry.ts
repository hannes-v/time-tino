import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
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

	showOverlay(): void {
		console.log("Showing overlay for item", this.item.id);
		this.editOverlayVisible = true;
	}

	get duration(): number | null {
		return calculateItemDuration(this.item);
	}
}
