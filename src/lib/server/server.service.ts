import { HttpBackend, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerServerService } from './iserver.service';

@Injectable()
export class NGXLoggerServerService implements INGXLoggerServerService {

  constructor(
    protected readonly httpBackend: HttpBackend,
  ) { }

  // TODO bmtheo : Should we keep this ?
  protected prepareAdditionalParameters(additional: any[]) {
    if (additional === null || additional === undefined) {
      return null;
    }

    return additional.map((next, idx) => {
      try {
        // We just want to make sure the JSON can be parsed, we do not want to actually change the type
        if (typeof next === 'object') {
          JSON.stringify(next);
        }

        return next;
      } catch (e) {
        return `The additional[${idx}] value could not be parsed using JSON.stringify().`;
      }
    });
  }

  // TODO bmtheo : Should we keep this ?
  protected prepareMessage(message) {
    try {
      if (typeof message !== 'string' && !(message instanceof Error)) {
        message = JSON.stringify(message, null, 2);
      }
    } catch (e) {
      // additional = [message, ...additional];
      message = 'The provided "message" value could not be parsed with JSON.stringify().';
    }

    return message;
  }

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
  ): Observable<T> {
    // HttpBackend skips all HttpInterceptors
    // They may log errors using this service causing circular calls
    const req = new HttpRequest<T>('POST', url, logContent, options || {});

    return this.httpBackend.handle(req).pipe(
      filter(e => e instanceof HttpResponse),
      map<HttpResponse<T>, T>((httpResponse: HttpResponse<T>) => httpResponse.body)
    );
  }

  public sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    // TODO bmtheo : should we keep this ? yes to avoid "TypeError: Converting circular structure to JSON" see in demo with "complex structure"
    // const additional = this.prepareAdditionalParameters(metadata.additional);

    // TODO bmtheo : should we keep this ? yes to avoid "TypeError: Converting circular structure to JSON" see in demo with "complex structure"
    // const message = this.prepareMessage(metadata.message);

    // TODO bmtheo : should we keep this ?
    // const message = metadata.message instanceof Error ? metadata.message.stack : metadata.message;

    const headers = config.customHttpHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    this.logOnServer<INGXLoggerMetadata>(config.serverLoggingUrl, metadata, {
      headers,
      params: config.customHttpParams || new HttpParams(),
      responseType: config.httpResponseType || 'json',
      withCredentials: config.withCredentials || false,
    }).pipe(catchError(err => {
      // Do not use NGXLogger here because this could cause an infinite loop 
      console.error('NGXLogger: Failed to log on server', err);
      return throwError(err);
    })).subscribe();
  }
}
