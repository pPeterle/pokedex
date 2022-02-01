import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  NotificationService,
  PokemonFightService,
  PokemonService,
} from './services';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { HttpErrorInterceptor } from './interceptors/http-error-interceptor';
import { LocalStorageDatabase } from './database/local-storage.database';
import { DATABASE_NAME, LocalDatabase } from './database/local.database';
import { HttpBaseUrlInterceptor } from './interceptors/http-base-url-inteceptor';
import { environment } from 'src/environments/environment';

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
      deps: [NotificationService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBaseUrlInterceptor,
      multi: true,
    },
    { provide: DATABASE_NAME, useValue: environment.database_name },
    PokemonFightService,
  ],
})
export class CoreModule {}
