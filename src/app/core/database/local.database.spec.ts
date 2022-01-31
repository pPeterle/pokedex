import { PokemonModel } from '../models';
import { LocalDatabase } from './local.database';

describe('Local Database', () => {
  let database: LocalDatabase;

  const list: PokemonModel[] = [
    {
      height: 1,
      id: 1,
      name: 'abcde',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 2,
      name: 'efjh',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 3,
      name: 'e12',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 4,
      name: 'e123',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 5,
      name: 'e1234',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 6,
      name: 'e12345',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
    {
      height: 2,
      id: 7,
      name: 'e123456',
      sprites: {
        front_default: '',
      },
      stats: [],
      types: [],
      weight: 1,
    },
  ];

  beforeEach(async () => {
    database = new LocalDatabase('TestDb');
    await database.clearDatabase();
    await database.addPokemonData(list);
  });

  it('add pokemon data', async () => {
    const data = await database.getPokemonsByNames(list.map((p) => p.name));

    expect(data).toEqual(list);
  });

  it('search pokemon by name that not exists', async () => {
    const result = await database.searchPokemonName('f');

    expect(result.length).toBe(0);
  });

  it('search pokemon by name', async () => {
    const result = await database.searchPokemonName('e');

    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('return error if not found pokemon', async () => {
    try {
      await database.getPokemonsByNames(['notNameInDatabase'])
    } catch(e) {
      expect(e).toBeTruthy();
    }
  })

  it('return pokemons by name', async () => {
    const pokemons = await database.getPokemonsByNames(list.map(p => p.name));

    expect(pokemons.length).toBe(list.length);
  })
});
