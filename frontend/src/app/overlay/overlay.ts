import {
	ChangeDetectorRef,
	Component,
	type ElementRef,
	EventEmitter,
	Input,
	inject,
	type OnInit,
	Output,
	ViewChild,
} from "@angular/core";

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
	@ViewChild("customdialog", { static: true })
	dialog!: ElementRef<HTMLDialogElement>;
	// TODO: investigate why this is needed
	cdr = inject(ChangeDetectorRef);

	ngOnInit(): void {
		this.dialog.nativeElement.showModal();
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.dialog.nativeElement.close();
		this.cdr.detectChanges();
	}
}
