import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private openSubject = new Subject<string>();
  open$ = this.openSubject.asObservable();

  open(message: string) {
    this.openSubject.next(message);
  }
}
