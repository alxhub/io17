import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdCardModule, MdIconModule, MdInputModule, MdToolbarModule, MdSnackBarModule} from '@angular/material';

import {HomeRouteComponent} from './home-route/home-route.component';

import { AppComponent } from './app.component';
import { CurrentSaleComponent } from './current-sale/current-sale.component';
import { ProductLineComponent } from './product-line/product-line.component';

import {CartModule} from './cart/cart-route.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeRouteComponent,
    CurrentSaleComponent,
    ProductLineComponent,
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule.withServerTransition({appId: 'ng-store'}),
    HttpModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdToolbarModule,
    MdSnackBarModule,
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', component: HomeRouteComponent},
    ]),
    CartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
