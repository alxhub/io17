import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdCardModule, MdIconModule, MdToolbarModule, MdSnackBarModule} from '@angular/material';
import {ServiceWorkerModule} from '@angular/service-worker';

import { AppComponent } from './app.component';
import { CurrentSaleComponent } from './current-sale/current-sale.component';
import { ProductLineComponent } from './product-line/product-line.component';

import {HomeModule} from './home/home-route.module';
import {CartModule} from './cart/cart-route.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule.withServerTransition({appId: 'ng-store'}),
    NoopAnimationsModule,
    HttpModule,
    // Material
    MdCardModule,
    MdIconModule,
    MdToolbarModule,
    // Application routing
    RouterModule.forRoot([]),
    HomeModule,
    CartModule,
    // Service worker
    ServiceWorkerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
