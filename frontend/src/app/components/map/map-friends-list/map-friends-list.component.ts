import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-friends-list',
  templateUrl: './map-friends-list.component.html',
  styleUrl: './map-friends-list.component.scss',
})
export class MapFriendsListComponent {
  loggedInUser!: User | null;
  friends: User[] = [];
  sortBy: 'name' | 'weight' | 'distance' = 'name';

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {
        this.loadFriends();
      }
    });
  }

  loadFriends() {
    if (!this.loggedInUser) return;

    this.http
      .get<User[]>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}/friends`
      )
      .subscribe((friends) => {
        this.friends = friends;
        this.sortFriends();
      });
  }

  sortFriends() {
    if (!this.loggedInUser) return;

    switch (this.sortBy) {
      case 'name':
        this.friends.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'weight':
        this.friends.sort((a, b) => Number(a.weight) - Number(b.weight));
        break;
      case 'distance':
        const loggedLat = Number(this.loggedInUser.currentLocation.latitude);
        const loggedLng = Number(this.loggedInUser.currentLocation.longitude);
        this.friends.sort((a, b) => {
          const distA = this.getDistance(
            loggedLat,
            loggedLng,
            Number(a.currentLocation.latitude),
            Number(a.currentLocation.longitude)
          );
          const distB = this.getDistance(
            loggedLat,
            loggedLng,
            Number(b.currentLocation.latitude),
            Number(b.currentLocation.longitude)
          );
          return distA - distB;
        });
        break;
    }
  }

  public getDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth radius in km
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
