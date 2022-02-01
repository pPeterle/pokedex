import { LocalDatabase } from '../database/local.database';
import { LocalStorageDatabase } from '../database/local-storage.database';
import { ApiResultModel, PokemonListModel, PokemonModel } from '../models';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PokemonService, QUERY_LIMIT } from '.';

describe('Api Service', () => {
  let pokemonService: PokemonService;
  let fakeLocalDatabase: LocalDatabase;
  let fakeLocalStorage: LocalStorageDatabase;
  let controller: HttpTestingController;

  const pokemonData: PokemonModel = {
    height: 1,
    id: 1,
    name: 'a',
    sprites: {
      front_default: '',
    },
    stats: [],
    types: [],
    weight: 1,
  };

  let historySearch = ['history'];
  let pokemonsSavedLocal: PokemonModel[] = [pokemonData];
  let searchPokemonInDatabase: PokemonListModel[] = [{ name: 'search' }];

  let page = 0;
  const limit = QUERY_LIMIT;
  let offset = page * limit;

  beforeEach(() => {
    page = 0;

    offset = page * limit;
    fakeLocalStorage = jasmine.createSpyObj<LocalStorageDatabase>(
      'LocalStorageDatabase',
      {
        getHistorySearch: historySearch,
        saveHistorySearch: undefined,
      }
    );

    fakeLocalDatabase = jasmine.createSpyObj<LocalDatabase>('LocalDatabase', {
      addPokemonData: Promise.resolve(pokemonsSavedLocal),
      getPokemonsByNames: Promise.resolve([pokemonData]),
      searchPokemonName: Promise.resolve(searchPokemonInDatabase),
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PokemonService,
        {
          provide: LocalDatabase,
          useValue: fakeLocalDatabase,
        },
        {
          provide: LocalStorageDatabase,
          useValue: fakeLocalStorage,
        },
      ],
    });
    pokemonService = TestBed.inject(PokemonService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('return pokemon data locally', fakeAsync(() => {
    let pokemon: PokemonModel | undefined;

    pokemonService.getPokemon(pokemonData.name).subscribe({
      next: (data) => {
        pokemon = data;
      },
      error: () => {
        fail('Error');
      },
    });

    tick(1000);

    expect(fakeLocalStorage.saveHistorySearch).toHaveBeenCalledWith(
      pokemonData.name
    );
    expect(fakeLocalStorage.getHistorySearch).toHaveBeenCalled();
    expect(pokemon).toBe(pokemonData);
  }));

  it('return pokemon data api when locally fails', fakeAsync(() => {
    let pokemon: PokemonModel | undefined;
    fakeLocalDatabase.getPokemonsByNames = jasmine
      .createSpy()
      .and.rejectWith(new Error('Pokemon not found'));

    pokemonService.getPokemon(pokemonData.name).subscribe({
      next: (data) => {
        pokemon = data;
      },
      error: () => {
        fail('Error');
      },
    });

    tick(1000);
    controller.expectOne(`pokemon/${pokemonData.name}`).flush(<PokemonModel>{
      ...pokemonData,
    });

    tick(1000);

    expect(fakeLocalStorage.saveHistorySearch).toHaveBeenCalledWith(
      pokemonData.name
    );
    expect(fakeLocalStorage.getHistorySearch).toHaveBeenCalled();
    expect(fakeLocalDatabase.addPokemonData).toHaveBeenCalledOnceWith([
      pokemonData,
    ]);
    expect(pokemon).toEqual(pokemonData);
  }));

  it('return empy observable on error when get miss the pokemon name', fakeAsync(() => {
    let complete = false;
    const pokemonName = 'kabuto';
    fakeLocalDatabase.getPokemonsByNames = jasmine
      .createSpy()
      .and.rejectWith(new Error('Pokemon not found'));
    pokemonService.getPokemon(pokemonName).subscribe({
      next: () => {
        fail('Cannot emit result');
      },
      error: () => {
        fail('Cannot emit error');
      },
      complete: () => {
        complete = true;
      },
    });
    tick(1000);
    controller.expectOne(`pokemon/${pokemonName}`).flush('', {
      status: 404,
      statusText: 'Not found',
    });
    tick(1000);

    expect(complete).toBe(true);
  }));

  it('return list of pokemons locally', fakeAsync(() => {
    let resultApi: ApiResultModel<PokemonModel> | undefined;
    pokemonsSavedLocal = [pokemonData];
    pokemonService.getListPokemon().subscribe({
      next: (data) => {
        resultApi = data;
      },
      error: () => {
        fail('Can not throw excpetion');
      },
    });
    controller
      .expectOne(`pokemon?limit=${QUERY_LIMIT}&offset=${offset}`)
      .flush(<ApiResultModel<PokemonModel>>{
        count: 1,
        results: [pokemonData],
      });

    tick(4000);

    if (!resultApi) throw new Error('Result api cannot be null');

    expect(fakeLocalDatabase.getPokemonsByNames).toHaveBeenCalledWith([
      pokemonData.name,
    ]);
    expect(resultApi.results).toEqual(pokemonsSavedLocal);
  }));

  it('return list of pokemons api when locally fails', fakeAsync(() => {
    let resultApi: ApiResultModel<PokemonModel> | undefined;

    fakeLocalDatabase.getPokemonsByNames = jasmine
      .createSpy()
      .and.rejectWith(new Error('Pokemon not found'));

    pokemonService.getListPokemon(page).subscribe({
      next: (data) => {
        resultApi = data;
      },
      error: () => {
        fail('Can not throw excpetion');
      },
    });
    controller
      .expectOne(`pokemon?limit=${QUERY_LIMIT}&offset=${offset}`)
      .flush(<ApiResultModel<PokemonModel>>{
        count: 1,
        results: [pokemonData],
      });

    tick(4000);
    controller.expectOne(`pokemon/${pokemonData.name}`).flush(pokemonData);

    tick(4000);

    if (!resultApi) throw new Error('Result api cannot be null');

    expect(fakeLocalDatabase.addPokemonData).toHaveBeenCalledWith([
      pokemonData,
    ]);
    expect(resultApi.results).toEqual(pokemonsSavedLocal);
  }));

  it('return history of search when search a pokemon name with a empty string', () => {
    let pokemonsName: string[] | undefined;
    pokemonService.searchPokemonName('').subscribe({
      next: (history) => {
        pokemonsName = history;
      },
    });
    if (!pokemonsName) throw new Error();

    expect(pokemonsName).toEqual(historySearch);
  });

  it('search a pokemon in database when name is not empty', fakeAsync(() => {
    let pokemonsName: string[] | undefined;
    pokemonService.searchPokemonName('abc').subscribe({
      next: (history) => {
        pokemonsName = history;
      },
    });
    tick(1000);

    if (!pokemonsName) throw new Error();

    expect(pokemonsName).toEqual(searchPokemonInDatabase.map((p) => p.name));
  }));
});
