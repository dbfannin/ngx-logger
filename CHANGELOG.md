# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Merged features waiting to be published in upcoming version

### Added
- NGXLogger is now fully customisable, see more in docs

### Breaking Changes
- LoggerConfig is renamed to INGXLoggerConfig
- ConfigEngine is shared through all logger instances. It was not before. TODO bmtheo to check (what happens when using forchild ?)
- null sent in message will still log something
    before "this.logger.error(null, myVar)" would not log anything, now it does
    if you want to come back to the old behavior, you can override INGXLoggerRulesService
- NGXLogInterface was changed to INGXLoggerMetadata
- Column number is now displayed by default in metadata
    before "... [my-component.ts:15] ..."
    after "... [my-component.ts:15:10] ..."
- LoggerColorScheme is renamed to NGXLoggerColorScheme
- NGXMapperService is renamed to INGXLoggerMapperService
- NGXLoggerHttpService is renamed to INGXLoggerServerService
- If server logger fails it now throws an exception instead of logging an error

### Deprecated features
- CustomNGXLoggerService is now deprecated because the Logger is now fully customisable
- NGXLoggerMonitor is now deprecated, you should use INGXLoggerMonitor instead
- setCustomHttpHeaders in config now
- setCustomParams in config now
- setWithCredentialsOptionValue in config now

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