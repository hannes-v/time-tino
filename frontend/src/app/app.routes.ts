import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "delete/:id", // Overlay-Seite
		loadComponent: () => import("./overlay/overlay").then((m) => m.Overlay),
	},
];
