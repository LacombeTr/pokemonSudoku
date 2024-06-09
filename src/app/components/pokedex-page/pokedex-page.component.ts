import { Component, OnDestroy, OnInit, Output, EventEmitter, Renderer2, ChangeDetectorRef} from '@angular/core';
import Pokedex from 'pokedex-promise-v2';

import { FormBuilder, FormGroup } from '@angular/forms';
import PokeAPI from 'pokedex-promise-v2';

@Component({
  selector: 'app-pokedex-page',
  templateUrl: './pokedex-page.component.html',
  styleUrl: '../../../styles/pokedex-page.component.scss'
})
export class PokedexPageComponent implements OnInit, OnDestroy{

  @Output() loaded = new EventEmitter<string>();

  searchForm: FormGroup;

  pokeDex = new Pokedex();

  retrievedPokemon: any;

  constructor(private renderer: Renderer2, private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    
    this.loaded.emit('pokedex');

    const statDisplayer = this.renderer.selectRootElement(".stats-displayer");

    statDisplayer.innerHTML = `<div class="stats-hexagon">
                                  <div class="stat-pv">
                                      <p class="stat">PV</p>
                                      <p id="PV">0</p>
                                  </div>

                                  <div class="stat-atk">
                                      <p class="stat">Attaque</p>
                                      <p id="atk">0</p>
                                  </div>

                                  <div class="stat-def">
                                      <p class="stat">Défense</p>
                                      <p id="def">0</p>
                                  </div>

                                  <div class="stat-atkspe">
                                      <p class="stat">Atk. Sp.</p>
                                      <p id="atkspe">0</p>
                                  </div>

                                  <div class="stat-defspe">
                                      <p class="stat">Def. Sp.</p>
                                      <p id="defspe">0</p>
                                  </div>

                                  <div class="stat-vit">
                                      <p class="stat">Vit.</p>
                                      <p id="vit">0</p>
                                  </div>

                                  <svg width="156" height="168" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 112">
                                      <polygon points="50 0, 100 26.9, 100 80.8, 50 107.7, 0 80.8, 0 26.9" style="fill:hsla(0, 0%, 0%, 0.2)"/>
                                      <line x1="50" y1="0" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="26.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="80.8" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="50" y1="107.7" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="26.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="80.8" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <polygon points="50 0, 100 26.9, 100 80.8, 50 107.7, 0 80.8, 0 26.9" style="fill:transparent;stroke:white;stroke-width:1"/>
                                  </svg>
                               </div>`;

    this.searchForm= this.fb.group({
      searchField: ''
    });
  }

  ngOnDestroy(){
      
    this.loaded.emit('');

  }


  pokedexSearch() {
  
    this.pokeDex.getPokemonByName(this.searchForm.get('searchField')?.value.toLowerCase())
      .then((response) => {
        this.retrievedPokemon = response;

        this.pokeDex.getPokemonSpeciesByName(this.searchForm.get('searchField')?.value.toLowerCase())
          .then((response2) => {
            this.retrievedPokemon = { ...this.retrievedPokemon, ...response2 };
          })
          .catch((error) => {
            console.log('There was an ERROR with pokemon species infos: ', error);
          });

      })
      .catch((error) => {
        console.log('There was an ERROR with pokemon infos: ', error);
      });

      console.log(this.retrievedPokemon)

    this.statDisplayerDrawer(this.retrievedPokemon.stats[0].base_stat, this.retrievedPokemon.stats[1].base_stat, this.retrievedPokemon.stats[2].base_stat, this.retrievedPokemon.stats[3].base_stat, this.retrievedPokemon.stats[4].base_stat, this.retrievedPokemon.stats[5].base_stat);

    const pokemonInfoNames = document.querySelector(".pokemonInfoName") as HTMLElement;
    // console.log(this.retrievedPokemon.name);
    pokemonInfoNames.innerText = this.retrievedPokemon.name.charAt(0).toUpperCase()
    + this.retrievedPokemon.name.slice(1);

    // Gestion de l'affichage des types (l'utilisation des pipe n'est pas possible ici)

    const pokemonInfoTypes = document.querySelector(".pokemonInfoTypes") as HTMLElement;
    pokemonInfoTypes.innerHTML = ``;
    
    for (let typeIndex = 0; typeIndex < this.retrievedPokemon.types.length; typeIndex++) {
      pokemonInfoTypes.innerHTML = pokemonInfoTypes.innerHTML + ' ' + this.typesPokemonChip(this.retrievedPokemon.types[typeIndex].type.name);
    }
    
    const pokemonInfoSprite = this.renderer.selectRootElement(".pokemonInfoSprite");
    this.renderer.setProperty(pokemonInfoSprite, 'innerHTML', `<img class="pokemonInfoSpriteImg" src="${this.retrievedPokemon.sprites.other.home.front_default}" alt="">`);
    
    const pokemonInfoQuali = document.querySelector(".pokemonInfoQuali") as HTMLElement;
    pokemonInfoQuali.innerText = this.findGenusByLanguage(this.retrievedPokemon, 'en');

    const pokemonInfoDim = document.querySelector(".pokemonInfoDim") as HTMLElement;
    pokemonInfoDim.innerHTML = `Height: ${(this.retrievedPokemon.height / 10).toFixed(1)} m </br> Weight: ${(this.retrievedPokemon.weight / 10).toFixed(1)} kg`;

    const pokemonInfoDesc = document.querySelector(".pokemonDesc") as HTMLElement;
    pokemonInfoDesc.innerText = this.findDescByLanguage(this.retrievedPokemon, 'en');
    
    this.cdr.detectChanges(); // Déclencher manuellement la détection des changements
}

  statDisplayerDrawer(pv, atk, def, atkspe, defspe, vit){
    const statDisplayer = this.renderer.selectRootElement(".stats-displayer");
    statDisplayer.innerHTML = `<div class="stats-hexagon">
                                  <div class="stat-pv">
                                      <p class="stat">PV</p>
                                      <p id="PV">${pv}</p>
                                  </div>

                                  <div class="stat-atk">
                                      <p class="stat">Attaque</p>
                                      <p id="atk">${atk}</p>
                                  </div>

                                  <div class="stat-def">
                                      <p class="stat">Défense</p>
                                      <p id="def">${def}</p>
                                  </div>

                                  <div class="stat-atkspe">
                                      <p class="stat">Atk. Sp.</p>
                                      <p id="atkspe">${atkspe}</p>
                                  </div>

                                  <div class="stat-defspe">
                                      <p class="stat">Def. Sp.</p>
                                      <p id="defspe">${defspe}</p>
                                  </div>

                                  <div class="stat-vit">
                                      <p class="stat">Vit.</p>
                                      <p id="vit">${vit}</p>
                                  </div>

                                  <svg width="156" height="168" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 112">
                                      <polygon points="50 0, 100 26.9, 100 80.8, 50 107.7, 0 80.8, 0 26.9" style="fill:hsla(0, 0%, 0%, 0.2)"/>
                                      <polygon points="50 ${53.9 - (pv / 255) * 53.9}, ${50 + ((atk / 255) * 53.9)} ${(53.9 - (atk / 255) * 28.9)}, ${50 + ((def / 255) * 53.9)} ${(53.9 + (def / 255) * 28.9)}, 50 ${53.9 + (vit / 255) * 53.9}, ${50 - ((defspe / 255) * 53.9)} ${(53.9 + (defspe / 255) * 28.9)}, ${50 - ((atkspe / 255) * 53.9)} ${(53.9 - (atkspe / 255) * 28.9)}" style="fill:#9DD1FA"/>
                                      <line x1="50" y1="0" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="26.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="80.8" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="50" y1="107.7" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="26.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="80.8" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <polygon points="50 0, 100 26.9, 100 80.8, 50 107.7, 0 80.8, 0 26.9" style="fill:transparent;stroke:white;stroke-width:1"/>
                                  </svg>
                               </div>`
  }


  // fonction permettant de trouver la description dans la bonne langue
  findDescByLanguage(data: {flavor_text_entries: {flavor_text: string, language: {name: string, url: string}, version: {name: string, url: string}}[]}, languageName: string): string | undefined {
    const descEntry = data.flavor_text_entries.find(entry => entry.language.name === languageName);
    return descEntry?.flavor_text;
  };

  // fonction permettant de trouver le genus dans la bonne langue
  findGenusByLanguage(data: {genera: {genus: string, language: {name: string, url: string}}[]}, languageName: string): string | undefined {
    const genusEntry = data.genera.find(entry => entry.language.name === languageName);
    return genusEntry?.genus;
  };

  typesPokemonChip(value){
    var typeName: string = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    return `<div class="type-chip">
            <div class="type-chip-color ${typeName}TypeColor";">
              <img class="type-chip-icon" src="../../../assets/imgs/typeIcons/40px-${typeName}_icon.png">
            </div>
            <p class="type-chip-name">${typeName}</p>
          </div>`;
  }
}