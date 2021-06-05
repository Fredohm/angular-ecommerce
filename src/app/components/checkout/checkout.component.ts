import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: []
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });
  }

  // tslint:disable-next-line:typedef
  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress
        .setValue(this.checkOutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkOutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit(): void {
    console.log(`Handling the submit button`);
    console.log(this.checkOutFormGroup.get('customer').value);
    console.log(`The email address is ` + this.checkOutFormGroup.get('customer').value.email);
  }
}
