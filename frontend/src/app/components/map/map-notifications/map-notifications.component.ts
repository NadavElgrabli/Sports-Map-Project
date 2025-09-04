import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { interval, Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-notifications',
  templateUrl: './map-notifications.component.html',
  styleUrl: './map-notifications.component.scss',
})
export class MapNotificationsComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null;
  nearByUsers: User[] = [];
  userSub!: Subscription;
  intervalSub!: Subscription;

  radius: number = 1; // default 1 km

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;

      if (user) {
        this.updateNearbyUsers();

        // Refresh every 5 seconds
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
    if (!this.loggedInUser) return;

    this.http
      .get<User[]>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}/friends`
      )
      .subscribe((friends) => {
        const loggedLat = Number(this.loggedInUser!.currentLocation.latitude);
        const loggedLng = Number(this.loggedInUser!.currentLocation.longitude);

        this.nearByUsers = friends.filter((u) => {
          const userLat = Number(u.currentLocation.latitude);
          const userLng = Number(u.currentLocation.longitude);
          const distance = this.getDistance(
            loggedLat,
            loggedLng,
            userLat,
            userLng
          );
          return distance <= this.radius; 
        });

        // console.log(
        //   `Nearby friends within ${this.radius} km:`,
        //   this.nearByUsers
        // );
      });
  }

  private getDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Radius of Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
