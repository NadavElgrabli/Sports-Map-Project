import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Subscription, forkJoin } from 'rxjs';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';
import { LOGGED_USER_TRAIL_COLOR } from '../../../shared/constants/trail.constants';

@Component({
  selector: 'app-map-user-route',
  templateUrl: './map-user-route.component.html',
  styleUrls: ['./map-user-route.component.scss'],
})
export class MapUserRouteComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  private userSub!: Subscription;

  constructor(
    private authService: AuthService,
    private mapService: MapService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {
        //TODO: why does set timout work here? whatdoes it do behind the scenes? is it necessary? How is it related to single thread of browser
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  private initMap() {
    if (!this.loggedInUser) return;

    this.mapService.initMap(
      this.mapContainer.nativeElement,
      [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      () => {},
      () => {
        this.addOrUpdateMarker(this.loggedInUser!);
        this.updateUser();
      }
    );

    this.map = this.mapService.getMap();
  }

  private updateUser() {
    this.userService
      .getUserById(this.loggedInUser!.id)
      .subscribe((currentUser) => {
        this.mapService.clearMediaMarkers();
        this.addOrUpdateMarker(currentUser);
        this.mapService.drawTrail(currentUser, LOGGED_USER_TRAIL_COLOR);
        this.mapService.drawMediaMarkers(currentUser);
      });
  }

  private addOrUpdateMarker(user: User) {
    this.mapService.addOrUpdateMarker(user, true);
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.map) this.map.remove();
  }
}
