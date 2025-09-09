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
    private geoService: GeoService // ✅ inject geo service
  ) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {
        // todo: no scope for 1 line
        this.loadFriends();
      }
    });
  }

  loadFriends() {
    if (!this.loggedInUser) return; //todo: do we need this check?

    this.friendsService
      .getFriends(this.loggedInUser.id)
      .subscribe((friends) => {
        this.friends = this.friendsService.sortFriends(
          friends,
          this.loggedInUser,
          this.sortBy
        );
      });
  }

  // todo(done): underline before html functions
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
    return this.geoService.getDistance(lat1, lng1, lat2, lng2); // ✅ fixed to use GeoService
  }
}
