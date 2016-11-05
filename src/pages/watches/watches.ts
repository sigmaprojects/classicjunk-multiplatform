import { Component, trigger, state, animate, transition, style } from '@angular/core';

import { NavController, AlertController, Alert, LoadingController, NavParams } from 'ionic-angular';

import { KeyValService } from '../../app/providers/keyval.service';

import { WatchService } from '../../app/providers/watch.service';


@Component({
  selector: 'page-watches',
  templateUrl: 'watches.html',
  animations: [
    trigger('visibility', [
        state('true', style({
            opacity: 1/*,
            'line-height': '24px',
            'height': '24px'
            */
        })),
        state('false', style({
            opacity: 0,
            'line-height': '0px',
            'height': '0px'
        })),
        transition('* => *', animate('.5s'))
    ])
  ]
})
export class Watches {

  //loader: Loading;
  loading: boolean;

  watches: Array<any>;

  showCreate: any;

  constructor(
    public navCtrl: NavController,
    public keyValService: KeyValService,
    public watchService: WatchService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private params: NavParams
  ) {
    this.loading = true;
    /*
    let showCreate = params.get("showCreate");
    if( typeof showCreate !== 'undefined' && showCreate !== null ) {

      console.log("show create: " + showCreate);
    }
    */
    this.showCreate = params.get("showCreate");
    
  }

  ngOnInit() {
    console.log('oninitfired');

    if( typeof this.showCreate !== 'undefined' && this.showCreate !== null ) {
      this.editTapped({},null);
      console.log("showCreate not null, trigger dialog window");
    }

    this.keyValService.get(KeyValService.WatchesListKey).then(
      (w) => {
        console.log("setting cached watches");
        this.setWatches(w);
        this.fetch();
      },
      (err) => {
        console.log("error getting cached watches");
        this.fetch();
      }
    )
  }

  public fetch(): void {
    console.log('fetching');
    this.showLoading("Loading...");
    this.watchService.list().subscribe(
      watchResults => {
        //this.movies = data.results; 
        //console.log('subscribe watches returned');
        //console.log(JSON.stringify(searchResults));
        //console.log(JSON.stringify(watchResults));

        //this.watches = watchResults.results;
        this.setWatches(watchResults);
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

  private setWatches(w: Array<any>) {
    if( typeof w == 'undefined' ) {
      w = [];
    }
    if( w.length <= 0 ) {
      // show some kind of text to the user if there are 0 watches
      let stub = {
        year_start: '',
        year_end: '',
        label: 'No alerts setup yet.'
      };
      w.push(stub);
    }
    this.watches = w;
  }


  public editTapped(event,watch): void {

    //console.log(JSON.stringify(watch));

    if( watch != null && !watch.hasOwnProperty("id") ) {
      return;
    }

    let options = { maximumAge: 10000, timeout: 3000, enableHighAccuracy: true };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.showEditAlert(coords, watch);
      },
      (error) => {
        //console.error('Error getting coords', error);
        let coords = { latitude: null, longitude: null };
        this.showEditAlert(coords, watch);
      },
      options
    );
  }

  private showEditAlert(coords, watch) {
    let modal: Alert;
    if (watch == null) {
      modal = this.getEditModal(0, '', '', '', coords.latitude, coords.longitude, '',
        (watchData) => { this.saveWatch(watchData); }
      );
    } else {
      modal = this.getEditModal(watch.id, watch.label, watch.year_start, watch.year_end, coords.latitude, coords.longitude, watch.zipcode,
        (watchData) => { this.saveWatch(watchData); }
      );
    }

    modal.present();
  }

  public saveWatch(watchData): void {
    //console.log("got watch data?");
    //console.log(JSON.stringify(watchData));
    //console.log("are we still scoped?");
    //console.log(JSON.stringify(this.watches));

    this.showLoading("Saving...");

    this.watchService.save(
      watchData.id,
      watchData.label,
      watchData.year_start,
      watchData.year_end,
      watchData.lat,
      watchData.lng,
      watchData.zipcode
    ).subscribe(
      (saveResults) => {
        //this.movies = data.results; 
        //console.log('subscribe save watch returned');
        //console.log(JSON.stringify(searchResults));
        //console.log(JSON.stringify(saveResults));
        //this.hideLoading();
        if( saveResults.hasOwnProperty('errorsarray') && saveResults.errorsarray.length > 0 ) {
          this.hideLoading();
          this.showErrors(saveResults.errorsarray);
        } else {
          this.fetch();
        }
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

  public deleteWatch(id): void {
    this.showLoading("Removing...");

    this.watchService.delete(
      id
    ).subscribe(
      (deleteResults) => {
        //this.movies = data.results; 
        //console.log('subscribe Delete watch returned');
        //console.log(JSON.stringify(searchResults));
        //console.log(JSON.stringify(deleteResults));
        this.hideLoading();
        this.fetch();
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

    private getEditModal(
        id: any,
        label: string,
        year_start: any,
        year_end: any,
        lat: any,
        lng: any,
        zipcode: any,
        handler: any
        ): Alert {

        let title = "Get notified for...";
        /*
        if(id == 0) {
          title = "New Alert";
        }
        */
        let inputs = new Array();
        
        inputs.push({
            name: 'label',
            placeholder: 'Make & Model (e.g. "Ford Focus")',
            type: 'text',
            value: label
        });

        inputs.push({
            name: 'year_start',
            placeholder: 'Year Start (e.g. "1998")',
            type: 'number',
            value: year_start
        });

        inputs.push({
            name: 'year_end',
            placeholder: 'Year End (e.g. "2004")',
            type: 'number',
            value: year_end
        });

        inputs.push({ name: 'id', placeholder: '', type: 'hidden', value: id });

        if(
            typeof lat != 'undefined' &&
            typeof lng != 'undefined' &&
            typeof lat == 'number' &&
            typeof lng == 'number' &&
            lat.toString().length > 3 &&
            lng.toString().length > 3
        ) { 
            inputs.push({ name: 'lat', placeholder: '', type: 'hidden', value: lat });
            inputs.push({ name: 'lng', placeholder: '', type: 'hidden', value: lng });
            // insert hidden zipcode just to keep the object sane
            inputs.push({ name: 'zipcode', placeholder: 'Zip Code', type: 'hidden', value: zipcode });
        } else {
            console.log("No latitude/longitude for edit alert, adding zipcode");
            inputs.push({ name: 'zipcode', placeholder: 'Zip Code', type: 'number', value: zipcode });
            // insert hidden lat/lng just to keep object sane
            inputs.push({ name: 'lat', placeholder: '', type: 'hidden', value: '' });
            inputs.push({ name: 'lng', placeholder: '', type: 'hidden', value: '' });
        }

        let buttons: any;
        if(id == 0) {
          buttons = [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: handler
            }
          ]; 
        } else {
          buttons = [
            {
              text: 'Delete',
              handler: data => {
                this.deleteWatch(data.id);
              }
            },
            {
              text: 'Save',
              handler: handler
            }
          ]; 
        }

        let editModal = this.alertCtrl.create({
            title: title,
            inputs: inputs,
            buttons: buttons
        });
        return editModal;
    } 

    private showLoading(content: string): void {
      this.loading = true;
      /*
      this.loader = null;
      this.loader = this.loadingCtrl.create({
        content: content,
        dismissOnPageChange: true
      });
      this.loader.present();
      */
    }

    private hideLoading(): void {
      this.loading = false;
      /*
      try {
        this.loader.dismiss();
      } catch(e) {}
      */ 
    }

}