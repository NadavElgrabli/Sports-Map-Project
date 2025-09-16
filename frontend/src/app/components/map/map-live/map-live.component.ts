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
import { MapService } from '../../../services/map.service';
import {
  FRIEND_LINE_COLOR,
  LOGGED_USER_TRAIL_COLOR,
} from '../../../shared/constants/trail.constants';
import {
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_IMAGE,
  VIDEO_EXTENSION_MP4,
} from '../../../shared/constants/media-types.constants';
import { NEARBY_USERS_REFRESH_INTERVAL_MS } from '../../../shared/constants/time.constants';
import { UserService } from '../../../services/user.service';
import { FriendsService } from '../../../services/friends.service';
import { TrailService } from '../../../services/trail.service';

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
    private mapService: MapService,
    private userService: UserService,
    private friendsService: FriendsService,
    private trailService: TrailService
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

    forkJoin([
      this.userService.getUserById(this.loggedInUser!.id),
      this.friendsService.getFriends(this.loggedInUser!.id),
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

    const type = url.endsWith(VIDEO_EXTENSION_MP4)
      ? MEDIA_TYPE_VIDEO
      : MEDIA_TYPE_IMAGE;

    this.trailService
      .addMediaToTrail(
        this.loggedInUser!.id,
        e.lngLat.lat,
        e.lngLat.lng,
        url,
        type
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
