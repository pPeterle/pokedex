import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiService, NotificationService, PokemonFightService, PokemonService } from './services';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { HttpErrorInterceptor } from './errors/http-error-interceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule],
  providers: [
    NotificationService,
    ApiService,
    PokemonService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    PokemonFightService
  ],
})
export class CoreModule {}
