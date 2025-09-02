import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

interface SignUpResponseData {
  id: number;
  username: string;
  password: string;
  dateOfBirth: string;
  weight: number;
  address: string;
}

interface LoginResponseData {
  expiresIn: number;
  user: {
    id: number;
    username: string;
    password: string;
    dateOfBirth: string;
    weight: number;
    address: string;
  };
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(
    username: string,
    password: string,
    dateOfBirth: string,
    weight: number,
    address: string
  ) {
    return this.http.post<SignUpResponseData>(
      'http://localhost:5202/api/users/signup',
      {
        username: username,
        password: password,
        dateOfBirth: dateOfBirth,
        weight: weight,
        address: address,
      }
    );
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResponseData>('http://localhost:5202/api/users/login', {
        username: username,
        password: password,
      })
      .pipe(
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + resData.expiresIn * 1000
          );
          const loggedUser = new User(
            resData.user.id,
            resData.user.username,
            resData.user.password,
            resData.user.dateOfBirth,
            resData.user.weight,
            resData.user.address,
            resData.expiresIn,
            expirationDate
          );

          this.user.next(loggedUser);
          localStorage.setItem('userData', JSON.stringify(loggedUser));
          this.autoLogout(resData.expiresIn * 1000);
        })
      );
  }

  autoLogin() {
    const userData: {
      id: number;
      username: string;
      password: string;
      dateOfBirth: string;
      weight: number;
      address: string;
      expiresIn: number;
      expirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) return;

    const loadedUser = new User(
      userData.id,
      userData.username,
      userData.password,
      userData.dateOfBirth,
      userData.weight,
      userData.address,
      userData.expiresIn,
      new Date(userData.expirationDate)
    );

    if (loadedUser.isActive) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData.expirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    } else {
      this.logout();
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  logout() {
    this.user.next(null as any);
    this.router.navigate(['login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
