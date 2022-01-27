import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public snackBar: MatSnackBar, private zone: NgZone, private spinner: NgxSpinnerService) {}

  showSuccess(message: string): void {
    this.zone.run(() => {
      this.snackBar.open(message);
    });
  }

  showError(message: string): void {
    this.zone.run(() => {
      this.snackBar.open(message, 'X', { panelClass: ['error'] });
      this.spinner.hide();
    });
  }
}
