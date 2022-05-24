[![npm version](https://badge.fury.io/js/ngx-logger.svg)](https://www.npmjs.com/package/ngx-logger)

# NGX Logger

NGX Logger is a simple logging module for angular (currently supports angular 6+. *Warning : you might need older version of the lib to use older versions of angular*).
It allows "pretty print" to the console, as well as allowing log messages to be POSTed to a URL for server-side logging.

## Join the NGX Logger discord server!

[Join our discord server!](https://discord.gg/zzkz9ny) Get updated on the latest changes and newest feature! Get help faster from the community! Share implementation strategies! Make friends :)

## Installation

```shell
npm install --save ngx-logger
```

Once installed you need to import our main module (optionally you will need to import HttpClientModule):

```typescript
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
// HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps
import { HttpClientModule } from "@angular/common/http";
```

The only remaining part is to list the imported module in your application module, passing in a config to initialize the logger.

```typescript
@NgModule({
  declarations: [AppComponent, ...],
  imports:
  [
    // HttpClientModule is only needed if you want to log on server or if you want to inspect sourcemaps
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }),
    ...
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

To use the Logger, you will need to import it locally, then call one of the logging functions

```typescript
import { Component } from "@angular/core";
import { NGXLogger } from "ngx-logger";

@Component({
  selector: "your-component",
  templateUrl: "./your.component.html",
  styleUrls: ["your.component.scss"],
})
export class YourComponent {
  constructor(private logger: NGXLogger) {
    this.logger.error("Your log message goes here");
    this.logger.warn("Multiple", "Argument", "support");
  }
}
```
*For most browsers, you need to enable "verbose" or "debug" mode in the developper tools to see debug logs*

## Configuration

Configuration is sent by the forRoot call
`LoggerModule.forRoot({level: NgxLoggerLevel.DEBUG})`

For more information about configuration see the [doc](docs/config.md)

## Customise logger behavior

Since version 5 NGXLogger is fully customisable

See how in the [doc](docs/customising.md)

## Features

You can see more of the features supported by NGXLogger in this [doc](docs/features.md)

## Demo App

There is [a demo application](https://github.com/dbfannin/ngx-logger/tree/master/projects/demo/src) with examples of how to use ngx-logger. To run it perform the following:

- Clone the repo
- Run `npm ci` or `npm install`
- Build ngx-logger using `ng build`
- Run `ng serve demo` to serve the app

A convenience script has been added to `package.json` that performs the above steps. Simply run `npm run demo`
to have the demo built and served.

## Dependencies

- @angular/common
- @angular/core

## Testing Your App When Using NGXLogger

If you inject any of the NGX Logger services into your application, you will need to provide them in your Testing Module.

To provide them in your Testing Module:

```typescript
import { LoggerTestingModule } from 'ngx-logger/testing';

TestBed.configureTestingModule({
  imports: [
    LoggerTestingModule
  ],
  ...
});
```

All services have mocked classes that can be used for testing located [here](testing/src/lib)

## Contribute

All are welcome to contribute to NGX Logger.

See the [doc](docs/contributing.md) to know how
