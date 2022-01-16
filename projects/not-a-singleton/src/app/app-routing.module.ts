import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalProviderComponent } from './local-provider/local-provider.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'not-a-singleton',
    loadChildren: (): any => import('projects/not-a-singleton/src/app/not-a-singleton/not-a-singleton.module').then(m => m.NotASingletonModule),
  },
  {
    path: 'local-provider',
    component: LocalProviderComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
