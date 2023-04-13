import { HttpBackend, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, NgZone, Optional } from '@angular/core';
import { isObservable, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
import { Injectable, OnDestroy, Optional } from '@angular/core';
import { BehaviorSubject, isObservable, Observable, of, Subscription, throwError, timer } from 'rxjs';
import { catchError, concatMap, filter, map, take } from 'rxjs/operators';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { INGXLoggerConfig } from '../config/iconfig';
import { INGXLoggerServerService } from './iserver.service';

@Injectable()
export class NGXLoggerServerService implements INGXLoggerServerService, OnDestroy {
  protected serverCallsQueue: INGXLoggerMetadata[] = [];
  protected flushingQueue: BehaviorSubject<boolean> = new BehaviorSubject(false);
  protected addToQueueTimer: Subscription;

  constructor(
    @Optional() protected readonly httpBackend: HttpBackend,
    @Optional() protected readonly ngZone: NgZone,
  ) { }

  ngOnDestroy(): void {
    if (this.flushingQueue) {
      this.flushingQueue.complete();
      this.flushingQueue = null;
    }
    if (this.addToQueueTimer) {
      this.addToQueueTimer.unsubscribe();
      this.addToQueueTimer = null;
    }
  }

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
  protected customiseRequestBody(metadata: INGXLoggerMetadata | INGXLoggerMetadata[]): any {
    // In our API the body is not customised
    return metadata;
  }

  /**
   * Flush the queue of the logger
   * @param config 
   */
  public flushQueue(config: INGXLoggerConfig): void {
    this.flushingQueue.next(true);

    // If a timer was set, we cancel it because the queue is flushed
    if (this.addToQueueTimer) {
      this.addToQueueTimer.unsubscribe();
      this.addToQueueTimer = null;
    }

    if (!!this.serverCallsQueue && this.serverCallsQueue.length > 0) {
      this.sendToServerAction(this.serverCallsQueue, config);
    }
    this.serverCallsQueue = [];

    this.flushingQueue.next(false);
  }

  protected sendToServerAction(metadata: INGXLoggerMetadata | INGXLoggerMetadata[], config: INGXLoggerConfig): void {
    let requestBody: any;

    const secureMetadata = (pMetadata: INGXLoggerMetadata) => {
      // Copying metadata locally because we don't want to change the object for the caller
      const securedMetadata: INGXLoggerMetadata = { ...pMetadata };
      securedMetadata.additional = this.secureAdditionalParameters(securedMetadata.additional);
      securedMetadata.message = this.secureMessage(securedMetadata.message);
      return securedMetadata;
    }

    if (Array.isArray(metadata)) {
      requestBody = [];
      metadata.forEach(m => {
        requestBody.push(secureMetadata(m));
      })
    } else {
      requestBody = secureMetadata(metadata);
    }

    // Allow users to customise the data sent to the API
    requestBody = this.customiseRequestBody(requestBody);

    const headers = config.customHttpHeaders || new HttpHeaders();
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const logOnServerAction = () => {
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
    };

    if (config.serverCallsOutsideNgZone === true) {
      if (!this.ngZone) {
        console.error('NGXLogger: NgZone is not provided and serverCallsOutsideNgZone is set to true');
        return;
      }
      this.ngZone.runOutsideAngular(logOnServerAction);
    } else {
      logOnServerAction();
    }
  }

  /**
   * Sends the content to be logged to the server according to the config
   * @param metadata 
   * @param config 
   */
  public sendToServer(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
    // If there is no batch mode in the config, we send the log call straight to the server as usual
    if ((!config.serverCallsBatchSize || config.serverCallsBatchSize <= 0) &&
      (!config.serverCallsTimer || config.serverCallsTimer <= 0)) {
      this.sendToServerAction(metadata, config);
      return;
    }

    const addLogToQueueAction = () => {
      this.serverCallsQueue.push({ ...metadata });

      // Flush queue when size is reached
      if (!!config.serverCallsBatchSize && this.serverCallsQueue.length > config.serverCallsBatchSize) {
        this.flushQueue(config);
      }
      // Call timer only if it is in the config and timer is not already running
      if (config.serverCallsTimer > 0 && !this.addToQueueTimer) {
        this.addToQueueTimer = timer(config.serverCallsTimer).subscribe(_ => {
          this.flushQueue(config);
        });
      }
    };

    // If queue is being flushed, we need to wait for it to finish before adding other calls
    if (this.flushingQueue.value === true) {
      this.flushingQueue.pipe(
        filter(fq => fq === false),
        take(1),
      ).subscribe(_ => {
        addLogToQueueAction();
      });
    } else {
      addLogToQueueAction();
    }
  }
}
