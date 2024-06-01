import { Component, OnInit, Renderer2} from '@angular/core';
import { conditionTable } from '../../../assets/data/conditions';
import PokeAPI from 'pokedex-promise-v2';

@Component({
  selector: 'app-soduko-game',
  templateUrl: 'soduko-game.component.html',
  styleUrl: '../../../styles/soduko-game.component.scss'
})

export class SodukoGameComponent implements OnInit{

  pokeDex = new PokeAPI();
  pokemonNamesList: string[] = [];
  filteredPokemonNamesList: string[] = [];
  selectedPokemonName: string | null = null;

  conditionsList: string[] = [];
  conditionAvailable: string[] = conditionTable;
  
  ngOnInit() {

    const conditions = document.querySelectorAll('.condition');
    const answers = document.querySelectorAll('.answer');

    let checkIncr: number = 0;

    conditions.forEach(() => {

      if (checkIncr >= 3) { // On gère les cas ou les conditions s'excluent les unes les autres

        var regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea', 'Hisui'];
        var stages = ['1st Stage', '2nd Stage', '3rd Stage'];
        var gimmicks = ['Mega', 'Gigantamax'];

        if (regions.some(e => this.conditionsList.includes(e))) { // Si on a une region dans la ligne du haut alors on retire les regions de la pool de conditions
          this.conditionAvailable = this.conditionAvailable.filter(e => !regions.includes(e));
        };

        if (stages.some(e => this.conditionsList.includes(e))) { // Si on a la condition d'un pokemon qui a ou est une evolution(stage 1,2 et 3) alors on retire la condition "Single stage" du pool
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Single stage');
        };

        if (this.conditionsList.includes('Single stage')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => !stages.includes(e));
        };

        if (this.conditionsList.includes('1st stage')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Mega');
        };

        if (this.conditionsList.includes('Gigantamax')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Paldea');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Hisui');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== '1st Stage');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== '2nd Stage');
        };

        if (['Paldea','Hisui','1st Stage','2nd Stage'].some(e => this.conditionsList.includes(e))) { // Si on a la condition d'un pokemon qui a ou est une evolution(stage 1,2 et 3) alors on retire la condition "Single stage" du pool
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Gigantamax');
        };

        if (this.conditionsList.includes('Mega')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut ni etre de Galar, ni etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Galar');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Paldea');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Hisui');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== '1st Stage');
        };

        if (['Galar','Paldea','Hisui'].some(e => this.conditionsList.includes(e))) { // Si on a la condition d'un pokemon qui a ou est une evolution(stage 1,2 et 3) alors on retire la condition "Single stage" du pool
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Mega');
        };

        if (this.conditionsList.includes('Hisui')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Mega');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Gigantamax');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Mythical');
        };

        // Illegal type combination 

        if (this.conditionsList.includes('Normal')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Ice');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Rock');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Bug');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Steel');
        };

        if (this.conditionsList.includes('Rock')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Ghost');
        };

        if (this.conditionsList.includes('Bug')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Dragon');
        };

        if (this.conditionsList.includes('Ice')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Poison');
        };

        if (this.conditionsList.includes('Fairy')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Fire');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Ground');
        };

        if (this.conditionsList.includes('Fire')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Fairy');
        };

        if (this.conditionsList.includes('Ground')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Fairy');
        };

        if (this.conditionsList.includes('Steel')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Normal');
        };

        if (this.conditionsList.includes('Poison')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Ice');
        };
        
        if (this.conditionsList.includes('Ghost')) { // Si on a la condition d'un pokemon qui est une mega-evolution il ne peut pas etre de Paldea
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'Rock');
        };
      };

      // Conditions handling: ########################################################

      // The conditions given to divs are stored in the conditionsList table as:

      // conditionsList = {A1, A2, A3, B0, C0, D0}

      // The grid being:
      // # A1 A2 A3
      // B0 #  #  #
      // C0 #  #  #
      // D0 #  #  #

      var choosenCondition: string = this.conditionAvailable[Math.floor(Math.random() * this.conditionAvailable.length)];

      this.conditionsList.push(choosenCondition);

      this.conditionAvailable = this.conditionAvailable.filter(e => e !== choosenCondition);

      checkIncr ++;
    });

    const fetchPokemonList = async () => {
      try {
        const pokemonList = await this.pokeDex.getPokemonsList(); // Attendre que la promesse soit résolue
        this.pokemonNamesList = pokemonList.results.map(pokemon => pokemon.name);
        this.filteredPokemonNamesList = [...this.pokemonNamesList];
      } catch (error) {
        console.error('Error fetching Pokémon list:', error); // Gérez les erreurs éventuelles
      }
    };
  
    fetchPokemonList().then(() => {
      console.log(this.pokemonNamesList)
    });
    

    answers.forEach((element) =>{
      // Get div ID and separate row and column coordinate
      var idElement = element.getAttribute('id')

      var colCoord: string = idElement.charAt(1);
      var rowCoord: string = idElement.charAt(0);

      // Get the condition corresponding to the column

      switch (colCoord) {
        case '1':
          var colCond: string = this.conditionsList[0];
          break;
        case '2':
          var colCond: string = this.conditionsList[1];
          break;
        case '3':
          var colCond: string = this.conditionsList[2];
          break;
        default:
          throw new Error('Error while assigning condition (column step)');
          break;
      }
      
      // aller chercher la condition correspondant a la ligne

      switch (rowCoord) {
        case 'B':
          var rowCond: string = this.conditionsList[3];
          break;
        case 'C':
          var rowCond: string = this.conditionsList[4];
          break;
        case 'D':
          var rowCond: string = this.conditionsList[5];
          break;
        default:
          throw new Error('Error while assigning condition (row step)');
      }

      // Display in div (temporary)

        element.innerHTML = colCond + ' / ' + rowCond;

      // 
  
    })
  };

  onSearchInputChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPokemonNamesList = this.pokemonNamesList.filter(name =>
      name.toLowerCase().includes(searchTerm)
    );
  }

  selectPokemonName(name: string) {
    this.selectedPokemonName = name;
    this.filteredPokemonNamesList = [];
    return this.selectedPokemonName;
  }

  isPokemonType(condition: string): boolean {
    return ['Normal', 'Fighting', 'Flying', 'Ghost', 'Bug', 'Steel', 'Poison', 'Fire', 'Water', 'Grass', 'Ground', 'Rock', 'Electric', 'Ice', 'Dragon', 'Dark', 'Fairy'].includes(condition);
  };

  isRegion(condition: string): boolean {
    return ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea', 'Hisui'].includes(condition);
  };

  isNeitherPokemonTypeOrRegion(condition: string): boolean {
    return !['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea', 'Hisui','Normal', 'Fighting', 'Flying', 'Ghost', 'Bug', 'Steel', 'Poison',
    'Fire', 'Water', 'Grass', 'Ground', 'Rock', 'Electric', 'Ice',
    'Dragon', 'Dark', 'Fairy'].includes(condition);
  };

  selectPokemon(event: MouseEvent){
    let selectedDiv = event.target as HTMLElement;

    let validateButton = document.querySelector('.validate-button') as HTMLElement
    let modalSelection = document.querySelector('.modal-select') as HTMLElement;

    modalSelection.classList.remove('invisible');

    validateButton.addEventListener('click', () => {
      let selectedPokemon = document.querySelector('.selected-pokemon').textContent;
      selectedPokemon = selectedPokemon.replace('Selected Pokémon: ', '');

      let pokemonInfos = this.fetchPokemonInfos(selectedPokemon);

      selectedDiv.innerHTML = `<img src="${pokemonInfos.then.prototype.other.home.front_default}" alt="">`;

      modalSelection.classList.add('invisible');
    });
  };

  fetchPokemonInfos = async (pokemonName: string) => {
    try {
      let pokemonInfos = await this.pokeDex.getPokemonSpeciesByName(pokemonName); // Attendre que la promesse soit résolue
      let pokemonInfos2 = await this.pokeDex.getPokemonByName(pokemonName); // Attendre que la promesse soit résolue
      
    } catch (error) {
      throw console.error('Error fetching Pokémon list:', error); // Gérez les erreurs éventuelles
    }
  };
};