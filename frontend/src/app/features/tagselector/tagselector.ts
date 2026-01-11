import { Component, input, output, signal } from "@angular/core";

@Component({
	selector: "app-tagselector",
	imports: [],
	templateUrl: "./tagselector.html",
	styleUrls: [],
})
export class Tagselector {
	readonly options = input.required<string[]>();

	selectedOptionSignal = signal<string | null>(null);

	tagAdded = output<string>();
	tagRemoved = output<string>();
	selectedOption = output<string>();

	newTagName: string = "";

	onAdd(value?: string) {
		console.log("onAdd called with value:", value);
		const name = (value ?? this.newTagName).trim();
		if (name) {
			this.tagAdded.emit(name);
			this.newTagName = "";
		}
	}

	onSelect(tag: string) {
		this.selectedOptionSignal.set(tag);
		this.selectedOption.emit(tag);
	}

	onRemove(tag: string) {
		this.tagRemoved.emit(tag);
	}
}
