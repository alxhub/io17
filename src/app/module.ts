import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MdToolbarModule} from '@angular/material';

import {Root} from './root';
import {AppRouteModule} from './routes';

@NgModule({
  bootstrap: [
    Root,
  ],
  declarations: [
    Root,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ngs'}),
    NoopAnimationsModule,
    AppRouteModule,
    MdToolbarModule,
  ],
  providers: [],
})
export class AppModule {}
