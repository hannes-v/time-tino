import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import type { Item } from "./item";
import { Listentry } from "./listentry/listentry";
import { Timeinput } from "./timeinput/timeinput";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, Listentry, Timeinput],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("time-tino");

	allItems = [
		{
			id: 1,
			tag: "work",
			startedAt: new Date("2024-06-01T09:00:00"),
			endedAt: new Date("2024-06-01T17:00:00"),
		},
		{
			id: 2,
			tag: "exercise",
			startedAt: new Date("2024-06-01T18:00:00"),
			endedAt: null,
		},
	];

	getItems(): Item[] {
		return this.allItems;
	}
}
