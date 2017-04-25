import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MdCardModule, MdIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {CurrentSaleComponent} from '../current-sale/current-sale.component';
import {ProductLineComponent} from '../product-line/product-line.component';
import {HomeRouteComponent} from './home-route.component';

@NgModule({
  declarations: [
    CurrentSaleComponent,
    ProductLineComponent,
    HomeRouteComponent,
  ],
  imports: [
    CommonModule,
    MdCardModule,
    MdIconModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: HomeRouteComponent},
    ]),
  ],
})
export class HomeModule {}