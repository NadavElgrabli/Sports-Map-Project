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
import { interval, forkJoin, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TrailPoint } from '../../../interfaces/trail-point.interface';
import { MapService } from '../../../services/map.service';
import {
  FRIEND_LINE_COLOR,
  LOGGED_USER_TRAIL_COLOR,
} from '../../../shared/constants/trail.constants';
import { environment } from '../../../../environments/environment';
import { NEARBY_USERS_REFRESH_INTERVAL_MS } from '../../../shared/constants/time.constants';

@Component({
  selector: 'app-map-live',
  templateUrl: './map-live.component.html',
  styleUrls: ['./map-live.component.scss'],
})
export class MapLiveComponent implements OnInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  private viewInitialized = false;
  private mapInitialized = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.authService.user.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.loggedInUser = user;
      if (user && this.viewInitialized) {
        this.tryInitMap();
      }
    });
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.loggedInUser) {
      this.tryInitMap();
    }
  }

  private initMap() {
    if (!this.loggedInUser) return;

    this.mapService.initMap(
      this.mapContainer.nativeElement,
      [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      (e) => this.addMediaPrompt(e),
      () => {
        this.addOrUpdateMarker(this.loggedInUser!);
        interval(NEARBY_USERS_REFRESH_INTERVAL_MS)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.updateUsers();
          });
        this.updateUsers();
      }
    );

    this.map = this.mapService.getMap();
  }

  private tryInitMap() {
    if (!this.mapInitialized && this.loggedInUser && this.viewInitialized) {
      this.mapInitialized = true;
      this.initMap();
    }
  }

  private updateUsers() {
    this.mapService.clearUserMarkers();

    //TODO: avoid http calls from withing components, only call http calls from services.
    forkJoin([
      this.http.get<User>(
        `${environment.apiUrl}/users/${this.loggedInUser!.id}`
      ),
      this.http.get<User[]>(
        `${environment.apiUrl}/users/${this.loggedInUser!.id}/friends`
      ),
    ]).subscribe(([currentUser, friends]) => {
      this.addOrUpdateMarker(currentUser);
      this.mapService.drawTrail(currentUser, LOGGED_USER_TRAIL_COLOR);
      this.mapService.drawMediaMarkers(currentUser);

      friends.forEach((friend) => {
        this.addOrUpdateMarker(friend);
        this.mapService.drawTrail(friend, FRIEND_LINE_COLOR);
        this.mapService.drawMediaMarkers(friend);
      });
    });
  }

  private addOrUpdateMarker(user: User) {
    this.mapService.addOrUpdateMarker(user, user.id === this.loggedInUser?.id);
  }

  private addMediaPrompt(e: mapboxgl.MapMouseEvent) {
    const url = prompt('Enter image/video URL for this location:');
    if (!url) return;

    //TODO: every repetitive string should go into a const (video, image, .mp4) basically every string you have technical work with
    const type = url.endsWith('.mp4') ? 'video' : 'image';

    //TODO: no http requests inside components, only services
    this.http
      .post<TrailPoint>(
        `${environment.apiUrl}/users/${this.loggedInUser!.id}/trail/media`,
        {
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          url: url,
          type: type,
        }
      )
      .subscribe(() => {
        //TODO: dont work with alert, only angular material dialogue
        alert('Media added!');
        this.updateUsers();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) this.map.remove();
  }
}
