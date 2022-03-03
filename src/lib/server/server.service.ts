import { HttpBackend, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { concat, isObservable, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerServerService } from './iserver.service';

@Injectable()
export class NGXLoggerServerService implements INGXLoggerServerService {

  constructor(
    @Optional() protected readonly httpBackend: HttpBackend,
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

  /**
   * Edits HttpRequest object before sending request to server
   * @param httpRequest default request object
   * @returns altered httprequest
   */
  protected alterHttpRequest(httpRequest: HttpRequest<any>): HttpRequest<any> | Observable<HttpRequest<any>> {
    return httpRequest;
  }

  /**
   * Sends request to server
   * @param url 
   * @param logContent 
   * @param options 
   * @returns 
   */
  protected logOnServer(
    url: string,
    logContent: any,
    options: {
      headers?: HttpHeaders;
      reportProgress?: boolean;
      params?: HttpParams;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {

    if (!this.httpBackend) {
      console.error('NGXLogger : Can\'t log on server because HttpBackend is not provided. You need to import HttpClientModule');
      return of(null);
    }

    // HttpBackend skips all HttpInterceptors
    // They may log errors using this service causing circular calls
    let defaultRequest = new HttpRequest<any>('POST', url, logContent, options || {});
    let finalRequest: Observable<HttpRequest<any>> = of(defaultRequest);

    const alteredRequest = this.alterHttpRequest(defaultRequest);

    if (isObservable(alteredRequest)) {
      finalRequest = alteredRequest;
    } else if (alteredRequest) {
      finalRequest = of(alteredRequest);
    } else {
      console.warn('NGXLogger : alterHttpRequest returned an invalid request. Using default one instead');
    }

    return finalRequest.pipe(
      concatMap(req => {
        if (!req) {
          console.warn('NGXLogger : alterHttpRequest returned an invalid request (observable). Using default one instead');
          return this.httpBackend.handle(defaultRequest)
        }
        return this.httpBackend.handle(req);
      }),
      filter(e => e instanceof HttpResponse),
      map<HttpResponse<any>, any>((httpResponse: HttpResponse<any>) => httpResponse.body)
    );
  }

  /**
   * Customise the data sent to the API
   * @param metadata the data provided by NGXLogger
   * @returns the data that will be sent to the API in the body
   */
  protected customiseRequestBody(metadata: INGXLoggerMetadata): any {
    // In our API the body is not customised
    return metadata;
  }


  public sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    // Copying metadata locally because we don't want to change the object for the caller
    const localMetadata = { ...metadata };

    localMetadata.additional = this.secureAdditionalParameters(localMetadata.additional);

    localMetadata.message = this.secureMessage(metadata.message);

    // Allow users to customise the data sent to the API
    const requestBody = this.customiseRequestBody(metadata);

    const headers = config.customHttpHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    this.logOnServer(
      config.serverLoggingUrl,
      requestBody,
      {
        headers,
        params: config.customHttpParams || new HttpParams(),
        responseType: config.httpResponseType || 'json',
        withCredentials: config.withCredentials || false,
      },
    ).pipe(catchError(err => {
      // Do not use NGXLogger here because this could cause an infinite loop 
      console.error('NGXLogger: Failed to log on server', err);
      return throwError(err);
    })).subscribe();
  }
}
