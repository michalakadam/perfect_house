import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

export enum ContactFormType {
  SPRZEDAM = 'sprzedam',
  SZUKAM = 'szukam',
}

@Component({
  selector: 'perfect-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {
  readonly ContactFormType = ContactFormType;

  typ: ContactFormType = ContactFormType.SZUKAM;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.route.params.subscribe(params => {
      this.typ = params['typ'];
    });

    this.form = this.formBuilder.group({
      personalData: this.formBuilder.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      propertyDetails: this.formBuilder.group({
        advertisementType: [''],
        propertyType: [''],
        region: [''],
        city: [''],
        district: [''],
        price: [''],
        priceFrom: [''],
        priceTo: [''],
        area: [''],
        areaFrom: [''],
        areaTo: ['']
      }),
      consent: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
