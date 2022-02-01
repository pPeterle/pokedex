import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        let message = '';
        switch (error.status) {
          case 404:
            {
              if (error.url && error.url.includes('pokemon')) {
                message = 'Pokemon não encontrado';
                break;
              }
              message = 'Página não encontrada';
            }
            break;
        }

        message = navigator.onLine ? message : 'Sem conexão à internet';
        this.notificationService.showError(message);
        return throwError(() => new Error(message));
      })
    );
  }
}
