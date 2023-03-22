import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductItem } from '../product-item.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-list-of-product-items',
  templateUrl: './list-of-product-items.component.html',
  styleUrls: ['./list-of-product-items.component.css'],
})
export class ListOfProductItemsComponent implements OnInit, OnChanges {
  @Input() priceSortOrder: string = "asc";

  productItemsData: ProductItem[] = [];
  sortedProductItemsData: ProductItem[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getAccommodations().subscribe((productItems) => {
      this.productItemsData = productItems;
      this.sortProductItems();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['priceSortOrder'] && !changes['priceSortOrder'].firstChange) {
      this.onPriceSortOrderChange();
    }
  }

  onPriceSortOrderChange() {
    this.sortProductItems();
  }

  private sortProductItems() {
    const sortedProductItemsData = [...this.productItemsData].sort((a, b) => {
      if (this.priceSortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    this.sortedProductItemsData = sortedProductItemsData;
  }
}
