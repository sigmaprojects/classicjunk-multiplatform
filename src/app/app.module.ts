import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { ClassicJunkApp } from './app.component';
import { NotificationsPage } from '../pages/notifications/notifications';
import { Search } from '../pages/search/search';
import { InventoryModal } from '../pages/inventory-modal/inventory-modal';
import { Watches } from '../pages/watches/watches';

import { SearchOptionsPage } from '../pages/search/search.options';
import { NotificationsOptionsPage } from '../pages/notifications/notifications.options';  
@NgModule({
  declarations: [
    ClassicJunkApp,
    NotificationsPage,
    Search,
    InventoryModal,
    Watches,
    SearchOptionsPage,
    NotificationsOptionsPage
  ],
  imports: [
    IonicModule.forRoot(ClassicJunkApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ClassicJunkApp,
    NotificationsPage,
    Search,
    InventoryModal,
    Watches,
    SearchOptionsPage,
    NotificationsOptionsPage
  ],
  providers: []
})
export class AppModule {}
