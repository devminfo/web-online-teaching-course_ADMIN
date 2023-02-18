import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root',
})
export class GroupDetailService {
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
    const endPoint = this.apiURL + '/group-details' + `?${filter}`;

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
        this.apiURL + '/group-details',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API post() method => Create any
   * @returns
   */
  regenerate(): Observable<any> {
    return this.http
      .get<any>(this.apiURL + '/group-details/regenerate')
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
        this.apiURL + '/group-details/' + id,
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
  addChild(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/group-details/' + id + '/add-childs',
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
  removeChild(id: any, data: any): Observable<any> {
    return this.http
      .put<any>(
        this.apiURL + '/group-details/' + id + '/remove-childs',
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
      .delete<any>(this.apiURL + '/group-details/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => Fetch tinhTp
   * @param id
   * @returns
   */
  find(id: any): Observable<any> {
    return this.http
      .get<any>(this.apiURL + '/group-details/' + id)
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
        this.apiURL +
          '/group-details/collection-key?collectionName=' +
          collectionName
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param filter
   * @returns
   */
  getMenu(filter: any): Observable<any> {
    let url = this.apiURL + '/group-details/user?' + filter;

    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  paginate(page: number, limit: number, filter: any): Observable<any> {
    let url =
      this.apiURL + '/group-details/paginate?page=' + page + '&limit=' + limit;

    // add condition filter
    if (filter != '') {
      url =
        this.apiURL +
        '/group-details/paginate?page=' +
        page +
        '&limit=' +
        limit +
        filter;
    }
    return this.http.get<any>(url).pipe(retry(1), catchError(this.handleError));
  }

  /**
   * HttpClient API get() method => paginate tinhTp with start page = 1 and limit
   * @param id
   * @returns
   */
  getMenuOfCurrentUser(
    page: number,
    limit: number,
    filter: any
  ): Observable<any> {
    let url =
      this.apiURL +
      '/group-details/get-menu-by-user-login?page=' +
      page +
      '&limit=' +
      limit;

    // add condition filter
    if (filter != '') {
      url =
        this.apiURL +
        '/group-details/get-menu-by-user-login?page=' +
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

  /**
   * Handle result of response api getMenuOfCurrentUser
   * @param data
   */
  handleDataMenus(data: any) {
    const { results } = data;
    console.log({ results });
    const groupDetailsMap = new Map<string, any>();
    // Update response
    const groups = results.filter((result: any) => result.isGroup);
    let groupDetails = results.filter(
      (result: any) => result.isChild || (!result.isGroup && !result.isChild)
    );

    // add group details map
    groupDetails.forEach((groupDetail: any) => {
      groupDetailsMap.set(groupDetail._id, groupDetail);
    });

    // update child in groups
    groups.forEach((group: any) => {
      const { childs } = group;
      const newChilds: any[] = [];

      childs.forEach((child: any) => {
        const childExist = groupDetailsMap.get(child._id);

        if (childExist) {
          newChilds.unshift(childExist);
          console.log(groupDetailsMap.delete(childExist._id));
        }
      });

      group.childs = newChilds;
    });

    // update groupDetails
    groupDetails = Array.from(groupDetailsMap, ([name, value]) => value);

    return [...groups, ...groupDetails].sort((a, b) => a.position - b.position);
  }
}
