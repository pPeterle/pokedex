import Dexie, { Table } from 'dexie';
import { PokemonListModel, PokemonModel } from '../models';

export class LocalDb extends Dexie {
  pokemonTable!: Table<PokemonModel, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(2).stores({
      pokemonTable: 'id, &name',
    });
  }

  async addPokemonData(list: PokemonModel[]): Promise<PokemonModel[]> {
    try {
      const verifyPokemonsInDatabase = await localDb.pokemonTable
        .where('name')
        .anyOf(list.map((p) => p.name))
        .toArray();
      const listFiltered = list.filter(
        (pokemon) => !verifyPokemonsInDatabase.includes(pokemon)
      );
      await localDb.pokemonTable.bulkAdd(listFiltered);
      return list;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getPokemonsByNames(names: string[]): Promise<PokemonModel[]> {
    const pokemons = await localDb.pokemonTable
      .where('name')
      .anyOf(names)
      .sortBy('id');

    if (pokemons.length !== names.length) throw new Error('Pokemon not found');

    return pokemons;
  }

  async searchPokemonName(name: string): Promise<PokemonListModel[]> {
    return localDb.pokemonTable
      .where('name')
      .startsWithIgnoreCase(name)
      .limit(5)
      .toArray();
  }
}

export const localDb = new LocalDb();
