import { Injectable } from '@angular/core';
import mapboxgl, { Map as MapboxMap, MapMouseEvent, Marker } from 'mapbox-gl';
import { GeoJSONSource } from 'mapbox-gl';
import { User } from '../models/user.model';
import {
  MAP_DEFAULT_ZOOM,
  MAP_POPUP_OFFSET,
  MAP_STYLE,
} from '../shared/constants/map.constants';
import {
  TRAIL_MARKER_SIZE,
  TRAIL_MARKER_BORDER_RADIUS,
  DEFAULT_VIDEO_MARKER_SVG,
  MEDIA_MARKER_BG_POSITION,
  MEDIA_MARKER_BG_REPEAT,
  MEDIA_MARKER_BG_SIZE,
  MEDIA_MARKER_CURSOR,
  MEDIA_POPUP_IMAGE_WIDTH,
  MEDIA_POPUP_VIDEO_WIDTH,
} from '../shared/constants/marker.constants';
import {
  LINE_STRING_TYPE,
  TRAIL_LINE_WIDTH,
  FRIEND_LINE_COLOR,
  TRAIL_LINE_JOIN,
  TRAIL_LINE_CAP,
} from '../shared/constants/trail.constants';
import { environment } from '../../environments/environment';
import { TrailPoint } from '../interfaces/trail-point.interface';
import { Media } from '../interfaces/media.interface';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map!: MapboxMap;
  private userMarkers: Map<number, Marker> = new Map();
  private mediaMarkers: Marker[] = [];

  constructor() {
    mapboxgl.accessToken = environment.mapboxToken;
  }

  initMap(
    container: HTMLElement,
    center: [number, number],
    onRightClick: (e: MapMouseEvent) => void,
    onLoad?: () => void
  ): MapboxMap {
    this.map = new mapboxgl.Map({
      container,
      style: MAP_STYLE,
      center,
      zoom: MAP_DEFAULT_ZOOM,
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
      const marker = this.createUserMarker(user, colorClass);
      this.userMarkers.set(user.id, marker);
    }
  }

  private createUserMarker(user: User, colorClass: string): Marker {
    const el = document.createElement('div');
    el.className = colorClass;

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([
        user.currentLocation.longitude,
        user.currentLocation.latitude,
      ])
      .setPopup(
        new mapboxgl.Popup({ offset: MAP_POPUP_OFFSET }).setText(user.username)
      )
      .addTo(this.map);

    return marker;
  }

  drawTrail(user: User, color: string): void {
    if (!this.map || !user.trail || user.trail.length === 0) return;

    const coordinates = user.trail.map((tp) => [
      tp.location.longitude,
      tp.location.latitude,
    ]);

    const geojsonData: GeoJSON.Feature<GeoJSON.LineString, {}> = {
      type: 'Feature',
      geometry: { type: LINE_STRING_TYPE, coordinates },
      properties: {},
    };

    const sourceId = `trail-${user.id}`;
    const source = this.map.getSource(sourceId) as GeoJSONSource | undefined;

    if (source) {
      source.setData(geojsonData);
    } else {
      this.map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData,
      });

      this.map.addLayer({
        id: `trail-layer-${user.id}`,
        type: 'line',
        source: sourceId,
        layout: { 'line-join': TRAIL_LINE_JOIN, 'line-cap': TRAIL_LINE_CAP },
        paint: {
          'line-color': color ?? FRIEND_LINE_COLOR,
          'line-width': TRAIL_LINE_WIDTH,
        },
      });
    }
  }

  drawMediaMarkers(user: User): void {
    if (!this.map || !user.trail) return;

    user.trail.forEach((point) => {
      if (point.media && point.media.length > 0) {
        point.media.forEach((m) => {
          const marker = this.createMediaMarker(point, m);
          this.mediaMarkers.push(marker);
        });
      }
    });
  }

  private createMediaMarker(point: TrailPoint, media: Media): Marker {
    const el = document.createElement('div');
    el.className = 'trail-media-marker';
    el.style.width = `${TRAIL_MARKER_SIZE}px`;
    el.style.height = `${TRAIL_MARKER_SIZE}px`;
    el.style.borderRadius = TRAIL_MARKER_BORDER_RADIUS;
    el.style.cursor = MEDIA_MARKER_CURSOR;
    el.style.backgroundSize = MEDIA_MARKER_BG_SIZE;
    el.style.backgroundPosition = MEDIA_MARKER_BG_POSITION;
    el.style.backgroundRepeat = MEDIA_MARKER_BG_REPEAT;

    el.style.backgroundImage =
      media.type === 'image' ? `url(${media.url})` : DEFAULT_VIDEO_MARKER_SVG;

    const popupHTML =
      media.type === 'image'
        ? `<img src="${media.url}" width="${MEDIA_POPUP_IMAGE_WIDTH}">`
        : `<video src="${media.url}" width="${MEDIA_POPUP_VIDEO_WIDTH}" controls></video>`;

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([point.location.longitude, point.location.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: MAP_POPUP_OFFSET }).setHTML(popupHTML)
      )
      .addTo(this.map);

    return marker;
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
