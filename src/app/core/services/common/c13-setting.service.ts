import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConstantsService } from '../../utils/constants.service';

@Injectable({
  providedIn: 'root'
})
export class C13SettingService {
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
  * HttpClient API get() method => Fetch group apis list
  * @returns
  */
 get(): Observable<any> {
   return this.http
     .get<any>(this.apiURL + '/settings')
     .pipe(retry(1), catchError(this.handleError));
 }

  /**
  * HttpClient API getTimezone() method => Fetch group apis list
  * @returns
  */
  getTimezone(): Observable<any> {
    return this.http
      .get<any>(this.apiURL + '/settings/timezones')
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
       this.apiURL + '/settings/' + id,
       JSON.stringify(data),
       this.httpOptions
     )
     .pipe(retry(1), catchError(this.handleError));
 }

 /**
  * HttpClient API get() method => Fetch tinhTp
  * @param id
  * @returns
  */
 find(id: any): Observable<any> {
   return this.http
     .get<any>(this.apiURL + '/settings/' + id)
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
   populate: string;
 }): Observable<any> {
   let url = `${this.apiURL}/settings/paginate?page=${params.page}&limit=${params.limit}&filter=${params.filter}`;

   if (params.fields) url = url.concat(`&fields=${params.fields}`);
   if (params.populate) url = url.concat(`&populate=${params.populate}`);

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
