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
	ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

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

	id = input.required<string>();

	close() {
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
