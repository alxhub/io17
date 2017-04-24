import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {CurrentSaleComponent} from '../current-sale/current-sale.component';
import {ProductLineComponent} from '../product-line/product-line.component';
import {HomeRouteComponent} from './home-route.component';
import {SharedHttpModule} from '../http.module';
import {IconModule} from '../icon/icon.module';

@NgModule({
  declarations: [
    CurrentSaleComponent,
    ProductLineComponent,
    HomeRouteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: HomeRouteComponent},
    ]),
    IconModule,
  ],
})
export class HomeModule {}