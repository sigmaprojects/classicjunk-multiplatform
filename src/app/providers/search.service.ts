import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

@Injectable()
export class CarSearchService {
    static get parameters() {
        return [[Http]];
    }
    constructor(private http: Http) {
    }

    /*
    searchInventory(car, yearStart, yearEnd, latitude, longitude, zipcode) {
        let url = 'http://api.classicjunk.sigmaprojects.org/inventory/search/format/json/car/' + encodeURI(car) + '/yearStart/' + encodeURI(yearStart) + '/yearEnd/' + encodeURI(yearEnd) + '/lat/' + encodeURI(latitude) + '/lng/' + encodeURI(longitude) + '/zipcode/' + encodeURI(zipcode);
        console.log("calling url: " + url);
        var response = this.http.get(url).map(res => res.json());
        return response;
    }
    */

    searchInventory(car, yearStart, yearEnd, latitude, longitude, zipcode): Observable<any> {
        let url = 'https://api-classicjunk.sigmaprojects.org/inventory/search/format/json/car/' + encodeURI(car) + '/yearStart/' + encodeURI(yearStart) + '/yearEnd/' + encodeURI(yearEnd) + '/lat/' + encodeURI(latitude) + '/lng/' + encodeURI(longitude) + '/zipcode/' + encodeURI(zipcode);
        console.log("calling url: " + url);
        var response = this.http.get(url).map(res => res.json().results);
        return response;
    }




}