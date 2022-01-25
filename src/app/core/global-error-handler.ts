import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './services/error.service';
import { NotificationService } from './services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorService: ErrorService,
    private notifier: NotificationService
  ) {}

  handleError(error: Error | HttpErrorResponse) {
    let message: string;
    if (error instanceof HttpErrorResponse) {
      message = this.errorService.getServerErrorMessage(error);
      this.notifier.showError(message);
    } else {
      message = this.errorService.getClientErrorMessage(error);
      this.notifier.showError(message);
    }

    console.error(error);
  }
}
