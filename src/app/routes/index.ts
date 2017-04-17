import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  exports: [
    RouterModule,
  ],
  imports: [
    RouterModule.forRoot([
      {path: '', loadChildren: 'app/routes/home/module#HomeRouteModule', pathMatch: 'prefix'},
    ]),
  ],
})
export class AppRouteModule {}
