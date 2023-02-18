import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, finalize, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TinhTpRequest } from '../../model/request/50tinh-tp.request.model';
import { TinhTpResponse } from '../../model/response/50tinh-tp.response.model';
import { AuthModel } from '../../model/shared/auth.model';
import { UserModel } from '../../model/shared/user.model';
import { getItem, setItem, StorageItem } from '../../utils';
import { ConstantsService } from '../../utils/constants.service';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Define API
  apiURL = ConstantsService.api.frontEnd;

  isLoggedIn$ = new BehaviorSubject<boolean>(!!getItem(StorageItem.Auth));

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(private http: HttpClient,
    private router: Router) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // this.unsubscribe.push(this.getUserByToken().subscribe());
  }

  /*========================================
    Begin CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
    }),
  };


  /**
  * HttpClient API post() method => Create TinhTpRequest
  * @param TinhTpRequest
  * @returns
  */
  signin(email: String, password: String): Observable<any> {
    this.isLoadingSubject.next(true);

    return this.http
      .post<any>(
        this.apiURL + '/auth/signin',
        JSON.stringify({ 'email': email, 'password': password }),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * logout
   */
  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  /**
   * HttpClient API get() method => Get info current login user
   * @returns
   */
  getUserByToken(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }

    return this.http
      .get<any>(this.apiURL + '/users/me')
      .pipe(map((user) => {
        console.log('toi ne', user);

        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }), catchError(this.handleError));
  }
 
  /**
   * setAuthFromLocalStorage
   * @param auth 
   * @returns 
   */
  setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      console.log('phuong đã set');

      return true;
    }
    return false;
  }

  /**
   * getAuthFromLocalStorage
   * @returns 
   */
  getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  /**
   * Error handling
   * @param error
   * @returns
   */
  handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // log error when call api
    console.log('ERROR: API: ', error.url, ' Status:', error?.status, error?.error?.errors[0]);

    return throwError(error);
  }
}
