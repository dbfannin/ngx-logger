# Customising NGXLogger behavior

NGXLogger is fully customisable

Before customising please be mindful of the following

Customising is for :
 - Specific behaviors that contributors do not wish to include in the lib (several reasons could be invoked, too complex, too specific, makes the lib too heavy etc...)
 - Specific behaviors that can't be configured

Customising is not for :
 - Bug fixes
 - Improvements of the NGXLogger

In those cases, please submit a PR or an issue

## How to customise

The logger uses services to do all the work, each service is a step of the logging process.

Those services are provided with Angular DI and they all implement an interface.

So you can code your own service and then provide it to the logger to tweak the behavior as you like

### List of services

All the services can be found in the [logger constructor](../src/lib/logger.service.ts) :
 - INGXLoggerConfigEngine is used to store the INGXLoggerConfig
 - INGXLoggerMetadataService is used to create the INGXLoggerMetadata that store all the data (and metadata) that will be logged
 - INGXLoggerRulesService is used to know what logger should be called (writer, server and monitor)
 - INGXLoggerMapperService is used to map the logger call to its source position
 - INGXLoggerWriterService is used to write the log
 - INGXLoggerServerService is used to send the log to a server

### (example) Write the message to the sessionStorage instead of the console

Code your writer :

```
@Injectable()
export class WriterCustomisedService extends NGXLoggerWriterService {

  /** Write the content sent to the log function to the sessionStorage */
  public writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
      sessionStorage.setItem('logger', metadata.message);
  }
}
```

Provide the customised service to the logger

```
LoggerModule.forRoot(
  { level: NgxLoggerLevel.DEBUG },
  {
    writerProvider: {
      provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: WriterCustomisedService
    }
  }),
```

And now your logger will write to the sessionStorage instead of the console

Full code [here](../projects/customise/src/app/writer)

### (example) Send the log to the server only if "SERVER" is in the message

Tweak the rule service :

```
@Injectable()
export class RulesCustomisedService extends NGXLoggerRulesService {

  /** If true the logger will send logs to server */
  shouldCallServer(level: NgxLoggerLevel, config: INGXLoggerConfig, message?: any | (() => any), additional?: any[]): boolean {
    return (message && typeof message === 'string' && message.includes('SERVER'));
  }
}
```

Provide the customised service to the logger

```
LoggerModule.forRoot(
  { level: NgxLoggerLevel.DEBUG },
  {
    writerProvider: {
      provide: TOKEN_LOGGER_RULES_SERVICE, useClass: RulesCustomisedService
    }
  }),
```

And now everytime you have 'SERVER' in your message, the log will be sent to your server
