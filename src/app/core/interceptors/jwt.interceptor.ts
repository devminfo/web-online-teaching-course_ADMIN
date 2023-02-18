import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/api/00auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const isLoggedIn = this.authService.isLoggedIn$;
    const auth = this.authService.getAuthFromLocalStorage();

    if (isLoggedIn) {
      request = request.clone({
        setHeaders: { 
          'Authorization': `Bearer ${auth?.accessToken}`,
        },
      });
    } 

    return next.handle(request);
  }
}
