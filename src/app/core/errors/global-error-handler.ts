import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notifier: NotificationService) {}

  handleError(error: Error | HttpErrorResponse) {
    const message = error.message ? error.message : 'Algum Erro aconteceu';
    this.notifier.showError(message);

    console.error(error);
  }
}
