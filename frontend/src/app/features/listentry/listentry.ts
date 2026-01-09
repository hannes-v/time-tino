import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { calculateItemDuration } from "../../core/providers/PythonItemService";
import type { Item } from "../../shared/models/Item";

@Component({
	selector: "app-listentry",
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: "./listentry.html",
	styleUrls: [],
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
