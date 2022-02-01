import { first, take } from 'rxjs';
import { PokemonBattle, PokemonFightService } from '.';
import { PokemonModel } from '../models';

describe('Pokemon Fight Service', () => {
  let pokemonFightService: PokemonFightService;

  const pokemon1: PokemonModel = {
    height: 1,
    id: 1,
    name: 'a',
    sprites: {
      front_default: '',
    },
    stats: [
      {
        base_stat: 1,
        effort: 1,
        stat: {
          name: '',
          url: '',
        },
      },
      {
        base_stat: 2,
        effort: 1,
        stat: {
          name: 'b',
          url: '',
        },
      },
    ],
    types: [],
    weight: 1,
  };

  const pokemon2: PokemonModel = {
    height: 1,
    id: 2,
    name: 'b',
    sprites: {
      front_default: '',
    },
    stats: [
      {
        base_stat: 1,
        effort: 1,
        stat: {
          name: '',
          url: '',
        },
      },
    ],
    types: [],
    weight: 2,
  };

  beforeEach(() => {
    pokemonFightService = new PokemonFightService();
  });

  it('change battle status', () => {
    pokemonFightService.setFightState(true);
    expect(pokemonFightService.atualBattleStatus).toBe(true);

    pokemonFightService.setFightState(false);
    expect(pokemonFightService.atualBattleStatus).toBe(false);
  });

  it('call exitFight when battle status false', () => {
    spyOn(pokemonFightService, 'exitFight');

    pokemonFightService.setFightState(false);

    expect(pokemonFightService.exitFight).toHaveBeenCalled();
  });

  it('clear list and change battle status to false when exit fight', () => {
    let pokemonsFight: PokemonModel[] | undefined;
    pokemonFightService.setFightState(false);

    pokemonFightService.pokemonFightList.pipe(first()).subscribe((pokemons) => {
      pokemonsFight = pokemons;
    });

    expect(pokemonFightService.atualBattleStatus).toBe(false);
    expect(pokemonsFight).toHaveSize(0);
  });

  it('not add pokemon if battle status is false', () => {
    let pokemonsFight: PokemonModel[] | undefined;
    pokemonFightService.setFightState(false);
    pokemonFightService.addPokemonToFight(pokemon1);

    pokemonFightService.pokemonFightList.pipe(first()).subscribe((pokemons) => {
      pokemonsFight = pokemons;
    });

    expect(pokemonsFight).toHaveSize(0);
  });

  it('add pokemon if it not added', () => {
    let pokemonsFight: PokemonModel[] | undefined;
    pokemonFightService.setFightState(true);
    pokemonFightService.addPokemonToFight(pokemon1);

    pokemonFightService.pokemonFightList.pipe(first()).subscribe((pokemons) => {
      pokemonsFight = pokemons;
    });

    expect(pokemonsFight).toHaveSize(1);
  });

  it('remove pokemon if it already added', () => {
    let pokemonsFight: PokemonModel[] | undefined;
    pokemonFightService.setFightState(true);
    pokemonFightService.addPokemonToFight(pokemon1);

    pokemonFightService.pokemonFightList.pipe(take(2)).subscribe((pokemons) => {
      pokemonsFight = pokemons;
    });
    pokemonFightService.addPokemonToFight(pokemon1);

    expect(pokemonsFight).toHaveSize(0);
  });

  it('start fight with 2 pokemons', () => {
    let resultBattle: PokemonBattle[] | undefined;

    pokemonFightService.setFightState(true);
    pokemonFightService.resultFight.pipe(first()).subscribe((pokemons) => {
      resultBattle = pokemons;
    });
    pokemonFightService.addPokemonToFight(pokemon1);
    pokemonFightService.addPokemonToFight(pokemon2);

    expect(resultBattle).toHaveSize(2);
  });
});
