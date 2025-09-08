import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class FriendsService {
  constructor(private http: HttpClient) {}

  getFriends(userId: number) {
    return this.http.get<User[]>(`http://localhost:5202/api/users/${userId}/friends`);
  }

  sortFriends(friends: User[], loggedInUser: User | null, sortBy: 'name' | 'weight' | 'distance'): User[] {
    if (!loggedInUser) return friends;

    switch (sortBy) {
      case 'name':
        return [...friends].sort((a, b) => a.username.localeCompare(b.username));
      case 'weight':
        return [...friends].sort((a, b) => Number(a.weight) - Number(b.weight));
      case 'distance':
        const loggedLat = Number(loggedInUser.currentLocation.latitude);
        const loggedLng = Number(loggedInUser.currentLocation.longitude);
        return [...friends].sort((a, b) => {
          const distA = this.getDistance(loggedLat, loggedLng, Number(a.currentLocation.latitude), Number(a.currentLocation.longitude));
          const distB = this.getDistance(loggedLat, loggedLng, Number(b.currentLocation.latitude), Number(b.currentLocation.longitude));
          return distA - distB;
        });
      default:
        return friends;
    }
  }

  getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
