import { Component } from '@angular/core';

import { NavController, AlertController, LoadingController, Loading, ModalController, PopoverController, Popover } from 'ionic-angular';

import { KeyValService } from '../../app/providers/keyval.service';

import { WatchService } from '../../app/providers/watch.service';

import { InventoryModal } from '../inventory-modal/inventory-modal';

import { NotificationsOptionsPage } from './notifications.options';

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
  providers: [WatchService]
})
export class NotificationsPage {

  loader: Loading;
  optionsPopover: Popover;
  watchInventories: any;

  inventoryModal: any;
  showingIndex: number;

  constructor(
    public navCtrl: NavController,
    public keyValService: KeyValService,
    public watchService: WatchService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController
  ) {
    
  }

  ngOnInit() {
    //console.log('oninitfired');
    this.fetch();
  }

  itemTapped(i) {
    let wi = this.watchInventories[i];
     if( !wi.hasOwnProperty('id') ) {
       this.showingIndex = -1;
      return;
    }
    try {
      this.inventoryModal.dismiss();
    } catch(e) {}
    this.inventoryModal = null;

    this.inventoryModal = this.modalCtrl.create(
      InventoryModal,
      {
        inventory:  wi.inventory,
        caller:     this
      }
    );
    this.inventoryModal.present();

    this.showingIndex = i;
    
  }


  public showPrevious(): void {
    let n = (this.showingIndex-1);
    console.log('showPrevious: ' + n);
    console.log('first: ' + (this.showingIndex > -1));
    console.log('second: ' + (this.watchInventories.length <= n));
    
    if( this.showingIndex > -1 && n >= 0 ) {
      this.itemTapped(n);
    }
  }

  public showNext(): void {
    let n = (this.showingIndex+1);
    console.log('showNext: ' + n);
    console.log('first: ' + (this.showingIndex > -1));
    console.log('second: ' + (this.watchInventories.length >= n));
    
    if( this.showingIndex > -1 && this.watchInventories.length >= n ) {
      this.itemTapped(n);
    }
  }


  public fetch(): void {
    this.showLoading("Loading...");
    this.watchService.getWatchInventories().subscribe(
      wiResults => {
        //this.movies = data.results; 
        //console.log('subscribe getWatchInventories returned');
        //console.log(JSON.stringify(searchResults));
        //console.log(JSON.stringify(wiResults));
        //this.watchInventories = wiResults;
        this.setWatchInventories(wiResults);
        this.hideLoading();
      },
      (err) => {
        //console.log("error");
        //console.log(JSON.stringify(err));
        //console.log(err.json()); //gives the object object
        //console.log(JSON.stringify(err.json())); //gives the object object
        this.hideLoading();
        this.showErrors(["Error communicating with server, please try again later."]);
      }
    );
  }

  private setWatchInventories(wis: Array<any>): void {
    for (let wi of wis) {
      if (!wi.hasOwnProperty("inventory") || !wi.inventory.hasOwnProperty("location")) {
        let index = wis.indexOf(wi, 0);
        if (index > -1) {
          wis.splice(index, 1);
        }
      }
    }
    
    if( wis.length <= 0 ) {
      // show some kind of text to the user if there are 0 notifications
      let stub = {
        timeago: '',
        inventory: {
          caryear: 'No notifications yet.',
          car: '',
          location: {
            label: ''
          }
        }
      };
      wis.push(stub);
    }
    
    this.watchInventories = wis;
  }
  
  public getWatchInventories(): Array<any> {
    return this.watchInventories;
  }


  private showLoading(content: string): void {
    this.loader = null;
    this.loader = this.loadingCtrl.create({
      content: content,
      dismissOnPageChange: true
    });
    this.loader.present();
  }

  private hideLoading(): void {
    try {
      this.loader.dismiss();
    } catch(e) {}
  }

  public presentPopover(ev): void {
    this.optionsPopover = this.popoverCtrl.create(NotificationsOptionsPage, {
      caller: this
    });
    this.optionsPopover.present({ ev: ev });
  }

  public dismissPopover(): void {
    try {
      this.optionsPopover.dismiss();
    } catch(e) {}
  }

  private showErrors(errors: Array<string>) {
    //console.log('errors here?');
    //console.log(JSON.stringify(errors));
    let alert = this.alertCtrl.create({
      title: 'Woops',
      subTitle: errors.join("<br />"),
      buttons: ['Okay']
    });
    alert.present();
  }

}
