import {Component, Input} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  moduleId: module.id,
})
export class IconComponent {
  @Input() name: string;
}
