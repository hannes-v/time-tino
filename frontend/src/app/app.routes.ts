import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "delete/:id", // Overlay-Seite
		loadComponent: () =>
			import("./shared/components/overlay/overlay").then((m) => m.Overlay),
	},
];
