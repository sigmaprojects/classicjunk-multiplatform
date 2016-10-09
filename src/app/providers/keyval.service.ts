import { Injectable } from '@angular/core';
import { NativeStorage, Device } from 'ionic-native';

@Injectable()
export class KeyValService {  
 
    public static LastSearchParamsKey = "LastSearchParams";
    public static PositionCoordsKey = "PositionCoords";
    public static WatchInventoriesKey = "WatchInventories";
    public static HighestSeenWatchInventoryIdKey = "HighestSeenWatchInventoryId";
 

    constructor() {
        /*
        NativeStorage.clear().then(
            (finished) => {
                console.log("cleared storage.");
                console.log(JSON.stringify(finished));
            });
            */
        this.setDefaultObjects();
    }
 
    public getDeviceUuid(): string {
        // test uuid: ffffffff-e167-463a-e390-b0f35b303118
        return Device.device.uuid;
        //return 'ffffffff-e167-463a-e390-b0f35b303118';
        //return 'ffffffff-9adc-3175-ffff-ffffc5c2767f';
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

        if( key == KeyValService.PositionCoordsKey ) {
            // hack to update the search params at the same time
            this.updateSearchParamCoords(value);
        }

        return NativeStorage.setItem(key, value);
    }


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


    private setDefaultObjects() {
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