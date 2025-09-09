import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FriendsService } from '../../../services/friends.service';
import { GeoService } from '../../../services/geo.service';

@Component({
  selector: 'app-map-friends-list',
  templateUrl: './map-friends-list.component.html',
  styleUrls: ['./map-friends-list.component.scss'],
})
export class MapFriendsListComponent {
  loggedInUser!: User | null;
  friends: User[] = [];
  sortBy: 'name' | 'weight' | 'distance' = 'name'; // todo: if the type is in multiple use - give it name

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
    private geoService: GeoService
  ) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) this.loadFriends();
    });
  }

  loadFriends() {
    this.friendsService
      .getFriends(this.loggedInUser!.id)
      .subscribe((friends) => {
        this.friends = this.friendsService.sortFriends(
          friends,
          this.loggedInUser,
          this.sortBy
        );
      });
  }

  _sortFriends() {
    if (!this.loggedInUser) return;

    this.friends = this.friendsService.sortFriends(
      this.friends,
      this.loggedInUser,
      this.sortBy
    );
  }

  getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    // todo: explain what happening here
    return this.geoService.getDistance(lat1, lng1, lat2, lng2);
  }
}
