import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserResponse } from '../interfaces/user-response.interface';
import { LoginResponseData } from '../interfaces/login-response.interface';


@Injectable({ providedIn: 'root' })
export class AuthService {
  //TODO: where do you unsubscribe?
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
    //TODO: read about angular environment, why we need it , what it is, what we put there and
    return this.http.post<UserResponse>(
      'http://localhost:5202/api/users/signup',
      { username, password, dateOfBirth, weight, address }
    );
  }

  //TODO: if frontend changes name of property, and the backend doesnt change it, then we can only change the name of the property after ":" when
  // we rename the symbol of username for example, and that is why it should always look like for example: username : username
  login(username: string, password: string) {
    return this.http
      .post<LoginResponseData>('http://localhost:5202/api/users/login', {
        username: username,
        password,
      })
      .pipe(
        tap((resData) => {
          const expirationDate = new Date(
            new Date().getTime() + resData.expiresIn * 1000 //TODO: call it a constant
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

          //TODO: read the differences between type / class/ interface
          //TODO: This option below is better, do it that way
          const loggedUser2 = {
            ...resData.user,
            expirationDate: expirationDate,
          };

          this.user.next(loggedUser);
          //TODO: Avoid touching the local storage from any service / component. Create a service that handles the local storage managment
          //TODO: Dont access the userData as a string, make it a const that the service of the local storage will handle
          localStorage.setItem('userData', JSON.stringify(loggedUser));
          this.autoLogout(resData.expiresIn * 1000);
        })
      );
  }

  autoLogin() {
    const userData: any = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;

    const loadedUser = new User(
      userData.id,
      userData.username,
      userData.password,
      userData.dateOfBirth,
      userData.weight,
      userData.address,
      userData.expiresIn,
      new Date(userData.expirationDate),
      userData.currentLocation,
      userData.friends
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

  //TODO: read about 'ng serve' - what happens after we log in, close the chrome, and return to the website, and how does it affect the login / log out?
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }
}
