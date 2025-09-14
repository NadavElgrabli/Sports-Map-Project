import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrailPoint } from '../interfaces/trail-point.interface';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrailService {
  constructor(private http: HttpClient) {}

  addMediaToTrail(
    userId: number,
    latitude: number,
    longitude: number,
    url: string,
    type: string
  ): Observable<TrailPoint> {
    return this.http.post<TrailPoint>(
      `${environment.apiUrl}/users/${userId}/trail/media`,
      { latitude, longitude, url, type }
    );
  }
}
