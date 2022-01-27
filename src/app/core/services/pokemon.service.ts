import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  tap,
  lastValueFrom,
  BehaviorSubject,
  from,
} from 'rxjs';

import { ApiService, QUERY_LIMIT } from './api.service';
import { PokemonModel, PokemonListModel, ApiResultModel } from '../models';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { localDb } from '../database/local.database';
import LocalStorageDatabase from '../database/local-storage.database';

@Injectable()
export class PokemonService {
  private _lastPokemonSearch: BehaviorSubject<string[]>;

  constructor(private apiService: ApiService) {
    const historySearch = LocalStorageDatabase.getHistorySearch();
    this._lastPokemonSearch = new BehaviorSubject<string[]>(historySearch);
  }

  getPokemon(name: string): Observable<PokemonModel> {
    return this.apiService.get<PokemonModel>(`pokemon/${name}`).pipe(
      tap(() => {
        LocalStorageDatabase.saveHistorySearch(name);
        const history = LocalStorageDatabase.getHistorySearch();
        this._lastPokemonSearch.next(history);
      })
    );
  }

  getListPokemon(page = 0): Observable<ApiResultModel<PokemonModel>> {
    const params = new HttpParams()
      .set('limit', QUERY_LIMIT)
      .set('offset', QUERY_LIMIT * page);

    return this.apiService
      .get<ApiResultModel<PokemonListModel>>('pokemon', params)
      .pipe(switchMap((data) => this.getLocalOrApi(data)));
  }

  searchPokemonName(name: string): Observable<string[]> {
    try {
      if (name === '') {
        return this._lastPokemonSearch.pipe(
          map((pokemons) => pokemons.filter((name) => name !== ''))
        );
      } else {
        return from(localDb.searchPokemonName(name)).pipe(
          map((list) => list.map((p) => p.name))
        );
      }
    } catch (e) {
      console.error(e);
      return new Observable();
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
    const pokemons = await localDb.getPokemonsByNames(name);

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
        this.apiService.get<PokemonModel>(`pokemon/${pokemon.name}`)
      )
    )
      .pipe(mergeMap((pokemon) => localDb.addPokemonData(pokemon)))
      .pipe(
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
