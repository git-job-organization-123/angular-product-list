import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ListOfProductItemsComponent } from './components/list-of-product-items.component';
import { ProductItemComponent } from './components/product-item.component';
import { BookingModalComponent } from './components/booking-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ListOfProductItemsComponent,
    ProductItemComponent,
    BookingModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
