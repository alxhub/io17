import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

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
    AppRouteModule,
  ],
  providers: [],
})
export class AppModule { }
