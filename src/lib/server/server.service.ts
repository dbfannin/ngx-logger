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

  /**
   * Transforms an error object into a readable string (taking only the stack)
   * This is needed because JSON.stringify would return "{}"
   * @param err the error object
   * @returns The stack of the error
   */
  protected secureErrorObject(err: Error): string {
      return err?.stack;
  }

  /**
   * Transforms the additional parameters to avoid any json error when sending the data to the server
   * Basically it just replaces unstringifiable object to a string mentioning an error
   * @param additional The additional data to be sent
   * @returns The additional data secured
   */
  protected secureAdditionalParameters(additional: any[]): any[] {
    if (additional === null || additional === undefined) {
      return null;
    }

    return additional.map((next, idx) => {
      try {
        if (next instanceof Error) {
            return this.secureErrorObject(next);
        }
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

  /**
   * Transforms the message so that it can be sent to the server
   * @param message the message to be sent
   * @returns the message secured
   */
  protected secureMessage(message: any): string {
    try {
      if (message instanceof Error) {
          return this.secureErrorObject(message);
      }

      if (typeof message !== 'string') {
        message = JSON.stringify(message, null, 2);
      }
    } catch (e) {
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
    // Copying metadata locally because we don't want to change the object for the caller
    const localMetadata = { ...metadata };

    localMetadata.additional = this.secureAdditionalParameters(localMetadata.additional);

    localMetadata.message = this.secureMessage(metadata.message);

    const headers = config.customHttpHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    this.logOnServer<INGXLoggerMetadata>(config.serverLoggingUrl, localMetadata, {
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
