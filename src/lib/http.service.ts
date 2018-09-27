import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NGXLogInterface} from './types/ngx-log.interface';


@Injectable()
export class NGXLoggerHttpService {
  constructor(private readonly http: HttpClient) {

  }

  logOnServer(url: string, log: NGXLogInterface): Observable<any> {

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(url, log, options);
  }
}
