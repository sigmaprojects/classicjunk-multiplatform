import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { KeyValService } from './keyval.service';

@Injectable()
export class FCMService {
    static get parameters() {
        return [[Http,KeyValService]];
    }

    platformString: string;

    constructor(
        private http: Http,
        private keyValService: KeyValService,
        private platform: Platform
    ) {
        if(this.platform.is('ios')) {
            this.platformString = 'ios';
        } else if(this.platform.is('android')) {
            this.platformString = 'android';
        } else if(this.platform.is('windows')) {
            this.platformString = 'windows';
        } else if(this.platform.is('browser')) {
            this.platformString = 'browser';
        } else {
            this.platformString = 'unknown';
        }
    }

    register(regid): Observable<any> {
        let device_id = this.keyValService.getDeviceUuid();
        let url = 'https://api-classicjunk.sigmaprojects.org/device/register/?device_id=' + encodeURI(device_id) + '&registration_id=' + encodeURI(regid) + '&platform=' + encodeURI(this.platformString);
        //console.log("FCM Calling URL: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }




}