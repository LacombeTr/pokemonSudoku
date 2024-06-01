import { TypesPokemonPipe } from './types-pokemon.pipe';

describe('TypesPokemonPipe', () => {
  it('create an instance', () => {
    const pipe = new TypesPokemonPipe();
    expect(pipe).toBeTruthy();
  });
});
