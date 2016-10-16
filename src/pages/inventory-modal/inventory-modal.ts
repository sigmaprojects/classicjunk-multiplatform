import { Component } from '@angular/core';
import { NavParams, ViewController, Platform, ActionSheetController } from 'ionic-angular';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SocialSharing} from 'ionic-native';

@Component({
  selector: 'inventory-modal',
  templateUrl: './inventory-modal.html'
})

export class InventoryModal {

  inventory;
  caller: any;

  addressUrl: SafeUrl;
  phoneUrl: SafeUrl;
  placeholderimg: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKRJREFUeNrs0QENAAAIwzDAv+djg5BOwtpJSncaC4AICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAICBABASIgQAQEiIAAERABASIgQATkeyvAAPvNA8UTegMeAAAAAElFTkSuQmCC';


  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController
  ) {
    console.log('modal constructor');
    this.inventory = params.get("inventory");
    this.caller = params.get("caller");

    let mapHref = '';
    if (this.platform.is('ios')) {
      mapHref = 'maps://maps.apple.com/?daddr='
    } else if (this.platform.is('android')) {
      mapHref = 'geo:0,0?q=';
    } else if (this.platform.is('windows')) {
      mapHref = 'geo:0,0?q=';
    } else if (this.platform.is('browser')) {
      mapHref = 'geo:0,0?q=';
    } else {
      mapHref = 'geo:0,0?q=';
    }

    this.addressUrl = sanitizer.bypassSecurityTrustUrl(mapHref+this.inventory.location.address);

    this.phoneUrl = sanitizer.bypassSecurityTrustUrl('tel:'+this.inventory.location.phonenumber);

    try {
      this.inventory.location.phonenumber = this.formatPhone(this.inventory.location.phonenumber);
    } catch(e) {}

    
  }

  public swipeEvent(e): void {
    try {
      switch (e.direction) {
        case 2: {
          console.log("DIRECTION_LEFT");
          this.dismiss();
          this.caller.showNext();
          break;
        }
        case 4: {
          console.log("DIRECTION_RIGHT");
          this.dismiss();
          this.caller.showPrevious();
          break;
        }
      }
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }


  public showActionSheetShare(inventory): void {
    //socialsharing.share('Optional message', 'Optional title', 'https://www.google.nl/images/srpr/logo4w.png', null)
    /*
    SocialSharing.share("Genral Share Sheet",null,null,"http://pointdeveloper.com")
    .then(()=>{
        alert("Success");
      },
      ()=>{
         alert("failed")
      })
      */
    let shareString = "Found a " + inventory.caryear + " " + inventory.car + " using the Classic Junk app. It's located " + inventory.location.address + "." + 
      "#ClassicJunk #ClassicJunkApp #SigmaProjects #" + inventory.car;

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share via...',
      cssClass: 'share-action-sheets',
      buttons: [
        {
          text: 'Post to Instagram',
          icon: 'logo-instagram',
          handler: () => {
            console.log('instagram clicked');
            SocialSharing.shareViaInstagram(shareString,inventory.imageurl).then(
              (success)=>{
                //alert("Success");
              },
              (fail)=>{
                //alert("failed")
            });
            actionSheet.dismiss();
          }
        },
        {
          text: 'Post to Facebook',
          icon: 'logo-facebook',
          handler: () => {
            console.log('facebook clicked');
            SocialSharing.shareViaFacebook(shareString,inventory.imageurl).then(
              (success)=>{
                //alert("Success");
              },
              (fail)=>{
                //alert("failed")
            });
            actionSheet.dismiss();
          }
        },
        {
          text: 'Send Message',
          icon: 'ios-text',
          handler: () => {
            console.log('send message clicked');
             SocialSharing.shareViaSMS(shareString, null).then(
              (success)=>{
                //alert("Success");
              },
              (fail)=>{
                //alert("failed")
            });
            actionSheet.dismiss();
          }
        },
        {
          text: 'Send Mail',
          icon: 'ios-mail',
          handler: () => {
            console.log('send mail clicked');
             SocialSharing.shareViaEmail(shareString, "Found the car", [""], [""], [""], inventory.imageurl).then(
              (success)=>{
                //alert("Success");
              },
              (fail)=>{
                //alert("failed")
            });
            actionSheet.dismiss();
          }
        },
        {
          text: 'Cancel',
          icon: 'ios-arrow-down',
          handler: () => {
            actionSheet.dismiss();
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }


  public dismiss(): void {
    this.viewCtrl.dismiss();
  }


  public close(event): void {
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


  public formatPhone(text: string): string {
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