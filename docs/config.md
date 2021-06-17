# Config options of NGXLogger

## Options

You can see all config details in `INGXLoggerConfig` interface located [here](../src/lib/config/iconfig.ts)

Some of the options are detailed below :
- `level` {NgxLoggerLevel}: only log messages of this level or higher (`OFF` disables the logger for the client).
- `disableConsoleLogging` {boolean}: disables console logging (does not disable other feature like server logging or log monitoring).
- `serverLogLevel` {NgxLoggerLevel}: only send log messages of this level or higher to the server (`OFF` disables the logger for the server).
- `serverLoggingUrl` {string}: URL to POST logs.
- `httpResponseType` {'arraybuffer' | 'blob' | 'text' | 'json'}: the response type of the HTTP Logging request.
- `enableSourceMaps` {boolean}: enables manual parsing of Source Maps
  - Note: In order for the enableSourceMaps flag to work, your app must generate the source maps during the build process. If your using AngularCli you can generate Source Maps by setting `"sourceMap": {"scripts": true}` (or for older version of angularCli `"sourceMap": true`) in your angular.json
- `timestampFormat` {string}: format for the timestamp displayed with each log message. Can be any of the formatting options accepted by the classic Angular [DatePipe](https://angular.io/api/common/DatePipe#pre-defined-format-options).
- `colorScheme` {NGXLoggerColorScheme}: a color scheme that defines which color should be used for each log level
  - Note: the index of the scheme relates to the log level value
- `disableFileDetails` {boolean} (defaults to false). When set to `true`, filename details will not be shown in log messages.
- `proxiedSteps` {number}. That many steps will be ignored in the stack trace to compute the caller location. If you happen to always see the same location reported in the logs (for example a wrapper service of your own), tune this option to skip this step in the stack traces.

`NgxLoggerLevels` are: `TRACE|DEBUG|INFO|LOG|WARN|ERROR|FATAL|OFF`

## Setting up the config

You can set it straight from the forRoot call, ex:
```typescript
@NgModule({
  ...
  imports: [
    LoggerModule.forRoot({ level: NgxLoggerLevel.ERROR }),
  ]
})
```

## Updating the config

Once your app is running you might want to update the config

In that case you can use updateConfig : `logger.updateConfig({level: NgxLoggerLevel.TRACE });`

> :warning: The updateConfig is **overwriting** all the config

If you want to update only one field you can do as follow

```
// Get the current config
var config = logger.getConfigSnapshot();
// Updating only one field
config.disableFileDetails = true;
// Setting the config
logger.updateConfig(config);
```

