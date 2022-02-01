import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'idPokemon' })
export class IdPokemonPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 1000) return `#${('000' + value).slice(-3)}`;
    else return `#${value}`;
  }
}
