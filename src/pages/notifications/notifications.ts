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

  lastHighestSeenId: number;

  constructor(
    public navCtrl: NavController,
    public keyValService: KeyValService,
    public watchService: WatchService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController
  ) {
    this.lastHighestSeenId = 0; 
  }

  ngOnInit() {
    //console.log('oninitfired');
    this.keyValService.get(KeyValService.HighestSeenWatchInventoryIdKey).then(
      (val) => {
        this.lastHighestSeenId = val;
        console.log("keyval get HighestSeenWatchInventoryId: " + val);
        this.fetch();
      },
      (err) => {
        this.fetch();
      }
    );
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
        //this.setWatchInventories(wiResults);
        this.setWatchInventories(this.gettest());
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
    let highestId = -1;

    for (let wi of wis) {
      if (!wi.hasOwnProperty("inventory") || !wi.inventory.hasOwnProperty("location")) {
        let index = wis.indexOf(wi, 0);
        if (index > -1) {
          wis.splice(index, 1);
        }
      }
      if( wi.id > highestId ) {
        highestId = wi.id;
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

    if (highestId > -1) {
      this.keyValService.set(KeyValService.HighestSeenWatchInventoryIdKey,highestId).then(
        () => {
          this.watchInventories = wis;
        },
        (err) => {
          this.watchInventories = wis;
        }
      );
    } else {
      this.watchInventories = wis;
    }

    
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

  private gettest() {
    let watchinventories = [{
			"distance": 33.993217,
			"created": 1476990143,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12900-1058970.jpeg",
				"created": 1476990004,
				"notes": "Section: Big Trucks Row: 111 Space: 4 Color: Silver",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476990004,
				"id": "8281EEDC994B26C9579BAB61ECEB87D703CCAAF92D18E516DBD8FAEF1FA220CD",
				"timeago": "12 hours ago",
				"arrived": 1476946800,
				"caryear": 2000
			},
			"updated": 1476990143,
			"id": 119868,
			"timeago": "27 minutes ago"
		},
		{
			"distance": 33.993217,
			"created": 1476986644,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12884-1056232.jpeg",
				"created": 1476986502,
				"notes": "Section: Big Trucks Row: 116 Space: 2 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476990004,
				"id": "6EE77579E9DC915648AC0D565DCF172EB4C25EF0AC5708A211DB615A9A3531BD",
				"timeago": "12 hours ago",
				"arrived": 1476946800,
				"caryear": 2000
			},
			"updated": 1476986644,
			"id": 119840,
			"timeago": "1 hour ago"
		},
		{
			"distance": 111.556244,
			"created": 1476982940,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-7586-916999.jpeg",
				"created": 1476982781,
				"notes": "Section: Trk &amp; Van Row: T Space: 7 Color: Other",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476989985,
				"id": "14A1147F4510542D4989092FD982E9007C5E8B75A3C59B9D96DD1986047718BF",
				"timeago": "12 hours ago",
				"arrived": 1476946800,
				"caryear": 2000
			},
			"updated": 1476982940,
			"id": 119825,
			"timeago": "2 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476979335,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-7783-953384.jpeg",
				"created": 1476979183,
				"notes": "Section: Primo Trk Row: M Space: 3 Color: Green",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476989985,
				"id": "E78F2C090CC91AF4E0F1963E61DBD3241323B2B0521747EED3A22E3B84F21CF7",
				"timeago": "12 hours ago",
				"arrived": 1476946800,
				"caryear": 2001
			},
			"updated": 1476979335,
			"id": 119756,
			"timeago": "3 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13421-970214.jpeg",
				"created": 1475002833,
				"notes": "Section: TrucksVans Row: A Space: 13 Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475096431,
				"id": "022E1569CF4E6F2AE5DAB4DD2C6748186360A1C9193CE119ED9721FE649EB256",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119401,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10984-976330.jpeg",
				"created": 1474657255,
				"notes": "Section: FORD Row: F Space: 2 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1474819281,
				"id": "026362A930B64306CFB8C1C436116AAFB9D8E0D5186E45A3ABA49F6EFB996643",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119328,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18397-1014441.jpeg",
				"created": 1476907197,
				"notes": "Section: A- FORDS Row: 28 Space: 12 Color: Black",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476990001,
				"id": "05A30E6A0D6678471C5FB37433740722225B5820CE04167B04211383BAAE7D40",
				"timeago": "1 day ago",
				"arrived": 1476860400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119264,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10907-970178.jpeg",
				"created": 1474657255,
				"notes": "Section: FORD Row: I Space: 2 Color: Green",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1474819281,
				"id": "06CE90FEE1BD1A25283B8B46E3B1207A19EA246F3BC52729205357619283F646",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119329,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16141-984581.jpeg",
				"created": 1476486015,
				"notes": "Section: SM Truck Row: 1 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1476727207,
				"id": "0860EC655EA35D1A6EE331C5C8BA7C678E9398DB267BE26325933C9FEB23A04B",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119295,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11883-1073530.jpeg",
				"created": 1476836580,
				"notes": "Section: Trucks/SUB Row: J Space: 3 Color: Red",
				"car": "Ford Escape",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476975602,
				"id": "087431E574C9E2B26908A1FA73EA10C6758FCC50FD74E24992FBB27981BBA8C3",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119330,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26137-993816.jpeg",
				"created": 1475863218,
				"notes": "Section: Import 1 Row: F Space: 6 Color: Green",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475866819,
				"id": "096D136629291CEA59CA7D11F50F78979D8B66A1A17FC41ACD1446DBD3C99309",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119370,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16238-993546.jpeg",
				"created": 1475359242,
				"notes": "Section: Ford Row: 8 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475614836,
				"id": "0AF0E6C14797B31765162592B24B8E5A69FCA5AC97DD46B85B46735A9C4DABBA",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119296,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-23822-921240.jpeg",
				"created": 1474992050,
				"notes": "Section: P-American Row: I Space: 3 Color: Gold",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475071250,
				"id": "0B2F50DAA747D048F601F785F92C0E72881F148B831425A8C81E051A4E968622",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119347,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-6167-716910.jpeg",
				"created": 1475798446,
				"notes": "Section: Primo Car Row: A Space: 8 Color: Red",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1475859610,
				"id": "0B482878CEABC1429E633CE9C744A9829E23A82083E13EB84F7D2C1F1C3E58E9",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119434,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18549-1025322.jpeg",
				"created": 1476565302,
				"notes": "Section: D- SUV SM Row: 10 Space: 8 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476759608,
				"id": "11025A08FDDEED0227D7B1D382E4EAECFDCC42F2FB37DF415DC5E1CC8E39D848",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119265,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18201-996031.jpeg",
				"created": 1476388829,
				"notes": "Section: D-SUV/VAN Row: 16 Space: 5 Color: Red",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476532828,
				"id": "11129576067547236944D11F8995055C465BCB030C585E9C6B84FAA6190F9A48",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119266,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-6374-744734.jpeg",
				"created": 1475776828,
				"notes": "Section: Ford Row: B Space: 3 Color: Black",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1475780434,
				"id": "12964DD13E27F050C6559E56AC9A53C836C3352AF38FCA5B449A1563A9135A58",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119435,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-23462-899800.jpeg",
				"created": 1476734386,
				"notes": "Section: R-TrkVnSUV Row: L Space: 4 Color: White",
				"car": "Ford E-250 Econoline",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476810086,
				"id": "12DF38D2952E8DAD613BE21E935CDCF2833377D2B868D1D69313545357366221",
				"timeago": "3 days ago",
				"arrived": 1476687600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119348,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13589-985132.jpeg",
				"created": 1475168444,
				"notes": "Section: Ford Row: D Space: 7 Color: Gold",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475254829,
				"id": "12F75C89CA3DE1C04BACBFB9749066E45B11E3408222D28103092C99A1F6DDE2",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119402,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15915-961579.jpeg",
				"created": 1475089243,
				"notes": "Section: SM Truck Row: 11 Color: Purple",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475186448,
				"id": "139F8070E043FD12CB3EFE8AD5239EDE013ED96D9E7BCAC25E8812B051A57D74",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119297,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-6041-313240.jpeg",
				"created": 1474653656,
				"notes": "Section: D- VAN SM Row: 13 Space: 14 Color: Blue",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1474747253,
				"id": "1602A3C4CFEB82A5C67AB8A298849966749EFEC49892CAEA2BA2F802F6AB0CA9",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119267,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13851-1017558.jpeg",
				"created": 1475863219,
				"notes": "Section: Ford Row: H Space: 7 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475946017,
				"id": "172046238E46A89B16EE63D27E99260186E53FD0B63A2823E6DAE2236CC5E3ED",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119403,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17892-969249.jpeg",
				"created": 1475686912,
				"notes": "Section: D- VAN SM Row: 12 Space: 10 Color: Gold",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475769644,
				"id": "17969345C046D9CDB3272E541E28648CDF4CAF59C5973097413539B60E28E57E",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119268,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13861-1018568.jpeg",
				"created": 1476385208,
				"notes": "Section: TrucksVans Row: A Space: 5 Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476550796,
				"id": "18783CE53F76EAB89E5E3C010C37137694897AB38A82E3FC185C0986AEAED3F3",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119404,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18458-1018104.jpeg",
				"created": 1475953228,
				"notes": "Section: A- FORDS Row: 24 Space: 16 Color: Blue",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476021691,
				"id": "1890ECC7292391995E2381F9D7ABCA1FD5552D9F730318475D230946DDA79BA0",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119269,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10880-968498.jpeg",
				"created": 1475892036,
				"notes": "Section: FORD Row: F Space: 6 Color: Gold",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476126086,
				"id": "1C6A95EA40C932D99BC81ACCA3F482E7D78F42DC6E094107E5B4C19E91E28FE1",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119331,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12309-1008617.jpeg",
				"created": 1475766035,
				"notes": "Section: RFOR Row: M Color: Red",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476194434,
				"id": "2560D19C4D6C39097C3F162337BE8E0313C59BC30F766BD5D7734922407312C4",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119442,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26153-994033.jpeg",
				"created": 1475424020,
				"notes": "Section: Ford Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475625622,
				"id": "2857999ACFF2A40F67E0AEA5E8D1DBCEF4BC1E2ED080DFA87201E4D56566196D",
				"timeago": "18 days ago",
				"arrived": 1475391600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119371,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12765-1062082.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM/ TRK Row: C Color: Silver",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "2C8F8D2AB40C3E05E18AFE89AB99CF88F3EEF897CB44E0BB62A5ACA8CE9E8223",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119443,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119444,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11576-1037958.jpeg",
				"created": 1476237621,
				"notes": "Section: FORD Row: B Space: 8 Color: Green",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476813592,
				"id": "2E29B276885EA9FF04672E270721AF59770F423DA94F83E59907721EF50C52A7",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119332,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18040-980355.jpeg",
				"created": 1476223318,
				"notes": "Section: B-TRUCK BG Row: 18 Space: 2 Color: Purple",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476370811,
				"id": "2E9E39D2A5509D5203D76E72E68709EE6735E41FF9F665E7166CFA1A8F927D73",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119270,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26766-1029343.jpeg",
				"created": 1476115206,
				"notes": "Section: Ford Color: Red",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476381600,
				"id": "304102E5B12C1DB81A6AA108C3812C8C33F2838C79BE6C31521CF2B4D1F5CBF3",
				"timeago": "10 days ago",
				"arrived": 1476082800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119372,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-7790-953669.jpeg",
				"created": 1475798446,
				"notes": "Section: Primo Car Row: B Space: 7 Color: Other",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1475859610,
				"id": "3188D02AB3D31EF6585575C0198D9F2E80398232356BA01D36E0208E9C0567C3",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119436,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12465-1029237.jpeg",
				"created": 1476810087,
				"notes": "Section: RDOM / TRK Row: L Color: Red",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "3678E1E0F42466CE44CB8349FDE8CF64E3DD1CA45EC1DA07FFAFBB51B5BDC244",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119445,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26271-997597.jpeg",
				"created": 1476835191,
				"notes": "Section: Ford Color: White",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476975590,
				"id": "369FF7B798DAE56DCDD2AA56E9AD508147BF3AB887ED61DD3590A0D73B4BC0A1",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119373,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12659-1051372.jpeg",
				"created": 1476810087,
				"notes": "Section: RDOM / TRK Row: L Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476824480,
				"id": "372770F9266FAF2B006B6164BF1D279B941FEA5FAD1CE851E04A8B3E33D5972B",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119446,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13335-954155.jpeg",
				"created": 1474761646,
				"notes": "Section: Ford Row: B Space: 6 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475010045,
				"id": "3734C5D4A0F33BA4F303AA4DB6F0B07972F3C98941C7C9A9078A74A3CDF3D303",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119405,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12024-968064.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM / CAR Row: F Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "39F342539E50E5486B725768F611187A0E4094D7072510482D2761346DB78676",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119447,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-14049-1033685.jpeg",
				"created": 1476309602,
				"notes": "Section: Ford Row: K Space: 5 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476550796,
				"id": "3B656BEB62DA8DA6B28F36AB95561C3CF70DB6535685D4ED3336ADC0CC6CF248",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119406,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12613-1046109.jpeg",
				"created": 1476284401,
				"notes": "Section: PDOM / CAR Row: G Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476453621,
				"id": "3D7E24F29D527485682666484DC6AB45184FEB132F6646DE251CF20F85920683",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119448,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12474-968239.jpeg",
				"created": 1475020857,
				"notes": "Section: Truck/SUV Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475193655,
				"id": "4077A759BB0DD5C8BF56053E59EB23C3AEBA28953F0F7D2C3C38C82BB51F38B0",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119313,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-24605-912380.jpeg",
				"created": 1474498843,
				"notes": "Section: Import 1 Row: D Space: 14 Color: Blue",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474581673,
				"id": "40ACD82CCCC6E0DA00EF34FF010ADCEA87FA916657115B48FEA853635EE0CE1B",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119374,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24448-958703.jpeg",
				"created": 1475082039,
				"notes": "Section: P-American Row: H Space: 4 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475157637,
				"id": "440D3952754500E40BFF83A0CD3B82294779150D6C6FB21EB55EA58D26A4FF80",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119349,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13415-969305.jpeg",
				"created": 1474761646,
				"notes": "Section: TrucksVans Row: G Space: 10 Color: Silver",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475082034,
				"id": "44B9C8FC848B2ED8E53BE3C4130131EEDF496023DD6829A3942ECB8100DFF0CD",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119407,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26316-1001755.jpeg",
				"created": 1476572411,
				"notes": "Section: Ford Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476759593,
				"id": "453836756985F968B865E35901F5FF42A89501534F498CA329AA214C7AFAF1D2",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119375,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13526-979481.jpeg",
				"created": 1474761646,
				"notes": "Section: Ford Row: C Space: 8 Color: White",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475082034,
				"id": "4552520574A480CC72BAC25AF674D26DCBCDCE33AEAF2C797D360C44F67A70B2",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119408,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25677-967867.jpeg",
				"created": 1475870421,
				"notes": "Section: Import 1 Row: C Space: 1 Color: Red",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475964017,
				"id": "45E79DCFF6EE5FD3BC75E22ED0A1E1CAAF7611267E5E4B36467893E08672249D",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119376,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13265-948878.jpeg",
				"created": 1475362834,
				"notes": "Section: Foreign Row: F Space: 6 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475600418,
				"id": "47150B3A2E39841E2DA545EBF8C7D24A67B75C043684EAA700CBEF9FBE773C59",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119409,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12696-1051494.jpeg",
				"created": 1476810087,
				"notes": "Section: RFOR Row: K Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "4A5738978B03043F959F07E0301267EDC0AE8EA94A53775E1AFA908ACD9ABA1A",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119449,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24597-967964.jpeg",
				"created": 1475085647,
				"notes": "Section: R-ForMrLin Row: F Space: 4 Color: Red",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475164840,
				"id": "4A8EC54AC1D133CBC81C5A0F0075FB7420961615C4F0105B0778ACD6F88516F2",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119350,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15644-939164.jpeg",
				"created": 1474653657,
				"notes": "Section: Ford Row: 7 Color: Blue",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1474747255,
				"id": "4AC14B597452202F3E395BCE2AF6886CB38F9A1FBC790CDC53B8B8396E62EE12",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119298,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25925-979939.jpeg",
				"created": 1476054014,
				"notes": "Section: Ford Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476054014,
				"id": "4C489E860494084FF888988B82057D09D55A811A8E3D2A8CC9B3DEB099581296",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119377,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10614-938895.jpeg",
				"created": 1474657255,
				"notes": "Section: FORD Row: A Space: 2 Color: Black",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1474819281,
				"id": "4D0855D474F8554F8256A8E36F6A9A2679FFB3753436C4410A6B3BD049A9A629",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119333,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10930-970896.jpeg",
				"created": 1475892036,
				"notes": "Section: FORD Row: C Space: 6 Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476126086,
				"id": "4D1DD8EA77AD70BBEC06E6C35BC5611662A28DFC4E31B96D5BE1629F11D3F09D",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119334,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13810-1010586.jpeg",
				"created": 1476205213,
				"notes": "Section: TrucksVans Row: G Space: 6 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476223300,
				"id": "4F3BB3DB845E01F9DE26C96655D72235E7DD2D563942630F84D55C3985469699",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119410,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-11913-953453.jpeg",
				"created": 1474912838,
				"notes": "Section: RFOR Row: N Color: Blue",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1474988451,
				"id": "4F57918790332F4E5321DC8F6AB697619411EF0AC931BE435A426DFE1899C808",
				"timeago": "24 days ago",
				"arrived": 1474873200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119450,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16720-1037302.jpeg",
				"created": 1475856031,
				"notes": "Section: Ford Row: 9 Color: Black",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475953229,
				"id": "4FEC3A9587A05ED777A90942ABCDFA98C398E73FCFF9C3A91260973F5AFD7B06",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119299,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119451,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18046-981717.jpeg",
				"created": 1475168456,
				"notes": "Section: A- FORDS Row: 23 Space: 14 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475251260,
				"id": "5063FC80EBF59F0311DC42FA8693936BC4AF846ADC387039E14163AFA8961AD3",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119271,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25910-1048306.jpeg",
				"created": 1476374420,
				"notes": "Section: P-TrkVnSUV Row: N Space: 6 Color: Silver",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476460883,
				"id": "52DDA741193F0B50670ED1D4476292DFA78EC74609831F6A13DB566B026AECD7",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119351,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24209-944224.jpeg",
				"created": 1475186439,
				"notes": "Section: R-ForMrLin Row: D Space: 10 Color: Red",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475330423,
				"id": "536AA8A326EC54B61AF60607A04B27F436733F8671AAF3DDE8CE44C307431128",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119352,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-23867-923590.jpeg",
				"created": 1475082039,
				"notes": "Section: P-American Row: H Space: 5 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475157637,
				"id": "53E4A795AD3D7CED56A83F39454D7EB2A63DBDAE16B2A8EFFB45B3B79CD49ADC",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119353,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26215-995635.jpeg",
				"created": 1476460879,
				"notes": "Section: Ford Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476568897,
				"id": "54A918FBB6123F0219EF842DD9FC68B6EA0E3DF771F3A58C516804ECB9D19A6B",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119378,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-14303-725093.jpeg",
				"created": 1474578054,
				"notes": "Section: A- FORDS Row: 27 Space: 9 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1474653656,
				"id": "55A255357A62BB8D807E58F76FF8280235BD7B0B6FE3DAD78C67FB5C960F61EF",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119272,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15478-922813.jpeg",
				"created": 1475794865,
				"notes": "Section: Ford Row: 9 Color: Yellow",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475949621,
				"id": "56F5474A03A0617A8CB5A3A09AB028F86DDC1C0B078C2C7DFE5D5E49CEE1E088",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119300,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25762-970725.jpeg",
				"created": 1475769628,
				"notes": "Section: Import 1 Row: C Space: 13 Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859612,
				"id": "57442DC227E0C5D067792ED613E9A6059323C5B3D9670B4E686C31A6013EE85A",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119379,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18805-1052279.jpeg",
				"created": 1476896741,
				"notes": "Section: D- VAN SM Row: 11 Space: 1 Color: Red",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476982797,
				"id": "574B3887C827FB44D37E8792E1E1528FE3C76894E1D4BC53B0524B69DBE2D771",
				"timeago": "1 day ago",
				"arrived": 1476860400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119273,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12403-1023425.jpeg",
				"created": 1476201621,
				"notes": "Section: PDOM/ TRK Row: D Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476284401,
				"id": "58DB45BD68178ADD1B4F00F09D91CD97F66A8018299C2C407A5DBE03D5E94770",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119452,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26988-1041173.jpeg",
				"created": 1476118811,
				"notes": "Section: Ford Color: White",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476129611,
				"id": "5A00DB223D8516EA577C26F5A972B613C36A4068871FDA8206EBEC6C8306E75C",
				"timeago": "10 days ago",
				"arrived": 1476082800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119380,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26760-1029259.jpeg",
				"created": 1475870421,
				"notes": "Section: Import 1 Row: C Space: 14 Color: Other",
				"car": "Ford Excursion",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475964017,
				"id": "5A54F52CE26005DC2EE3EF42A69C5375916711BEA9C2BBDE487F56ADE04DB3CD",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119381,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17894-969325.jpeg",
				"created": 1475168456,
				"notes": "Section: A- FORDS Row: 23 Space: 1 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475244063,
				"id": "5F0678DFAD198C31B1036DCF5F6C0D7B116CE44253209B51B7DFFDE35B16CAC5",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119274,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11488-1022987.jpeg",
				"created": 1475632825,
				"notes": "Section: Trucks/SUB Row: O Space: 8 Color: Black",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1475859619,
				"id": "60D848E0565376EEBFA406BA73AEA63BBD957F0ACECDFFCCEA6ECBEAAFBD4393",
				"timeago": "16 days ago",
				"arrived": 1475564400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119335,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-22341-840998.jpeg",
				"created": 1476550797,
				"notes": "Section: P-American Row: E Space: 1 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476719999,
				"id": "60E59526BA6F6795A1CDBF2E42421CD9E258880EBD3295E004916854F89AD150",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119354,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16240-993571.jpeg",
				"created": 1475618439,
				"notes": "Section: SM Truck Row: 3 Color: White",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475773250,
				"id": "6189B7B70D40EF3F7909403B7BB8913DBC45C69F1D3F253727B3B1FC9483B6AC",
				"timeago": "16 days ago",
				"arrived": 1475564400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119301,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-12904-920099.jpeg",
				"created": 1474570868,
				"notes": "Section: Ford Row: A Space: 3 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474740048,
				"id": "6206B9ED1FC1F96F1BF714F776D963F3ED8AE8D220ECA3D4D039401CCA845418",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119411,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13970-1028183.jpeg",
				"created": 1476050418,
				"notes": "Section: Ford Row: J Color: Black",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476201618,
				"id": "62AB09EE15E781CC0C219D9F6450A02836A7AF19436395B5FA7CB55E76CD4C00",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119412,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-6189-721296.jpeg",
				"created": 1475863216,
				"notes": "Section: Primo Trk Row: K Space: 2 Color: White",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1475863216,
				"id": "632ECEC801EAB07CE3D0BE853BA8771A7A29C7E515C1051C1DBDBDF8BF6A969A",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119437,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-11959-957837.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM / CAR Row: F Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "638678AC8FF5B9CF16E18A199D947E5680F31F79774974999891E2BDBE8C27CA",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119453,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17731-958791.jpeg",
				"created": 1474488052,
				"notes": "Section: A- FORDS Row: 22 Space: 15 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1474578055,
				"id": "6693AF0BDFE427A4FB7AF3385C2498F0A8982A6DC84E9ED1773C6F91BC9044F7",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119275,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24893-987532.jpeg",
				"created": 1474992050,
				"notes": "Section: P-American Row: I Space: 6 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475071250,
				"id": "670B8D1EE29B3ACADCA053487685152F2CF8F35E8A5409EF1B68935013E74224",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119355,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26116-993275.jpeg",
				"created": 1476057684,
				"notes": "Section: Ford Color: Gold",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476111622,
				"id": "673C74361000B448023E6C76510BA2285E5124AE8D18A69745AA23074B26D6DA",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119382,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17627-949625.jpeg",
				"created": 1475424030,
				"notes": "Section: A- FORDS Row: 29 Space: 8 Color: Red",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475679703,
				"id": "673EDB0F9C31EEBD7777A599DE33CD4ADB7E3AFE6C82E0E3FD6D5E6BCA72CDE1",
				"timeago": "18 days ago",
				"arrived": 1475391600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119276,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12830-1007778.jpeg",
				"created": 1475895643,
				"notes": "Section: Ford Color: Brown",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1476140431,
				"id": "691C590A06A19779F9EAF87D1C482F1D32EF9BF12B8AEABE43947C4F206AC8E9",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119314,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "",
				"created": 1476810083,
				"notes": "Section: Ford Row: F Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476831591,
				"id": "6A3CB73E5DD0E4A7227400A1FB05BE01A541FDED4AC4DBA6A8B0FC802D2DA93F",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119383,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12778-1002590.jpeg",
				"created": 1475895643,
				"notes": "Section: Ford Color: Red",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1476140431,
				"id": "6C1EFEF0F4A1BC7869E951ABE7FD179D844CBD7207A2A38C92BE0EB2539E5F97",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119315,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12774-1002284.jpeg",
				"created": 1475114444,
				"notes": "Section: Ford Color: Silver",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475330430,
				"id": "6F00EC2F5F02A38E8A067AE16DE517535396C7FC6D2227F5F4D0438AB11AC852",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119316,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26809-1031669.jpeg",
				"created": 1476118811,
				"notes": "Section: Ford Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476381600,
				"id": "72A2104DA231AC6F4D3342C04C0236166535AE7CC3BAEAF453999DF0F6178F61",
				"timeago": "10 days ago",
				"arrived": 1476082800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119384,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18507-1021001.jpeg",
				"created": 1476388829,
				"notes": "Section: D-SUV/VAN Row: 16 Space: 3 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476536476,
				"id": "73A0FB0E223DE0F740CB681BCABD9C3EF23B01BD4A22033F86F4CE30D35BE982",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119277,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16317-1001962.jpeg",
				"created": 1475794865,
				"notes": "Section: Ford Row: 9 Color: Other",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475946034,
				"id": "73C4BBFF0AC81CF31D0E7B10DCC20D1EB14757B330E3E5697862CA2F48DE6C75",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119302,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24784-979281.jpeg",
				"created": 1475766030,
				"notes": "Section: P-TrkVnSUV Row: A Space: 2 Color: Gold",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475784033,
				"id": "751B652D8C51957F4EDAAE269F65CF6062C143EF8DA9B80176799E78F5F0BAE0",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119356,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-10355-516116.jpeg",
				"created": 1476561619,
				"notes": "Section: D- SUV SM Row: 10 Space: 15 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476633595,
				"id": "77AF2FE47AF0222AF701B20DD92541C39F212D06651F26ED8EA3B1A15A72BA6F",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119278,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18748-1046289.jpeg",
				"created": 1476637195,
				"notes": "Section: A- FORDS Row: 25 Space: 3 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476896741,
				"id": "7833632135F9369C8FA0B2B8D1D7609032E4A4F4B263D96FAD1FB1C13EBDA40A",
				"timeago": "4 days ago",
				"arrived": 1476601200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119279,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119454,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17643-953174.jpeg",
				"created": 1474491657,
				"notes": "Section: A- FORDS Row: 22 Space: 9 Color: Purple",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1474578054,
				"id": "7AA686759E7CD68C85D91285CEBE4E026E0EB8F9EEE15E4A66965CEED5573B74",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119280,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-23410-897325.jpeg",
				"created": 1475082039,
				"notes": "Section: P-American Row: H Space: 9 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475157637,
				"id": "7B1C07FF0547C78CCF8A3A5D5A06B17D18C0B8DE785D50B55EDCFB5E54B1F1C6",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119357,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25441-952720.jpeg",
				"created": 1475190033,
				"notes": "Section: Import 1 Row: D Space: 14 Color: Gold",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475344827,
				"id": "7C0F7E90F51B048F7469673EB64AF38315CD43370C878FEBA87AD4C7FE03C2A5",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119385,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18302-1006444.jpeg",
				"created": 1475679703,
				"notes": "Section: D- SUV SM Row: 7 Space: 4 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475766043,
				"id": "7CB5B9E3DBBF398F0905A34470D2E90A3EB3223E3EAE16927019AE7592C946A0",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119281,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16574-1023040.jpeg",
				"created": 1476723603,
				"notes": "Section: Ford Row: 11 Color: Other",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1476819173,
				"id": "7CB88FC5E2E2CDA52EB7463B3975E9A5D71C69DCE4CD3DEFC5DC9E18E433AB71",
				"timeago": "3 days ago",
				"arrived": 1476687600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119303,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13823-1014082.jpeg",
				"created": 1475863219,
				"notes": "Section: Ford Row: H Space: 6 Color: Green",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475884832,
				"id": "7DC88BF33B45E588B4D22AF19C573F2A8859AF04A21BD3FE17B2240A3711DEFF",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119413,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25323-947159.jpeg",
				"created": 1474412446,
				"notes": "Section: Import 1 Row: L Space: 9 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474495247,
				"id": "7FD82C4DFFB6459D8F785CF0D417C5E8A887B0F92BA4044A01CBD8E51830A729",
				"timeago": "1 month ago",
				"arrived": 1474354800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119386,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25900-978831.jpeg",
				"created": 1476115206,
				"notes": "Section: Ford Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476381600,
				"id": "8257ADE6294BED2940714C5E9C76274A45C4E07ADCEC8A24B0F7DDD7B6A3FAF6",
				"timeago": "10 days ago",
				"arrived": 1476082800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119387,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15074-887545.jpeg",
				"created": 1475866834,
				"notes": "Section: SM Truck Row: 6 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475960424,
				"id": "828CA23EDD041C132F4FDEED814DE36D8BE8AA64BEC6DBCAB016C47D4BC7325C",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119304,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12825-1007476.jpeg",
				"created": 1475895643,
				"notes": "Section: Ford Color: Black",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1476140431,
				"id": "8543C6638EB99D71B5F974A2DB24E88BC9703ED027DBE880C007F62CCE4452B1",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119317,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13823-1014082.jpeg",
				"created": 1475791246,
				"notes": "Section: Ford Row: H Space: 5 Color: Green",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859613,
				"id": "88AA757F8A5CF5241DE1C525A52BCA6A699DFF414EC634ADEB1C380308D647A3",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119414,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13343-956208.jpeg",
				"created": 1474761646,
				"notes": "Section: TrucksVans Row: G Space: 7 Color: Green",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475010045,
				"id": "88AE7876DAF8E800679E28F430D4D84084259EFFAC56D5197C836A4691FF0784",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119415,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12020-966525.jpeg",
				"created": 1474470055,
				"notes": "Section: RFOR Row: O Color: Blue",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1474552858,
				"id": "89D6A752BFD7827AC39ADCB57CCA1F878D4F727114522A940378180EA40E80E6",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119455,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13314-953079.jpeg",
				"created": 1474570868,
				"notes": "Section: Ford Row: A Space: 7 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474740048,
				"id": "8AD61D5CC1B6E7FE6E18CAA328B4174DAFBD74CAF1F0A3BFAF5A6DA212D3EAE9",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119416,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10617-938992.jpeg",
				"created": 1474822852,
				"notes": "Section: FORD Row: N Space: 2 Color: White",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1474930858,
				"id": "8C8650CFCB4307E749102CF55E012F1650D11EB364FA54EBAABF9AC1D095E5F7",
				"timeago": "25 days ago",
				"arrived": 1474786800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119336,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13022-928199.jpeg",
				"created": 1474650052,
				"notes": "Section: TrucksVans Row: E Space: 5 Color: Green",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474740048,
				"id": "8EBF123DCB130AB49F0A5E1E2F79A8B2098DE6C4102DDF5F0330C92B941C3FF5",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119417,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25991-983713.jpeg",
				"created": 1476057684,
				"notes": "Section: Import 1 Color: Blue",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476111622,
				"id": "905D52FE8723DC7BA23E4D04A54217FEC5E6967FB57A15563FAA60618E0ECD58",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119388,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25260-943672.jpeg",
				"created": 1474675251,
				"notes": "Section: Import 1 Row: D Space: 16 Color: Green",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474822844,
				"id": "911F3797AAB6A79736B37C26E1468B4E1B9D0B97340F09BDF19AFDA25268E460",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119389,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12252-1000811.jpeg",
				"created": 1476201621,
				"notes": "Section: PDOM/ TRK Row: D Color: Gold",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476284401,
				"id": "9410B6F89ED24E8BE27A0CD6460DB5F4D853B5C0FE84EF807E0AF9630D19D3E0",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119456,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-12508-883399.jpeg",
				"created": 1475694013,
				"notes": "Section: Primo Row: C Space: 2 Color: White",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859613,
				"id": "95390534A6B4E9BCF77D2A3E0EA02D724DEC2934289AAEFB818D79F6090CAA68",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119418,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-24441-903396.jpeg",
				"created": 1474675251,
				"notes": "Section: Import 1 Row: I Space: 4 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474819269,
				"id": "969C63989C76FF431EB2113417822D449B1A0FAB3C8F3D55743FA43D323AF044",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119390,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12894-1015825.jpeg",
				"created": 1475542839,
				"notes": "Section: Truck/SUV Color: Red",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475708420,
				"id": "96C8EA55C8849D6B967928D75C4CF3C9E78868D46B547564C2259293D665497A",
				"timeago": "17 days ago",
				"arrived": 1475478000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119318,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119358,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-7950-988802.jpeg",
				"created": 1475877623,
				"notes": "Section: Primo Car Row: F Space: 3 Color: Other",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476370797,
				"id": "98F1ABABA309F8E696608962088A78DCF999F1C0575073BE664A124B414B0F15",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119438,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13474-974803.jpeg",
				"created": 1474761646,
				"notes": "Section: TrucksVans Row: F Space: 13 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475010045,
				"id": "99EA47A0C3A2664497B4D23348B84489895044D4E71286B11D809AC5CAACB583",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119419,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11864-1069697.jpeg",
				"created": 1476836581,
				"notes": "Section: Trucks/SUB Row: I Space: 3 Color: Maroon",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476971998,
				"id": "9C35826D73894CCF52500D42F70293EC23EE444F1539A21F9F95BB08DECA2C18",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119337,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-8019-1006859.jpeg",
				"created": 1476723581,
				"notes": "Section: Primo Car Row: I Space: 8 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476975588,
				"id": "9D9E1F124F7A4737ABE5C4F40D5607379DA983CD6AFFDA5AF4321DF11532E230",
				"timeago": "3 days ago",
				"arrived": 1476687600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119439,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11288-1004347.jpeg",
				"created": 1475107237,
				"notes": "Section: Trucks/SUB Row: K Space: 4 Color: Yellow",
				"car": "Ford Escape",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1475262034,
				"id": "9EE19CFA5B7352AD34E7666F8E6D69D991AFE14777FF5505357D3FCA7A25B4EC",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119338,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16773-1040798.jpeg",
				"created": 1476720015,
				"notes": "Section: SM Truck Row: 2 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1476759610,
				"id": "9EED2DD6EB6ECF09DD9AA80AE114B701AE2471AC0987F191E006CD8A690FCE3F",
				"timeago": "3 days ago",
				"arrived": 1476687600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119305,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-8044-1011688.jpeg",
				"created": 1476374415,
				"notes": "Section: Primo Car Row: P Space: 2 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476719993,
				"id": "9FC3809D7DF5FB55BE0F6F6EBFB5B0D4BE17A30A92DED73B7FDB70F9A166FA45",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119440,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25600-1030556.jpeg",
				"created": 1476370802,
				"notes": "Section: P-TrkVnSUV Row: O Space: 1 Color: Black",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476464410,
				"id": "A30CE18E89587DA0E2677AE411B4413A3FA793E22A1A03C7A0F16441C54089A8",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119359,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24701-974567.jpeg",
				"created": 1476122419,
				"notes": "Section: R-ForMrLin Row: I Space: 7 Color: Gold",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476288008,
				"id": "A30EA24050E045A9D44B571C7A9D207FDA76B7F94B444B90B17639DE42940085",
				"timeago": "10 days ago",
				"arrived": 1476082800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119360,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18003-977967.jpeg",
				"created": 1475168456,
				"notes": "Section: A- FORDS Row: 23 Space: 15 Color: Blue",
				"car": "Ford Contour",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475251260,
				"id": "A3E7527DC8C63BCCF7FB2E4E8AA37508A768BB02121854D8EC07550A03763560",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119282,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13508-978000.jpeg",
				"created": 1475618425,
				"notes": "Section: TrucksVans Row: C Space: 7 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475769630,
				"id": "A550A3B60B145E9AD9F7A62B5B97B32A1B90E336775C89117D6E7ACD39C8CBE8",
				"timeago": "16 days ago",
				"arrived": 1475564400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119420,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11625-1044458.jpeg",
				"created": 1476237621,
				"notes": "Section: FORD Row: A Space: 8 Color: Gold",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476813592,
				"id": "A62D17D51F769ABE71F52F59F0A7EFD14A6E347197D10358702D791115547972",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119339,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25524-957732.jpeg",
				"created": 1475424020,
				"notes": "Section: Ford Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475625622,
				"id": "A7B70731B3E69A34AA6AFE2C6BF36CE035A03A2CAC6D44A940B57FCB436188A2",
				"timeago": "18 days ago",
				"arrived": 1475391600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119391,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17877-968450.jpeg",
				"created": 1474995648,
				"notes": "Section: D-SUV/VAN Row: 17 Space: 6 Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475082046,
				"id": "A7C3BD01B43CCEB891A9EA78ADEB8854C066EFA5F86BC6E6E5B498AB7E64962D",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119283,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-10898-969988.jpeg",
				"created": 1474423268,
				"notes": "Section: FORD Row: N Space: 1 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1474653653,
				"id": "A8DD487FD6002000B9BAB9132F8802AA221F4270918C5909E5E6C0B07F53B6DE",
				"timeago": "1 month ago",
				"arrived": 1474354800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119340,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12673-1050019.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM / CAR Row: F Color: Gold",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "A9BD1D2538B21DEB6EBEA2731D9FCB3C74A8E3E26FC4C754EEA42E896A85E30F",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119457,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13803-1008548.jpeg",
				"created": 1475791246,
				"notes": "Section: Ford Row: H Space: 4 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859613,
				"id": "A9E6645DAAE9D74E70592664480431FFEA8ECC9AEF9FECFC5F91F00BE5F9CD34",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119421,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-14101-1038494.jpeg",
				"created": 1476554403,
				"notes": "Section: Ford Row: L Space: 6 Color: White",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476633586,
				"id": "AA25FF5DE3EF7C22FE1B6361F00EB0726361E87FDF5B7920B3B48835BD4A00D9",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119422,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-14381-826454.jpeg",
				"created": 1475708426,
				"notes": "Section: SM Truck Row: 4 Color: White",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475852424,
				"id": "AB5D32BD9723D2B2A07AD5CAF774F1F8C2D1A5178665DAD88F1B8433E550F443",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119306,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13432-971184.jpeg",
				"created": 1474761646,
				"notes": "Section: Ford Row: C Space: 6 Color: Red",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475082034,
				"id": "AC12FD5C7F9517BC184F45C7A71765B55C54EDCDC4545FF208EF0BBE9F44C64C",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119423,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16224-991977.jpeg",
				"created": 1475272843,
				"notes": "Section: Big Truck Row: 1 Color: Red",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475517635,
				"id": "B1BD75AC69533DB26551E42A6D1C2C7B7A7FEEFDC0869A85655184C0073B4C74",
				"timeago": "20 days ago",
				"arrived": 1475218800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119307,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12384-1023238.jpeg",
				"created": 1476288010,
				"notes": "Section: RFOR Row: L Color: Green",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476453621,
				"id": "B1C96B53803181A2948F97EC26BA97693E404171C59AF0204F1EEA4D96FDD58F",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119458,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18075-985031.jpeg",
				"created": 1475168456,
				"notes": "Section: A- FORDS Row: 23 Space: 12 Color: Green",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475251260,
				"id": "B2F6A89993D0F882BBBFF5DA1FC61424A52D5BFC743FD04E8712C21A65D21285",
				"timeago": "21 days ago",
				"arrived": 1475132400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119284,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16355-1006006.jpeg",
				"created": 1475953229,
				"notes": "Section: Big Truck Row: 3 Color: Other",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1476129624,
				"id": "B3369A9195E9CBDE47C2A603409C12735AEF1A7B71CAA18EA24960184ECE9E4A",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119308,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17771-962182.jpeg",
				"created": 1476475215,
				"notes": "Section: B-TRUCK BG Row: 16 Space: 3 Color: White",
				"car": "Ford F-250 Super Duty",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476547195,
				"id": "B4050F498333FE91C0A658021AB10BB39726AAE73005FCCF2E845D772D690860",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119285,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26014-985225.jpeg",
				"created": 1476057684,
				"notes": "Section: Ford Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476111622,
				"id": "B5BF2CA8B3D86C5BD7B018A694D4323E8FA72E37AC1280C121C322DFD3380567",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119392,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24788-979674.jpeg",
				"created": 1474992050,
				"notes": "Section: P-American Row: I Space: 5 Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475071250,
				"id": "B723386C4FDE52A1069EA3E9621BCF70E985FAF305C5D00F1195DEC446807AF8",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119361,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25480-1023812.jpeg",
				"created": 1475679694,
				"notes": "Section: P-TrkVnSUV Row: A Space: 9 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475701220,
				"id": "B864F91C515DDF815A982B58442FF4E03FAE18C845B83A2317FD374EA0E60D45",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119362,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12853-1009109.jpeg",
				"created": 1475366437,
				"notes": "Section: Truck/SUV Color: White",
				"car": "Ford E-150 Econoline",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475535638,
				"id": "B9D3E0F0CF34C272BB9A631B7FD03F6E56E84732375F5D72E5E34C899AA99008",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119319,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11432-1018029.jpeg",
				"created": 1475542841,
				"notes": "Section: FORD Row: K Space: 5 Color: Red",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1475773246,
				"id": "BA944B6545E577AE3F64A729D2E90984065663D6472ED72C57B0B399BB9E8764",
				"timeago": "17 days ago",
				"arrived": 1475478000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119341,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-24839-921452.jpeg",
				"created": 1474822844,
				"notes": "Section: Ford Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474927240,
				"id": "BA9AF93FB48FC063E0C35986BB955893FC2C3E87C59E726D142E081AC14E1EE6",
				"timeago": "25 days ago",
				"arrived": 1474786800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119393,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-26152-1063102.jpeg",
				"created": 1476899997,
				"notes": "Section: R-ForMrLin Row: G Space: 7 Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476982788,
				"id": "BDEE6DE9AB00D47EA33EA3AEC13B9544DF93A932AB3114F2750B4D59E91AE7B0",
				"timeago": "1 day ago",
				"arrived": 1476860400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119363,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13462-973350.jpeg",
				"created": 1474761646,
				"notes": "Section: TrucksVans Row: G Space: 13 Color: White",
				"car": "Ford E-250 Econoline",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475082034,
				"id": "C1BBBB745F17FB269C7C05C52AE6C05D81256B1EA8A3877F97AF68298BE9AE87",
				"timeago": "26 days ago",
				"arrived": 1474700400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119424,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13479-975134.jpeg",
				"created": 1475258427,
				"notes": "Section: Ford Row: E Space: 3 Color: Black",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475359231,
				"id": "C4D4B178D865184DC52035C647165F7BBE974947F050691337146F4D094E3A6C",
				"timeago": "20 days ago",
				"arrived": 1475218800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119425,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-24996-931379.jpeg",
				"created": 1474822844,
				"notes": "Section: Ford Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474927240,
				"id": "C5F25008BF64128F32192ADAB115A3EA6399D9683B4CEAEFFD9ADCA25885AF8C",
				"timeago": "25 days ago",
				"arrived": 1474786800,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119394,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25322-1014585.jpeg",
				"created": 1475359232,
				"notes": "Section: R-ForMrLin Row: C Space: 8 Color: Black",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475596824,
				"id": "C63312D049432BFC5E78257A92787108EE6DC081430E6BA7F85E099AA582AD78",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119364,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12596-1045507.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM / CAR Row: F Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476989995,
				"id": "C6A83F9C1312559DF701C6AE5F32AF92CEB017CE2CC86E563A5C0F9710E3E803",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119459,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-11832-915529.jpeg",
				"created": 1475334074,
				"notes": "Section: Truck/SUV Color: White",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475535638,
				"id": "C794100C539FFDEFAA49316BF61859DE5BB5175DF9D11F66ABD1AB2CF2ED0883",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119320,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17809-963890.jpeg",
				"created": 1476385231,
				"notes": "Section: D-SUV/VAN Row: 16 Space: 9 Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476532828,
				"id": "C8477C0F521B6EE0082BCC4B54132E4A8F2D83B617B1090E8ADEF8783B9E6337",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119286,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119365,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18776-1048286.jpeg",
				"created": 1476813594,
				"notes": "Section: D-SUV/VAN Row: 17 Space: 8 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476968510,
				"id": "C9D7B0B4539A997E55221C0C918BA896A24A9943FB6737322DC11732CF7E0D86",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119287,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18308-1006710.jpeg",
				"created": 1475784043,
				"notes": "Section: A- FORDS Row: 27 Space: 15 Color: White",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475938834,
				"id": "CB375219B119BB676DEE6632A73D0EE5FA17B86E995961280C60CCC227B7E74A",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119288,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12815-1006577.jpeg",
				"created": 1475366437,
				"notes": "Section: Truck/SUV Color: White",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475535638,
				"id": "CDA9D91B2E273AB671D78DB523A5F96110DF59A7512799BA08B863A6117328A6",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119321,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17736-958958.jpeg",
				"created": 1475956887,
				"notes": "Section: A- FORDS Row: 24 Space: 2 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476028828,
				"id": "CDDBB89CD66057B77B7BB851FA8030AFB1F40BBCE3AAE975BE950FA179A15E5C",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119289,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-24588-967305.jpeg",
				"created": 1474567250,
				"notes": "Section: R-ForMrLin Row: G Space: 9 Color: Maroon",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1474639264,
				"id": "CE451E3E765636436129454EE4C068604D1DB6EBF6693E83C1419CF8EBF61850",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119366,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13740-1001043.jpeg",
				"created": 1475791246,
				"notes": "Section: Ford Row: H Space: 2 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859613,
				"id": "D219D25048769E5A88BC9076B34B7AC3872852BB82CA3AE025BF3A2AD2906463",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119426,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-11920-920388.jpeg",
				"created": 1475114444,
				"notes": "Section: Ford Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475330430,
				"id": "D35576C71070EAD809A73ED92FE2E1823A643143EFFF93790D3DFC9576C18503",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119322,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13963-1027180.jpeg",
				"created": 1476309602,
				"notes": "Section: Ford Row: K Space: 1 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476392406,
				"id": "D4FF726FAB04272D55FFC577E1B0ED4F8C44BA8A3032A185884BD13E60C42C17",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119427,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12773-1001131.jpeg",
				"created": 1475334074,
				"notes": "Section: Truck/SUV Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475535638,
				"id": "D5303C0EFC50E992FFDE98BAD1D3D4AD897CE3A29EC52687CE5D10164D20AA75",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119323,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13851-1017558.jpeg",
				"created": 1475791246,
				"notes": "Section: Ford Row: H Space: 6 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475859613,
				"id": "D736E5E0179A47D2C886B68761A42F92E0E8B579B72349E461C4560E4ED9B002",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119428,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12628-1046490.jpeg",
				"created": 1476810088,
				"notes": "Section: PDOM / CAR Row: F Color: Black",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1476820796,
				"id": "D84027ABFD5A4162B9524E582B1B1D1CCC73D146EB72D868ED12E00CDE8EBB11",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119460,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11322-1008485.jpeg",
				"created": 1475971222,
				"notes": "Section: FORD Row: E Space: 7 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476234123,
				"id": "D88F846D7627F61B072D7FD07033028ADF09FFD9C2CE4842DE224443EE9D4489",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119342,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25062-935335.jpeg",
				"created": 1475017241,
				"notes": "Section: Import 1 Row: P Space: 17 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475164836,
				"id": "D8D3C824879892339C833CCB689EAFE462BD8829A13DE1754AA8F71B3FD52026",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119395,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12572-977876.jpeg",
				"created": 1474509646,
				"notes": "Section: Truck/SUV Color: Brown",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1474596042,
				"id": "D9EDB6FB01CB33EFCDF7ADF6505EAC874F4A6F9AD848FD22726ACB5B07B00BEC",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119324,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15001-880858.jpeg",
				"created": 1474650068,
				"notes": "Section: Ford Row: 7 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1474740058,
				"id": "DA4B08B0C296B2A55938C2593003A4462555220F2D918616F58A7E31839C3173",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119309,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26279-999000.jpeg",
				"created": 1476810083,
				"notes": "Section: Ford Row: F Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476831591,
				"id": "DB22D20295437CA5C09556408CADF2C3C2188198ECB06C8E3E4AF0EE5D172891",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119396,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25630-1032267.jpeg",
				"created": 1476547188,
				"notes": "Section: P-American Row: E Space: 9 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1476716401,
				"id": "E02621604A240F65E9313FC575A05C7F2DAB9DF446406D12C557BF2F61AAB71C",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119367,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25197-941956.jpeg",
				"created": 1474675251,
				"notes": "Section: Import 1 Row: D Space: 10 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474822844,
				"id": "E225FEACE2CC7B3F1AFB753A675D685D8B7B1E40E9614E53B8AEEC02A69A1A49",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119397,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18644-1035761.jpeg",
				"created": 1476464418,
				"notes": "Section: B-TRUCK SM Row: 13 Space: 3 Color: Gold",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476543595,
				"id": "E2B524738CBA4F2116207607D032D77DB52D7D6856D8592C65726145562BDFFE",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119290,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13970-1028183.jpeg",
				"created": 1475949609,
				"notes": "Section: Ford Row: J Space: 3 Color: Black",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476046819,
				"id": "E2C2AD03A4BD53D82E15E1B0B7F936804A745A1C437AFC4C613ED33EC571C6A7",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119429,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13284-949598.jpeg",
				"created": 1474570868,
				"notes": "Section: Ford Row: A Space: 6 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1474740048,
				"id": "E4270160F021027E8DEB92A3397C9C61B96362A90A45BE1358AC657CACD859A6",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119430,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11560-1035566.jpeg",
				"created": 1475892036,
				"notes": "Section: Trucks/SUB Row: D Space: 10 Color: Blue",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476126086,
				"id": "E6A0F2146788B4119DA970773C3E01371C76C685940A3F09654F4B0F99CB9D50",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119343,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11732-1060826.jpeg",
				"created": 1476835202,
				"notes": "Section: Trucks/SUB Row: G Space: 1 Color: Other",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1476835202,
				"id": "E7AE13EC4AA0EEA83050398F58BEE9123F28CE6AAD7967E0A09E7220CDCC1E78",
				"timeago": "2 days ago",
				"arrived": 1476774000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119344,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18473-1019296.jpeg",
				"created": 1475859623,
				"notes": "Section: C-TRUCK BG Row: 18 Space: 9 Color: Green",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475942435,
				"id": "E9C10110234FF4EC808FF2336FFA359CAA2DE7FB36728C567BE278DCFBFD07CF",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119291,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26186-995073.jpeg",
				"created": 1475870421,
				"notes": "Section: Import 1 Row: C Space: 2 Color: Green",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475964017,
				"id": "EA5797340AC0A055B8D3E7A3D0340974C768035796E0298BEE8C5FF50BBA91A5",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119398,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-26082-991349.jpeg",
				"created": 1476057684,
				"notes": "Section: Ford Color: White",
				"car": "Ford E-350 Econoline Club Wagon",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476111622,
				"id": "ECD19101F62FFC626CC68E46142138163DF659ADC6D7869931FB60ED9CD6061A",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119399,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13740-1001043.jpeg",
				"created": 1475863219,
				"notes": "Section: Ford Row: H Space: 3 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475884832,
				"id": "EE4BFC8E15EB77B211F447A89ED2B376C9CFD71EC14C6A642EC56E176B677734",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119431,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13803-1008548.jpeg",
				"created": 1475863219,
				"notes": "Section: Ford Row: H Space: 5 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475884832,
				"id": "EEF04CCD55649232A64098C209EB75709BDCE68F1E192C86D1F59308787D0873",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119432,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12686-988978.jpeg",
				"created": 1474938041,
				"notes": "Section: Truck/SUV Color: Green",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1475110847,
				"id": "EFC71174FA063016B0A1F85038727D9E718E3EA296080AF46A49843A4028D755",
				"timeago": "24 days ago",
				"arrived": 1474873200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119325,
			"timeago": "15 hours ago"
		},
		{
			"distance": 132.21864,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1264/1264-12039-969172.jpeg",
				"created": 1474992057,
				"notes": "Section: PDOM/ TRK Row: F Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:25",
					"lat": 32.5963,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.012924,
					"id": 264,
					"label": "LKQ - Chula Vista",
					"address": "880 Energy Way, Chula Vista, California 91911, United States"
				},
				"updated": 1475157646,
				"id": "F0EDE7D2F622FF08F9FE872039836C9CB275657217C8EB6B7EE9AC6E09D4C36A",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119461,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11285-1004031.jpeg",
				"created": 1475107237,
				"notes": "Section: Trucks/SUB Row: I Space: 4 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1475262034,
				"id": "F1F2E06AE164259DF9F659ABCED86FEE3F748170648CE13F7CCCD5CD868B8BD9",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119345,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-13060-1033148.jpeg",
				"created": 1476252043,
				"notes": "Section: Truck/SUV Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1476493215,
				"id": "F1F4AF99FF08A7F769C406676C3CA48E298F70CA46135A72FE354CFFDC9D2CC6",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119326,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-18013-978754.jpeg",
				"created": 1475791255,
				"notes": "Section: A- FORDS Row: 27 Space: 1 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475942435,
				"id": "F20DE66D6FC88665A163646D43840C59FBACE74DF94464F754936D9D9086479C",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119292,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"updated": 1476937716,
			"id": 119368,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.907013,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1268/1268-11287-1004100.jpeg",
				"created": 1475107237,
				"notes": "Section: Trucks/SUB Row: J Space: 4 Color: Purple",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:36",
					"lat": 33.802925,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.99006,
					"id": 268,
					"label": "LKQ - Stanton",
					"address": "8188 Katella Ave, Stanton, California 90680, United States"
				},
				"updated": 1475262034,
				"id": "F2A5BBDE57496773264E5524E7FF52804D323D4ED969BEA9840F325E95341DF5",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119346,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17558-944848.jpeg",
				"created": 1475859623,
				"notes": "Section: C-TRUCK BG Row: 18 Space: 8 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1475942435,
				"id": "F2DC02D74A6A7F086651C423FDADF01E8658B3F73BB05A1F103A757B07349D86",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119293,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15950-964605.jpeg",
				"created": 1475089243,
				"notes": "Section: SM Truck Row: 11 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475186448,
				"id": "F603606CA5EC16E802A1709AA813591EE957678B138AA4DB2740A9F26215A03F",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119310,
			"timeago": "15 hours ago"
		},
		{
			"distance": 34.745487,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1280/1280-17851-967081.jpeg",
				"created": 1476907197,
				"notes": "Section: A- FORDS Row: 28 Space: 7 Color: Green",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:04",
					"lat": 34.037884,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.55654,
					"id": 280,
					"label": "LKQ - Ontario",
					"address": "2025 S Milliken Ave, Ontario, California 91761, United States"
				},
				"updated": 1476990001,
				"id": "F60A9B3B42CC66175059E8EC4D50CF9545F2FAF913237CB49B70E22DF6B5196C",
				"timeago": "1 day ago",
				"arrived": 1476860400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119294,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-16336-1004162.jpeg",
				"created": 1475708426,
				"notes": "Section: SM Truck Row: 4 Color: Silver",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475852424,
				"id": "F6CC2B3D798559FEAE11D808368BD1F8DC8BFC201203F65E3A03BCAAF3E49EBA",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119311,
			"timeago": "15 hours ago"
		},
		{
			"distance": 111.556244,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1260/1260-6371-743974.jpeg",
				"created": 1476378022,
				"notes": "Section: Primo Trk Row: Q Space: 6 Color: Blue",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:46",
					"lat": 35.306675,
					"updated": "2016-02-17T22:28:26",
					"lng": -119.00334,
					"id": 260,
					"label": "LKQ - Bakersfield",
					"address": "5311 South Union Avenue, Bakersfield, California 93307, United States"
				},
				"updated": 1476759591,
				"id": "FA633CC8C2BB2B41821FEFA4F26F1AB70229CBB0B34FA73EF688F9E6374BCEB7",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119441,
			"timeago": "15 hours ago"
		},
		{
			"distance": 48.396328,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1281/1281-15740-944474.jpeg",
				"created": 1475013664,
				"notes": "Section: Ford Row: 8 Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:27",
					"lat": 34.10657,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.00779,
					"id": 281,
					"label": "LKQ - Monrovia",
					"address": "3333 Peck Rd, Monrovia, California 91016, United States"
				},
				"updated": 1475172049,
				"id": "FB84636617486CFD7B33315B9CBD55D27D4830A2C343607F2605C4B2B2977117",
				"timeago": "23 days ago",
				"arrived": 1474959600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119312,
			"timeago": "15 hours ago"
		},
		{
			"distance": 63.8169,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1263/1263-25373-1017230.jpeg",
				"created": 1475600420,
				"notes": "Section: P-American Row: G Space: 10 Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:16:08",
					"lat": 34.236725,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.37631,
					"id": 263,
					"label": "LKQ - Sun Valley",
					"address": "11201 Pendleton Street, Sun Valley, California 91352, United States"
				},
				"updated": 1475607622,
				"id": "FBE9811326D6890BF039374167E0ACF430BA2D8890D502B180DF33FD4946A86F",
				"timeago": "16 days ago",
				"arrived": 1475564400,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119369,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.377686,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1261/1261-25795-972163.jpeg",
				"created": 1475348461,
				"notes": "Section: Import 1 Row: J Space: 15 Color: Red",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:42",
					"lat": 33.797073,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24617,
					"id": 261,
					"label": "LKQ - Wilmington",
					"address": "1903 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1475420426,
				"id": "FC4A2AD7339E9E470B0722D0E3925180EFDD970E290DBCEAA81FFCBC4E7E2768",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119400,
			"timeago": "15 hours ago"
		},
		{
			"distance": 72.670296,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1262/1262-13802-1008422.jpeg",
				"created": 1475791246,
				"notes": "Section: Ford Row: I Space: 7 Color: Silver",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:17:08",
					"lat": 33.789467,
					"updated": "2016-02-17T22:28:26",
					"lng": -118.24475,
					"id": 262,
					"label": "LKQ - Wilmington",
					"address": "1232 Blinn Ave, Wilmington, California 90744, United States"
				},
				"updated": 1476046819,
				"id": "FC9D5E1CC3AC6317CCA3E3807B8FB07D00CCDB975C542D37EFA6366BA3AE706E",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937716,
			"id": 119433,
			"timeago": "15 hours ago"
		},
		{
			"distance": 61.387028,
			"created": 1476937716,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1265/1265-12823-1007376.jpeg",
				"created": 1475895643,
				"notes": "Section: Ford Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T16:46:52",
					"lat": 33.816006,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.994865,
					"id": 265,
					"label": "LKQ - Anaheim",
					"address": "1235 Beach Blvd, Anaheim, California 92804, United States"
				},
				"updated": 1476140431,
				"id": "FDC79EE99CCF0E2DBB6E422460EEE58ED917F96EA111E68C871B700C836546DF",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937716,
			"id": 119327,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12398-842635.jpeg",
				"created": 1474642874,
				"notes": "Section: TRK WEST Row: 6 Space: 11 Color: Blue",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474815650,
				"id": "020A36369C03FB202F847CCEC7A3FB34396631567DCDD3E4493FF1C9BE59AA62",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119209,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11811-922654.jpeg",
				"created": 1475100054,
				"notes": "Section: Ford Row: 56 Space: 18 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475168459,
				"id": "03865FA5DD4033619AF7D8B192EB073EDC5828FDD7D4A310C112BA046F992766",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119236,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12586-857384.jpeg",
				"created": 1476234134,
				"notes": "Section: FORD EAST Row: 59 Space: 5 Color: White",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476406833,
				"id": "0987F1DF78E598BE3A48BA58ED8066309F210B433380CA88A023BDE6FA230763",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119210,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12619-860473.jpeg",
				"created": 1476320414,
				"notes": "Section: FORD EAST Row: 61 Space: 11 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476489619,
				"id": "0B3D777BBE81FCAEF97134308CE0397B999F1D0B206AFDF00909FC0C2AFA6998",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119211,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6689-981706.jpeg",
				"created": 1475866839,
				"notes": "Section: Ford Row: 23 Space: 3 Color: Black",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1476219650,
				"id": "0C23568E9C397694302B856030821F8C17C78275E7831585B9D95EF5790BE20F",
				"timeago": "13 days ago",
				"arrived": 1475823600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119197,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6813-1018607.jpeg",
				"created": 1476561625,
				"notes": "Section: Truck Row: 3 Space: 16 Color: Red",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1476982803,
				"id": "100682569457A2F4A9783FEE424B859F26CC08A8D3CD824E451B367A78CB129D",
				"timeago": "5 days ago",
				"arrived": 1476514800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119198,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12489-851921.jpeg",
				"created": 1475683241,
				"notes": "Section: FORD WEST Row: 58 Space: 5 Color: Silver",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1475946038,
				"id": "130CFB23E2DBAEAF76DDA8C72126053BAC67F05C67FFE9D709C0E09150071E32",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119212,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12404-988879.jpeg",
				"created": 1475780452,
				"notes": "Section: Ford Row: 57 Space: 7 Color: Green",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475863231,
				"id": "15C4AEFCD9206766A2B9FC74E53235904CAC12E70E4C02950B87C1F965D69D4D",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119237,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11914-934913.jpeg",
				"created": 1475100054,
				"notes": "Section: Ford Row: 56 Space: 17 Color: Brown",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475168459,
				"id": "18978F016C1787949E281240073DB6020B806BB85CEF634076A84234CCB01D1E",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119238,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11713-915479.jpeg",
				"created": 1474567290,
				"notes": "Section: Ford Row: 55 Space: 7 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1474653659,
				"id": "19CFA4D0B6D46FCC4E1D0B1CF1D0A09523C273BABAB41E758E6097F9E04261FC",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119239,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12598-1015285.jpeg",
				"created": 1476381691,
				"notes": "Section: Big Trucks Row: 105 Space: 5 Color: Green",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476572427,
				"id": "1AA17E96CD830BA18A43AB17766C2584F83684215C586FA8BC3B9F4E1A83CC51",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119240,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6618-967934.jpeg",
				"created": 1476226914,
				"notes": "Section: Truck Row: 34 Space: 8 Color: Blue",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1476475220,
				"id": "1BEDD01ACFBD39BCA82B94CF8898DEFA5B7D4C7E040AE212D3A52ACFE98A49C2",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119199,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11915-934936.jpeg",
				"created": 1475276446,
				"notes": "Section: Big Trucks Row: 89 Space: 10 Color: Blue",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475366446,
				"id": "1DB9C33D7ED684414B705CB571C64B42D6A1FA97DCAED846D8881802591704C2",
				"timeago": "20 days ago",
				"arrived": 1475218800,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119241,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12684-1024795.jpeg",
				"created": 1476309614,
				"notes": "Section: Ford Row: 64 Space: 5 Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476464422,
				"id": "233474D8CA0231D821252C4EE38F1E1211EEE597DC9647E58B90178D8848A9C3",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119242,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11833-923614.jpeg",
				"created": 1474657260,
				"notes": "Section: Mini Truck Row: 39 Space: 3 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1474761668,
				"id": "2BB1E3E28863DE663AE2FB72BAC091DCD6851DE63DEAA5107659423F44049EE8",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119243,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6334-903829.jpeg",
				"created": 1474657266,
				"notes": "Section: Ford Row: 22 Space: 6 Color: White",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475006462,
				"id": "2E63C47A980C283946CE10D799EB0FC922E896B710F53C23D62467A1398C94D1",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119200,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-13259-914932.jpeg",
				"created": 1476925226,
				"notes": "Section: FORD EAST Row: 62 Space: 3 Color: Gold",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476990005,
				"id": "323F99C34D7C5ED142190065BEA3B88600662A226B70259E87C64A2492F76019",
				"timeago": "1 day ago",
				"arrived": 1476860400,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119213,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6747-998481.jpeg",
				"created": 1476478823,
				"notes": "Section: Ford Row: 24 Space: 8 Color: Green",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1476820899,
				"id": "336F9B94F34A9E0718F83F1B4950BA0B92D311F298F6FE6162E2E19EF1DD82F8",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119201,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12677-865070.jpeg",
				"created": 1476230436,
				"notes": "Section: TRK WEST Row: 19 Space: 6 Color: Blue",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476313217,
				"id": "40B32D4FC7549291D419AB7774ECC3E081044CEEB09ED390340D14F5A1A704A9",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119214,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12016-805663.jpeg",
				"created": 1474506059,
				"notes": "Section: FORD WEST Row: 61 Space: 4 Color: Silver",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474729294,
				"id": "434B8F5BD9EDF5B9E57A5DB51944DD9072910B390C5ED4A23A106C35B2990356",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119215,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-2912-414578.jpeg",
				"created": 1475096448,
				"notes": "Section: Truck Row: 33 Space: 7 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475352046,
				"id": "4530C9D1D87B270EB72849F9C4359B4CC564CD09B4F33ABCB5DC4D3E31A263C5",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119202,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12781-1040469.jpeg",
				"created": 1476637198,
				"notes": "Section: Big Trucks Row: 108 Space: 3 Color: Other",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476907200,
				"id": "48FAC356DF58639BF3B8876066594EA23F7CE212C6A2421A78017D0F43B97159",
				"timeago": "4 days ago",
				"arrived": 1476601200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119244,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12568-1008091.jpeg",
				"created": 1476054030,
				"notes": "Section: Ford Row: 64 Space: 8 Color: Blue",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476306015,
				"id": "4C9C6A984E36B04692A42402258242D5D8CD1F40E418BCF370694B618AAF6984",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119245,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12230-967798.jpeg",
				"created": 1475694025,
				"notes": "Section: Big Trucks Row: 94 Space: 4 Color: Tan",
				"car": "Ford Excursion",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475773252,
				"id": "4D19AB31E82496529096DF2C3ACFDBF3D0F66A0FF6436C11D4EEC366DF846BE5",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119246,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12106-815689.jpeg",
				"created": 1474419661,
				"notes": "Section: TRK WEST Row: 5 Space: 3 Color: Maroon",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474502492,
				"id": "507B475845712F1EA637E2B8313D8038D8071253170C293D38D746B14D1EF449",
				"timeago": "1 month ago",
				"arrived": 1474354800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119216,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12627-861191.jpeg",
				"created": 1476234134,
				"notes": "Section: FORD EAST Row: 59 Space: 8 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476406833,
				"id": "5188C9DF1CA1098790F4F9BA3403685340017F862D755846AB05557BFAA1E251",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119217,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12035-807271.jpeg",
				"created": 1475683241,
				"notes": "Section: TRK WEST Row: 14 Space: 4 Color: Gold",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1475780454,
				"id": "54D47468D0C0A26496536382B9DFFA98C6F2238984C0FE704D349622D41BFD31",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119218,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12650-1020506.jpeg",
				"created": 1476313215,
				"notes": "Section: Ford Row: 65 Space: 9 Color: White",
				"car": "Ford Contour",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476464422,
				"id": "57CE63895351794591877454303413041436B6C8B7E5C22CA998245420792FC4",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119247,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12394-987014.jpeg",
				"created": 1475780452,
				"notes": "Section: Ford Row: 57 Space: 6 Color: Black",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475863231,
				"id": "57E7040AFE36FE70BDDA143F0ECC522AD812C8D55C415E28814B12A380CDB641",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119248,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12448-994985.jpeg",
				"created": 1476054030,
				"notes": "Section: Ford Row: 64 Space: 9 Color: Silver",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476306015,
				"id": "62CEADA2A77ADC0D28914DD3945754A9BAF3C54F4F0ECFD2A66AD1237EB51E5F",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119249,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11949-938014.jpeg",
				"created": 1474927258,
				"notes": "Section: Mini Truck Row: 40 Space: 3 Color: Tan",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475168459,
				"id": "63D2FAF5A013579BF65E07925C1E24C0098D0F0AC0502D156AB273D2B87A21AE",
				"timeago": "24 days ago",
				"arrived": 1474873200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119250,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6631-969534.jpeg",
				"created": 1475625642,
				"notes": "Section: Ford Row: 22 Space: 4 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475863234,
				"id": "64628398BD830B27EACBB7ED25C95DFF090F8BDFB4B722CE45E3697A801C1D38",
				"timeago": "16 days ago",
				"arrived": 1475564400,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119203,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12540-1004172.jpeg",
				"created": 1476054030,
				"notes": "Section: Ford Row: 57 Space: 2 Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476306015,
				"id": "6D0A2BB770D30F9D76FE0D5E6AB1AAE6D5840E5CE1681E93D9D14F630619A080",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119251,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12684-865449.jpeg",
				"created": 1476230436,
				"notes": "Section: TRK WEST Row: 19 Space: 7 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476313217,
				"id": "6FBE745FFC78083C45E720CF41800DA1AA21A45529743EC24A83DB158C9C0673",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119219,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11971-940481.jpeg",
				"created": 1475276446,
				"notes": "Section: Big Trucks Row: 89 Space: 5 Color: Green",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475366446,
				"id": "70BDE00EBE564FB162064708E3A2A5B60B6D38491A74554044881620CC7C6C2B",
				"timeago": "20 days ago",
				"arrived": 1475218800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119252,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12234-968053.jpeg",
				"created": 1475370037,
				"notes": "Section: Ford Row: 56 Space: 8 Color: Silver",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475427631,
				"id": "74F9F117D38CC3BBFEA430320A545BC46214C1696DCA84369569B1311988DC24",
				"timeago": "19 days ago",
				"arrived": 1475305200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119253,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12150-819142.jpeg",
				"created": 1474506059,
				"notes": "Section: FORD WEST Row: 61 Space: 12 Color: Red",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474729294,
				"id": "78A124A26FA5E57542693E7188AB926D1D31BD55FE58E924183BBB78ED7AC180",
				"timeago": "29 days ago",
				"arrived": 1474441200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119220,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12659-863233.jpeg",
				"created": 1476230436,
				"notes": "Section: TRK WEST Row: 19 Space: 5 Color: Black",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476313217,
				"id": "78B0F785AB8B2D045BD243B6F91D33ED62B4D42768BD4A3000701D0E649313EF",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119221,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12604-858992.jpeg",
				"created": 1476234134,
				"notes": "Section: FORD EAST Row: 59 Space: 4 Color: White",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476406833,
				"id": "8C592C2E1B0DE2A9F86A2FB32742DF8C20560BD46C195F0E3421D1F2FB2F3C1A",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119222,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12110-953868.jpeg",
				"created": 1475100054,
				"notes": "Section: Ford Row: 55 Space: 4 Color: Other",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475168459,
				"id": "92C8600C693B409A0B1603523109076387AB41C32173F3329507D36442700878",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119254,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11954-938982.jpeg",
				"created": 1475276446,
				"notes": "Section: Big Trucks Row: 89 Space: 7 Color: White",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1475366446,
				"id": "9840B93B1BCDDE3F94316539EBF192DC9A4648B597F936518A066BEC60D39897",
				"timeago": "20 days ago",
				"arrived": 1475218800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119255,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12523-1000978.jpeg",
				"created": 1476302413,
				"notes": "Section: Mini Truck Row: 76 Space: 4 Color: White",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476378040,
				"id": "A020432BDFCE6E1C6AD1F1A8D7A8EB3FEC89C76B506E99ABA04271D67F7AFA72",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119256,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-13109-901950.jpeg",
				"created": 1475107248,
				"notes": "Section: TRK WEST Row: 11 Space: 5 Color: Gold",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1475341238,
				"id": "A1304911A5B1E160FE8E4F61888D716FC4CC412E158F79B7FFE7E5113F6B2ED7",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119223,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12413-991601.jpeg",
				"created": 1475971294,
				"notes": "Section: Big Trucks Row: 101 Space: 4 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476054030,
				"id": "A316E26DE2CCC4F9B6E0BE24588DC4BA848F8010D25CAE1E583AB492C6D79B0B",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119257,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12808-876628.jpeg",
				"created": 1476320414,
				"notes": "Section: FORD EAST Row: 60 Space: 1 Color: Black",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476489619,
				"id": "A8DDE2D3532969FC1CCDDC12D472B365CA24C5FC31FAAB50108F20836A2C302D",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119224,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-11894-933060.jpeg",
				"created": 1474567290,
				"notes": "Section: Ford Row: 55 Space: 12 Color: Tan",
				"car": "Ford Focus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1474653659,
				"id": "ABB174383A47DF8B28FE4F717CC810A3A835FCCAECD214BF6CF0B81291E6365C",
				"timeago": "28 days ago",
				"arrived": 1474527600,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119258,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12809-1043187.jpeg",
				"created": 1476637198,
				"notes": "Section: Mini Truck Row: 79 Space: 7 Color: Silver",
				"car": "Ford Escape",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476907200,
				"id": "AE9B0B29ABF4C8D33E7AD907720A80939C9BFF8533037FF890C9C07A7657D34F",
				"timeago": "4 days ago",
				"arrived": 1476601200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119259,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12029-807053.jpeg",
				"created": 1474642874,
				"notes": "Section: TRK WEST Row: 6 Space: 2 Color: Gold",
				"car": "Ford Ranger",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474815650,
				"id": "AFFA208BCBFFC11597BD91A6D5768118F94B04DA6434C528B5D0CF9E2736BEB9",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119225,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12491-851949.jpeg",
				"created": 1475683241,
				"notes": "Section: FORD WEST Row: 58 Space: 4 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1475946038,
				"id": "B468C51F568B8B2A3E26B8B252D6069B0A10D2153257463B6E4F3804EEA0BA0F",
				"timeago": "15 days ago",
				"arrived": 1475650800,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119226,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-13010-893663.jpeg",
				"created": 1476234134,
				"notes": "Section: FORD EAST Row: 59 Space: 11 Color: Gold",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476406833,
				"id": "C60167C1317DE7FC0DB53DB3847341CCCC7E3778169E0812A3F615949B6C5044",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119227,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12588-1012662.jpeg",
				"created": 1476313215,
				"notes": "Section: Ford Row: 65 Space: 10 Color: Tan",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476464422,
				"id": "C96373ED4F8C715739F71D819513000FDD692509023048EE94B1F82E993EECF1",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119260,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12708-1027736.jpeg",
				"created": 1476637198,
				"notes": "Section: Mini Truck Row: 79 Space: 6 Color: White",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476907200,
				"id": "CB03214A3FBDE15EFC5410E516F3386A1F16A8870B8885D249002AB2B81C32FA",
				"timeago": "4 days ago",
				"arrived": 1476601200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119261,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6515-940646.jpeg",
				"created": 1475096448,
				"notes": "Section: Truck Row: 33 Space: 15 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475352046,
				"id": "D1AE232E1C2C7A213CA444749C97C4BED9F1BEED22AEF3990BBE69630FCF4559",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119204,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-4773-670378.jpeg",
				"created": 1474657266,
				"notes": "Section: Ford Row: 22 Space: 11 Color: Blue",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475006462,
				"id": "D3DC223916877CB9422BAA6F0B93D4C812B701E1EB8119AE9BC7964ABB4290CF",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119205,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12656-863176.jpeg",
				"created": 1476320414,
				"notes": "Section: FORD EAST Row: 60 Space: 4 Color: Gold",
				"car": "Ford Crown Victoria",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476489619,
				"id": "D5C15DFC1EACCE89985D7D68A1F65B806600C59C41D05C628A5B5B534197645E",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119228,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12550-855852.jpeg",
				"created": 1475780454,
				"notes": "Section: TRK WEST Row: 15 Space: 6 Color: Black",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1475949624,
				"id": "D743A6024C9F0CB6B0B68C6AE9F7A0AC483CE305A324A4FB1C1E296170AA894C",
				"timeago": "14 days ago",
				"arrived": 1475737200,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119229,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-13403-927085.jpeg",
				"created": 1475949624,
				"notes": "Section: TRK WEST Row: 16 Space: 11 Color: Black",
				"car": "Ford Expedition",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476201637,
				"id": "DC0C8B3D322DEB653D0187BD65293DC8DE3D79F23CB3297B99D0B0CCDD078349",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119230,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6028-845580.jpeg",
				"created": 1474657266,
				"notes": "Section: Ford Row: 21 Space: 6 Color: Red",
				"car": "Ford Taurus",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475006462,
				"id": "DC855FD6B052A1799CD89EA7C00CD0049C739407BA46DF1A2D8A7EC428E57BB1",
				"timeago": "27 days ago",
				"arrived": 1474614000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119206,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12680-1024717.jpeg",
				"created": 1476381691,
				"notes": "Section: Big Trucks Row: 104 Space: 8 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476468017,
				"id": "E0B787290D690EB7006C832658B5AA84B222DC707FB3BE6B6904F666FD8FD8CE",
				"timeago": "7 days ago",
				"arrived": 1476342000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119262,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12303-837283.jpeg",
				"created": 1474819288,
				"notes": "Section: GM WEST Row: 51 Space: 11 Color: Maroon",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1474988465,
				"id": "E0E516DD732DEA4A8CDD882B399C27C35FA30E77F78CD70B6E0559FCC48F1AEA",
				"timeago": "25 days ago",
				"arrived": 1474786800,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119231,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-13395-926674.jpeg",
				"created": 1475949624,
				"notes": "Section: TRK WEST Row: 16 Space: 2 Color: Silver",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476201637,
				"id": "E3AA6F41CBA3A360F6121E87B54708B6E58ADCE055AC802562750D25553E94F7",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119232,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12900-885364.jpeg",
				"created": 1475949624,
				"notes": "Section: TRK WEST Row: 17 Space: 11 Color: Gold",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476201637,
				"id": "E8FDF8CA5238DF51530352E037C0B311D948DD3F48E60EB865BB3B6678019471",
				"timeago": "12 days ago",
				"arrived": 1475910000,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119233,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6770-1007364.jpeg",
				"created": 1476478823,
				"notes": "Section: Ford Row: 24 Space: 9 Color: Silver",
				"car": "Ford Escort",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1476820899,
				"id": "EA2B13FAAA4B16FE7E564C6B025DA2F51255B67969D6FD84CC7A62FF0E68327C",
				"timeago": "6 days ago",
				"arrived": 1476428400,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119207,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12611-859075.jpeg",
				"created": 1476230436,
				"notes": "Section: TRK WEST Row: 19 Space: 3 Color: Blue",
				"car": "Ford Explorer",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476313217,
				"id": "EB7F920CD5D36EE6A9F738A7AD02E4ACAEBF6EFEDCF91CFD75F88523ED4F6340",
				"timeago": "9 days ago",
				"arrived": 1476169200,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119234,
			"timeago": "15 hours ago"
		},
		{
			"distance": 26.498222,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1291/1291-12811-876773.jpeg",
				"created": 1476320414,
				"notes": "Section: FORD EAST Row: 60 Space: 2 Color: Blue",
				"car": "Ford Mustang",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:13:37",
					"lat": 34.111706,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.27578,
					"id": 291,
					"label": "LKQ - San Bernardino",
					"address": "434 E 6th St, San Bernardino, California 92410, United States"
				},
				"updated": 1476489619,
				"id": "EFAB02E0AD2DADFA8EDA63AB90CDB3C2EA75194D725CE382B33CF9B039870C86",
				"timeago": "8 days ago",
				"arrived": 1476255600,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119235,
			"timeago": "15 hours ago"
		},
		{
			"distance": 2.77462,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1292/1292-6405-912913.jpeg",
				"created": 1475096448,
				"notes": "Section: Truck Row: 33 Space: 9 Color: White",
				"car": "Ford F-150",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:15:22",
					"lat": 34.45757,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.28305,
					"id": 292,
					"label": "LKQ - Hesperia",
					"address": "11399 Santa Fe Ave E, Hesperia, California 92345, United States"
				},
				"updated": 1475352046,
				"id": "F547F97BF5504C4EFFB90054B5359C867EF0A6BDEB7BD03E2753EDB08B4D866F",
				"timeago": "22 days ago",
				"arrived": 1475046000,
				"caryear": 2001
			},
			"updated": 1476937715,
			"id": 119208,
			"timeago": "15 hours ago"
		},
		{
			"distance": 33.993217,
			"created": 1476937715,
			"inventory": {
				"imageurl": "https://docazr1vweb01.azureedge.net/carbuy/1290/1290-12457-995274.jpeg",
				"created": 1476054030,
				"notes": "Section: Big Trucks Row: 102 Space: 3 Color: Tan",
				"car": "Ford Windstar",
				"location": {
					"phonenumber": "18009622277",
					"created": "2014-03-21T20:14:55",
					"lat": 34.021027,
					"updated": "2016-02-17T22:28:26",
					"lng": -117.46319,
					"id": 290,
					"label": "LKQ - Hillside",
					"address": "3760 Pyrite St, Riverside, California 92509, United States"
				},
				"updated": 1476298816,
				"id": "F9CD92EF2E1308CDC7CCAEB162027DBD233DDAC63165283D5369F7F87BDB8C3B",
				"timeago": "11 days ago",
				"arrived": 1475996400,
				"caryear": 2000
			},
			"updated": 1476937715,
			"id": 119263,
			"timeago": "15 hours ago"
		}];
    return watchinventories;
  }

}
