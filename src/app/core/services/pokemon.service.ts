import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, forkJoin, firstValueFrom, lastValueFrom } from 'rxjs';

import { ApiService, QUERY_LIMIT } from './api.service';
import { PokemonModel, PokemonListModel, ApiResultModel } from '../models';
import { map, switchMap, mergeMap } from 'rxjs/operators';
import { localDb } from '../database/local.database';
import { POPULATE_POKEMON_URL } from '.';

@Injectable()
export class PokemonService {
  constructor(private apiService: ApiService) {}

  async populateLocalDb(url: string = POPULATE_POKEMON_URL) {
    const resultApi = await firstValueFrom(
      this.apiService.getWithUrl<ApiResultModel<PokemonListModel>>(url).pipe(
        mergeMap(async (data) => {
          await localDb.addPokemonsName(data.results);
          return data;
        })
      )
    );

    const countPokemon = await localDb.getCountPokemonName();
    if (countPokemon === resultApi.count) return;

    if (resultApi.next) {
      this.populateLocalDb(resultApi.next);
    }
  }

  getPokemon(name: string): Observable<PokemonModel> {
    return this.apiService.get<PokemonModel>(`pokemon/${name}`);
  }

  getListPokemon(page = 0): Observable<ApiResultModel<PokemonModel>> {
    const params = new HttpParams()
      .set('limit', QUERY_LIMIT)
      .set('offset', QUERY_LIMIT * page);

    return this.apiService
      .get<ApiResultModel<PokemonListModel>>('pokemon', params)
      .pipe(switchMap((data) => this.getLocalOrApi(data)));
  }

  async searchPokemonName(name: string): Promise<string[]> {
    try {
      const pokemons = await localDb.searchPokemonName(name);
      return pokemons.map((p) => p.name);
    } catch (e) {
      console.error(e);
      return [];
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
        this.apiService.getWithUrl<PokemonModel>(pokemon.url)
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
