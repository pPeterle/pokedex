import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { NotificationService, PokemonFightService, PokemonService } from './services';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { HttpErrorInterceptor } from './errors/http-error-interceptor';
import { LocalStorageDatabase } from './database/local-storage.database';
import { LocalDatabase } from './database/local.database';
import { HttpBaseUrlInterceptor } from './errors/http-base-url-inteceptor';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule],
  providers: [
    NotificationService,
    LocalDatabase,
    LocalStorageDatabase,
    PokemonService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
      deps: [NotificationService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBaseUrlInterceptor,
      multi: true
    },
    PokemonFightService,
  ],
})
export class CoreModule {}
