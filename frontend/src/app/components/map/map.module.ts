// map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { MapLiveComponent } from './map-live/map-live.component';
import { MapNotificationsComponent } from './map-notifications/map-notifications.component';
import { MapFriendsListComponent } from './map-friends-list/map-friends-list.component';
import { MapUserRouteComponent } from './map-user-route/map-user-route.component';

@NgModule({
  declarations: [
    MapComponent,
    MapLiveComponent,
    MapNotificationsComponent,
    MapFriendsListComponent,
    MapUserRouteComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule, MapRoutingModule],
})
export class MapModule {}
