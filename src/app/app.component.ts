import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController  } from 'ionic-angular';
import { StatusBar, Push } from 'ionic-native';

import { NotificationsPage } from '../pages/notifications/notifications';
import { Search } from '../pages/search/search';
import { Watches } from '../pages/watches/watches';

import { KeyValService } from './providers/keyval.service';
import { FCMService } from './providers/fcm.service';
import { WatchService } from './providers/watch.service';

import { AdMob, AppVersion } from 'ionic-native';


@Component({
    templateUrl: 'app.html'
})
export class ClassicJunkApp {

    @ViewChild(Nav) nav: Nav;

    //rootPage: any = NotificationsPage;
    //rootPage: any = Watches;
    rootPage: any;

    pages: Array<{ title: string, component: any, icon: string }>;

    constructor(
        public platform: Platform,
        public alertCtrl: AlertController,
        private keyvalService: KeyValService,
        public loadingCtrl: LoadingController,
        public fcmService: FCMService,
        private watchService: WatchService
    ) {
        console.log("MyApp Constructor");

        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            //{ title: 'Notifications', component: NotificationsPage, icon: 'ios-notifications-outline' },
            { title: 'Set Alerts', component: Watches, icon: 'ios-alert-outline' },
            { title: 'Search', component: Search, icon: 'ios-search-outline' }
        ];

        watchService.alertCreated$.subscribe(
            val => {
                //console.log('RECEIVED emitted notifyAlertCreated from watch service in app.component');
                this.addNotificationsMenuItem();
            }
        );

    }

    private addNotificationsMenuItem(): void {
        if( this.pages.length == 2 ) {
            this.pages.unshift(
                { title: 'Notifications', component: NotificationsPage, icon: 'ios-notifications-outline' }
            );
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            console.log("Platform ready");

            this.keyvalService.setDefaultObjects();

            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

            // see if this is the first time the app has ran before,
            // if so hide the notifications menu item and make the Watches page first
            this.keyvalService.get(KeyValService.HasSetupAlertsBeforeKey).then(
                (val) => {
                    console.log("key exists, just adding item");
                    this.nav.setRoot(NotificationsPage);
                    this.addNotificationsMenuItem();
                },
                (err) => {
                    this.nav.setRoot(Watches,{showCreate: true});
                    console.log('HasSetupAlertsBeforeKey doesnt exist/errored, setting up subscribe');
                }
            );

            this.keyvalService.setDefaultObjects();


            /*
            let self = this;
            setTimeout(function () {
                self.start();

                try {
                    self.pushSetup();
                } catch(e) {}

            }, 3000);
            */
            //this.start();
            //this.pushSetup();

            AppVersion.getVersionNumber().then((ver) => {
                this.pushSetup(ver);
            })

            
            AppVersion.getPackageName().then((p) => {
                if( p.includes('free') || this.platform.is('android') ) {
                    console.log("free version, show ads");
                    console.log(p);
                    this.setupAds(p);
                } else {
                    console.log("non-free, dont setup ads");
                    console.log(p);
                }
            })

        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }



    pushSetup(currentVersion) {
        let push = Push.init({
            android: {
                senderID: "352912943392",
                icon: "ic_notification",
                iconColor: "#c94545"
            },
            ios: {
                senderID: "352912943392",
                "sound": "true",
                "alert": "true",
                "badge": "false",
                "clearBadge": "true",
                "gcmSandbox": "false"
            },
            windows: {}
        });
        
        // force an unregister if the app has been updated
        this.keyvalService.get(KeyValService.LastKnownAppVersionKey).then(
            (oldVersion) => {
                if( currentVersion > oldVersion ) {
                    console.log("calling resetPushSetup due to version bump");
                    this.resetPushSetup(push,currentVersion);
                }
            },
            (err) => {
                console.log("calling resetPushSetup due to unknown version");
                this.resetPushSetup(push,currentVersion);
            }
        );

        push.on('registration', (data) => {
            console.log("device token ->", data.registrationId);
            this.fcmService.register(data.registrationId).subscribe(
                regResults => {
                    console.log('subscribe register fcm returned');
                    console.log(JSON.stringify(regResults));
                },
                (err) => {
                    console.log("START: FCM Registration Error");
                    console.log(JSON.stringify(err));
                    console.log(err.json()); //gives the object object
                    console.log(JSON.stringify(err.json())); //gives the object object
                    console.log("END: FCM Registration Error");
                }
            );;
        });
        push.on('notification', (data) => {
            console.log('notification message', data.message);
            console.log(JSON.stringify(data));

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
                            this.nav.setRoot(NotificationsPage);
                        }
                    }]
                });
                confirmAlert.present();
            } else {
                if(this.nav.length() == 2) {
                    this.nav.remove(1, 1);
                }
                this.nav.push(NotificationsPage, { message: data.message });
                console.log("got background notification, moving to page");
            }
            
            push.finish(function() {
                console.log('accept callback finished');
            }, function() {
                console.log('accept callback failed');
            }, data.additionalData.notId);
            

        });
        push.on('error', (e) => {
            console.log('push.On error: ' + e.message);
        });
    }

    resetPushSetup(push, currentVersion) {
        let self = this;
        this.keyvalService.clear().then(() => {
            console.log("finished clearing cache");
        });
        push.unregister(function () {
            console.log('unregistered successfully');
            self.keyvalService.set(KeyValService.LastKnownAppVersionKey, currentVersion).then(
            () => {
                console.log("storing current app version: " + currentVersion);
                self.pushSetup(currentVersion);
            },
            (err) => {
                self.pushSetup(currentVersion);
            }
        );
        }, function () {
            console.log('unregistering failed');
            self.keyvalService.set(KeyValService.LastKnownAppVersionKey, currentVersion).then(
            () => {
                console.log("storing current app version: " + currentVersion);
                self.pushSetup(currentVersion);
            },
            (err) => {
                self.pushSetup(currentVersion);
            }
        );
        });
        
    }



    start() {

        //console.log("Device UUID:" + Device.device.uuid);
        //this.keyvalService.set("deviceuuid",Device.device.uuid);
        /*
        let options = { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log("onGeoSuccess; Latitude: " + coords.latitude + " Longitude: " + coords.longitude);
                this.keyvalService.set(KeyValService.PositionCoordsKey, coords).then(
                    () => {
                        console.log('Geo found, storing');
                    },
                    (err) => {
                        console.error('Error storing item', err);
                    }
                );

            },
            (error) => {
                console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
            },
            options
        );
        */
        //console.log("started???-");
    }

    private setupAds(packageName: string): void {
            interface AdMobType {
                banner: string,
                interstitial: string
            };

            var admobid: AdMobType;

            // select the right Ad Id according to platform
            switch(packageName) {
                case 'org.sigmaprojects.ClassicJunkfree': {
                    admobid = { // for iOS
                        banner: 'ca-app-pub-1023269354859119/5769023784',
                        interstitial: 'ca-app-pub-1023269354859119/8448778586'
                    };
                    break;
                } 
                default: {
                    admobid = { // for Android
                        banner: 'ca-app-pub-1023269354859119/9925511785',
                        interstitial: 'ca-app-pub-1023269354859119/8448778586'
                    };
                }
            }

            if (AdMob) {
                console.log("showing ads");
                AdMob.createBanner({
                    adId: admobid.banner,
                    //isTesting: true,//comment this out before publishing the app
                    autoShow: true
                });
                //AdMob.showInterstitial();
            }
    }

}
