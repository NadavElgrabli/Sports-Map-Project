import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { GeoService } from './geo.service';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  // TODO (DONE): rethink about the logic of the service (we usually (not always) have service that are "dataGetters", and services with logic, we usually seperate them.)
  //Also consider seperating functions here to seperate services
  constructor(private http: HttpClient, private geoService: GeoService) {}

  getFriends(userId: number) {
    return this.http.get<User[]>(
      `http://localhost:5202/api/users/${userId}/friends`
    );
  }

  sortFriends(
    friends: User[],
    loggedInUser: User | null,
    sortBy: 'name' | 'weight' | 'distance'
  ): User[] {
    // TODO: make this function 3-4 rows (think of SOLID, what would happen if i wanted to add a new sorting type?)
    if (!loggedInUser) return friends;

    switch (sortBy) {
      case 'name':
        return [...friends].sort((a, b) =>
          a.username.localeCompare(b.username)
        );
      case 'weight':
        return [...friends].sort((a, b) => Number(a.weight) - Number(b.weight));
      case 'distance':
        const loggedLat = Number(loggedInUser.currentLocation.latitude);
        const loggedLng = Number(loggedInUser.currentLocation.longitude);
        return [...friends].sort((a, b) => {
          const distA = this.geoService.getDistance(
            loggedLat,
            loggedLng,
            Number(a.currentLocation.latitude),
            Number(a.currentLocation.longitude)
          );
          const distB = this.geoService.getDistance(
            loggedLat,
            loggedLng,
            Number(b.currentLocation.latitude),
            Number(b.currentLocation.longitude)
          );
          return distA - distB;
        });
      default:
        return friends;
    }
  }
}
