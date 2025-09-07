import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { User } from '../../../models/user.model';
import mapboxgl from 'mapbox-gl';
import { AuthService } from '../../../services/auth.service';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Subscription, interval, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-live',
  templateUrl: './map-live.component.html',
  styleUrls: ['./map-live.component.scss'],
})
export class MapLiveComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private userSub!: Subscription;
  private updateIntervalSub!: Subscription;

  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  private markers: Map<number, mapboxgl.Marker> = new Map();

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.updateIntervalSub) this.updateIntervalSub.unsubscribe();
    if (this.map) this.map.remove();
  }

  initMap() {
    if (!this.loggedInUser) return;

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZWUxOTk2IiwiYSI6ImNtZjN1cnhtdDAwcHYya3I0cmhpNzF3bDkifQ.b4WP0iqLlxYqJAqstne1lA';

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      zoom: 10,
    });

    this.map.on('load', () => {
      // Add initial logged-in user marker
      this.addOrUpdateMarker(this.loggedInUser!);

      // Start live update every 5 seconds
      this.updateIntervalSub = interval(5000).subscribe(() => {
        this.updateUsers();
      });

      // Initial fetch of friends & current user
      this.updateUsers();
    });
  }

  private updateUsers() {
    if (!this.loggedInUser) return;

    // Fetch logged-in user + friends in parallel
    forkJoin([
      this.http.get<User>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}`
      ),
      this.http.get<User[]>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}/friends`
      ),
    ]).subscribe(([currentUser, friends]) => {
      // Update logged-in user marker
      this.addOrUpdateMarker(currentUser);

      // Update friend markers
      friends.forEach((friend) => this.addOrUpdateMarker(friend));
    });
  }

  private addOrUpdateMarker(user: User) {
    if (!this.map) return;

    const existingMarker = this.markers.get(user.id);

    if (existingMarker) {
      // Move existing marker
      existingMarker.setLngLat([
        user.currentLocation.longitude,
        user.currentLocation.latitude,
      ]);
    } else {
      // Create new marker
      const el = document.createElement('div');
      el.className =
        user.id === this.loggedInUser?.id
          ? 'marker-logged-in'
          : 'marker-friend';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([
          user.currentLocation.longitude,
          user.currentLocation.latitude,
        ])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
        .addTo(this.map);

      this.markers.set(user.id, marker);
    }
  }
}
