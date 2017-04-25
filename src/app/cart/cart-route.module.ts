import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MdCardModule} from '@angular/material';

import {CartRouteComponent} from './cart-route.component';

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full', component: CartRouteComponent},
    ])
  ],
  declarations: [
    CartRouteComponent,
  ]
})
export class CartModule { }
