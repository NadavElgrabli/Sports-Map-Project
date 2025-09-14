import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import {
  interval,
  Subject,
  EMPTY,
  takeUntil,
  switchMap,
  startWith,
} from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FriendsService } from '../../../services/friends.service';
import { GeoService } from '../../../services/geo.service';
import { NEARBY_USERS_REFRESH_INTERVAL_MS } from '../../../shared/constants/time.constants';

@Component({
  selector: 'app-map-notifications',
  templateUrl: './map-notifications.component.html',
  styleUrls: ['./map-notifications.component.scss'],
})
export class MapNotificationsComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null;
  nearByUsers: User[] = [];
  radius: number = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
    private geoService: GeoService
  ) {}

  ngOnInit() {
    this.authService.user
      .pipe(
        takeUntil(this.destroy$),
        switchMap((user) => {
          this.loggedInUser = user;

          if (!user) return EMPTY; // no user, stop here

          return interval(NEARBY_USERS_REFRESH_INTERVAL_MS).pipe(
            startWith(0) // immediately trigger first update
          );
        })
      )
      .subscribe(() => this.updateNearbyUsers());
  }

  updateNearbyUsers() {
    if (!this.loggedInUser) return;

    this.friendsService
      .getFriends(this.loggedInUser.id)
      .subscribe((friends) => {
        const loggedLatitude = Number(
          this.loggedInUser!.currentLocation.latitude
        );
        const loggedLongitude = Number(
          this.loggedInUser!.currentLocation.longitude
        );

        this.nearByUsers = friends.filter((u) => {
          const userLatitude = Number(u.currentLocation.latitude);
          const userLongitude = Number(u.currentLocation.longitude);

          const distance = this.geoService.getDistance(
            loggedLatitude,
            loggedLongitude,
            userLatitude,
            userLongitude
          );

          return distance <= this.radius;
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
