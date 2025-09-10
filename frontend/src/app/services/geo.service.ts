import { Injectable } from "@angular/core";
import { User } from "../models/user.model";

@Injectable({ providedIn: 'root' })
export class GeoService {
  getDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ): number {
    const earthRadiusKm = 6371;

    const deltaLatitude = this.degreesToRadians(latitude2 - latitude1);
    const deltaLongitude = this.degreesToRadians(longitude2 - longitude1);

    const a =
      Math.sin(deltaLatitude / 2) ** 2 +
      Math.cos(this.degreesToRadians(latitude1)) *
        Math.cos(this.degreesToRadians(latitude2)) *
        Math.sin(deltaLongitude / 2) ** 2;

    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * centralAngle;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  computeDistancesFromUserToFriends(user: User, friends: User[]): Map<number, number> {
    const distances = new Map<number, number>();
    const userLat = user.currentLocation.latitude;
    const userLng = user.currentLocation.longitude;

    friends.forEach(friend => {
      const distance = this.getDistance(
        userLat,
        userLng,
        friend.currentLocation.latitude,
        friend.currentLocation.longitude
      );
      distances.set(friend.id, distance);
    });

    return distances;
  }
}
