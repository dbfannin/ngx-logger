import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel, TOKEN_LOGGER_SERVER_SERVICE } from 'src/public_api';
import { AuthTokenServerService } from './auth-token-server.service';
import { AuthTokenComponent } from './auth-token.component';

const authTokenRoutes = [
  {
    path: '',
    component: AuthTokenComponent,
  }
];

@NgModule({
  declarations: [
    AuthTokenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(authTokenRoutes),
    LoggerModule.forRoot(
      { level: NgxLoggerLevel.TRACE, serverLogLevel: NgxLoggerLevel.TRACE, serverLoggingUrl: 'dummyURL' },
      {
        serverProvider: {
          provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: AuthTokenServerService
        }
      }),
  ],
  providers: [
    AuthTokenServerService,
  ]
})
export class AuthTokenModule {
}
