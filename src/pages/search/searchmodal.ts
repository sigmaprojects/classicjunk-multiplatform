import { Injectable } from '@angular/core';
import { AlertController, Alert } from 'ionic-angular';

@Injectable()
export class SearchModal {

    constructor(
        public alertCtrl: AlertController
        ) {
    }

    public show(
        searchParams: any,
        handler: any
        ): void {

        //let inputs: Array<{ name: string, placeholder: string, type: string, value: string }> = new Array();
        let inputs = new Array();
        
        inputs.push({
            name: 'car',
            placeholder: 'Car (e.g. "Ford Focus")',
            type: 'text',
            value: searchParams.car
        });

        inputs.push({
            name: 'yearStart',
            placeholder: 'Year Start (e.g. "1998")',
            type: 'number',
            value: searchParams.yearStart
        });

        inputs.push({
            name: 'yearEnd',
            placeholder: 'Year End (e.g. "2004")',
            type: 'number',
            value: searchParams.yearEnd
        });

        if(
            typeof searchParams != 'undefined' &&
            searchParams.hasOwnProperty('latitude') &&
            searchParams.hasOwnProperty('longitude') && 
            typeof searchParams.latitude == 'number' &&
            typeof searchParams.longitude == 'number' &&
            searchParams.latitude.toString().length > 3 &&
            searchParams.longitude.toString().length > 3
        ) { 
            inputs.push({ name: 'latitude', placeholder: '', type: 'hidden', value: searchParams.latitude });
            inputs.push({ name: 'longitude', placeholder: '', type: 'hidden', value: searchParams.longitude });
            // insert hidden zipcode just to keep the object sane
            inputs.push({ name: 'zipcode', placeholder: 'Zip Code', type: 'hidden', value: searchParams.zipcode });
        } else {
            console.log("No latitude/longitude for search, adding zipcode");
            console.log(JSON.stringify(searchParams));
            inputs.push({ name: 'zipcode', placeholder: 'Zip Code', type: 'number', value: searchParams.zipcode });
            // insert hidden lat/lng just to keep object sane
            inputs.push({ name: 'latitude', placeholder: '', type: 'hidden', value: '' });
            inputs.push({ name: 'longitude', placeholder: '', type: 'hidden', value: '' });
        }

        let searchModal = this.alertCtrl.create({
            title: 'Search',
            inputs: inputs,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Search Cars',
                    handler: handler
                }
            ]
        });
        searchModal.present();
        //return searchModal;
    } 

}


