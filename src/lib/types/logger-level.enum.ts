// export enum NgxLoggerLevel {
//   TRACE = 0,
//   DEBUG,
//   INFO,
//   LOG,
//   WARN,
//   ERROR,
//   FATAL,
//   OFF
// }

export enum NgxLoggerLevel {
  EMERG = 0,
  ALERT,
  CRIT,
  ERR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
  OFF
}

/* SYSLOG LEVELS:

0   'emerg'     System is unusable (a panic condition)
1   'alert'     Action must be taken immediately (e.g., a corrupt database)
2   'crit'      Critical conditions (hard device errors)
3   'err'       Error conditions
4   'warning'   Warning conditions
5   'notice'    Normal but significant conditions
6   'info'      Informational messages
7   'debug'     Debug-level messages

*/
