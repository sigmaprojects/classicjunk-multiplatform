import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController  } from 'ionic-angular';
import { StatusBar, Push } from 'ionic-native';

import { NotificationsPage } from '../pages/notifications/notifications';
import { Search } from '../pages/search/search';
import { Watches } from '../pages/watches/watches';

import { KeyValService } from './providers/keyval.service';
import { FCMService } from './providers/fcm.service';


@Component({
    templateUrl: 'app.html',
    providers: [KeyValService,FCMService]
})
export class ClassicJunkApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = NotificationsPage;

    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        public alertCtrl: AlertController,
        private keyvalService: KeyValService,
        public loadingCtrl: LoadingController,
        public fcmService: FCMService
    ) {
        console.log("MyApp Constructor");

        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Notifications', component: NotificationsPage },
            { title: 'Set Alerts', component: Watches },
            { title: 'Search', component: Search }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            try {
                this.pushSetup();
            } catch(e) {
                console.log("Error setting up Push");
                console.log(JSON.stringify(e));
            }
            this.start();
            //navigator.splashscreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }


    pushSetup() {
        let push = Push.init({
            android: {
                senderID: "352912943392",
                icon: "ic_notification",
                iconColor: "#c94545"
            },
            ios: {
                alert: "true",
                badge: false,
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', (data) => {
            console.log("device token ->", data.registrationId);
            this.fcmService.register(data.registrationId).subscribe(
                regResults => {
                    console.log('subscribe register fcm returned');
                    console.log(JSON.stringify(regResults));
                },
                (err) => {
                    /*
                    console.log("START: FCM Registration Error");
                    console.log(JSON.stringify(err));
                    console.log(err.json()); //gives the object object
                    console.log(JSON.stringify(err.json())); //gives the object object
                    console.log("END: FCM Registration Error");
                    */
                }
            );;
        });
        push.on('notification', (data) => {
            console.log('notification message', data.message);
            //console.log(JSON.stringify(data));

            //if user using app and push notification comes
            if (data.additionalData.foreground) {
                // if application open, show popup
                let confirmAlert = this.alertCtrl.create({
                    title: data.title,
                    message: data.message,
                    buttons: [{
                        text: 'Ignore',
                        role: 'cancel'
                    }, {
                        text: 'View',
                        handler: () => {
                            //TODO: Your logic here
                            //self.nav.push(NotificationsPage);
                            this.nav.setRoot(NotificationsPage);
                        }
                    }]
                });
                confirmAlert.present();
            } else {
                //if user NOT using app and push notification comes
                //TODO: Your logic on click of push notification directly
                //self.nav.push(NotificationsPage, { message: data.message });
                this.nav.setRoot(NotificationsPage);
                //console.log("Push notification clicked");
            }
        });
        push.on('error', (e) => {
            console.log('push.On error: ' + e.message);
        });
    }


    start() {

        //console.log("Device UUID:" + Device.device.uuid);
        //this.keyvalService.set("deviceuuid",Device.device.uuid);

        let options = { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                //console.log("onGeoSuccess; Latitude: " + coords.latitude + " Longitude: " + coords.longitude);
                this.keyvalService.set(KeyValService.PositionCoordsKey, coords).then(
                    () => {
                        //console.log('Geo found, storing');
                    },
                    (err) => {
                        //console.error('Error storing item', error);
                    }
                );

            },
            (error) => {
                //console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            },
            options
        );

        //console.log("started???-");
    }

}
