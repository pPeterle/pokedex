import { Injectable } from "@angular/core";

const HISTORY_SEARCH_POKEMON_KEY = 'historySearchPokemonKey';

@Injectable()
export class LocalStorageDatabase {
  saveHistorySearch(pokemon: string) {
    const historyPokemons = this.getHistorySearch();
    if (!historyPokemons.includes(pokemon)) {
      historyPokemons.unshift(pokemon);
      if(historyPokemons.length > 5) {
        historyPokemons.pop();
      }
      localStorage.setItem(HISTORY_SEARCH_POKEMON_KEY, JSON.stringify(historyPokemons));
    }
  }

  getHistorySearch(): string[] {
    const json = localStorage.getItem(HISTORY_SEARCH_POKEMON_KEY);
    if (json) return JSON.parse(json);
    else return [];
  }
}
