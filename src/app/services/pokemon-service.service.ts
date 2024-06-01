import { Injectable } from '@angular/core';
import PokeAPI from 'pokedex-promise-v2';

@Injectable({
  providedIn: 'root'
})
export class PokemonServiceService {

  constructor() { }

  pokeDex = new PokeAPI();
  pokemonNamesList: string[] = [];

  fetchPokemonList = async () => {
    try {
      const pokemonList = await this.pokeDex.getPokemonsList(); // Attendre que la promesse soit résolue
      this.pokemonNamesList = pokemonList.results.map(pokemon => pokemon.name);
    } catch (error) {
      console.error('Error fetching Pokémon list:', error); // Gérez les erreurs éventuelles
    };
  };
};
