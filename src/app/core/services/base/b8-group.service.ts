import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
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
   * HttpClient API get() method => Fetch group details list
   * @returns
   */
  get(filter: string = ''): Observable<any> {
    const endPoint = this.apiURL + '/groups' + `?${filter}`;

    return this.http
      .get<any>(endPoint)
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
        this.apiURL + '/groups',
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
        this.apiURL + '/groups/' + id,
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
      .delete<any>(this.apiURL + '/groups/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  find(id: any): Observable<any> {
    return this.http
      .get<any>(
        this.apiURL +
          '/groups/' +
          id +
          `?populate=groupAPIAccesses,groupAPIDenines,groupDetails.idGroupDetail&fields=groupDetails.idGroupDetail.name`
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param params
   * @returns
   */
  getUsersInGroup(params: {
    groupId: string;
    page: number;
    limit: number;
    filter: string;
    fields: string;
  }): Observable<any> {
    let url = `${this.apiURL}/users/paginate?groups=${params.groupId}&page=${params.page}&limit=${params.limit}&${params.filter}`;

    if (params.fields) url = url.concat(`&fields=${params.fields}`);

    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param data
   * @returns
   */
  updateUsers(
    groupId: string,
    data: {
      users: string[];
      options: 'add' | 'delete';
    }
  ): Observable<any> {
    let url = `${this.apiURL}/groups/${groupId}/update-users`;

    return this.http
      .put<any>(url, JSON.stringify(data), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch collectionKey
   * @param collectionName
   * @returns
   */
  getCollectionKey(collectionName: string): Observable<any> {
    return this.http
      .get<any>(
        this.apiURL + '/groups/collection-key?collectionName=' + collectionName
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(page: number, limit: number, filter: any): Observable<any> {
    let url = this.apiURL + '/groups/paginate?page=' + page + '&limit=' + limit;

    // add condition filter
    if (filter != '') {
      url =
        this.apiURL +
        '/groups/paginate?page=' +
        page +
        '&limit=' +
        limit +
        filter;
    }
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
