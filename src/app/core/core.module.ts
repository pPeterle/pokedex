import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  NotificationService,
  PokemonFightService,
} from './services';
import { environment } from 'src/environments/environment';
import { PokemonService } from './http';
import { DATABASE_NAME, LocalDatabase, LocalStorageDatabase } from './database';
import { GlobalErrorHandler } from './errors';
import { HttpBaseUrlInterceptor, HttpErrorInterceptor } from './interceptors';

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
