import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel, TOKEN_LOGGER_WRITER_SERVICE } from 'src/public_api';
import { WriterCustomisedService } from './writer-customised.service';
import { WriterComponent } from './writer.component';

const writerRoutes = [
  {
    path: '',
    component: WriterComponent,
  }
];

@NgModule({
  declarations: [
    WriterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(writerRoutes),
    LoggerModule.forRoot(
      { level: NgxLoggerLevel.DEBUG },
      {
        writerProvider: {
          provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: WriterCustomisedService
        }
      }),
  ],
  providers: [
    WriterCustomisedService,
  ]
})
export class WriterModule {
}
