import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Luv2ShopFormService} from '../../services/luv2-shop-form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkOutFormGroup: FormGroup;

  totalPrice = 0;
  totalQuantity = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) { }

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
    // populate credit card months and years
    const startMonth: number = new Date().getMonth() + 1;
    console.log(`Start month: ` + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved credit card months: ` + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log(`Retrieved credit card years: ` + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log(`Retrieved countries: ` + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  // tslint:disable-next-line:typedef
  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkOutFormGroup.controls.billingAddress
        .setValue(this.checkOutFormGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkOutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  // tslint:disable-next-line:typedef
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrieved credit card months:` + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  // tslint:disable-next-line:typedef
  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item as default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  onSubmit(): void {
    console.log(`Handling the submit button`);
    console.log(this.checkOutFormGroup.get('customer').value);
    console.log(`The email address is ` + this.checkOutFormGroup.get('customer').value.email);
    console.log(`The shipping address country is ` + this.checkOutFormGroup.get('shippingAddress').value.country.name);
    console.log(`The shipping address state is ` + this.checkOutFormGroup.get('shippingAddress').value.state.name);
    console.log(`The billing address country is ` + this.checkOutFormGroup.get('billingAddress').value.country.name);
    console.log(`The billing address state is ` + this.checkOutFormGroup.get('billingAddress').value.state.name);
  }
}
