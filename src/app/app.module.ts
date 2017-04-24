import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from '@angular/router';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {IconModule} from './icon/icon.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule.withServerTransition({appId: 'ng-store'}),
    NoopAnimationsModule,
    HttpModule,
    // Application routing
    RouterModule.forRoot([
      {path: '', pathMatch: 'full', loadChildren: 'app/home/home-route.module#HomeModule'},
      {path: 'cart', loadChildren: 'app/cart/cart-route.module#CartModule'},
    ]),
    IconModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
