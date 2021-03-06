import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone,
    private spinner: NgxSpinnerService
  ) {}

  showError(message: string): void {
    this.zone.run(() => {
      this.spinner.hide();
      this.snackBar.open(message, 'X', {
        panelClass: ['error'],
        duration: 2500,
      });
    });
  }
}
