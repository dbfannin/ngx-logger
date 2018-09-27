import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NGXLogInterface} from './types/ngx-log.interface';


@Injectable()
export class NGXLoggerHttpService {
  constructor(private readonly http: HttpClient) {

  }

  logOnServer(url: string, log: NGXLogInterface, customHeaders: HttpHeaders): Observable<any> {
    const headers = customHeaders || new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    const options = {
      headers: headers
    };

    return this.http.post(url, log, options);
  }
}
