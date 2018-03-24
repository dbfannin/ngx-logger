import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class NGXLoggerHttpService {
  constructor(private readonly http: HttpClient) {

  }

  logOnServer(url: string, message: string, additional: any[] = [], timestamp: string, logLevel: string): Observable<any> {
    const body = {
      level: logLevel,
      message: message,
      additional: additional,
      timestamp: timestamp
    };

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(url, body, options)
  }
}