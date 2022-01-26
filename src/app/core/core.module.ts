import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiService, PokemonFightService, PokemonService } from './services';
import { GlobalErrorHandler } from './global-error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MatSnackBarModule],
  providers: [
    ApiService,
    PokemonService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    PokemonFightService
  ],
})
export class CoreModule {}
