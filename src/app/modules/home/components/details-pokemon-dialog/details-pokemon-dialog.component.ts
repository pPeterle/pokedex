import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonModel } from 'src/app/core/models';

export const MAX_STAT_TOTAL = 1275;
export const MAX_STAT = 255;

@Component({
  selector: 'app-details-pokemon-dialog',
  templateUrl: './details-pokemon-dialog.component.html',
  styleUrls: ['./details-pokemon-dialog.component.scss'],
})
export class DetailsPokemonDialogComponent {
  totalStatusPercentage: number;
  totalStatus: number;

  constructor(@Inject(MAT_DIALOG_DATA) public pokemon: PokemonModel) {
    const stats = this.pokemon.stats
      .map((s) => s.base_stat)
      .reduce((previus, current) => previus + current);

    this.totalStatus = stats;
    this.totalStatusPercentage = (stats / MAX_STAT_TOTAL) * 100;
  }
}
