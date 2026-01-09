import { Component, input, output } from "@angular/core";

@Component({
	selector: "app-tagselector",
	imports: [],
	templateUrl: "./tagselector.html",
	styleUrls: [],
})
export class Tagselector {
	protected readonly options = input.required<string[]>();

	tagAdded = output<string>();
	tagRemoved = output<string>();

	newTagName: string = "";

	onAdd() {
		const trimmedTag = this.newTagName.trim();
		if (trimmedTag) {
			this.tagAdded.emit(trimmedTag);
			this.newTagName = "";
		}
	}

	onRemove(tag: string) {
		this.tagRemoved.emit(tag);
	}
}
