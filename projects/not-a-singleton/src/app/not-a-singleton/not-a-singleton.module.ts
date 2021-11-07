import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggerModule, NgxLoggerLevel } from 'src/public_api';
import { NotASingletonComponent } from './not-a-singleton.component';

const singletonRoutes = [
  {
    path: '',
    component: NotASingletonComponent,
  }
];

@NgModule({
  declarations: [
    NotASingletonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(singletonRoutes),
    LoggerModule.forRoot({ level: NgxLoggerLevel.TRACE }),
  ],
})
export class NotASingletonModule {
}
