import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';

/**
 * Relative on purpose. The site is served from more than one hostname
 * (production and the perfect.stronazen.pl target in deploy.sh), so an absolute
 * URL would break whichever one it was not written for.
 */
const CONTACT_ENDPOINT = '/api/contact.php';

export enum ContactFormType {
  SPRZEDAM = 'sprzedam',
  SZUKAM = 'szukam',
}

@Component({
  selector: 'perfect-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ContactFormComponent implements OnDestroy {
  private subscription: Subscription;
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
    this.subscription = this.route.params.subscribe((params) => {
      this.typ = params['typ'];
    });

    this.form = this.formBuilder.group({
      personalData: this.formBuilder.group({
        name: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      }),
      propertyDetails: this.formBuilder.group({
        propertyType: [''],
        region: [''],
        city: [''],
        priceFrom: [''],
        priceTo: [''],
        areaFrom: [''],
        areaTo: [''],
        address: [''],
        price: [''],
      }),
      // Honeypot. Hidden with CSS rather than type="hidden" because bots skip
      // hidden inputs but do fill anything that looks like a real field. A
      // non-empty value server-side means the submission is not a person.
      website: [''],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    // Structured fields rather than a pre-rendered blob: the endpoint formats
    // the email, so the client has no business deciding how it reads.
    const payload = { ...this.form.getRawValue(), typ: this.typ };

    this.subscription.add(
      this.httpClient
        .post<{ ok: boolean }>(CONTACT_ENDPOINT, payload, {
          headers: new HttpHeaders({ 'content-type': 'application/json' }),
        })
        .pipe(
          // Any non-2xx or network failure lands here. Without this the
          // submission failed silently and the enquiry was simply lost.
          catchError(() => {
            this.snackbarService.open('Wystąpił błąd, spróbuj ponownie');
            return EMPTY;
          }),
        )
        .subscribe(() => {
          this.snackbarService.open('Dziękujemy za zgłoszenie :)');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
        }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
