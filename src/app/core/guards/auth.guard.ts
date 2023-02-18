import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';  
import { AuthService } from '../services/api/00auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree { 
    const isLoggedIn = this.authService.isLoggedIn$;
    const auth = this.authService.getAuthFromLocalStorage();

    if (auth) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
