import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "../../providers/DataService";
import { Tagselector } from "../tagselector/tagselector";

@Component({
	selector: "app-tagselector-wrapper",
	imports: [Tagselector],
	templateUrl: "./tagselector-wrapper.html",
	styleUrls: [],
})
export class TagselectorWrapper {
	randomTags = signal<string[]>(["work", "exercise", "leisure", "other"]);
	selectedTag = signal<string | null>(null);

	dataService = inject(DataService);

	router = inject(Router);

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
		this.selectedTag.set(tag);
		console.log("Tag selected in App component:", tag);
	};

	onClose(): void {
		const payload = { selectedTag: this.selectedTag() };
		console.log("Closing TagselectorWrapper with payload:", payload);
		this.dataService.sendData(payload);
		this.router.navigate([{ outlets: { modal: null } }]);
	}
}
