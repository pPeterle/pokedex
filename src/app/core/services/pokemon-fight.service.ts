import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PokemonModel } from '../models';

export interface PokemonBattle extends PokemonModel {
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

  private _resultFightSubject = new Subject<PokemonBattle[]>();
  get resultFight(): Observable<PokemonBattle[]> {
    return this._resultFightSubject.asObservable();
  }

  private _battleStatus = new BehaviorSubject<boolean>(false);
  get atualBattleStatus() {
    return this._battleStatus.value;
  }
  get battleStatus(): Observable<boolean> {
    return this._battleStatus.asObservable();
  }

  setFightState(isFight: boolean) {
    this._battleStatus.next(isFight);
    if (!isFight) {
      this.exitFight();
    }
  }

  addPokemonToFight(pokemon: PokemonModel) {
    if (!this._battleStatus.value) return;

    const index = this._pokemonsFightSubject.value.indexOf(pokemon);

    if (index > -1) {
      this._pokemonsFightSubject.value.splice(index, 1);
      this._pokemonsFightSubject.next(this._pokemonsFightSubject.value);
      return;
    }

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

    this._battleStatus.next(false);
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
