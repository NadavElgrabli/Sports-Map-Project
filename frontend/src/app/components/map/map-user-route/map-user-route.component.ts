// import {
//   Component,
//   ElementRef,
//   OnInit,
//   OnDestroy,
//   AfterViewInit,
//   ViewChild,
// } from '@angular/core';
// import { User } from '../../../models/user.model';
// import { AuthService } from '../../../services/auth.service';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
// import { MapService } from '../../../services/map.service';
// import { UserService } from '../../../services/user.service';
// import { LOGGED_USER_TRAIL_COLOR } from '../../../shared/constants/trail.constants';

// @Component({
//   selector: 'app-map-user-route',
//   templateUrl: './map-user-route.component.html',
//   styleUrls: ['./map-user-route.component.scss'],
// })
// export class MapUserRouteComponent implements OnInit, AfterViewInit, OnDestroy {
//   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

//   map!: mapboxgl.Map;
//   loggedInUser!: User | null;

//   private viewInitialized = false;
//   private mapInitialized = false;
//   private destroy$ = new Subject<void>();

//   constructor(
//     private authService: AuthService,
//     private mapService: MapService,
//     private userService: UserService
//   ) {}

//   ngOnInit() {
//     this.authService.user.pipe(takeUntil(this.destroy$)).subscribe((user) => {
//       this.loggedInUser = user;
//       if (user && this.viewInitialized) {
//         this.tryInitMap();
//       }
//     });
//   }

//   ngAfterViewInit() {
//     this.viewInitialized = true;
//     if (this.loggedInUser) {
//       this.tryInitMap();
//     }
//   }

//   private initMap() {
//     if (!this.loggedInUser) return;

//     this.mapService.initMap(
//       this.mapContainer.nativeElement,
//       [
//         this.loggedInUser.currentLocation.longitude,
//         this.loggedInUser.currentLocation.latitude,
//       ],
//       () => {},
//       () => {
//         this.addOrUpdateMarker(this.loggedInUser!);
//         this.updateUser();
//       }
//     );

//     this.map = this.mapService.getMap();
//   }

//   private tryInitMap() {
//     if (!this.mapInitialized && this.loggedInUser && this.viewInitialized) {
//       this.mapInitialized = true;
//       this.initMap();
//     }
//   }

//   private updateUser() {
//     this.userService
//       .getUserById(this.loggedInUser!.id)
//       .subscribe((currentUser) => {
//         this.mapService.clearMediaMarkers();
//         this.addOrUpdateMarker(currentUser);
//         this.mapService.drawTrail(currentUser, LOGGED_USER_TRAIL_COLOR);
//         this.mapService.drawMediaMarkers(currentUser);
//       });
//   }

//   private addOrUpdateMarker(user: User) {
//     this.mapService.addOrUpdateMarker(user, true);
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();

//     if (this.map) this.map.remove();
//   }
// }

import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MapService } from '../../../services/map.service';
import { UserService } from '../../../services/user.service';
import { LOGGED_USER_TRAIL_COLOR } from '../../../shared/constants/trail.constants';

@Component({
  selector: 'app-map-user-route',
  templateUrl: './map-user-route.component.html',
  styleUrls: ['./map-user-route.component.scss'],
})
export class MapUserRouteComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: mapboxgl.Map;
  loggedInUser!: User | null;

  private viewInitialized = false;
  private mapInitialized = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private mapService: MapService,
    private userService: UserService
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

    timer(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.loggedInUser) {
          this.tryInitMap();
        }
      });
  }

  private initMap() {
    if (!this.loggedInUser) return;

    this.mapService.initMap(
      this.mapContainer.nativeElement,
      [
        this.loggedInUser.currentLocation.longitude,
        this.loggedInUser.currentLocation.latitude,
      ],
      () => {},
      () => {
        this.addOrUpdateMarker(this.loggedInUser!);
        this.updateUser();
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

  private updateUser() {
    this.userService
      .getUserById(this.loggedInUser!.id)
      .subscribe((currentUser) => {
        this.mapService.clearMediaMarkers();
        this.addOrUpdateMarker(currentUser);
        this.mapService.drawTrail(currentUser, LOGGED_USER_TRAIL_COLOR);
        this.mapService.drawMediaMarkers(currentUser);
      });
  }

  private addOrUpdateMarker(user: User) {
    this.mapService.addOrUpdateMarker(user, true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.map) this.map.remove();
  }
}
