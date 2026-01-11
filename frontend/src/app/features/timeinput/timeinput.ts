import {
	Component,
	inject,
	type OnDestroy,
	type OnInit,
	signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { MockItemService } from "../../core/providers/MockItemService";
import { PythonItemService } from "../../core/providers/PythonItemService";
import { DataService } from "../../providers/DataService";
import type { Item } from "../../shared/models/Item";

@Component({
	selector: "app-timeinput",
	standalone: true,
	imports: [FormsModule],
	templateUrl: "./timeinput.html",
	styleUrls: [],
})
export class Timeinput implements OnDestroy, OnInit {
	private itemService = inject(MockItemService);

	tags = ["work", "exercise", "leisure", "other"];
	selectedTag: string = this.tags[0];
	elapsedSeconds = signal<number>(0);
	private startTime: number | null = null;
	isRunning = signal<boolean>(false);

	private destroy$ = new Subject<void>();
	selectedTagXXX = signal<string | null>(null);

	dataService = inject(DataService);

	router = inject(Router);

	currentItem: Item | null = null;

	startDisplayTimer(): void {
		if (this.isRunning()) {
			setInterval(() => {
				if (this.startTime) {
					const now = Date.now();
					this.elapsedSeconds.set(this.timeElapsed(this.startTime, now));
				}
			}, 1000);
		}
	}

	start(): void {
		this.itemService.createItem(this.selectedTag).subscribe({
			next: (response) => {
				console.log("Timer started:", response);
				this.currentItem = response;
				this.isRunning.set(true);

				this.startDisplayTimer();
			},
			error: (err) => console.error("Backend Error:", err),
		});
	}

	stop(): void {
		if (!this.currentItem) return;

		this.isRunning.set(false);
		const endTime = Date.now();

		this.itemService
			.updateItem({ ...this.currentItem, endedAt: endTime })
			.subscribe({
				next: (response) => {
					console.log("Timer stopped:", response);
				},
			});
	}

	reset() {
		this.stop();
		this.elapsedSeconds.set(0);
		this.startTime = null;
	}

	timeElapsed = (start: number, end: number): number => {
		if (start && end) {
			return Math.floor((end - start) / 1000);
		}
		return 0;
	};

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
		this.stop();
	}

	ngOnInit(): void {
		this.dataService.data$
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: any) => {
				this.selectedTagXXX = data.selectedTag;
				console.log("Received data in Timeinput:", data);
			});
	}

	openTagSelector(): void {
		console.log("Opening modal");
		this.router.navigate([{ outlets: { modal: ["tagselector"] } }]);
	}
}
