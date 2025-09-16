import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserResponse } from '../interfaces/user-response.interface';
import { LoginResponseData } from '../interfaces/login-response.interface';
import { environment } from '../../environments/environment';
import { MILLISECONDS_IN_SECOND } from '../shared/constants/time.constants';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.autoLogin(); // <-- call autoLogin automatically on service init
  }

  signup(
    username: string,
    password: string,
    dateOfBirth: string,
    weight: number,
    address: string
  ) {
    return this.http.post<UserResponse>(`${environment.apiUrl}/users/signup`, {
      username,
      password,
      dateOfBirth,
      weight,
      address,
    });
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponseData>(`${environment.apiUrl}/users/login`, {
        username,
        password,
      })
      .pipe(
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + resData.expiresIn * MILLISECONDS_IN_SECOND
          );
          const loggedUser = new User(
            resData.user.id,
            resData.user.username,
            resData.user.password,
            resData.user.dateOfBirth,
            resData.user.weight,
            resData.user.address,
            resData.expiresIn,
            expirationDate,
            resData.user.currentLocation,
            resData.user.friends
          );

          this.user.next(loggedUser);
          this.localStorageService.setUser(loggedUser);
          this.autoLogout(resData.expiresIn * MILLISECONDS_IN_SECOND);
        })
      );
  }

  autoLogin() {
    const loadedUser = this.localStorageService.getUser();
    if (!loadedUser) return;

    if (loadedUser.isActive) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(loadedUser.expirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    } else {
      this.logout();
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['login']);
    this.localStorageService.removeUser();
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
