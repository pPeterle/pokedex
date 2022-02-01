import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonBatle } from 'src/app/core/services';

@Component({
  selector: 'app-fight-pokemon-dialog',
  templateUrl: './fight-pokemon-dialog.component.html',
  styleUrls: ['./fight-pokemon-dialog.component.scss'],
})
export class FightPokemonDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public pokemons: PokemonBatle[]) {}
}
