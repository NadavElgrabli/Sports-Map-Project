import { Injectable } from '@angular/core';
import mapboxgl, { Map as MapboxMap, MapMouseEvent, Marker } from 'mapbox-gl';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map!: MapboxMap;
  private userMarkers: Map<number, Marker> = new Map(); // key user id, value marker
  private mediaMarkers: Marker[] = [];

  constructor() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZWUxOTk2IiwiYSI6ImNtZjN1cnhtdDAwcHYya3I0cmhpNzF3bDkifQ.b4WP0iqLlxYqJAqstne1lA';
  }

  initMap(
    container: HTMLElement,
    center: [number, number],
    onRightClick: (e: MapMouseEvent) => void,
    onLoad?: () => void
  ): MapboxMap {
    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom: 15,
    });

    //Hooks into the right-click event (context menu) on the map.
    this.map.on('contextmenu', onRightClick);

    //it will be executed once the map is fully loaded (useful for drawing markers or trails.)
    if (onLoad) {
      this.map.on('load', onLoad);
    }

    return this.map;
  }

  getMap(): MapboxMap {
    return this.map;
  }

  // Add or update a single user marker
  addOrUpdateMarker(user: User, isLoggedIn: boolean): void {
    if (!this.map) return;

    const existingMarker = this.userMarkers.get(user.id);
    const colorClass = isLoggedIn ? 'marker-logged-in' : 'marker-friend';

    if (existingMarker) {

      // just move the existing marker to the new location
      existingMarker.setLngLat([
        user.currentLocation.longitude,
        user.currentLocation.latitude,
      ]);
    } else {

      //create a new marker
      const el = document.createElement('div');
      el.className = colorClass;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([
          user.currentLocation.longitude,
          user.currentLocation.latitude,
        ])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
        .addTo(this.map);

      // saves this marker in the userMarkers map so it can be updated next time
      this.userMarkers.set(user.id, marker);
    }
  }

  // Draw a trail for a user
  drawTrail(user: User, color: string): void {
    if (!this.map || !user.trail || user.trail.length === 0) return;

    //turn the array of trail points to [[lion1, lat1], [lon2, lat2]] - the format that mapbox needs
    const coordinates = user.trail.map((tp) => [
      tp.location.longitude,
      tp.location.latitude,
    ]);

    //each trail given a unique id (user id 7, then trail is trail-7)
    const sourceId = `trail-${user.id}`;

    //If we’ve already drawn this user’s trail before - redraw the whole trail with the new line at the end
    if (this.map.getSource(sourceId)) {
      (this.map.getSource(sourceId) as any).setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates },
        properties: {},
      });

      //If the trail doesn’t exist yet:
    } else {

      //Add a new data source (addSource) with the trail coordinates.
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates },
          properties: {},
        },
      });

      //Add a layer (addLayer) that tells Mapbox how to render that source.
      this.map.addLayer({
        id: `trail-layer-${user.id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': color, 'line-width': 4 },
      });
    }
  }

  // Draw media markers for a user
  drawMediaMarkers(user: User): void {
    if (!this.map || !user.trail) return;

    user.trail.forEach((point) => {
      if (point.media && point.media.length > 0) {
        point.media.forEach((m) => {
          const el = document.createElement('div');
          el.className = 'trail-media-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.backgroundSize = 'cover';
          el.style.backgroundPosition = 'center';
          el.style.backgroundRepeat = 'no-repeat';

          if (m.type === 'image') {
            el.style.backgroundImage = `url(${m.url})`;
          } else {
            el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='10' fill='white'/%3E%3Cpolygon points='7,5 7,15 15,10' fill='%23FF9800'/%3E%3C/svg%3E")`;
          }

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([point.location.longitude, point.location.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                m.type === 'image'
                  ? `<img src="${m.url}" width="100">`
                  : `<video src="${m.url}" width="150" controls></video>`
              )
            )
            .addTo(this.map);

          this.mediaMarkers.push(marker);
        });
      }
    });
  }

  // Clear all media markers
  clearMediaMarkers(): void {
    this.mediaMarkers.forEach((marker) => marker.remove());
    this.mediaMarkers = [];
  }

  // Optional: clear all user markers
  clearUserMarkers(): void {
    this.userMarkers.forEach((marker) => marker.remove());
    this.userMarkers.clear();
  }
}
