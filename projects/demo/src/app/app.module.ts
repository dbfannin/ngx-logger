import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatSelectModule
} from '@angular/material';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppComponent } from './app.component';
import { LogConfigComponent } from './log-config/log-config.component';
import { LoggerFormComponent } from './logger-form/logger-form.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, LogConfigComponent, LoggerFormComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
