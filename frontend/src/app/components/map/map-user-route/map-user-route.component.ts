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
import { HttpClient } from '@angular/common/http';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-map-user-route',
  templateUrl: './map-user-route.component.html',
  styleUrls: ['./map-user-route.component.scss'],
})
export class MapUserRouteComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  //TODO: private after
  private userSub!: Subscription;
  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {
        // delay init so Angular finishes rendering first
        //TODO: why does set timout work here? whatdoes it do behind the scenes? is it necessary? How is it related to single thread of browser
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.map) this.map.remove();
  }

  private initMap() {
    if (!this.loggedInUser) return;

    this.mapService.initMap(
      this.mapContainer.nativeElement,
      [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      () => {}, // no right-click adding
      () => {
        this.addOrUpdateMarker(this.loggedInUser!);
        this.updateUser();
      }
    );

    //pull the reference back into the component's map
    this.map = this.mapService.getMap();

    // ensure proper render after Angular paints
    //TODO: why does set timout work here? whatdoes it do behind the scenes? is it necessary? How is it related to single thread of browser
    setTimeout(() => this.map.resize(), 200);
  }

  private updateUser() {
    if (!this.loggedInUser) return;

    //TODO: read angular environment (why its bad to put urls)
    //TODO: no http calls from within a component - only via services
    this.http
      .get<User>(`http://localhost:5202/api/users/${this.loggedInUser.id}`)
      .subscribe((currentUser) => {
        this.mapService.clearMediaMarkers();
        this.addOrUpdateMarker(currentUser);
        this.mapService.drawTrail(currentUser, '#007bff'); //TODO: const (decide how)
        this.mapService.drawMediaMarkers(currentUser);
      });
  }

  private addOrUpdateMarker(user: User) {
    //TODO: is it necessary this check?
    if (!this.loggedInUser) return;
    this.mapService.addOrUpdateMarker(user, true); // only logged-in user
  }
}
