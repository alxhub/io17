import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'loading-screen',
  template: '<h2>Loading...</h2>',
})
export class LoadingScreen {}

@NgModule({
  declarations: [
    LoadingScreen,
  ],
  imports: [
    RouterModule.forChild([
      {path: '', pathMatch: 'prefix', component: LoadingScreen},
    ])
  ]
})
export class AppServerModule {}