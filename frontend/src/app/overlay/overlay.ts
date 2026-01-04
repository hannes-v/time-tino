import {
	Component,
	type ElementRef,
	effect,
	Input,
	inject,
	input,
	type OnDestroy,
	type OnInit,
	ViewChild,
	viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, type Observable, of, switchMap } from "rxjs";
import type { Item } from "../item";
// biome-ignore lint/style/useImportType: <explanation>
import { ItemService } from "../item-utils";

@Component({
	selector: "app-overlay",
	standalone: true,
	imports: [],
	templateUrl: "./overlay.html",
	styleUrls: ["./overlay.css"],
})
export class Overlay implements OnDestroy {
	// Services
	private itemService = inject(ItemService);
	private router = inject(Router);

	// Inputs
	readonly id = input<number | null>(null);
	readonly dialogTitle = input<string>("Item Dialog");

	private dialogEl = viewChild<ElementRef<HTMLDialogElement>>("appDialog");

	item = toSignal(
		toObservable(this.id).pipe(
			switchMap((id) => (id ? this.itemService.getItemById(+id) : of(null))),
			catchError((err) => {
				console.error("Fehler beim Laden:", err);
				return of(null);
			}),
		),
	);

	constructor() {
		// Ein Effekt reagiert automatisch, wenn das dialogEl verfügbar ist
		effect(() => {
			const el = this.dialogEl()?.nativeElement;
			if (el) {
				el.showModal();
			}
		});
	}

	getTags() {
		return ["work", "exercise", "leisure", "other"];
	}

	onDelete() {
		const currentItem = this.item();
		if (currentItem) {
			this.itemService.deleteItem(currentItem);
			this.onClose();
		}
	}
	onSave() {
		const currentItem = this.item();
		if (currentItem) {
			this.itemService.updateItem(currentItem);
			this.onClose();
		}
	}

	onClose() {
		this.dialogEl()?.nativeElement.close();
		this.router.navigate(["/"]);
	}

	ngOnDestroy(): void {
		this.dialogEl()?.nativeElement.close();
		this.router.navigate(["/"]);
	}
}
