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

  // Go to the previous stage
  onBackClick() {
    this.stage--;
  }

  // Go to the next stage
  onNextClick() {
    this.stage++;
  }

  onModalBoxClick(e: Event) {
    // Prevent the modal from closing when clicking inside the modal
    e.stopPropagation();
  }

  // Close modal on clicking the gray area outside of the modal
  onModalOutsideClick(e: Event) {
    this.onModalClose(e);
  }

  onModalClose(e: Event) {
    e.stopPropagation(); // Prevent re-opening of the modal
    this.closeModal.emit();
  }

  // On clicking a service in stage 2
  onServiceSelect(service: ProductItem) {
    const serviceIndex = this.selectedServices.indexOf(service);
    if (serviceIndex === -1) {
      // Select a service
      this.selectedServices.push(service);
    }
    else {
      // De-select a service
      this.selectedServices.splice(serviceIndex, 1);
    }
  }

  onCustomerBackClick() {
    this.onBackClick();
  }

  // Validate customer, then go to the next stage
  onCustomerNextClick() {
    const errors = this.validateCustomerForm();
    this.customerFormErrors = errors;

    // Check for any customer form errors
    if (Object.keys(errors).length === 0) {
      // No errors, go to next stage
      this.onNextClick();
    }
  }

  // Validate customer form input on losing focus to the customer form input
  onCustomerInputBlur(name: string) {
    let error = this.validateCustomerFormInput(name);
    if (!error) {
      // Remove error message
      error = { [name]: '' };
    }

    // Show the customer form input error message
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

  // Products to book
  getBookingProducts() {
    if (!this.productItem) {
      return null;
    }

    // This product + extra services
    return [{
      "name": this.productItem.name,
      "code": this.productItem.code,
    }].concat(this.selectedServices.map((service) => {
      return {
        "name": service.name,
        "code": service.code,
      }
    }));
  }

  onBookClick() {
    // Book the booking
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
