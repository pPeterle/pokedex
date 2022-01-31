import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { PokemonListModel, PokemonModel } from '../models';

@Injectable()
export class LocalDatabase extends Dexie {
  private pokemonTable!: Table<PokemonModel, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(2).stores({
      pokemonTable: 'id, &name',
    });
  }

  async addPokemonData(list: PokemonModel[]): Promise<PokemonModel[]> {
    try {
      const verifyPokemonsInDatabase = await this.pokemonTable
        .where('name')
        .anyOf(list.map((p) => p.name))
        .toArray();
      const listFiltered = list.filter(
        (pokemon) => !verifyPokemonsInDatabase.includes(pokemon)
      );
      await this.pokemonTable.bulkAdd(listFiltered);
      return list;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getPokemonsByNames(names: string[]): Promise<PokemonModel[]> {
    const pokemons = await this.pokemonTable
      .where('name')
      .anyOf(names)
      .sortBy('id');

    if (pokemons.length !== names.length) throw new Error('Pokemon not found');

    return pokemons;
  }

  async searchPokemonName(name: string): Promise<PokemonListModel[]> {
    return this.pokemonTable
      .where('name')
      .startsWithIgnoreCase(name)
      .limit(5)
      .toArray();
  }
}

