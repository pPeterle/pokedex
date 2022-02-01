import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  tap,
  lastValueFrom,
  BehaviorSubject,
  from,
  EMPTY,
} from 'rxjs';

import { PokemonModel, PokemonListModel, ApiResultModel } from '../models';
import { map, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { LocalDatabase, LocalStorageDatabase } from '../database';

export const QUERY_LIMIT = 20;

@Injectable()
export class PokemonService {
  private _lastPokemonSearch: BehaviorSubject<string[]>;

  constructor(
    private http: HttpClient,
    private localDatabase: LocalDatabase,
    private localStorage: LocalStorageDatabase
  ) {
    const historySearch = this.localStorage.getHistorySearch();
    this._lastPokemonSearch = new BehaviorSubject<string[]>(historySearch);
  }

  getPokemon(name: string): Observable<PokemonModel> {
    const fakeApiResult: ApiResultModel<PokemonListModel> = {
      count: 1,
      results: [
        {
          name,
        },
      ],
    };
    return from(this.getLocalOrApi(fakeApiResult)).pipe(
      tap(() => {
        this.localStorage.saveHistorySearch(name);
        const history = this.localStorage.getHistorySearch();
        this._lastPokemonSearch.next(history);
      }),
      map((apiResult) => {
        return apiResult.results[0];
      }),
      catchError(() => EMPTY)
    );
  }

  getListPokemon(page = 0): Observable<ApiResultModel<PokemonModel>> {
    const params = new HttpParams()
      .set('limit', QUERY_LIMIT)
      .set('offset', QUERY_LIMIT * page);

    return this.http
      .get<ApiResultModel<PokemonListModel>>('pokemon', { params })
      .pipe(switchMap((data) => this.getLocalOrApi(data)));
  }

  searchPokemonName(name: string): Observable<string[]> {
    if (name === '') {
      return this._lastPokemonSearch.pipe(
        map((pokemons) => pokemons.filter((name) => name !== ''))
      );
    } else {
      return from(this.localDatabase.searchPokemonName(name)).pipe(
        map((list) => list.map((p) => p.name))
      );
    }
  }

  private async getLocalOrApi(
    data: ApiResultModel<PokemonListModel>
  ): Promise<ApiResultModel<PokemonModel>> {
    try {
      const localData = await this.getPokemonLocalData(data);
      console.log(`Dados local: ${localData.results.length}`);
      return localData;
    } catch (e) {
      console.log('req api');
      return lastValueFrom(this.getPokemonApiData(data));
    }
  }

  private async getPokemonLocalData(
    data: ApiResultModel<PokemonListModel>
  ): Promise<ApiResultModel<PokemonModel>> {
    const name = data.results.map((pokemon) => pokemon.name);
    const pokemons = await this.localDatabase.getPokemonsByNames(name);
    const localPokemonModel: ApiResultModel<PokemonModel> = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: pokemons,
    };
    return localPokemonModel;
  }

  private getPokemonApiData(
    data: ApiResultModel<PokemonListModel>
  ): Observable<ApiResultModel<PokemonModel>> {
    return forkJoin(
      data.results.map((pokemon) =>
        this.http.get<PokemonModel>(`pokemon/${pokemon.name}`)
      )
    ).pipe(
      mergeMap((pokemon) => this.localDatabase.addPokemonData(pokemon)),
      map((pokemonModel) => {
        const apiResultPokemonModel: ApiResultModel<PokemonModel> = {
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: pokemonModel,
        };
        return apiResultPokemonModel;
      })
    );
  }
}
