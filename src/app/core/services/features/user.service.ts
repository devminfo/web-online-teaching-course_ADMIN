import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Define API
  apiURL = ConstantsService.api.frontEnd;

  constructor(private http: HttpClient) { }

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
   * HttpClient API get() method => Fetch group apis list
   * @returns
   */
  get(filter = ''): Observable<any> {
    return this.http
      .get<any>(this.apiURL + `/users?${filter}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method => Create any
   * @param any
   * @returns
   */
  add(data: any): Observable<any> {
    return this.http
      .post<any>(this.apiURL + '/users', JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update data
   * @param id
   * @param data
   * @returns
   */
  updateRoles(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/users/' + id + '/roles',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update data
   * @param id
   * @param data
   * @returns
   */
  update(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/users/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update data
   * @param data
   * @returns
   */
  updateMe(data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/users/update-me',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update data
   * @param data
   * @returns
   */
  updatePassword(data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/users/update-password',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API delete() method => Delete data
   * @param id
   * @returns
   */
  delete(id: any) {
    return this.http
      .delete<any>(this.apiURL + '/users/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API delete() method => Delete data
   * @param id
   * @returns
   */
  deleteManyByIds(ids: string) {
    return this.http
      .delete<any>(this.apiURL + '/users/' + ids + '/ids', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  find(id: any, filter = ''): Observable<any> {
    return this.http
      .get<any>(this.apiURL + '/users/' + id + `?${filter}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  resetAuthorization(): Observable<any> {
    return this.http
      .get<any>(this.apiURL + `/users/reset-authorization`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Get me
   *
   * @returns
   */
  getMe({ populate, fields }: { populate?: string; fields?: string }) {
    let url = this.apiURL + '/users/me?';

    if (populate) url = url.concat(`&populate=${populate}`);

    if (fields) url = url.concat(`&fields=${fields}`);

    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(
    params: any = {
      page: 1,
      limit: 20,
      filter: '',
      populate: '',
      fields: '',
    }
  ): Observable<any> {
    let url = `${this.apiURL}/users/paginate?page=${params.page}&limit=${params.limit}&populate=${params.populate}${params.filter}`;

    if (params.fields) url = url.concat(`&fields=${params.fields}`);

    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
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

    // log error when call api
    console.log(
      'ERROR: API: ',
      error.url,
      ' Status:',
      error?.status,
      error?.error?.errors[0]
    );

    return throwError(error);
  }
}
