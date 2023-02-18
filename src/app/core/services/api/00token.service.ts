import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TokenRequest } from '../../model/request/00token.request.model';
import { TokenResponse } from '../../model/response/00token.response.model';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  // Define API
  apiURL = ConstantsService.api.frontEnd;

  constructor(private http: HttpClient) {}

  /*========================================
    Begin CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * HttpClient API get() method => Fetch token list
   * @returns
   */
  get(): Observable<any> {
    return this.http
      .get<TokenResponse>(this.apiURL + '/tokens')
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method => Create TokenRequest
   * @param TokenRequest
   * @returns
   */
  add(token: TokenRequest): Observable<TokenRequest> {
    return this.http
      .post<TokenRequest>(
        this.apiURL + '/tokens',
        JSON.stringify(token),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update token
   * @param id
   * @param token
   * @returns
   */
  update(id: any, token: TokenRequest): Observable<TokenRequest> {
    return this.http
      .put<TokenRequest>(
        this.apiURL + '/tokens',
        JSON.stringify(token),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API delete() method => Delete token
   * @param id
   * @returns
   */
  delete(id: any) {
    return this.http
      .delete<TokenRequest>(this.apiURL + '/tokens/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch token
   * @param id
   * @returns
   */
  find(id: any): Observable<TokenResponse> {
    return this.http
      .get<TokenResponse>(this.apiURL + '/tokens/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * refreshAuth
   * @param token
   * @returns
   */
  refreshAuth(refreshToken: string) {
    return this.http
      .post<TokenRequest>(
        this.apiURL + '/auth/refresh-tokens',
        {refreshToken},
        this.httpOptions,
      )
  }

  /**
   * HttpClient API get() method => paginate token with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(
    page: number,
    limit: number,
    filter: any,
  ): Observable<TokenResponse> {
    let url = this.apiURL + '/tokens/paginate?page=' + page + '&limit=' + limit;

    // add condition filter
    if (filter != '') {
      url =
        this.apiURL +
        '/tokens/paginate?page=' +
        page +
        '&limit=' +
        limit +
        filter;
    }
    return this.http
      .get<TokenResponse>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  /*========================================
    Begin Custom Methods for RESTful API
  =========================================*/

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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
