import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Luv2ShopFormService} from '../../services/luv2-shop-form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {Luv2ShopValidators} from '../../validators/luv2-shop-validators';

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
        firstName: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('',
          [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:  new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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

  // Customer
  // tslint:disable-next-line:typedef
  get firstName() {
    return this.checkOutFormGroup.get('customer.firstName');
  }
  // tslint:disable-next-line:typedef
  get lastName() {
    return this.checkOutFormGroup.get('customer.lastName');
  }
  // tslint:disable-next-line:typedef
  get email() {
    return this.checkOutFormGroup.get('customer.email');
  }

  // Shipping Address
  // tslint:disable-next-line:typedef
  get shippingAddressCountry() {
    return this.checkOutFormGroup.get('shippingAddress.country');
  }
  // tslint:disable-next-line:typedef
  get shippingAddressStreet() {
    return this.checkOutFormGroup.get('shippingAddress.street');
  }
  // tslint:disable-next-line:typedef
  get shippingAddressCity() {
    return this.checkOutFormGroup.get('shippingAddress.city');
  }
  // tslint:disable-next-line:typedef
  get shippingAddressState() {
    return this.checkOutFormGroup.get('shippingAddress.state');
  }
  // tslint:disable-next-line:typedef
  get shippingAddressZipCode() {
    return this.checkOutFormGroup.get('shippingAddress.zipCode');
  }

  // Billing Address
  // tslint:disable-next-line:typedef
  get billingAddressCountry() {
    return this.checkOutFormGroup.get('shippingAddress.country');
  }
  // tslint:disable-next-line:typedef
  get billingAddressStreet() {
    return this.checkOutFormGroup.get('billingAddress.street');
  }
  // tslint:disable-next-line:typedef
  get billingAddressCity() {
    return this.checkOutFormGroup.get('billingAddress.city');
  }
  // tslint:disable-next-line:typedef
  get billingAddressState() {
    return this.checkOutFormGroup.get('billingAddress.state');
  }
  // tslint:disable-next-line:typedef
  get billingAddressZipCode() {
    return this.checkOutFormGroup.get('billingAddress.zipCode');
  }

  // Credit Card
  // tslint:disable-next-line:typedef
  get creditCardType() {
    return this.checkOutFormGroup.get('creditCard.cardType');
  }
  // tslint:disable-next-line:typedef
  get creditCardNameOnCard() {
    return this.checkOutFormGroup.get('creditCard.nameOnCard');
  }
  // tslint:disable-next-line:typedef
  get creditCardCardNumber() {
    return this.checkOutFormGroup.get('creditCard.cardNumber');
  }
  // tslint:disable-next-line:typedef
  get creditCardSecurityCode() {
    return this.checkOutFormGroup.get('creditCard.securityCode');
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

    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
    }

    console.log(this.checkOutFormGroup.get('customer').value);
    console.log(`The email address is ` + this.checkOutFormGroup.get('customer').value.email);
    console.log(`The shipping address country is ` + this.checkOutFormGroup.get('shippingAddress').value.country.name);
    console.log(`The shipping address state is ` + this.checkOutFormGroup.get('shippingAddress').value.state.name);
    console.log(`The billing address country is ` + this.checkOutFormGroup.get('billingAddress').value.country.name);
    console.log(`The billing address state is ` + this.checkOutFormGroup.get('billingAddress').value.state.name);
  }
}
