import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'current-sale',
  templateUrl: './current-sale.component.html',
  styleUrls: ['./current-sale.component.css'],
  moduleId: module.id,
})
export class CurrentSaleComponent {
  @Input() sale: any;

  constructor() {}
}
