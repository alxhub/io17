import {Injectable, NgModule} from '@angular/core';
import {HttpModule, Request, XSRFStrategy} from '@angular/http';

@Injectable()
export class NoopXsrfStrategy {
  configureRequest(req: Request): void {}
}

@NgModule({
  imports: [HttpModule],
  providers: [
    {provide: XSRFStrategy, useClass: NoopXsrfStrategy},
  ],
})
export class SharedHttpModule {}