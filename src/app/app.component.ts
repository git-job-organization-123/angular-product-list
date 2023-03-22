import { Component, NgModule, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None // Temporary style fix (left and right margin)
})
export class AppComponent {
  priceSortOrder: string = "asc";

  onPriceSortOrderChange(e: any) {
    this.priceSortOrder = e.target.value;
  }
}
