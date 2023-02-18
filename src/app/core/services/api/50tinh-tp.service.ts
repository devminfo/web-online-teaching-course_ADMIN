import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { TinhTpRequest } from '../../model/request/50tinh-tp.request.model';
import { TinhTpResponse } from '../../model/response/50tinh-tp.response.model';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root',
})
export class TinhTpService {
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
   * HttpClient API get() method => Fetch tinhTp list
   * @returns
   */
  get(): Observable<any> {
    return this.http
      .get<TinhTpResponse>(this.apiURL + '/tinh-tps')
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method => Create TinhTpRequest
   * @param TinhTpRequest
   * @returns
   */
  add(tinhTp: TinhTpRequest): Observable<TinhTpRequest> {
    return this.http
      .post<TinhTpRequest>(
        this.apiURL + '/tinh-tps',
        JSON.stringify(tinhTp),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API put() method => Update tinhTp
   * @param id
   * @param tinhTp
   * @returns
   */
  update(id: any, tinhTp: TinhTpRequest): Observable<TinhTpRequest> {
    return this.http
      .put<TinhTpRequest>(
        this.apiURL + '/tinh-tps',
        JSON.stringify(tinhTp),
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API delete() method => Delete tinhTp
   * @param id
   * @returns
   */
  delete(id: any) {
    return this.http
      .delete<TinhTpRequest>(this.apiURL + '/tinh-tps/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  find(id: any): Observable<TinhTpResponse> {
    return this.http
      .get<TinhTpResponse>(this.apiURL + '/tinh-tps/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(
    page: number,
    limit: number,
    filter: any,
  ): Observable<any> {
    let url =
      this.apiURL + '/tinh-tps/paginate?page=' + page + '&limit=' + limit;

    // add condition filter
    if (filter != '') {
      url =
        this.apiURL +
        '/tinh-tps/paginate?page=' +
        page +
        '&limit=' +
        limit +
        filter;
    }
    return this.http
      .get<any>(url)
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
