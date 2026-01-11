import type { Routes } from "@angular/router";
import { Tagselector } from "./features/tagselector/tagselector";
import { TagselectorWrapper } from "./features/tagselector-wrapper/tagselector-wrapper";

export const routes: Routes = [
	{
		path: "delete/:id", // Overlay-Seite
		loadComponent: () =>
			import("./shared/components/overlay/overlay").then((m) => m.Overlay),
	},
	{
		path: "tagselector",
		component: TagselectorWrapper,
		outlet: "modal",
	},
];
