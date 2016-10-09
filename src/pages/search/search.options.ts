import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
    templateUrl: 'search.options.html'
})
export class SearchOptionsPage {

    caller: any;

    constructor(private navParams: NavParams) {
        this.caller = navParams.get("caller");
    }

    public sortBy(sort): void {
        let inventories = this.caller.getInventories();

        switch(sort) {
            case 'arrived': {
                //this.caller.setInventories([]);
                inventories.sort(this.dynamicSort("-arrived"));
                break;
            }
            case 'distance': {
                inventories.sort(this.dynamicSort("distance"));
                break;
            }
            case 'caryear': {
                inventories.sort(this.dynamicSort("caryear"));
                break;
            }
        }
        this.caller.setInventories(inventories);
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