import { HttpBackend, HttpHeaders, HttpParams, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { INGXLoggerServerService } from './iserver.service';
import { NGXLoggerServerService } from './server.service';

@Injectable()
export class NGXLoggerInterceptableServerService extends NGXLoggerServerService {

  constructor(
    @Optional() protected readonly httpBackend: HttpBackend,  // For when Authorization or other interceptors are not required
    @Optional() protected readonly httpClient: HttpClient     // For when Authorization or other interceptors *are* required
  ) { super(httpBackend); }

  protected logOnServer<T>(
    url: string,
    logContent: T,
    options: {
      headers?: HttpHeaders;
      reportProgress?: boolean;
      params?: HttpParams;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
    withIntercept?: boolean
  ): Observable<T> {
    // They may log errors using this service causing circular calls
    const req = new HttpRequest<T>('POST', url, logContent, options || {});

    // HttpClient invokes all HttpInterceptors (such as ones that add Authorization headers)
    if (!this.httpClient) {
      console.error('NGXLogger : Can\'t log on server because HttpClient is not provided. You need to import HttpClientModule');
      return of(null);
    }
    return this.httpClient.request(req).pipe(
      filter(e => e instanceof HttpResponse),
      map<HttpResponse<T>, T>((httpResponse: HttpResponse<T>) => httpResponse.body)
    );
  }
}
