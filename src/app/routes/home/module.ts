import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeRoute} from './root';

@NgModule({
  declarations: [
    HomeRoute,
  ],
  imports: [
    RouterModule.forChild([
      {path: '', component: HomeRoute, pathMatch: 'full'},
    ]),
  ],
})
export class HomeRouteModule {}
