import { NgModule } from '@angular/core';
import { MapFriendsListComponent } from './map-friends-list/map-friends-list.component';
import { MapLiveComponent } from './map-live/map-live.component';
import { MapNotificationsComponent } from './map-notifications/map-notifications.component';
import { MapUserRouteComponent } from './map-user-route/map-user-route.component';
import { MapComponent } from './map.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    MapComponent,
    MapFriendsListComponent,
    MapNotificationsComponent,
    MapLiveComponent,
    MapUserRouteComponent,
  ],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [
    MapComponent,
    MapFriendsListComponent,
    MapNotificationsComponent,
    MapLiveComponent,
    MapUserRouteComponent,
  ],
})
export class MapModule {}
