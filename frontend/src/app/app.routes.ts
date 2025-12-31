import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "my-dialog",
		loadComponent: () => import("./overlay/overlay").then((m) => m.Overlay),
	},
	{ path: "", loadComponent: () => import("./app").then((m) => m.App) },
];
