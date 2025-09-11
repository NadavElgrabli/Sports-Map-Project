import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/user.model';
import { GeoService } from './geo.service';
import { SortBy } from '../shared/types/sort-by.type';
import { sortByName } from '../shared/handlers/sort-by-name.handler';
import { sortByWeight } from '../shared/handlers/sort-by-weight.handler';
import { sortByDistance } from '../shared/handlers/sort-by-distance.handler';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  constructor(private http: HttpClient, private geoService: GeoService) {}

  getFriends(userId: number) {
    return this.http.get<User[]>(
      `http://localhost:5202/api/users/${userId}/friends`
    );
  }

  sortFriends(
    friends: User[],
    loggedInUser: User | null,
    sortBy: SortBy
  ): User[] {
    if (!loggedInUser) return friends;

    const handlers = {
      name: sortByName,
      weight: sortByWeight,
      distance: sortByDistance(this.geoService, loggedInUser),
    };

    return [...friends].sort(handlers[sortBy]);
  }
}
