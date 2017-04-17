import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'ngs-loading',
  template: '<h3>App Shell Loading Screen</h3>',
})
export class LoadingRoute {}

@NgModule({
  declarations: [
    LoadingRoute,
  ],
  imports: [
    RouterModule.forChild([
      {path: '', pathMatch: 'prefix', component: LoadingRoute},
    ]),
  ],
})
export class AppServerModule {}
