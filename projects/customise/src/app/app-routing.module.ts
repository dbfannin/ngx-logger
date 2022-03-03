import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'writer',
    loadChildren: (): any => import('projects/customise/src/app/writer/writer.module').then(m => m.WriterModule),
  },
  {
    path: 'customise-body-server-log',
    loadChildren: (): any => import('projects/customise/src/app/customise-body-server-log/customise-body-server-log.module').then(m => m.CustomiseBodyServerLogModule),
  },
  {
    path: 'auth-token',
    loadChildren: (): any => import('projects/customise/src/app/auth-token/auth-token.module').then(m => m.AuthTokenModule),
  },
  {
    path: 'main',
    component: MainComponent,
  },
];

@NgModule({
  declarations: [MainComponent],
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
