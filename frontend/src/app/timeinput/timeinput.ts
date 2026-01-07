import { type HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { timer } from "rxjs";

@Component({
	selector: "app-timeinput",
	standalone: true,
	imports: [FormsModule],
	templateUrl: "./timeinput.html",
	styleUrls: [],
})
export class Timeinput {
	private tags = ["work", "exercise", "leisure", "other"];
	selectedTag: string = "work";
	timerRunning: boolean = false;

	getTags(): string[] {
		return this.tags;
	}

	timerButtonClicked(): void {
		this.timerRunning = !this.timerRunning;
		if (this.timerRunning) {
			console.log("Timer started for tag:", this.selectedTag);
		} else {
			console.log("Timer stopped");
		}
		// this.http
		// 	.post("http://127.0.0.1:8080/items/", { tag: this.selectedTag })
		// 	.subscribe({
		// 		next: (response) => {
		// 			console.log("Timer started:", response);
		// 			this.timerRunning = true;
		// 		},
		// 		error: (error) => {
		// 			console.error("Error starting timer:", error);
		// 		},
		// 	});
	}
}
