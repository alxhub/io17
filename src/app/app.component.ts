import { Component } from '@angular/core';
import {NgServiceWorker} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  moduleId: module.id,
})
export class AppComponent {

  constructor(private sw: NgServiceWorker) {
    sw.registerForPush().subscribe(handler => {
      window.prompt('Push endpoint', JSON.stringify({
              url: handler.url,
              key: handler.key(),
              auth: handler.auth()
            }));
    })
    sw.updates.subscribe(event => {
      switch (event.type) {
        case 'pending':
          console.log(event);
          break;
        case 'activation':
          window.location.reload();
          break;
      }
    })
  }
}
