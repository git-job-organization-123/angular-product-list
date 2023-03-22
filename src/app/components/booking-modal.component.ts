import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ProductItem } from '../product-item.model';
import { ProductService } from '../product.service';

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css'],
  encapsulation: ViewEncapsulation.None // Temporary style fix (fix broken modal)
})
export class BookingModalComponent {
  @Input() productItem: ProductItem = new ProductItem('', '', '', 0, '', []);
  @Output() closeModal = new EventEmitter();

  showModal: boolean = true;
  stage: number = 1;
  selectedServices: ProductItem[] = [];

  customer: Customer = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  customerFormErrors: { [key: string]: string } = {};

  constructor(private productService: ProductService) { }

  onBackClick() {
    this.stage--;
  }

  onNextClick() {
    this.stage++;
  }

  onModalBoxClick(e: Event) {
    e.stopPropagation();
  }

  onModalOutsideClick(e: Event) {
    this.onModalClose(e);
  }

  onModalClose(e: Event) {
    e.stopPropagation(); // Prevent re-opening of the modal
    this.closeModal.emit();
  }

  onServiceSelect(service: ProductItem) {
    const serviceIndex = this.selectedServices.indexOf(service);
    if (serviceIndex === -1) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices.splice(serviceIndex, 1);
    }
  }

  onCustomerBackClick() {
    this.onBackClick();
  }

  onCustomerNextClick() {
    const errors = this.validateCustomerForm();
    this.customerFormErrors = errors;

    if (Object.keys(errors).length === 0) {
      this.onNextClick();
    }
  }

  onCustomerInputBlur(name: string) {
    let error = this.validateCustomerFormInput(name);
    if (!error) {
      // Remove error message
      error = { [name]: '' };
    }

    Object.assign(this.customerFormErrors, error);
  }

  validateCustomerFormInput(formInputName: string): any {
    if (formInputName === 'firstName' && !this.customer.firstName) {
      return { firstName: 'Please enter your first name' };
    } else if (formInputName === 'lastName' && !this.customer.lastName) {
      return { lastName: 'Please enter your last name' };
    } else if (formInputName === 'email' && !this.customer.email) {
      return { email: 'Please enter your email' };
    } else if (
      formInputName === 'email' &&
      !/\S+@\S+.\S+/.test(this.customer[formInputName])
    ) {
      return { email: 'Please enter a valid email' };
    } else if (formInputName === 'phone' && !this.customer.phone) {
      return { phone: 'Please enter your phone number' };
    } else if (
      formInputName === 'phone' &&
      !/^\d{10}$/.test(this.customer[formInputName])
    ) {
      return { phone: 'Please enter a valid 10-digit phone number' };
    }

    return null;
  }

  validateCustomerForm(): any {
    const errors = {};

    Object.assign(errors, this.validateCustomerFormInput('firstName'));
    Object.assign(errors, this.validateCustomerFormInput('lastName'));
    Object.assign(errors, this.validateCustomerFormInput('email'));
    Object.assign(errors, this.validateCustomerFormInput('phone'));

    return errors;
  }

  getBookingProducts() {
    if (!this.productItem) {
      return null;
    }

    const serviceItems = this.selectedServices.map((service) => {
      return {
        "name": service.name,
        "code": service.code,
      }
    });

    // Put this product first
    return [{
      "name": this.productItem.name,
      "code": this.productItem.code,
    }].concat(serviceItems);
  }

  onBookClick() {
    this.productService.book({
      "products": this.getBookingProducts(),
      "customer": this.customer
    }).subscribe((response) => {
      alert(JSON.stringify(response));
    });
  }

  get totalExtraServicePrice() {
    return this.selectedServices.reduce((total, service) => total + service.price, 0);
  }

  get totalPrice() {
    if (!this.productItem) {
      return 0;
    }

    return this.productItem.price + this.totalExtraServicePrice;
  }
}
