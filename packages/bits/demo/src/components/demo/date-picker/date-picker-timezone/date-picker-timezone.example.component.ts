import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ISelectChangedEvent } from "@nova-ui/bits";
import moment from "moment-timezone";

const zonesData = require("moment-timezone/data/packed/latest.json");
moment.tz.add(zonesData.zones);

@Component({
    selector: "nui-date-picker-timezone-example",
    templateUrl: "./date-picker-timezone.example.component.html",
})
export class DatePickerTimezoneExampleComponent {
    public control = new FormControl(moment(), Validators.required);
    public zones: string[] = zonesData.zones.map((z: string) => z.split("|")[0]);
    public displayedZones = this.zones;
    public initialZone = "Australia/Sydney";

    get selectedDate(): string {
        return this.control.value.toString();
    }

    constructor() {
        this.control.setValue(this.control.value.tz(this.initialZone));
    }

    public textboxChanged(searchQuery: ISelectChangedEvent<any>): void {
        const val = searchQuery.newValue;
        this.displayedZones = this.zones.filter((z): boolean => z.toLowerCase().includes(val.toLowerCase()));

        if (this.zones.find(z => z === val)) {
            this.control.setValue(this.control.value.tz(val));
        }
    }
}
