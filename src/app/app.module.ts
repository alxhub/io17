import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdCardModule, MdIconModule, MdToolbarModule, MdSnackBarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { CurrentSaleComponent } from './current-sale/current-sale.component';
import { ProductLineComponent } from './product-line/product-line.component';

import {HomeModule} from './home/home-route.module';
import {CartModule} from './cart/cart-route.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    NoopAnimationsModule,
    BrowserModule.withServerTransition({appId: 'ng-store'}),
    HttpModule,
    MdCardModule,
    MdIconModule,
    MdToolbarModule,
    MdSnackBarModule,
    RouterModule.forRoot([]),
    HomeModule,
    CartModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
