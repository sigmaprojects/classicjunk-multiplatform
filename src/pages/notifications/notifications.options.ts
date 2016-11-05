import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'notifications.options.html'
})
export class NotificationsOptionsPage {

    caller: any;

    constructor(private navParams: NavParams) {
        this.caller = navParams.get("caller");
    }

    public sortBy(sort): void {
        let wis = this.caller.getWatchInventories();
        switch(sort) {
            case 'created': {
                wis.sort(this.dynamicSort("-created"));
                break;
            }
            case 'arrived': {
                wis.sort(this.dynamicSort("-inventory.arrived"));
                break;
            }
            case 'distance': {
                wis.sort(this.dynamicSort("distance"));
                break;
            }
            case 'caryear': {
                wis.sort(this.dynamicSort("inventory.caryear"));
                break;
            }
        }
        this.caller.setWatchInventories(wis);
        this.caller.dismissPopover();
    }


    private dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

  


}