import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NGXLogger, NgxLoggerLevel } from '../../../../../src/public_api';
import { BusinessService } from '../business-service/business.service';

import { LogEvent } from '../models/log-event.model';

export interface LoggerSelectionOption {
  value: NgxLoggerLevel;
  viewValue: string;
}

@Component({
  selector: 'app-logger',
  templateUrl: './logger-form.component.html',
  styleUrls: ['./logger-form.component.scss']
})
/**
 * The LoggerComponent allows a user to enter a message and log it using ngx-logger. The user can select the type of log message.
 * This component emits an event to the parent of the message and log type so the parent can perform the logging operation.
 */
export class LoggerFormComponent implements OnInit {
  @Output() logToConsole: EventEmitter<LogEvent> = new EventEmitter<LogEvent>();

  loggerForm = this.fb.group({
    logMessage: ['', Validators.required],
    logType: ['', Validators.required]
  });

  /* Used in the mat-select on the form */
  logTypes: LoggerSelectionOption[] = [
    { value: NgxLoggerLevel.TRACE, viewValue: 'Trace' },
    { value: NgxLoggerLevel.DEBUG, viewValue: 'Debug' },
    { value: NgxLoggerLevel.INFO, viewValue: 'Info' },
    { value: NgxLoggerLevel.LOG, viewValue: 'Log' },
    { value: NgxLoggerLevel.WARN, viewValue: 'Warn' },
    { value: NgxLoggerLevel.ERROR, viewValue: 'Error' }
  ];

  constructor(
    private fb: FormBuilder,
    private logger: NGXLogger,
    private businessService: BusinessService,
  ) {
  }

  ngOnInit() {
  }

  /**
   * Take the message and type of logging to be performed and emits it to the parent component.
   */
  handleFormSubmission() {
    this.logToConsole.emit(this.loggerForm.value);
  }

  logComplex() {
    const complexStructure = new FormGroup({ sub: new FormGroup({}) });
    this.logger.error('Test complex', complexStructure);
    this.logger.error(complexStructure);
  }

  logError() {
    try {
      var test = '';
      test = null;
      test.padEnd(1);
    } catch (err) {
      this.logger.error('Error is', err);
      this.logger.error(err);
    }
  }

  logCustomInstance(): void {
    this.businessService.doBusiness();
  }

}
