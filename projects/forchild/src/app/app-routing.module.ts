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
    path: 'forchild',
    loadChildren: (): any => import('projects/forchild/src/app/forchild/forchild.module').then(m => m.ForchildModule),
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
