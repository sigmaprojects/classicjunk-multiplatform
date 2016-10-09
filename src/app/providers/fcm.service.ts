import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { KeyValService } from './keyval.service';

@Injectable()
export class FCMService {
    static get parameters() {
        return [[Http,KeyValService]];
    }
    constructor(private http: Http, private keyValService: KeyValService) {
    }

    register(regid): Observable<any> {
        let device_id = this.keyValService.getDeviceUuid();
        let url = 'https://api-classicjunk.sigmaprojects.org/device/register/?device_id=' + encodeURI(device_id) + '&registration_id=' + encodeURI(regid) + '&platform=android';
        console.log("FCM Calling URL: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }




}