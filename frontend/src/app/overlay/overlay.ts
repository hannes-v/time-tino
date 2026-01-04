import {
	ChangeDetectorRef,
	Component,
	type ElementRef,
	EventEmitter,
	Input,
	inject,
	input,
	type OnInit,
	Output,
	type Signal,
	ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import type { Item } from "../item";

@Component({
	selector: "app-overlay",
	standalone: true,
	imports: [],
	templateUrl: "./overlay.html",
	styleUrls: ["./overlay.css"],
})
export class Overlay implements OnInit {
	@Input("isOpen") isVisible = false;
	@Input() dialogTitle!: string;
	@ViewChild("appDialog", { static: true })
	dialog!: ElementRef<HTMLDialogElement>;
	router = inject(Router);

	id: Signal<string> = input.required<string>();

	//itemData: Item | null = id() ? getItemById(id()) : null;

	getTags() {
		return ["work", "exercise", "leisure", "other"];
	}

	onDelete() {}
	onSave() {}
	onClose() {
		this.dialog.nativeElement.close();
		this.router.navigate(["/"]);
	}

	ngOnInit(): void {
		this.dialog.nativeElement.showModal();
	}

	ngOnDestroy(): void {
		this.dialog.nativeElement.close();
		this.router.navigate(["/"]);
	}
}
function getItemById(arg0: string): Item | null {
	throw new Error("Function not implemented.");
}
