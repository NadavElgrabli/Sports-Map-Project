import { Injectable } from '@angular/core';

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

    const distanceKm = earthRadiusKm * centralAngle;
    return distanceKm;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
