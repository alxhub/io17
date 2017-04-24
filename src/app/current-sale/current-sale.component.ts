import { Component, OnInit, Input } from '@angular/core';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'current-sale',
  templateUrl: './current-sale.component.html',
  styleUrls: ['./current-sale.component.css'],
  moduleId: module.id,
})
export class CurrentSaleComponent {
  @Input() sale: any;

  constructor(private sb: MdSnackBar) {}

  testSnackBar() {
    this.sb.open('Update Available', 'Reload');
  }
}
