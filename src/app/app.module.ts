import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ClassicJunkApp } from './app.component';
import { NotificationsPage } from '../pages/notifications/notifications';
import { Search } from '../pages/search/search';
import { InventoryModal } from '../pages/inventory-modal/inventory-modal';
import { Watches } from '../pages/watches/watches';

import { SearchOptionsPage } from '../pages/search/search.options';
import { NotificationsOptionsPage } from '../pages/notifications/notifications.options';


import { KeyValService } from './providers/keyval.service';
import { FCMService } from './providers/fcm.service';
import { WatchService } from './providers/watch.service';
import { CarSearchService } from './providers/search.service';
import { SearchModal } from '../pages/search/searchmodal';

@NgModule({
  declarations: [
    ClassicJunkApp,
    Watches,
    Search,
    InventoryModal,
    NotificationsPage,
    SearchOptionsPage,
    NotificationsOptionsPage
  ],
  imports: [
    IonicModule.forRoot(ClassicJunkApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClassicJunkApp,
    Watches,
    NotificationsPage,
    Search,
    InventoryModal,
    SearchOptionsPage,
    NotificationsOptionsPage
  ],
  providers: [
    KeyValService,
    FCMService,
    WatchService,
    SearchModal,
    CarSearchService
  ]
})
export class AppModule {}
