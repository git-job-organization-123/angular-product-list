import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductItem } from '../product-item.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
  encapsulation: ViewEncapsulation.None // Temporary style fix (fix broken flex)
})
export class ProductItemComponent {
  @Input() productItem: ProductItem = new ProductItem('', '', '', 0, '', []);

  showModal: boolean = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
