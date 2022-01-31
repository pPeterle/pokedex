import Dexie, { Table } from 'dexie';
import { environment } from 'src/environments/environment';
import { PokemonListModel, PokemonModel } from '../models';

export class LocalDatabase extends Dexie {
  private pokemonTable!: Table<PokemonModel, number>;

  constructor(private nameBd: string = environment.database_name) {
    super(nameBd);
    this.version(3).stores({
      pokemonTable: 'id, &name',
    });
  }

  async addPokemonData(list: PokemonModel[]): Promise<PokemonModel[]> {
    const verifyPokemonsInDatabase = await this.pokemonTable
      .where('name')
      .anyOf(list.map((p) => p.name))
      .toArray();
    const listFiltered = list.filter(
      (pokemon) => !verifyPokemonsInDatabase.includes(pokemon)
    );
    await this.pokemonTable.bulkAdd(listFiltered);
    return list;
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

  clearDatabase() {
    return Dexie.delete(this.nameBd);
  }
}
