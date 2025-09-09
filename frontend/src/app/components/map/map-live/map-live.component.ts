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
import { TrailPoint } from '../../../interfaces/trail.interface';
import { MapService } from '../../../services/map.service';

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

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
      if (user) {

        //make sure that when initmap is called the map container exists in DOM
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) this.userSub.unsubscribe();
    if (this.updateIntervalSub) this.updateIntervalSub.unsubscribe();
    if (this.map) this.map.remove();
  }

  private initMap() {
    if (!this.loggedInUser) return;

    this.mapService.initMap(
      //The HTML <div> where the map is rendered
      this.mapContainer.nativeElement,

      //center
      [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],

      //right click handler to add image / video
      (e) => this.addMediaPrompt(e),

      //on load, runs after map loads
      () => {
        this.addOrUpdateMarker(this.loggedInUser!);

        this.updateIntervalSub = interval(5000).subscribe(() => {
          this.updateUsers();
        });

        this.updateUsers();
      }
    );

    this.map = this.mapService.getMap();
  }

  private updateUsers() {
    if (!this.loggedInUser) return;

    // Clear previous markers (both user markers and media markers)
    this.mapService.clearUserMarkers();
    // this.mapService.clearMediaMarkers();

    forkJoin([
      this.http.get<User>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}`
      ),
      this.http.get<User[]>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}/friends`
      ),
    ]).subscribe(([currentUser, friends]) => {
      this.addOrUpdateMarker(currentUser);
      this.mapService.drawTrail(currentUser, '#007bff');
      this.mapService.drawMediaMarkers(currentUser);

      friends.forEach((friend) => {
        this.addOrUpdateMarker(friend);
        this.mapService.drawTrail(friend, '#ff0000');
        this.mapService.drawMediaMarkers(friend);
      });
    });
  }

  private addOrUpdateMarker(user: User) {
    if (!this.loggedInUser) return;

    this.mapService.addOrUpdateMarker(user, user.id === this.loggedInUser?.id);
  }

  private addMediaPrompt(e: mapboxgl.MapMouseEvent) {
    if (!this.loggedInUser) return;

    const url = prompt('Enter image/video URL for this location:');
    if (!url) return;

    //TODO: every repetitive string should go into a const (video, image, .mp4) basically every string you have technical work with
    const type = url.endsWith('.mp4') ? 'video' : 'image';

    //TODO: add ": name" for example: isntead of url, -> "url : url"
    this.http
      .post<TrailPoint>(
        `http://localhost:5202/api/users/${this.loggedInUser.id}/trail/media`,
        {
          latitude: e.lngLat.lat,
          longitude: e.lngLat.lng,
          url,
          type,
        }
      )
      .subscribe(() => {

        //TODO: dont work with alert, only angular material dialogue
        alert('Media added!');
        this.updateUsers();
      });
  }
}
