import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'product-line',
  templateUrl: './product-line.component.html',
  styleUrls: ['./product-line.component.css'],
  moduleId: module.id,
})
export class ProductLineComponent {
  @Input() product;

  constructor(public sanitizer: DomSanitizer) {}
}
