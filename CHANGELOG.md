# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - Merged features waiting to be published in upcoming version

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
