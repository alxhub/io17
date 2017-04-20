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
      {path: 'qux', pathMatch: 'prefix'},
      {path: 'baz', pathMatch: 'full'},
      {path: 'zux/:id/:other'},
      {path: 'test', children: [
        {path: 'foo/:id/:other/bar'},
        {path: 'bar/:id/:other/foo', pathMatch: 'prefix'},
      ]}
    ]),
  ],
})
export class HomeRouteModule {}
