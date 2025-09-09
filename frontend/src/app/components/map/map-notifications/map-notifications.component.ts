import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FriendsService } from '../../../services/friends.service';
import { GeoService } from '../../../services/geo.service';

@Component({
  selector: 'app-map-notifications',
  templateUrl: './map-notifications.component.html',
  styleUrls: ['./map-notifications.component.scss'],
})
export class MapNotificationsComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null;
  nearByUsers: User[] = [];

  //TODO: we dont save subscriptions, find another way to unsubscribe
  userSub!: Subscription;
  intervalSub!: Subscription;

  radius: number = 1;

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
    private geoService: GeoService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;

      if (user) {
        this.updateNearbyUsers();

        //TODO: put into a const
        this.intervalSub = interval(5000).subscribe(() =>
          this.updateNearbyUsers()
        );
      }
    });
  }

  updateNearbyUsers() {
    //TODO: uncessecary check
    if (!this.loggedInUser) return;

    this.friendsService
      .getFriends(this.loggedInUser.id)
      .subscribe((friends) => {
        // TODO: dont use short names, write the full loggedLattitude
        const loggedLat = Number(this.loggedInUser!.currentLocation.latitude);
        const loggedLng = Number(this.loggedInUser!.currentLocation.longitude);

        this.nearByUsers = friends.filter((u) => {
          const userLat = Number(u.currentLocation.latitude);
          const userLng = Number(u.currentLocation.longitude);

          const distance = this.geoService.getDistance(
            loggedLat,
            loggedLng,
            userLat,
            userLng
          );

          return distance <= this.radius;
        });
      });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }
}
