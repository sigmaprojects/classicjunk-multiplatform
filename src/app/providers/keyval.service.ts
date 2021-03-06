import { Injectable } from '@angular/core';
import { NativeStorage, Device } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Injectable()
export class KeyValService {  
 
    public static LastSearchParamsKey = "LastSearchParams";
    public static HighestSeenWatchInventoryIdKey = "HighestSeenWatchInventoryId";
    public static HasSetupAlertsBeforeKey = "HasSetupAlertsBefore";

    public static WatchesListKey = "WatchesList";
    public static WatchInventoriesListKey = "WatchInventoriesList";

    public static LastKnownAppVersionKey = "LastKnownAppVersion"; 
 

    constructor(public platform: Platform) {
        /*
        NativeStorage.clear().then(
            (finished) => {
                console.log("cleared storage.");
                console.log(JSON.stringify(finished));
            });
            */
        //this.setDefaultObjects();
    }
 
    public clear(): Promise<any> {
        return NativeStorage.clear();
    }

    public getDeviceUuid(): string {
        // test uuid: ffffffff-e167-463a-e390-b0f35b303118
        //
        //return 'ffffffff-e167-463a-e390-b0f35b303118';
        //return 'ffffffff-9adc-3175-ffff-ffffc5c2767f';
        
        //return '764b567bcb17b757';
        return Device.device.uuid;
        //return 'ffffffff-9adc-3175-ffff-ffffc5c27000';
    }

    public get(key: string): Promise<any> {
        //console.log("KeyValService get");
        return NativeStorage.getItem(key);
    }

    public set(key: string, value: any): Promise<any> {
        //console.log("KeyValService setting: " + key);
        //console.log("--------------------------");
        //console.log(JSON.stringify(value));
        //console.log("--------------------------");

        /*
        if( key == KeyValService.PositionCoordsKey ) {
            // hack to update the search params at the same time
            this.updateSearchParamCoords(value);
        }
        */

        return NativeStorage.setItem(key, value);
    }

    /*
    private updateSearchParamCoords(coords) {
        this.get(KeyValService.LastSearchParamsKey).then(
            (data) => {
                let newData = data;
                newData.latitude = coords.latitude;
                newData.longitude = coords.longitude;
                this.set(KeyValService.LastSearchParamsKey,newData).then(
                    (setted) => {
                    },
                    (errr) => { });
            },
            (err) => {
                // dont care
            });
    }
    */


    public setDefaultObjects() {

        this.get(KeyValService.WatchesListKey).then(
            (data) => {//we good
            },
            (err) => {
                this.set(KeyValService.WatchesListKey,[]).then(
                    (setted) => {
                    },
                    (errr) => { });
            });


        this.get(KeyValService.WatchInventoriesListKey).then(
            (data) => {//we good
            },
            (err) => {
                this.set(KeyValService.WatchesListKey,[]).then(
                    (setted) => {
                    },
                    (errr) => { });
            });

        this.get(KeyValService.LastSearchParamsKey).then(
            (data) => {//we good
            },
            (err) => {
                this.set(KeyValService.LastSearchParamsKey, {
                    car: '',
                    yearStart: '',
                    yearEnd: '',
                    zipcode: '',
                    latitude: '',
                    longitude: ''
                }).then(
                    (setted) => {
                    },
                    (errr) => { });
            });
        
    }
}