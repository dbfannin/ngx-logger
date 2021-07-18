import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggerModule } from 'src/public_api';
import { SingletonComponent } from './singleton.component';

const singletonRoutes = [
  {
    path: '',
    component: SingletonComponent,
  }
];

@NgModule({
  declarations: [
    SingletonComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(singletonRoutes),
    LoggerModule.forChild(),
  ],
})
export class SingletonModule {
}
