import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  priceSortOrder: string = "asc";

  onPriceSortOrderChange(e: any) {
    this.priceSortOrder = e.target.value;
  }
}
