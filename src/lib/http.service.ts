import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpMetaDataInterface} from './types/http-meta-data.interface';


@Injectable()
export class NGXLoggerHttpService {
  constructor(private readonly http: HttpClient) {

  }

  logOnServer(url: string, message: string, additional: any[], metaData: HttpMetaDataInterface): Observable<any> {
    const body = {
      message: message,
      additional: additional,
      level: metaData.level,
      timestamp: metaData.timestamp,
      fileName: metaData.fileName,
      lineNumber: metaData.lineNumber
    };

    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    return this.http.post(url, body, options)
  }
}
