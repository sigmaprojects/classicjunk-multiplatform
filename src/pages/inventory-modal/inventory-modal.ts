import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'inventory-modal',
  templateUrl: './inventory-modal.html'
})

export class InventoryModal {

  inventory;
  addressUrl: SafeUrl;
  phoneUrl: SafeUrl;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private sanitizer: DomSanitizer
  ) {
    console.log('modal constructor');
    this.inventory = params.get("inventory");

    this.addressUrl = sanitizer.bypassSecurityTrustUrl('geo:0,0?q='+this.inventory.location.address);

    this.phoneUrl = sanitizer.bypassSecurityTrustUrl('tel:'+this.inventory.location.phonenumber);

    try {
      this.inventory.location.phonenumber = this.formatPhone(this.inventory.location.phonenumber);
    } catch(e) {}

    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  close(event) {
    /*
    console.log(JSON.stringify(event));
    console.log(event.target);
    console.log(JSON.stringify(event.target));
    */
    let senderElementName = event.target.tagName.toLowerCase();
    //console.log("senderElementName is: " + senderElementName);
    if (senderElementName === 'a') {
      // do something here
      //console.log("senderElementName is a?"); 
    } else {
      //do something with <a> tag
      //console.log("senderElementName is NOT a");
      this.viewCtrl.dismiss();
    }
  }

  formatPhone(text: string) {
    if (text.toString().length < 3) {
      return text;
    } else if (text.toString().length == 11) {
      return text.toString().replace(/(\d)(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3-$4");
    } else if (text.toString().length == 10) {
      return text.toString().replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "$1-$2-$3");
    }
    return text;
  }

  public sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}