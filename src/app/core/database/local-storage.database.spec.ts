import { LocalStorageDatabase } from './local-storage.database';

describe('Pokemon Fight Service', () => {
  let pokemonFightService: LocalStorageDatabase;

  beforeEach(() => {
    pokemonFightService = new LocalStorageDatabase();
  });

  it('get itens from local storage', () => {
    const savedItens = ['a', 'b'];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(savedItens));
    const result = pokemonFightService.getHistorySearch();

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(result).toEqual(savedItens);
  });

  it('get empty array on json equals to null', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const result = pokemonFightService.getHistorySearch();

    expect(result.length).toBe(0);
  });

  it('not save itens in local storage', () => {
    const savedItens = ['a', 'b'];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(savedItens));
    spyOn(localStorage, 'setItem');

    pokemonFightService.saveHistorySearch('a');

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('max lenght array saved must be 5', () => {
    const savedItens = ['a', 'b', 'c', 'd', 'e'];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(savedItens));
    spyOn(localStorage, 'setItem');

    pokemonFightService.saveHistorySearch('f');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'historySearchPokemonKey',
      JSON.stringify(['f', 'a', 'b', 'c', 'd'])
    );
  });
});
