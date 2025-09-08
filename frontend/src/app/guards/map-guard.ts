import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class MapGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      //takes only the first emitted value from an observable and then completes it
      //which makes observable stop emitting, and allows guard to allow navigation
      take(1),

      //transforms the emitted user into true or UrlTree
      map((user) => {
        const isAuth = user ? true : false;
        if (isAuth) {
          return true;
        }

        return this.router.createUrlTree(['login']);
      })
    );
  }
}
