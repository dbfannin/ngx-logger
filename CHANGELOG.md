# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Merged features waiting to be published in upcoming version


## [5.0.9] - 2022-03-03

### Added
- Added the function alterHttpRequest to allow users to tweak the HttpRequest just before it is sent to the API

### Fixed
- Fix typo in doc (customise.md)


## [5.0.8] - 2022-02-20

### Changed
- Makes the DatePipe dependency Optional

### Breaking Changes
- If you use `timestampFormat`, you now need to manually provide `DatePipe` from @angular/common
  - If not provided, this will just display an error when logging, build will not break, your application will still run and logger will still produce an output


## [5.0.7] - 2022-01-22

### Fixed
- Now correctly secures `message` and `additional` from payload when sending log to server (fixes #286)


## [5.0.6] - 2022-01-15

### Changed
- REVERT : testing project is now under main project (this was causing compilation error)


## [5.0.5] - 2022-01-15

### Changed
- testing project is now under main project (this was causing compilation error)

### Breaking changes
- ConfigEngine is not provided in DI anymore, this was causing a bug where all NGXLogger instances share the same config (only the forRoot call would make a NGXLogger instance independant) fixes #282
  - Now ConfigEngine is instantiated by the INGXLoggerConfigEngineFactory, the call is made in NGXLogger constructor
  - The INGXLoggerConfigEngineFactory is provided in DI if any user wants to tweak this behavior


## [5.0.4] - 2021-12-06

### Changed
- Lib is now built with Angular v13
- Lib is now built in ivy compatible mode (fixes #277)


## [5.0.3] - 2021-11-08

### Added
- Added a step in the ServerService that allow users to fully customise the body sent to the API (see example in customise [doc](docs/customising.md))


## [5.0.2] - 2021-11-08

### Changed
- HttpClientModule is not needed by default anymore
    If HttpClientModule is not imported and you use the ServerSide logger, it will log an error
    If HttpClientModule is not imported and you use the enableSourceMaps, it will log an error


## [5.0.1] - 2021-11-07

### Added
- NGXLogger is now fully customisable, see more in docs

### Changed
- Column number is now displayed by default in metadata
    before "... [my-component.ts:15] ..."
    after "... [my-component.ts:15:10] ..."
- null sent in message will still log something
    before "this.logger.error(null, myVar)" would not log anything, now it does
    if you want to come back to the old behavior, you can override INGXLoggerRulesService

### Breaking Changes
- LoggerConfig is renamed to INGXLoggerConfig
- NGXLogInterface is changed to INGXLoggerMetadata
- LoggerColorScheme is renamed to NGXLoggerColorScheme
- NGXMapperService is renamed to INGXLoggerMapperService
- NGXLoggerHttpService is renamed to INGXLoggerServerService
- If server logger fails it now throws an exception instead of logging an error
- LoggerUtils is deleted
- For server side logging : If an error is sent (in message or in additional) then we return the error.stack only. It was done only for message now it is also done for additional.
- NgxLoggerService is not a singleton anymore and respects Angular DI rules (before it was providedIn: 'root')

### Deprecated features
- CustomNGXLoggerService is now deprecated because the Logger is now fully customisable
- NGXLoggerMonitor is now deprecated, you should use INGXLoggerMonitor instead
- setCustomHttpHeaders is now deprecated, the property is now part of the config
- setCustomParams is now deprecated, the property is now part of the config
- setWithCredentialsOptionValue is now deprecated, the property is now part of the config


## [4.2.3, 4.3.0, 4.3.1, 4.3.2 and 4.3.3] - 2021-07-12 & 2021-07-13
NB : those changelogs where not added correctly when the version was published, I reread all the commits to update changelog

Note about version numbers :
4.2.3 was never published (but it was commited)
4.3.1 publish was bugged and was changed for 4.3.2 right after

### Breaking changes
- NGXLoggerService is now a singleton (used with providedIn: 'root')
  For information, this change was reverted in 5.x.x so that the lib respects Angular DI rules and you have control on how you want to provide NGXLogger instances

### Changes
- (internal) Changed the way some internal services were provided
- (internal) e2e project was deleted because it was not used
- Added forChild function to LoggerModule


## [4.2.2] - 2021-05-23

### Fixed

- Fix getcolor, colorscheme was not binded correctly [#253](https://github.com/dbfannin/ngx-logger/pull/253). Thanks [@jschank](https://github.com/jschank)

### Added

- Updates to Angular 11 [#251](https://github.com/dbfannin/ngx-logger/pull/251). Thanks [@bmtheo](https://github.com/bmtheo)


## [4.2.1] - 2021-02-23

### Fixed

- Fix for sourcemap parsing in Firefox [#227](https://github.com/dbfannin/ngx-logger/pull/227). Thanks [@bmtheo](https://github.com/bmtheo)
- Fix for logging complex structures (circular) without introducing a new dependency [#223](https://github.com/dbfannin/ngx-logger/pull/223). Thanks [@bmtheo](https://github.com/bmtheo)

## [4.2.0] - 2021-02-22

### Added

- A new option `proxiedSteps` {number} has been introduced. When set to a number, the given number of steps will be ignored in the stacktrace to compute the caller location. If you happen to always see the same location reported in the logs (for example a wrapper service of your own), tune this option to skip this step in the stack traces [#192](https://github.com/dbfannin/ngx-logger/pull/192). Thanks [@amilor](https://github.com/amilor) & [@bmtheo](https://github.com/bmtheo)
- New config option `disableFileDetails` (defaults to false). When set to `true`, filename details will not be shown in log messages ([#214](https://github.com/dbfannin/ngx-logger/pull/214)). Thanks [@Raphy](https://github.com/Raphy)
- Calling the `debug` endpoint now use `console.debug` api on the browser ([#213](https://github.com/dbfannin/ngx-logger/pull/213)). Thanks [@bmtheo](https://github.com/bmtheo)
- Gives direct accesss to current log levels through `level()` and `serverLogLevel()`. [#215](https://github.com/dbfannin/ngx-logger/pull/225). Thanks [@bmtheo](https://github.com/bmtheo)

### Fixed

- Fix missing `HttpClientModule` import ([#212](https://github.com/dbfannin/ngx-logger/pull/212)). Thanks [@markterrill](https://github.com/markterrill)
- Various dependencies bumps

### Changed

- Now in order to display the messages in the debug level you need to enable “verbose” or "debug" mode in the developer tools - console of the browser.

- Firefox – Enable debug
- Chrome – Enable verbose
- Edge – Enable verbose
- Opera – Enable verbose


## [4.1.8] - 2020-04-16

### Fixed

- Fixed issues with filename and line number being incorrect

## [4.1.7] - 2020-04-16

### Added

- Now supports custom color schemes for logs (see README)

## [4.1.5] - 2020-04-16

### Fixed

- Now support custom format timestamps in addition to pre-defined ones in Angular [@qortex](https://github.com/qortex). Fixes #178.

## Breaking changes for NGX Logger 3.\* to 4.\*

- Importing mocks and the logger testing module should now be imported from the new testing entrypoint
  - `import {LoggerTestingModule} from 'ngx-logger/testing';`