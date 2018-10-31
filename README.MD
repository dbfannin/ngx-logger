[![npm version](https://badge.fury.io/js/ngx-logger.svg)](https://www.npmjs.com/package/ngx-logger)

# NGX Logger

NGX Logger is a simple logging module for angular (currently supports angular 6.x and 7.x). It allows "pretty print" to the console, as well as allowing log messages to be POSTed to a URL for server-side logging.

## Latest Updates to NGX Logger

- Using the NGXLoggerMonitor and want to disable console logs? now you can!
    - new config option disableConsoleLogging will disable console logs, but still alert to the log monitor

- Custom HTTP Headers
    - If you use an auth token, or need to pass in a custom header, now you can!
```typescript
    this.logger.setCustomHttpHeaders(new HttpHeaders({'X-Custom-Header': '123456'}));
```  
    

- Custom Log Monitoring is now available
    - Only 1 monitor can be registered at a time, registering a new monitor overwrites the previous monitor
    - This should be registered as soon as possible so that it does not miss any logs.
```typescript
import {NGXLoggerMonitor, NGXLogInterface} from 'ngx-logger';

export class MyLoggerMonitor implements NGXLoggerMonitor {
  onLog(log: NGXLogInterface) {
    console.log('myCustomLoggerMonitor', log);
  }
}
```

```typescript
import {NGXLogger} from 'ngx-logger';
import {MyLoggerMonitor} from './my-logger-monitor';

export class MyService {
  constructor(private logger: NGXLogger) {
    this.logger.registerMonitor(new MyLoggerMonitor())

    this.logger.error('BLAHBLAHBLAH');
  }
}
```



- Updating your config after importing the module has never been easier...


```typescript
this.logger.updateConfig({ level: NgxLoggerLevel.DEBUG });
```

- You can now create a standalone logger with it's own config!


```typescript
export class MyService {
  private logger: NGXLogger;
  constructor(customLogger: CustomNGXLoggerService) {
    this.logger = customLogger.create({ level: NgxLoggerLevel.ERROR });

    this.logger.error('BLAHBLAHBLAH');
  }
}
```

## Dependencies

- @angular/common
- @angular/core

## Installation

```shell
npm install --save ngx-logger
```

Once installed you need to import our main module:

```typescript
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
```

The only remaining part is to list the imported module in your application module, passing in a config to intialize the logger.

```typescript
@NgModule({
  declarations: [AppComponent, ...],
  imports: [LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR}), ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

To use the Logger, you will need import it locally, then call one of the logging functions

```typescript
import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'your-component',
  templateUrl: './your.component.html',
  styleUrls: ['your.component.less'],
  providers: [NGXLogger]
})
export class YourComponent {
  constructor(private logger: NGXLogger) {
    this.logger.debug('Your log message goes here');
    this.logger.debug('Multiple', 'Argument', 'support');
  }
}
```

## Config Options

- serverLogLevel - Only sends logs to the server for the level specified or higher (OFF disables the logger for the server)
- serverLoggingUrl - URL to POST logs
- level: The app will only log message for that level or higher (OFF disables the logger for the client)
- disableConsoleLogging: disables the console logging, while still alerting the log monitor

```
TRACE|DEBUG|INFO|LOG|WARN|ERROR|FATAL|OFF
```

## Server Side Logging

If serverLogginUrl exists, NGX Logger will attempt to POST that log to the server.

Payload Example
`{level: 'DEBUG', message: 'Your log message goes here'}`

## Testing your App when using NGXLogger

If you inject the of the NGX Logger services into your application. you will need to provide it in your Testing Module.
All services have mocked classes that can be used for testing

- NGXLoggerHttpService: NGXLoggerHttpServiceMock
- CustomNGXLoggerService: CustomNGXLoggerServiceMock
- NGXLogger: NGXLoggerMock

To provide them in your Testing Module

```typescript
     TestBed.configureTestingModule({
       imports: [
         LoggerTestingModule
       ],
       ...
     });
```

## Demo App

There is a demo application with examples of how to use ngx-logger. To run it perform the following

- Clone the repo
- Run `npm ci` or `npm install`
- Build ngx-logger using `ng build`
- Run `ng serve demo` to serve the app

A convenience script has been added to `package.json` that performs the above steps. Simpley run `npm run demo`
to have the demo built and served.

## Development

All are welcome to contribute to NGX Logger. A couple quick notes to get started..

- NGX Logger is built with angular-cli
- To use npm link, you must link the /src (or /dist after it is built) directory not root.
- When possible, try to follow patterns that have already been established in the library
- Try to make your code as simple as possible
  - Even if the code could be made shorter, having code that is readable and easily understood is way more valuable
- Have fun!
