import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/api/00auth.service';
import { TokenService } from '../services/api/00token.service';
import { StorageItem } from '../utils';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(private router: Router, private tokenService: TokenService, private auth: AuthService) { }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    let authReq = request;
    // return next.handle(authReq);
    return next.handle(authReq).pipe(
      catchError((error) => {
        console.log('server-error.interceptor.ts', error);
        // 403
        if (error instanceof HttpErrorResponse && error.status === 403
        ) {
          // Logout
          this.auth.logout();
        }
        
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes('auth/sign-in') &&
          error.status === 401
        ) {
          // Refesh token
          return this.handle401Error(authReq, next);
        } else if (error.status === 500) {

          // Lỗi 500 => logout
          // this.logout(error);
        }

        // Throw error
        return throwError(error);
      }),
    );
  }

  /**
   * handle401Error
   * @param request
   * @param next
   * @returns
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token: any = localStorage.getItem(StorageItem.refreshToken);

      if (token) {
        return this.tokenService.refreshAuth(token).pipe(
          switchMap((data: any) => {
            this.isRefreshing = false;

            // Save access token
            localStorage.setItem(
              StorageItem.accessToken,
              data['access']['token'],
            );

            // Save refresh token
            localStorage.setItem(
              StorageItem.refreshToken,
              data['refresh']['token'],
            );

            this.refreshTokenSubject.next(data['access']['token']);

            return next.handle(
              this.addTokenHeader(request, data['access']['token']),
            );
          }),
          catchError((err) => {
            return this.logout(err);
          }),
        );
      }
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token))),
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token))),
    );
  }

  /**
   * addTokenHeader
   * @param request
   * @param token
   * @returns
   */
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * logout
   * @param error
   * @returns
   */
  logout(error: HttpErrorResponse) {
    //remove all local
    localStorage.clear();
    window.location.href = '';
    return throwError(error);
  }
}
