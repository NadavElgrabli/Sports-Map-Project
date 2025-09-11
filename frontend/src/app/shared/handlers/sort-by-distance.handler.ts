import { User } from '../../models/user.model';
import { GeoService } from '../../services/geo.service';

export const sortByDistance = (geoService: GeoService, loggedInUser: User) => {
  const loggedLat = Number(loggedInUser.currentLocation.latitude);
  const loggedLng = Number(loggedInUser.currentLocation.longitude);

  return (a: User, b: User) => {
    const distA = geoService.getDistance(
      loggedLat,
      loggedLng,
      Number(a.currentLocation.latitude),
      Number(a.currentLocation.longitude)
    );
    const distB = geoService.getDistance(
      loggedLat,
      loggedLng,
      Number(b.currentLocation.latitude),
      Number(b.currentLocation.longitude)
    );
    return distA - distB;
  };
};
