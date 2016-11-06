import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, PopoverController, Popover, AlertController, LoadingController } from 'ionic-angular';
import { InventoryModal } from '../inventory-modal/inventory-modal';
import { SearchOptionsPage } from './search.options';

import { KeyValService } from '../../app/providers/keyval.service';
import { CarSearchService } from '../../app/providers/search.service';
import { SearchModal } from './searchmodal';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

  inventories: any;
  inventoryModal: any;
  showingIndex: number;

  optionsPopover: Popover;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public searchModal: SearchModal,
    public carSearchService: CarSearchService,
    public keyvalService: KeyValService,
    public loadingCtrl: LoadingController
  ) {
    //this.inventories = navParams.get('inventories');
    //let invs = navParams.get('inventories');
    //this.setInventories(invs);
    console.log("Search constructor");
    this.showingIndex = -1;
  }

  ngOnInit() {
    console.log('oninitfired');
    //this.showAlert();

    let options = { maximumAge: 10000, timeout: 3000, enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.showAlert(coords);
      },
      (err) => {
        this.showAlert({latitude:null,longitude:null});
      },
      options
    );
  }



  showAlert(coords) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: false
    });

    //let self = this;
    this.keyvalService.get(KeyValService.LastSearchParamsKey).then(
      (lastSearchParams) => {

        //console.log('lastSearchParams?');
        //console.log(JSON.stringify(lastSearchParams));
        lastSearchParams.latitude = coords.latitude;
        lastSearchParams.longitude = coords.longitude;

        let modal = this.searchModal.getSearchModal(
          lastSearchParams,
          (searchProperties) => {

            //console.log('holy fuckin shit it worked');
            //console.log(JSON.stringify(searchProperties));

            loader.present();

            this.keyvalService.set(KeyValService.LastSearchParamsKey, searchProperties)

            this.carSearchService.searchInventory(
              searchProperties.car,
              searchProperties.yearStart,
              searchProperties.yearEnd,
              searchProperties.latitude,
              searchProperties.longitude,
              searchProperties.zipcode
            ).subscribe(
              searchResults => {
                //this.movies = data.results; 
                //console.log('subscribe search results returned');
                //console.log(JSON.stringify(searchResults));
                this.setInventories(searchResults);
                loader.dismiss();
              },
              err => {
                //console.log("error");
                //console.log(JSON.stringify(err));
                //console.log(err.json()); //gives the object object
                //console.log(JSON.stringify(err.json())); //gives the object object
                this.showErrors(["Error communicating with server, please try again later."]);
              },
              () => {
                //console.log('Car Search Complete');
              }
              );

          });
        modal.present();

      },
      (error) => {
        //console.error('Error getting coords', error);
      }
    );

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




  public setInventories(invs: Array<any>): void {
    console.log("setInventories");
    if (invs.length == 0) {
      let stub = {
        caryear: 'No results found.',
        car: '',
        timeago: '',
        label: ''
      };
      invs.push(stub);
    }
    this.inventories = invs;
  }
  public getInventories(): Array<any> {
    return this.inventories;
  }

  public itemTapped(i): void {
    let inventory = this.inventories[i];
    if (!inventory.hasOwnProperty('id')) {
      this.showingIndex = -1;
      return;
    }

    try {
      this.inventoryModal.dismiss();
    } catch(e) {}
    this.inventoryModal = null;
    
    let modalArgument = this.merge_options(inventory,inventory.location);

    this.inventoryModal = this.modalCtrl.create(
      InventoryModal,
      {
        inventory:  modalArgument,
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
    console.log('second: ' + (this.inventories.length <= n));
    
    if( this.showingIndex > -1 && n >= 0 ) {
      this.itemTapped(n);
    }
  }

  public showNext(): void {
    let n = (this.showingIndex+1);
    console.log('showNext: ' + n);
    console.log('first: ' + (this.showingIndex > -1));
    console.log('second: ' + (this.inventories.length >= n));
    
    if( this.showingIndex > -1 && this.inventories.length >= n ) {
      this.itemTapped(n);
    }
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
    } catch (e) { }
  }

  // nasty hack
  private merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

}


