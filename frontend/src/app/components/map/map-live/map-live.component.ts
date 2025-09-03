import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/user.model';
import mapboxgl from 'mapbox-gl';
import { AuthService } from '../../../services/auth.service';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-live',
  templateUrl: './map-live.component.html',
  styleUrls: ['./map-live.component.scss'],
})
export class MapLiveComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private userSub!: Subscription;

  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      console.log('Logged in user:', user);
      this.loggedInUser = user;
      if (user) {
        // Defer to ensure map container exists
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    if (!this.loggedInUser) return;

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZWUxOTk2IiwiYSI6ImNtZjN1cnhtdDAwcHYya3I0cmhpNzF3bDkifQ.b4WP0iqLlxYqJAqstne1lA';

    const mapEl = this.mapContainer.nativeElement;

    this.map = new mapboxgl.Map({
      container: mapEl,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      zoom: 10,
    });

    // Add markers **after the map has loaded**
    this.map.on('load', () => {
      if (this.loggedInUser) {
        this.addMarker(this.loggedInUser);
      }
      this.loggedInUser?.friends?.forEach((friend) => this.addMarker(friend));
    });
  }

  addMarker(user: User) {
    if (!this.map) return;

    const el = document.createElement('div');
    el.className =
      user.id === this.loggedInUser?.id ? 'marker-logged-in' : 'marker-friend';

    console.log('Marker element:', el);

    new mapboxgl.Marker({ element: el }) // explicitly set the element
      .setLngLat([
        user.currentLocation.longitude,
        user.currentLocation.latitude,
      ])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
      .addTo(this.map);
  }
}

// addMarker(user: User) {
//   if (!this.map) return;

//   // Outer container (Mapbox will touch this)
//   const wrapper = document.createElement('div');

//   // Inner element that we control
//   const inner = document.createElement('div');
//   inner.className =
//     user.id === this.loggedInUser?.id ? 'marker-logged-in' : 'marker-friend';

//   wrapper.appendChild(inner);

//   console.log('Marker element:', wrapper);

//   new mapboxgl.Marker({ element: wrapper })
//     .setLngLat([
//       user.currentLocation.longitude,
//       user.currentLocation.latitude,
//     ])
//     .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
//     .addTo(this.map);
// }
