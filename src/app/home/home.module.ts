import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxSpinnerModule } from "ngx-spinner";

import { HomeComponent } from './home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component'
import { IdPokemonPipe } from '../shared/pipes/id-pokemon.pipe';



@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    IdPokemonPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ScrollingModule,
    NgxSpinnerModule
  ],
  exports: [
    HomeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule { }
