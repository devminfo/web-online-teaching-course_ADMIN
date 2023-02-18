import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConstantsService } from '../../utils/constants.service';
@Injectable({
  providedIn: 'root',
})
export class F5ServiceOrdersService {
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
   * HttpClient API get() method => Fetch group apis list
   * @returns
   */
  get(): Observable<any> {
    return this.http
      .get<any>(this.apiURL + '/service-orders')
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method => Create any
   * @param any
   * @returns
   */
  add(data: any): Observable<any> {
    return this.http
      .post<any>(
        this.apiURL + '/service-orders',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => check out data
   * @param id
   * @param data
   * @returns
   */
  checkout(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/service-orders/' + id + '/check-out',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  /**
   * HttpClient API put() method => check in  data
   * @param id
   * @param data
   * @returns
   */
  checkIn(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/service-order/' + id + '/check-in',
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
      .delete<any>(this.apiURL + '/service-orders/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API delete() method => Delete data
   * @param ids
   * @returns
   */
  deleteManyByIds(ids: string) {
    return this.http
      .delete<any>(`${this.apiURL}/service-orders/${ids}/ids`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  find(params: { id: any; populate: any }): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiURL}/service-orders/${params.id}?populate=${params.populate}`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(params: {
    page: number;
    limit: number;
    filter: any;
    fields: string;
    populate: any;
  }): Observable<any> {
    let url = `${this.apiURL}/service-orders/paginate?page=${params.page}&populate=${params.populate}&limit=${params.limit}&filter=${params.filter}`;

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
