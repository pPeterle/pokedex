import Dexie, { Table } from 'dexie';
import { PokemonListModel, PokemonModel } from '../models';

export class LocalDb extends Dexie {
  pokemonNameListTable!: Table<PokemonListModel, number>;
  pokemonTable!: Table<PokemonModel, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      pokemonNameListTable: '++id, &name',
      pokemonTable: 'id, &name',
    });
  }

  async addPokemonsName(list: PokemonListModel[]) {
    try {
      const verifyPokemonsNotInDatabase = await localDb.pokemonNameListTable
        .where('name')
        .noneOf(list.map((i) => i.name))
        .toArray();
      const listFiltered = list.filter((pokemon) =>
        verifyPokemonsNotInDatabase.includes(pokemon)
      );
      await localDb.pokemonNameListTable.bulkAdd(listFiltered);
    } catch (e) {
      console.error(e);
    }
  }

  async addPokemonData(list: PokemonModel[]): Promise<PokemonModel[]> {
    console.log('adicionando pokemon');
    try {
      const verifyPokemonsNotInDatabase = await localDb.pokemonTable
      .where('name')
      .noneOf(list.map((i) => i.name))
        .toArray();
        const listFiltered = list.filter(
          (pokemon) => !verifyPokemonsNotInDatabase.includes(pokemon)
          );
          console.log(`pokemons adicionados: ${listFiltered.length}`);
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

  getCountPokemonName() {
    return localDb.pokemonNameListTable.count();
  }

  async searchPokemonName(name: string): Promise<PokemonListModel[]> {
    return localDb.pokemonNameListTable
      .where('name')
      .startsWithIgnoreCase(name)
      .limit(5)
      .toArray();
  }
}

export const localDb = new LocalDb();
