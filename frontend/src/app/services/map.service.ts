import { Injectable } from '@angular/core';
import mapboxgl, { Map as MapboxMap, MapMouseEvent, Marker } from 'mapbox-gl';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map!: MapboxMap;
  private userMarkers: Map<number, Marker> = new Map();
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
      zoom: 10,
    });

    this.map.on('contextmenu', onRightClick);

    if (onLoad) {
      this.map.on('load', onLoad);
    }

    return this.map;
  }

  getMap(): MapboxMap {
    return this.map;
  }

  // --- Add or update a single user marker ---
  addOrUpdateMarker(user: User, isLoggedIn: boolean): void {
    if (!this.map) return;

    const existingMarker = this.userMarkers.get(user.id);
    const colorClass = isLoggedIn ? 'marker-logged-in' : 'marker-friend';

    if (existingMarker) {
      existingMarker.setLngLat([
        user.currentLocation.longitude,
        user.currentLocation.latitude,
      ]);
    } else {
      const el = document.createElement('div');
      el.className = colorClass;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([
          user.currentLocation.longitude,
          user.currentLocation.latitude,
        ])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
        .addTo(this.map);

      this.userMarkers.set(user.id, marker);
    }
  }

  // --- Draw a trail for a user ---
  drawTrail(user: User, color: string): void {
    if (!this.map || !user.trail || user.trail.length === 0) return;

    const coordinates = user.trail.map((tp) => [
      tp.location.longitude,
      tp.location.latitude,
    ]);
    const sourceId = `trail-${user.id}`;

    if (this.map.getSource(sourceId)) {
      (this.map.getSource(sourceId) as any).setData({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates },
        properties: {},
      });
    } else {
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates },
          properties: {},
        },
      });

      this.map.addLayer({
        id: `trail-layer-${user.id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': color, 'line-width': 4 },
      });
    }
  }

  // --- Draw media markers for a user ---
  drawMediaMarkers(user: User): void {
    if (!this.map || !user.trail) return;

    user.trail.forEach((point) => {
      if (point.media && point.media.length > 0) {
        point.media.forEach((m) => {
          const el = document.createElement('div');
          el.className = 'trail-media-marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.backgroundImage =
            m.type === 'image'
              ? `url(${m.url})`
              : 'url(https://cdn-icons-png.flaticon.com/512/727/727245.png)';
          el.style.backgroundSize = 'cover';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';

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

  // --- Clear all media markers ---
  clearMediaMarkers(): void {
    this.mediaMarkers.forEach((marker) => marker.remove());
    this.mediaMarkers = [];
  }

  // --- Optional: clear all user markers ---
  clearUserMarkers(): void {
    this.userMarkers.forEach((marker) => marker.remove());
    this.userMarkers.clear();
  }
}
