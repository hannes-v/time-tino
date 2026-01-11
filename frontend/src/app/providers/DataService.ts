import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class DataService {
	private dataExchange = new Subject<any>();
	data$ = this.dataExchange.asObservable();

	sendData(data: any) {
		this.dataExchange.next(data);
	}
}
