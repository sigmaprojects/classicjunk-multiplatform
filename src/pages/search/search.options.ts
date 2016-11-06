import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import _ from 'lodash';

@Component({
    templateUrl: 'search.options.html'
})
export class SearchOptionsPage {

    caller: any;

    constructor(private navParams: NavParams) {
        this.caller = navParams.get("caller");
    }

    public sortBy(sort): void {
        let oWis = this.caller.getInventories();
        let nWis = [];

        switch(sort) {
            case 'arrived': {
                nWis = _.sortBy(oWis, ['created']).reverse();
                break;
            }
            case 'distance': {
                nWis = _.sortBy(oWis, ['distance']);
                break;
            }
            case 'caryear': {
                nWis = _.sortBy(oWis, ['car','caryear']);
                break;
            }
        }
        this.caller.setInventories(nWis);
        this.caller.dismissPopover();
    }




}