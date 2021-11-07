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
    path: 'main',
    component: MainComponent,
  }
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
