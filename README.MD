# NGX Logger

NGX Logger is a simple logging module for angular (currently supports angular 4.x). It allows "pretty print" to the console, as well as allowing log messages to be POSTed to a URL for server-side logging.

## Dependencies
 * @angular/common
 * @angular/core
 * @angular/http
 * moment

## Installation
```shell
npm install --save ngx-logger
```

Once installed you need to import our main module:
```typescript
import { LoggerModule } from 'ngx-logger';
```

The only remaining part is to list the imported module in your application module, passing in a config to intialize the logger.

```typescript
@NgModule({
  declarations: [AppComponent, ...],
  imports: [LoggerModule.forRoot({serverLoggingUrl: '/api/logs', level: 'DEBUG'}), ...],
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
    };
}

```


## Config Options
 * serverLogLevel - Only sends logs to the server for the level specified or higher
 * serverLoggingUrl - URL to POST logs
 * level: The log level. The app will only log message for that level or higher (OFF disables the logger)
```
TRACE|DEBUG|INFO|LOG|WARN|ERROR|OFF
```


## Server Side Logging

If serverLogginUrl exists, NGX Logger will attempt to POST that log to the server.

Payload Example
```{level: 'DEBUG', message: 'Your log message goes here'}```
