import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';

export enum ContactFormType {
  SPRZEDAM = 'sprzedam',
  SZUKAM = 'szukam',
}

@Component({
  selector: 'perfect-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnDestroy {
  private subscription = new Subscription();
  readonly ContactFormType = ContactFormType;

  typ: ContactFormType = ContactFormType.SZUKAM;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private snackbarService: SnackbarService,
    private router: Router,
  ) {
    this.route.params.subscribe((params) => {
      this.typ = params['typ'];
    });

    this.form = this.formBuilder.group({
      personalData: this.formBuilder.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
        areaTo: [''],
      }),
      consent: [false, Validators.requiredTrue],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const message: string = `Dane osobowe: ${JSON.stringify(this.form.get('personalData').value, null, 2)},\nDane nieruchomości: ${JSON.stringify(this.form.get('propertyDetails').value, null, 2)}`;

      this.subscription.add(
        this.httpClient
          .post<any>(
            'https://formspree.io/f/xoqgdpag',
            {
              message,
            },
            {
              headers: new HttpHeaders({ 'content-type': 'application/json' }),
            },
          )
          .subscribe((response) => {
            if (response.ok) {
              this.snackbarService.open('Dziękujemy za zgłoszenie :)');
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 500);
            } else {
              this.snackbarService.open('Wystąpił błąd, spróbuj ponownie');
            }
          }),
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
