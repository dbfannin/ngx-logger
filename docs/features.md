# Features

Here are listed some features of the logger

## Server side logging

To log on your server you need to set `serverLogLevel` and `serverLoggingUrl` accordingly
When you call the logger, the content will be sent to your server

The type of the payload is `INGXLoggerMetadata` see details [here](../src/lib/metadata/imetadata.ts)

```typescript
LoggerModule.forRoot({
...,
  serverLogLevel: NgxLoggerLevel.TRACE,
  serverLoggingUrl: '/api/logs',
})
```

- Support of responseType for HTTP Requests. A config option `httpResponseType` allows you to set your server's response type.

- Custom HTTP Params
  - If you need to pass in custom HTTP Params to your backend server, you can use `customHttpParams`.

```typescript
LoggerModule.forRoot({
...,
  customHttpParams: new HttpParams()
})
```

- Custom HTTP Headers
  - If you use an auth token, or need to pass in a custom header, you can use `customHttpHeaders`

```typescript
LoggerModule.forRoot({
...,
  customHttpHeaders: new HttpHeaders({ "X-Custom-Header": "123456" })
})
```

- Support to set WithCredentials on your HTTP requests.

```typescript
LoggerModule.forRoot({
...,
  withCredentials: true
})
```

## Other features

- Support for Custom Color Schemes in the config
  - uses the LoggerColorScheme type, it is an array of 7 colors, each color matches to a log level. see `NgxLoggerLevel`

```typescript
LoggerModule.forRoot({
...,
  colorScheme: ['purple', 'teal', 'gray', 'gray', 'red', 'red', 'red']
})
```

- Support for custom parsing of source maps. In order to use it, you must set `enableSourceMaps: true` in your logger config

  - Note: In order for the enableSourceMaps flag to work, your app must generate the source maps during the build process. If your using AngularCli you can generate Source Maps by setting `"sourceMap": {"scripts": true}` (or for older version of angularCli `"sourceMap": true`) in your angular.json

- Custom Log Monitoring is available.
  - Only one monitor can be registered at a time; registering a new monitor overwrites the previous monitor.
  - This should be registered as soon as possible so that it does not miss any logs.

```typescript
import { INGXLoggerMonitor, INGXLoggerMetadata, INGXLoggerConfig } from "ngx-logger";

export class MyLoggerMonitor implements INGXLoggerMonitor {
  onLog(logObject: INGXLoggerMetadata, config: INGXLoggerConfig) {
    console.log("myCustomLoggerMonitor", logObject);
  }
}
```

```typescript
import { NGXLogger } from "ngx-logger";
import { MyLoggerMonitor } from "./my-logger-monitor";

export class MyService {
  constructor(private logger: NGXLogger) {
    this.logger.registerMonitor(new MyLoggerMonitor());

    this.logger.error("BLAHBLAHBLAH");
  }
}
```