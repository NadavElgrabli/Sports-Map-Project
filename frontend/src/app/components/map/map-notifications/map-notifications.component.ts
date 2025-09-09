import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FriendsService } from '../../../services/friends.service';

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

  radius: number = 1; // default 1 km

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService
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

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.intervalSub) this.intervalSub.unsubscribe();
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

        //create a new array containing only the friends who satisfy the condition
        this.nearByUsers = friends.filter((u) => {
          const userLat = Number(u.currentLocation.latitude);
          const userLng = Number(u.currentLocation.longitude);

          //calculate distance between loggedin user and his friend
          const distance = this.friendsService.getDistance(
            loggedLat,
            loggedLng,
            userLat,
            userLng
          );

          //friends filter keeps only users who return true
          return distance <= this.radius;
        });
      });
  }
}
