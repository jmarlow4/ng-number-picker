import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  initialValue: number = 3;
  increment: number = 1;
  maxValue: number = 200;
  minValue: number = 0;
  value: number = 0;

  onNumberSelected(value: number) {
    this.value = value;
  }
}
