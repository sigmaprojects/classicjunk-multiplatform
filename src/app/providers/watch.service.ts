﻿import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { KeyValService } from './keyval.service';

/*
    this wont work, need another method for "createwatch" AND "updatewatch"
    but the controller doesnt' need to know about it, just handle it here in the service
    with an if/else depending on if id exists and is not 0
*/

@Injectable()
export class WatchService {
    static get parameters() {
        return [[Http,KeyValService]];
    }

    private deviceuuid: string;

    constructor(
        private http: Http,
        public keyValService: KeyValService
        ) {
            this.deviceuuid = keyValService.getDeviceUuid();
    }

    public getWatchInventories(): Observable<any> {
        let url = 'https://api-classicjunk.sigmaprojects.org/watch/getwatches/format/json/device_id/' + encodeURI(this.deviceuuid);
        //console.log("calling url: " + url);
        var response = this.http.get(url).map(
            (res) => {
                let results = res.json().results;
                let watchInventories = [];
                for(let result of results) {
                    for(let wi of result.watchinventories) {
                        watchInventories.push(wi);
                    }
                }
                return watchInventories;
            }
        );
        return response;
    }

    public list(): Observable<any> {
        let url = 'https://api-classicjunk.sigmaprojects.org/watch/getwatches/format/json/device_id/' + encodeURI(this.deviceuuid);
        //console.log("calling url: " + url);
        //var response = this.http.get(url).map(res => res.json());
        var response = this.http.get(url).map(
            (res) => {
                let results = res.json().results;
                let watches = [];
                for(let result of results) {
                    if( result.hasOwnProperty('watchinventories') ) {
                        result.watchinventories = [];
                    }
                    watches.push(result);
                }
                return watches;
            }
        );
        return response;
    }

    public delete(id: number): Observable<any> {
        let url = 'https://api-classicjunk.sigmaprojects.org/watch/deleteWatch/format/json/device_id/' + encodeURI(this.deviceuuid) + '/id/' + encodeURI(id.toString());
        //console.log("calling url: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }

    public save(
        id: string,
        label: string,
        year_start: string,
        year_end: string,
        lat: string,
        lng: string,
        zipcode: string
    ): Observable<any> {
        if( typeof id == 'undefined' || id == null || id.toString() == '0' || id.toString().length == 0 ) {
            return this.createWatch(label,year_start,year_end,lat,lng,zipcode);
        } else {
            return this.updateWatch(id,label,year_start,year_end,lat,lng,zipcode);
        }
    }

    private updateWatch(
        id: string,
        label: string,
        year_start: string,
        year_end: string,
        lat: string,
        lng: string,
        zipcode: string
    ): Observable<any> {

        if(typeof id == 'undefined') {
            id = '0';
        }
        if(typeof lat == 'undefined') {
            lat = '';
        }
        if(typeof lng == 'undefined') {
            lng = '';
        }
        if(typeof zipcode == 'undefined') {
            zipcode = '';
        }
        if(typeof year_start == 'undefined') {
            year_start = '';
        }
        if(typeof year_end == 'undefined') {
            year_end = '';
        }

        let url = 'https://api-classicjunk.sigmaprojects.org/watch/updateWatch/format/json/device_id/' + encodeURI(this.deviceuuid) +
        '/id/' + encodeURI(id.toString()) +
        '/label/' + encodeURI(label) +
        '/year_start/' + encodeURI(year_start.toString()) +
        '/year_end/' + encodeURI(year_end.toString()) +
        '/lat/' + encodeURI(lat.toString()) +
        '/lng/' + encodeURI(lng.toString()) +
        '/zipcode/' + encodeURI(zipcode.toString())
        ;
        //console.log("calling url: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }


    private createWatch(
        label: string,
        year_start: string,
        year_end: string,
        lat: string,
        lng: string,
        zipcode: string
    ): Observable<any> {

        if(typeof lat == 'undefined') {
            lat = '';
        }
        if(typeof lng == 'undefined') {
            lng = '';
        }
        if(typeof zipcode == 'undefined') {
            zipcode = '';
        }
        if(typeof year_start == 'undefined') {
            year_start = '';
        }
        if(typeof year_end == 'undefined') {
            year_end = '';
        }

        let url = 'https://api-classicjunk.sigmaprojects.org/watch/createwatch/format/json/device_id/' + encodeURI(this.deviceuuid) +
        '/label/' + encodeURI(label) +
        '/year_start/' + encodeURI(year_start.toString()) +
        '/year_end/' + encodeURI(year_end.toString()) +
        '/lat/' + encodeURI(lat.toString()) +
        '/lng/' + encodeURI(lng.toString()) +
        '/zipcode/' + encodeURI(zipcode.toString())
        ;
        //console.log("calling url: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }


}