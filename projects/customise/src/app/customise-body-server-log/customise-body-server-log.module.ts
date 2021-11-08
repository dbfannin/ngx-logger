import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel, TOKEN_LOGGER_SERVER_SERVICE } from 'src/public_api';
import { ServerCustomisedService } from './server-customised.service';
import { CustomiseBodyServerLogComponent } from './customise-body-server-log.component';

const customiseBodyServerLogRoutes = [
  {
    path: '',
    component: CustomiseBodyServerLogComponent,
  }
];

@NgModule({
  declarations: [
    CustomiseBodyServerLogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(customiseBodyServerLogRoutes),
    LoggerModule.forRoot(
      { level: NgxLoggerLevel.TRACE, serverLogLevel: NgxLoggerLevel.TRACE, serverLoggingUrl: 'dummyURL' },
      {
        serverProvider: {
          provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: ServerCustomisedService
        }
      }),
  ],
  providers: [
    ServerCustomisedService,
  ]
})
export class CustomiseBodyServerLogModule {
}
