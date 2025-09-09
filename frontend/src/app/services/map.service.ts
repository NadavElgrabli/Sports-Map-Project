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
  } //TODO: read about angular environment, why we need it , what it is, what we put there and why putting a token in the constructor is bad practice

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
      zoom: 15, //TODO: for constants (15), under shared folder, create a folder for constants, under constants folder create file for map constants
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
      //TODO: seperate to a seperate function here?
      const el = document.createElement('div');
      el.className = colorClass;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([
          user.currentLocation.longitude,
          user.currentLocation.latitude,
        ])
        //TODO: look up for what to do with this constant (25)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(user.username))
        .addTo(this.map);

      this.userMarkers.set(user.id, marker);
    }
  }

  drawTrail(user: User, color: string): void {
    if (!this.map || !user.trail || user.trail.length === 0) return;

    const coordinates = user.trail.map((tp) => [
      tp.location.longitude,
      tp.location.latitude,
    ]);

    //TODO: we set the data twice (type, geo, properties) so just put it into a variable to avoid repetition
    const sourceId = `trail-${user.id}`;

    //TODO: calling getSource twice is unecessary, place it into a const to avoid double call
    if (this.map.getSource(sourceId)) {
      (this.map.getSource(sourceId) as any).setData({
        //TODO: avoid using any, if you know what the return type is (here you know)
        type: 'Feature',
        geometry: { type: 'LineString', coordinates }, //TODO: 'LineString' is problematic due to typos, make it  into a cosntant
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

  drawMediaMarkers(user: User): void {
    if (!this.map || !user.trail) return;

    user.trail.forEach((point) => {
      if (point.media && point.media.length > 0) {
        point.media.forEach((m) => {
          const el = document.createElement('div');
          //TODO: always when creating an element dynamically, write it inside a const
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

  clearMediaMarkers(): void {
    this.mediaMarkers.forEach((marker) => marker.remove());
    this.mediaMarkers = [];
  }

  clearUserMarkers(): void {
    this.userMarkers.forEach((marker) => marker.remove());
    this.userMarkers.clear();
  }
}
