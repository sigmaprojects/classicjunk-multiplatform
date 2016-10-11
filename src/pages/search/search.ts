import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, PopoverController, Popover } from 'ionic-angular';
import { InventoryModal } from '../inventory-modal/inventory-modal';
import { SearchOptionsPage } from './search.options';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

  inventories: any;

  optionsPopover: Popover;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController
  ) {
    //this.inventories = navParams.get('inventories');
    let invs = navParams.get('inventories');
    this.setInventories(invs);
  }

  public setInventories(invs: Array<any>): void {
    this.inventories = invs;
  }
  public getInventories(): Array<any> {
    return this.inventories;
  }

  itemTapped(event, inventory) {
    //console.log("got this far");
    if( !inventory.hasOwnProperty('id') ) {
      return;
    }
    let modal = this.modalCtrl.create(
      InventoryModal,
      { inventory: inventory }
    );
    modal.present();
  }

  public presentPopover(ev): void {
    this.optionsPopover = this.popoverCtrl.create(SearchOptionsPage, {
      caller: this
    });
    this.optionsPopover.present({ ev: ev });
  }

  public dismissPopover(): void {
    try {
      this.optionsPopover.dismiss();
    } catch(e) {}
  }


}


