import { first, take } from 'rxjs';
import { PokemonBatle, PokemonFightService } from '.';
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

  it('change batle status', () => {
    pokemonFightService.setFightState(true);
    expect(pokemonFightService.atualBatleStatus).toBe(true);

    pokemonFightService.setFightState(false);
    expect(pokemonFightService.atualBatleStatus).toBe(false);
  });

  it('call exitFight when batle status false', () => {
    spyOn(pokemonFightService, 'exitFight');

    pokemonFightService.setFightState(false);

    expect(pokemonFightService.exitFight).toHaveBeenCalled();
  });

  it('clear list and change batle status to false when exit fight', () => {
    let pokemonsFight: PokemonModel[] | undefined;
    pokemonFightService.setFightState(false);

    pokemonFightService.pokemonFightList.pipe(first()).subscribe((pokemons) => {
      pokemonsFight = pokemons;
    });

    expect(pokemonFightService.atualBatleStatus).toBe(false);
    expect(pokemonsFight).toHaveSize(0);
  });

  it('not add pokemon if batle status is false', () => {
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
    let resultBatle: PokemonBatle[] | undefined;

    pokemonFightService.setFightState(true);
    pokemonFightService.resultFight.pipe(first()).subscribe((pokemons) => {
      resultBatle = pokemons;
    });
    pokemonFightService.addPokemonToFight(pokemon1);
    pokemonFightService.addPokemonToFight(pokemon2);

    expect(resultBatle).toHaveSize(2);
  });
});
