import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MdCardModule, MdIconModule, MdToolbarModule, MdSnackBarModule} from '@angular/material';

import { AppComponent } from './app.component';

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
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', loadChildren: 'app/home/home-route.module#HomeModule'},
      {path: 'cart', loadChildren: 'app/cart/cart-route.module#CartModule'},
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
