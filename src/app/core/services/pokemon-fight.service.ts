import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PokemonModel } from '../models';

export interface PokemonBatle extends PokemonModel {
  total: number;
  winner: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonFightService {
  private _pokemonsFightSubject = new BehaviorSubject<PokemonModel[]>([]);
  get pokemonFightList(): Observable<PokemonModel[]> {
    return this._pokemonsFightSubject.asObservable();
  }

  private _resultFightSubject = new Subject<PokemonBatle[]>();
  get resultFight(): Observable<PokemonBatle[]> {
    return this._resultFightSubject.asObservable();
  }

  private _batleStatus = new BehaviorSubject<boolean>(false);
  get atualBatleStatus() {
    return this._batleStatus.value;
  }
  get batleStatus(): Observable<boolean> {
    return this._batleStatus.asObservable();
  }

  setFightState(isFight: boolean) {
    this._batleStatus.next(isFight);
    if (!isFight) {
      this.exitFight();
    }
  }

  addPokemonToFight(pokemon: PokemonModel) {
    if (!this._batleStatus.value) return;

    const index = this._pokemonsFightSubject.value.indexOf(pokemon);

    if (index > -1) {
      this._pokemonsFightSubject.value.splice(index, 1);
      this._pokemonsFightSubject.next(this._pokemonsFightSubject.value);
      return;
    }

    if (this._pokemonsFightSubject.value.length >= 2) return;

    this._pokemonsFightSubject.value.push(pokemon);
    this._pokemonsFightSubject.next(this._pokemonsFightSubject.value);

    if (this._pokemonsFightSubject.value.length == 2) {
      this.fightPokemon();
    }
  }

  exitFight() {
    this._pokemonsFightSubject.value.splice(
      0,
      this._pokemonsFightSubject.value.length
    );
    this._pokemonsFightSubject.next(this._pokemonsFightSubject.value);

    this._batleStatus.next(false);
  }

  private fightPokemon() {
    const pokemonsWithTotal = this._pokemonsFightSubject.value.map(
      (pokemon) => {
        const total = pokemon.stats
          .map((stats) => stats.base_stat)
          .reduce((p, c) => p + c);
        return {
          ...pokemon,
          total,
        };
      }
    );

    const pokemonsWithWinner = pokemonsWithTotal.map((pokemon, index) => {
      const oponnentTotal = pokemonsWithTotal[1 - index].total;
      return {
        ...pokemon,
        winner: pokemon.total > oponnentTotal,
      };
    });
    this._resultFightSubject.next(pokemonsWithWinner);
  }

}
