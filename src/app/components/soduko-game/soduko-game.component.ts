import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';
import { conditionTable } from '../../../assets/data/conditions';
import Pokedex from 'pokedex-promise-v2';
@Component({
  selector: 'app-soduko-game',
  templateUrl: 'soduko-game.component.html',
  styleUrl: '../../../styles/soduko-game.component.scss'
})

export class SodukoGameComponent implements OnInit{

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  @Output() loaded = new EventEmitter<string>();
  
  pokeDex = new Pokedex();
  retrievedPokemon: any;
  selectedDiv: any;

  pokemonNamesList: string[] = [];
  filteredPokemonNamesList: string[] = [];
  selectedPokemonName: string | null = null;

  conditionsList: string[] = [];
  conditionAvailable: string[] = conditionTable;

  // Creation of the list of the condition combinations ====================================================================

  conditionsCombinations = {
    B1: [],
    B2: [],
    B3: [],
    C1: [],
    C2: [],
    C3: [],
    D1: [],
    D2: [],
    D3: []
  }

  // Creation of the list of pokemon selected by user ======================================================================
    
  selectedPokemonsList = {
    B1: '',
    B2: '',
    B3: '',
    C1: '',
    C2: '',
    C3: '',
    D1: '',
    D2: '',
    D3: ''
  }

  selectedDivID: string | undefined;
  
  ngOnInit() {

    const conditions = document.querySelectorAll('.condition');
    const answers = document.querySelectorAll('.answer');

    let checkIncr: number = 0;

    conditions.forEach(() => {

      if (checkIncr >= 3) { // On gère les cas ou les conditions s'excluent les unes les autres

        var regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea', 'Hisui'];

        if (regions.some(e => this.conditionsList.includes(e))) { // Si on a une region dans la ligne du haut alors on retire les regions de la pool de conditions
          this.conditionAvailable = this.conditionAvailable.filter(e => !regions.includes(e));
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
      // console.log(this.pokemonNamesList)
    });

    // Creation of the list of the condition combinations ====================================================================

    let conditionsCols = this.conditionsList.slice(0, 3);
    let conditionsRows = this.conditionsList.slice(3, 6);

    let indexList = 0;

    let keys = Object.keys(this.conditionsCombinations);

    for (let indexRow = 0; indexRow < conditionsRows.length; indexRow++) {
      for (let indexCol = 0; indexCol < conditionsCols.length; indexCol++) {

        let combinedCondition = [conditionsCols[indexCol], conditionsRows[indexRow]];
        // console.log(combinedCondition);

        if (indexList < keys.length) {
          let key = keys[indexList];

          this.conditionsCombinations[key] = combinedCondition;

          indexList++;
        }
      };
    };

    // console.log(this.conditionsCombinations);

    // Creation of the list of the condition combinations ====================================================================

    answers.forEach((answer) =>{
      const id = answer.id;
      if (this.conditionsCombinations.hasOwnProperty(id)) {
        
        answer.textContent = this.conditionsCombinations[id].join(' and ');
      };
    });
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
    let modalSelection = document.querySelector('.modal-select') as HTMLElement;

    modalSelection.classList.remove('invisible');

    this.selectedDiv = event.target as HTMLElement;
    this.selectedDivID = this.selectedDiv.id;
  };

  validatePokemon(){

    let modalSelection = document.querySelector('.modal-select') as HTMLElement;
    let selectedPokemon = document.querySelector('.selected-pokemon').textContent;
    selectedPokemon = selectedPokemon.replace('Selected Pokémon: ', '');

    this.pokedexSearch(selectedPokemon);
    
    this.selectedPokemonsList[this.selectedDivID] = {name: this.retrievedPokemon.name,
                                                     types: this.retrievedPokemon.types.map(slot => slot.type.name),
                                                     isMonotype: this.checkMonotype(this.retrievedPokemon.types.map(slot => slot.type.name)),
                                                     region: this.checkRegion(this.retrievedPokemon.generation.name, this.retrievedPokemon.name),
                                                     hasMega: this.checkMega(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                     hasGiga: this.checkGiga(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                     isLegendary: this.retrievedPokemon.is_legendary,
                                                     isMythical: this.retrievedPokemon.is_mythical
                                                     };
                                                     
    this.selectedDiv.getElementByID("image")
    // this.renderer.setProperty(this.selectedDiv, 'src', this.retrievedPokemon.sprites.other.home.front_default);

    // console.log(this.selectedPokemonsList);

    modalSelection.classList.add('invisible');
    this.cdr.detectChanges(); // Déclencher manuellement la détection des changements
  };

  pokedexSearch(pokemonInput){
    this.pokeDex.getPokemonByName(pokemonInput.toLowerCase())
      .then((response) => {

        this.pokeDex.getPokemonSpeciesByName(response.species.name.toLowerCase())
          .then((response2) => {
            const { name, ...response2WithoutName } = response2; // destructuration of the object the remove the new name (we want to keep the inital name)
            this.retrievedPokemon = { ...response, ...response2WithoutName };
            // console.log(this.retrievedPokemon);

            return this.retrievedPokemon;
          })
          .catch((error) => {
            console.log('There was an ERROR with pokemon species infos: ', error);
          });

      })
      .catch((error) => {
        console.log('There was an ERROR with pokemon infos: ', error);
      });
  };

  checkMonotype(typeArray: []){
    if(typeArray.length <= 1){
      return true;
    } else {
      return false;
    }
  }

  checkGiga(formArray: []){
    
    for (let index = 0; index < formArray.length; index++) {
      const element: string = formArray[index];
      // console.log(element);
      
      if (element.includes('-gmax')) {
        return true
      } else {
        return false
      };
    };

    return false
  };

  checkMega(formArray: []){

    for (let index = 0; index < formArray.length; index++) {
      const element: string = formArray[index];
      // console.log(element);
      
      if (element.includes('-mega')) {
        return true
      } else {
        return false
      };
    };

    return false
  };

  checkRegion(valueGen: string, valueName: string){
      
    if (valueName.includes('-hisui')) {

      return 'Hisui'

    } else if (valueName.includes('-alola')) {

      return 'Alola'

    } else if (valueName.includes('-paldea')) {

      return 'Paldea'

    } else {

      switch (valueGen) {
        case "generation-i":
          return 'Kanto'
        
        case "generation-ii":
          return 'Johto'
        
        case "generation-iii":
          return 'Hoenn'
        
        case "generation-iv":
          return 'Sinnoh'
        
        case "generation-v":
          return 'Unova'
        
        case "generation-vi":
          return 'Kalos'
        
        case "generation-vii":
          return 'Alola'

        case "generation-viii":
          return 'Galar'

        case "generation-ix":
          return 'Paldea'
      
        default:
          return ''
      }
    }
  };
};