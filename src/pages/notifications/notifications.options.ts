import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import _ from 'lodash';

@Component({
    templateUrl: 'notifications.options.html'
})
export class NotificationsOptionsPage {

    caller: any;

    constructor(private navParams: NavParams) {
        this.caller = navParams.get("caller");
    }

    public sortBy(sort): void {
        let oWis = this.caller.getWatchInventories();
        let nWis = [];
        switch(sort) {
            case 'created': {
                nWis = _.sortBy(oWis, ['created']).reverse();
                break;
            }
            case 'arrived': {
                nWis = _.sortBy(oWis, ['arrived']).reverse();
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
        this.caller.setWatchInventories(nWis);
        this.caller.dismissPopover();
    }


  


}