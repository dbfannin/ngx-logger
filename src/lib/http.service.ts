import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NGXLogInterface } from './types/ngx-log.interface';



@Injectable()
export class NGXLoggerHttpService {
  constructor(private readonly http: HttpClient) {

  }

  // logOnServer(url: string, log: NGXLogInterface, customHeaders: HttpHeaders, customParams?: HttpParams): Observable<any> {
  //   const headers = customHeaders || new HttpHeaders();
  //   const params = customParams || new HttpParams();
  //   headers.set('Content-Type', 'application/json');

  //   const options = {
  //     headers: headers,
  //     params: params
  //   };


  //   return this.http.post(url, log, options);
  // }

  logOnServer(url: string, log: NGXLogInterface, options: object): Observable<any> {
    return this.http.post(url, log, options || {});
  }


  setHeaders(customHeaders?: HttpHeaders): HttpHeaders {
    const headers = customHeaders || new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return headers;
  }

  setParams(customParams?: HttpParams): HttpParams {
    const params = customParams || new HttpParams();
    return params;
  }

}
