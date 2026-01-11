import type { Routes } from "@angular/router";
import { Tagselector } from "./features/tagselector/tagselector";

export const routes: Routes = [
	{
		path: "delete/:id", // Overlay-Seite
		loadComponent: () =>
			import("./shared/components/overlay/overlay").then((m) => m.Overlay),
	},
	{
		path: "modal/add-friend",
		component: Tagselector,
		outlet: "modal",
	},
];
