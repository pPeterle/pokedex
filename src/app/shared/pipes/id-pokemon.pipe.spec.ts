import { IdPokemonPipe } from './id-pokemon.pipe';

describe('IdPokemonPipe', () => {
  let pipe: IdPokemonPipe;

  beforeEach(() => {
     pipe = new IdPokemonPipe();
  })

  it('transform id when less than 10', () => {
    const result = pipe.transform(5);
    const expected = '#005';
    expect(result).toBe(expected);
  });

  it('transform id when less than 100', () => {
    const result = pipe.transform(98);
    const expected = '#098';
    expect(result).toBe(expected);
  });

  it('transform id when less than 1000', () => {
    const result = pipe.transform(501);
    const expected = '#501';
    expect(result).toBe(expected);
  });

  it('transform id when less than 10000', () => {
    const result = pipe.transform(2435);
    const expected = '#2435';
    expect(result).toBe(expected);
  });

  it('transform id when greather than 10000', () => {
    const result = pipe.transform(52000);
    const expected = '#52000';
    expect(result).toBe(expected);
  });
});
