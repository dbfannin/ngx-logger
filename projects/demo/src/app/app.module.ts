import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggerModule, NgxLoggerLevel } from '../../../../src/public_api';

import { AppComponent } from './app.component';
import { LogConfigComponent } from './log-config/log-config.component';
import { LoggerFormComponent } from './logger-form/logger-form.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomInstanceComponent } from './custom-instance/custom-instance.component';

@NgModule({
  declarations: [AppComponent, LogConfigComponent, LoggerFormComponent, CustomInstanceComponent],
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
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
