import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

function toFirebaseList(arr: any[]): any[] {
  return arr
    .map((item, index) => {
      if (item) {
        item.index = index;
      }
      return item;
    })
    .filter(item => item !== null);
}

@Component({
  selector: 'app-home-route',
  templateUrl: './home-route.component.html',
  styleUrls: ['./home-route.component.css'],
  moduleId: module.id,
})
export class HomeRouteComponent {
  sale: Observable<any>;
  products: Observable<any>;

  constructor(http: Http) {
    this.sale = http.get('https://ngstore-feb94.firebaseio.com/sale.json').map(res => res.json());
    this.products = http.get('https://ngstore-feb94.firebaseio.com/product.json')
      .map(res => res.json())
      .map(list => toFirebaseList(list));
  }
}
