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

// Initiation of several variable ========================================================================================

  // This allow to know which component is loaded

  @Output() loaded = new EventEmitter<string>();

  // Create a new instance of Pokedex object for "Pokedex-Promise" fetches and the object in which the retrieved
    // informations will be stored "retrievedPokemon"
  
  pokeDex = new Pokedex();
  retrievedPokemon: any = [];

  // Variables used to store the div that the user click on and it's ID

  selectedDiv: any;
  selectedDivID: string | undefined;
  
  // Variables used to store the list of all pokemons, 

  pokemonNamesList: string[] = []; // list of all pokemons names, filled on init
  filteredPokemonNamesList: string[] = []; // list of filtered pokemons names, updated by the "onSearchInputChange()" function
  selectedPokemonName: string | null = null; // Name of the selected pokemon
  selectedPokemonNameList= { // list of the selected pokemons
    B1: {},
    B2: {},
    B3: {},
    C1: {},
    C2: {},
    C3: {},
    D1: {},
    D2: {},
    D3: {}
  }

  // Variable used to store the list of conditions of the grid and the pool of availble conditions

  conditionsList: string[] = []; // the list is initally empty and filled on init
  conditionAvailable: string[] = conditionTable; // the pool is initally equal to all of the conditions (stored in "conditonTable")

  // Creation of the list of the condition combinations 

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

  // Creation of the list of pokemon selected by user 

                                                      // name: this.retrievedPokemon.name,
                                                      // types: this.retrievedPokemon.types.map(slot => slot.type.name),
                                                      // isMonotype: this.checkMonotype(this.retrievedPokemon.types.map(slot => slot.type.name)),
                                                      // region: this.checkRegion(this.retrievedPokemon.generation.name, this.retrievedPokemon.name),
                                                      // hasMega: this.checkMega(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                      // hasGiga: this.checkGiga(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                      // isLegendary: this.retrievedPokemon.is_legendary,
                                                      // isMythical: this.retrievedPokemon.is_mythical
                                                      
    
  selectedPokemonsList = {
    B1: {},
    B2: {},
    B3: {},
    C1: {},
    C2: {},
    C3: {},
    D1: {},
    D2: {},
    D3: {}
  };

// At the initialisation of the component ======================================================================================================

  ngOnInit() {

    // On initiation of the component let's grab the list of all pokemon "pokemonNamesList" and add it the
      // "filteredPokemonNamesList" so when the user choose a pokemon as an answer they can type the start
      // of the name of the wanted pokemon and select in a list of pokemon matching the input, the
      // user can also write nothing, in such case the list will correspond to all of the existing pokemon

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

    // At the initation of the component, we assign the conditions of each column and row.

    // The conditions given to divs are stored in the conditionsList table as:

    // conditionsList = {A1, A2, A3, B0, C0, D0}

    // The grid being:
    //     # A1 A2 A3
    //     B0 #  #  #
    //     C0 #  #  #
    //     D0 #  #  #

    // Let's grab the cells tagged as "conditions" (the first of each column and row) which will contain the conditions
    // Let's also grab the cells tagged as "answer" which will be the ones that the player will fill with the choosen pokemon,
      // trying to match the conditions.

    const conditions = document.querySelectorAll('.condition');

    // This increment is used to know when we attributed the conditions to all of column, once done we can handle all the
      // exceptions (conditions which conflict each others)

    let checkIncr: number = 0;

    // Let's attribute to each "condition" cell a condition through this forEach()
    // "conditions" represent the available condition pool

    conditions.forEach(() => { // ========================================================================================================================================

      // If each already 3 conditions cells are already ready then go through this loop
        // This loop handle the exception running through all of the possibilities and excluding from the condition pool
        // the conflicting conditions

      if (checkIncr >= 3) { //========================================================================================================================================

        var regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'];

        // Region conflict: a pokemon cannot be from two different region, therefore if a region is present in the column row
          // then all other region are removed from the condition pool

        if (regions.some(e => this.conditionsList.includes(e))) {
          this.conditionAvailable = this.conditionAvailable.filter(e => !regions.includes(e));
        };

        // Gimmick conflict:
          // 1 - A pokemon which can Mega-evolve cannot come Alola, Galar, Paldea or Hisui. Also no 1st stage pokemon can Mega-evolve
          // 2 - A pokemon which can Gigantamax cannot come Paldea or Hisui
          // the reverse is also checked

        if (this.conditionsList.includes('mega')) { 
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'alola');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'galar');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'paldea');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'hisui');
        };

        if (this.conditionsList.includes('gmax')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'paldea');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'hisui');
        };

        if (['paldea','hisui'].some(e => this.conditionsList.includes(e))) { 
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'gmax');
        };

        if (['alola','galar','paldea','hisui'].some(e => this.conditionsList.includes(e))) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'mega');
        };

        // Regional conflict: in Hisui, no mythical pokemon exist

        if (this.conditionsList.includes('hisui')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'mythical');
        };

        if (this.conditionsList.includes('mythical')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'hisui');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ice');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ground');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'dragon');
        };

        if (this.conditionsList.includes('legendary')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'bug');
        };

        // Illegal type combination conflict: pokemon contain 18 different types however not every combination exist, this is
          // handled here

        if (this.conditionsList.includes('normal')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ice');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'rock');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'bug');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'steel');
        };

        if (this.conditionsList.includes('rock')) { 
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ghost');
        };

        if (this.conditionsList.includes('bug')) { 
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'dragon');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'legendary');
        };

        if (this.conditionsList.includes('ice')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'normal');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'poison');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'mythical');
        };

        if (this.conditionsList.includes('fairy')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'fire');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ground');
        };

        if (this.conditionsList.includes('fire')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'fairy');
        };

        if (this.conditionsList.includes('ground')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'fairy');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'mythical');
        };

        if (this.conditionsList.includes('steel')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'normal');
        };

        if (this.conditionsList.includes('poison')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'ice');
        };
        
        if (this.conditionsList.includes('ghost')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'rock');
        };

        if (this.conditionsList.includes('dragon')) {
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'bug');
          this.conditionAvailable = this.conditionAvailable.filter(e => e !== 'mythical');
        };
      };

      // Conditions attribution ========================================================================================================================================

      // A condition is choosen randomly from the conditon pool, added to "conditionsList" (which represent the list of
        // the selected conditions) and removed from the condition pool (to avoid duplicates)

      var choosenCondition: string = this.conditionAvailable[Math.floor(Math.random() * this.conditionAvailable.length)];

      this.conditionsList.push(choosenCondition);

      this.conditionAvailable = this.conditionAvailable.filter(e => e !== choosenCondition);

      // The "checkIncr" variable is incremented to count at which condition are we.

      checkIncr ++;
    });

    // Creation of the list of the condition combinations ====================================================================

    // Here we combine the conditions of each column with each row, similarly to cartesian product, to get the combination
      // of every conditions (9 in total)

    // ################################# TO DO #################################

    // Change this system correspond to and object as for "conditionsCombinations"
      // before which would make easier condition combination

    // #########################################################################

    // We gather the slice the formed-before "conditionsList", the three first values are the conditions associated with the three
      // columns while the last three values are the conditions associated with the three rows

    let conditionsCols = this.conditionsList.slice(0, 3);
    let conditionsRows = this.conditionsList.slice(3, 6);

    // This index is here to map the object containing the conditions combinations ("conditionsCombinations")

    let indexList = 0;

    // "keys" correspond to the list of keys of the "conditionsCombinations" object

    let keys = Object.keys(this.conditionsCombinations);

    // Here we iterate similarly to cartesian product, for each row we iterate though each column, combining the conditions
      // of the current row and column ("combinedCondition"), adding the combination at the corresponding key 
      // and incrementing the indexList

    // We define for the condition the possible types

    type Condition = 
    | { types: string | string[] }
    | { isMonotype: boolean }
    | { region: string }
    | { hasMega: boolean }
    | { hasGiga: boolean }
    | { isLegendary: boolean }
    | { isMythical: boolean };

    // Let's attribute this type to both row and column condition
    
    let conditionRow: Condition;
    let conditionCol: Condition;
    let combinedCondition: Condition;

    // This function allow to check is conditons Col and conditionRow are types or not

    function isTypesCondition(condition: Condition): condition is { types: string | string[] } {
      return 'types' in condition;
    }

    for (let indexRow = 0; indexRow < conditionsRows.length; indexRow++) {

      switch (conditionsRows[indexRow]) {
        case 'normal':
        case 'fighting':
        case 'flying':
        case 'ghost':
        case 'bug': 
        case 'steel': 
        case 'poison': 
        case 'fire': 
        case 'water': 
        case 'grass': 
        case 'ground': 
        case 'rock': 
        case 'electric': 
        case 'ice': 
        case 'dragon': 
        case 'dark': 
        case 'fairy':
          
          conditionRow = {types: conditionsRows[indexRow]} ;
          break;

        case 'monotype':

          conditionRow = {isMonotype: true} ;
          break;
        
        case 'kanto':
        case  'johto':
        case  'hoenn':
        case  'sinnoh':
        case  'unova':
        case  'kalos':
        case  'alola':
        case  'galar':
        case  'paldea':
        case  'hisui':

          conditionRow = {region: conditionsRows[indexRow]} ;
          break;

        case 'mega':

          conditionRow = {hasMega: true} ;
          break;

        case 'gmax':

          conditionRow = {hasGiga: true} ;
          break;

        case 'legendary':

          conditionRow = {isLegendary: true} ;
          break;

        case 'mythical':

          conditionRow = {isMythical: true} ;
          break;

        default:
          throw console.error("Error during row conditions attribution at row" + indexRow + ": no correspondance in conditions");          
      }

      for (let indexCol = 0; indexCol < conditionsCols.length; indexCol++) {

        switch (conditionsCols[indexCol]) {
          case 'normal':
          case 'fighting':
          case 'flying':
          case 'ghost':
          case 'bug': 
          case 'steel': 
          case 'poison': 
          case 'fire': 
          case 'water': 
          case 'grass': 
          case 'ground': 
          case 'rock': 
          case 'electric': 
          case 'ice': 
          case 'dragon': 
          case 'dark': 
          case 'fairy':
            
            conditionCol = {types: conditionsCols[indexCol]} ;
            break;

          case 'monotype':

            conditionCol = {isMonotype: true} ;
            break;
          
          case 'kanto':
          case  'johto':
          case  'hoenn':
          case  'sinnoh':
          case  'unova':
          case  'kalos':
          case  'alola':
          case  'galar':
          case  'paldea':
          case  'hisui':
  
            conditionCol = {region: conditionsCols[indexCol]} ;
            break;
  
          case 'mega':
  
            conditionCol = {hasMega: true} ;
            break;
  
          case 'gmax':
  
            conditionCol = {hasGiga: true} ;
            break;
  
          case 'legendary':
  
            conditionCol = {isLegendary: true} ;
            break;
  
          case 'mythical':
  
            conditionCol = {isMythical: true} ;
            break;
  
          default:
            throw console.error("Error during column conditions attribution at column" + indexCol + ": no correspondance in conditions");          
        }
        
        // SI LES DEUX CONDITIONS SONT DES TYPES ALORS

        if (isTypesCondition(conditionCol) && isTypesCondition(conditionRow)){
          combinedCondition = { types: ([] as string[]).concat(conditionCol.types, conditionRow.types)};
        } else {
          combinedCondition = {...conditionCol, ...conditionRow};
        }

        // console.log(combinedCondition);

        if (indexList < keys.length) {
          let key = keys[indexList];

          this.conditionsCombinations[key] = combinedCondition;

          indexList++;
        }
      };

      console.log(this.conditionsCombinations);
      
    };
  };

// ================================================================================================================================================================================
  

// Other functions ================================================================================================================================================================================

  // This function is responsible to update the list of Pokemon displayed when the user wanted to search one,
    // "filteredPokemonNamesList" is initally constituted by the name of all pokemon (on init - see above),
    // this function filter "filteredPokemonNamesList" keeping only the names matching the user input

  onSearchInputChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPokemonNamesList = this.pokemonNamesList.filter(name =>
      name.toLowerCase().includes(searchTerm)
    );
  };

  // This function select the name of a pokemon choosen by the user (here onClick on a button in the HTML) and
    // reset "filteredPokemonNamesList" before returning "selectedPokemonName"

  selectPokemonName(name: string) {
    this.selectedPokemonName = name;
    this.filteredPokemonNamesList = [];
    return this.selectedPokemonName;
  }

  // This function take the condition and check if it's a type, returning a boolean (if the condition match one of the types)
  
  isPokemonType(condition: string): boolean {
    return ['normal', 'fighting', 'flying', 'ghost', 'bug', 'steel', 'poison', 'fire', 'water', 'grass', 'ground', 'rock', 'electric', 'ice', 'dragon', 'dark', 'fairy'].includes(condition);
    };

  // This function take the condition and check if it's a region, returning a boolean (if the condition match one of the region)
  
  isRegion(condition: string): boolean {
    return ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'].includes(condition);
    };
    
  // This function take the condition and check if it's neither a type or a region,
    // returning a boolean (if the condition DOES NOT match one of the region or type)

  isNeitherPokemonTypeOrRegion(condition: string): boolean {
    return !['normal', 'fighting', 'flying', 'ghost', 'bug', 'steel', 'poison', 'fire', 'water', 'grass',
             'ground', 'rock', 'electric', 'ice', 'dragon', 'dark', 'fairy','kanto', 'johto', 'hoenn', 'sinnoh',
             'unova', 'kalos', 'alola', 'galar', 'paldea', 'hisui'].includes(condition);
  };

  // This function display the pokemon selection modal screen when one of the answer div is clicked,
    // it then save the div ID for latter use as in the "validatePokemon()" function

  selectPokemon(event: MouseEvent){
    let modalSelection = document.querySelector('.modal-select') as HTMLElement;

    modalSelection.classList.remove('invisible');

    this.selectedDiv = event.target as HTMLElement;
    this.selectedDivID = this.selectedDiv.id;

    // console.log(this.selectedDivID);
    // console.log(this.selectedDiv);
    
  };

  // This function hide the pokemon selection modal screen when the validate button is clicked (see HTML),
    // and attribute the selected pokemon characteristics to the "selectedPokemonList" (corresponding to the list
    // of pokemons selected by the user as answers)

  async validatePokemon(){
    
    let modalSelection = document.querySelector('.modal-select') as HTMLElement;
    let loadingScreen = document.querySelector('.selector-loader') as HTMLElement;
    let modalSelectionContent = document.querySelector('.selector-content') as HTMLElement;

    // Disable selection screen and dislay a loading animation

    modalSelectionContent.classList.add('invisible');
    loadingScreen.classList.remove('invisible');

    // Fecthing informations about the selected pokemon using the "pokedexSearch()" function, this contain
      // both pokemon and pokemon species information (see PokeAPI for more informations)
    
    await this.pokedexSearch(this.selectedPokemonName);

    // ################################ TODO ################################
    //
    // For now if the user enter a something which is not the name of a pokemon
    // the loading screen run undefinitely, to counter that, either catch the
    // error.
    //
    // ######################################################################

    // Reverse selection screen and loading animation at their inital state

    modalSelectionContent.classList.remove('invisible');
    loadingScreen.classList.add('invisible');

    // using the pokemon information fetched using the "pokedexSearch()" function we can create a custom
      // object for each pokemon selected by the user and put it in the "selectedPokemonlist" object that
      // will be used latter to check if the selected pokemon are correct (match the conditions)

    this.selectedPokemonsList[this.selectedDivID] = {name: this.retrievedPokemon.name,
                                                      types: this.retrievedPokemon.types.map(slot => slot.type.name),
                                                      isMonotype: this.checkMonotype(this.retrievedPokemon.types.map(slot => slot.type.name)),
                                                      region: this.checkRegion(this.retrievedPokemon.generation.name, this.retrievedPokemon.name),
                                                      hasMega: this.checkMega(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                      hasGiga: this.checkGiga(this.retrievedPokemon.varieties.map(slot => slot.pokemon.name)),
                                                      isLegendary: this.retrievedPokemon.is_legendary,
                                                      isMythical: this.retrievedPokemon.is_mythical
                                                      };

    console.log(this.selectedPokemonNameList);
    

    // We remove the name of the selected pokemon from the pokemon name 

    if (Object.values(this.selectedPokemonNameList).includes(this.retrievedPokemon.name)){
      return window.alert('This pokemon is already selected, please choose another Pokemon !')
    }

    this.selectedPokemonNameList[this.selectedDivID] = this.retrievedPokemon.name;
    
    // Some details about the object :
      // - name: string : correspond to the name of the pokemon, notice that for forms only the
      //                  species name is used (ex: necrozma-ultra => necrozma)
      // - types: array[string] : correspond to the type(s) of the pokemon
      // - isMonotype: boolean : using the "checkMonotype()" function indicate is the pokemon have one (true)
      //                         or two (false) type(s)
      // - region: string : correspond to the region the pokemon was first introduced using the
      //                    "checkRegion()" function
      // - hasMega: boolean : using the "checkMega()" function indicate is the pokemon have (true)
      //                      or does not have (false) a mega-evolution
      // - hasGiga: boolean : using the "checkGiga()" function indicate is the pokemon have (true)
      //                      or does not have (false) a Gmax form
      // - isLegendary: boolean : indicate if the pokemon is legendary (true) or not (false)
      // - isMythical: boolean : indicate if the pokemon is mythical (true) or not (false)

    // console.log(this.selectedPokemonsList);
    
    // Apply to the selected (clicked) answer the image of the selected pokemon
    
    // Utilisation de Renderer2 pour manipuler le DOM

    const img = this.renderer.createElement('img');
                                                      
    this.renderer.setProperty(this.selectedDiv, 'innerHTML', '');
    this.renderer.setAttribute(img, 'src', this.retrievedPokemon.sprites.other.home.front_default);
    this.renderer.setAttribute(img, 'alt', this.retrievedPokemon.name);
    this.renderer.setAttribute(img, 'id', this.selectedDivID);
    this.renderer.addClass(img, 'img-sprite');

    if (this.selectedDiv.tagName == 'IMG') {

      this.selectedDiv.src = this.retrievedPokemon.sprites.other.home.front_default;
      this.selectedDiv.alt = this.retrievedPokemon.name;

    } else {

      this.renderer.appendChild(this.selectedDiv, img);

    };
    
    // Hide the pokemon selection modal screen

    modalSelection.classList.add('invisible');

    this.retrievedPokemon = [];
    this.selectedPokemonName = '';

    this.cdr.detectChanges(); // check changes in the DOM trigger render update
  };

  // This function is used to fetch informations about the selected pokemon which name is given as an input

  async pokedexSearch(pokemonInput){

    try{
      // Using the "getPokemonByName()" method from the Pokemon-Promise library (which provide premade fetching methods
        // and cache for the PokeAPI) let's fetch informations about the selected pokemon (Since URL from/to "PokeAPI"
        // only accept lowercase the passed pokemon name)

      const response = await this.pokeDex.getPokemonByName(pokemonInput.toLowerCase());

      const response2 = await this.pokeDex.getPokemonSpeciesByName(response.species.name.toLowerCase());

      // Once this second fetch is resolved let's merge the two responses of the fetch to only have one object summarizing
        // all the information sof the pokemon.

      // WARNING: we want to keep only the name of the pokemon not of the species so the object is destructared to
        //        remove the name of the species (in response2)

      const { name, ...response2WithoutName } = response2;

      this.retrievedPokemon = { ...response, ...response2WithoutName };

      // Return the object containing the informations of the pokemon
      // console.log(this.retrievedPokemon);
      
      return this.retrievedPokemon;

    } catch (error) {

      console.error('There was an error with fetching Pokémon data:', error);
    };
  };

  // This function check how many type a pokemon have, it return true if the pokemon only have one type or
    // false if the pokemon have two types

  checkMonotype(types: string[]): boolean {
    return types.length === 1;
  }

  // This function check if the pokemon have a Gmax form, it return true if the pokemon have one type or
    // false if it does not

  checkGiga(formArray){

    let isGiga: boolean;

    for (let index = 0; index < formArray.length; index++) {
      const element: string = formArray[index];
      
      if (element.includes('-gmax')) {
        isGiga = true;
        return isGiga

      } else {
        isGiga = false;
      };

    };

    return isGiga;
  };

  // This function check if the pokemon have a Mega evolution, it return true if the pokemon have one type or
    // false if it does not

  checkMega(formArray: []){

    
    let isMega: boolean;

    for (let index = 0; index < formArray.length; index++) {
      const element: string = formArray[index];
      // console.log(element);
      
      if (element.includes('-mega')) {
        isMega = true;
        return isMega

      } else {
        isMega = false;
      };

    };

    return isMega;
  };

  // This function check the pokemon generation or name to attribute and return it's origin region as a string

  checkRegion(valueGen: string, valueName: string){
      
    if (valueName.includes('-hisui')) {

      return 'hisui'

    } else if (valueName.includes('-alola')) {

      return 'alola'

    } else if (valueName.includes('-paldea')) {

      return 'paldea'

    } else {

      switch (valueGen) {
        case "generation-i":
          return 'kanto'
        
        case "generation-ii":
          return 'johto'
        
        case "generation-iii":
          return 'hoenn'
        
        case "generation-iv":
          return 'sinnoh'
        
        case "generation-v":
          return 'unova'
        
        case "generation-vi":
          return 'kalos'
        
        case "generation-vii":
          return 'alola'

        case "generation-viii":
          return 'galar'

        case "generation-ix":
          return 'paldea'
      
        default:
          return ''
      }
    }
  };

  // This function verify if the pokemons entered by the user correspond to
  // the conditions

  checkGrid(){
    const results = {};
    
    Object.keys(this.conditionsCombinations).forEach(key => {
      
      let selectedPokemon = this.selectedPokemonsList[key];

      let conditionsCombination = this.conditionsCombinations[key];
      
      let isMatch: boolean[] = [];

      if (conditionsCombination.types){

        if (conditionsCombination.types.length === 2){

          if (conditionsCombination.types.length !== selectedPokemon.types.length){

            isMatch.push(false);

          } else {

            conditionsCombination.types = conditionsCombination.types.sort();
            selectedPokemon.types = selectedPokemon.types.sort();

            isMatch.push(this.checkTypeMatch(conditionsCombination, selectedPokemon));

          }
        } else {

          isMatch.push(selectedPokemon.types.includes(conditionsCombination.types));
        }
      };

      if (conditionsCombination.isMonotype){
        isMatch.push(selectedPokemon.isMonotype === conditionsCombination.isMonotype);
      };

      if (conditionsCombination.hasMega){
        isMatch.push(selectedPokemon.hasMega === conditionsCombination.hasMega);
      };

      if (conditionsCombination.hasGiga){
        isMatch.push(selectedPokemon.hasGiga === conditionsCombination.hasGiga);

      };

      if (conditionsCombination.region){
        isMatch.push(selectedPokemon.region === conditionsCombination.region);
      };

      if (conditionsCombination.isLegendary){
        isMatch.push(selectedPokemon.isLegendary === conditionsCombination.isLegendary);
      };

      if (conditionsCombination.isMythical){
        isMatch.push(selectedPokemon.isMythical === conditionsCombination.isMythical);
      };

      results[key] = isMatch;
      isMatch = [];
    });

    Object.keys(results).forEach(key => {

      let answer = document.querySelector(`div#${key}`);

      if (results[key].includes(false)){

        this.renderer.removeClass(answer, 'answer-correct');
        this.renderer.removeClass(answer, 'answer');
        this.renderer.addClass(answer, 'answer-incorrect');

      } else {

        this.renderer.removeClass(answer, 'answer-incorrect');
        this.renderer.removeClass(answer, 'answer');
        this.renderer.addClass(answer, 'answer-correct');

      }
      
    });

    this.cdr.detectChanges(); // check changes in the DOM trigger render update
  };

  // This function check if the types matches

  checkTypeMatch(conditionsCombination, selectedPokemon){

    for (let i = 0; i < conditionsCombination.types.length; i++) {
      if (conditionsCombination.types[i] !== selectedPokemon.types[i])
        {
          return false
        };
      };

      return true;
  };


  closeModal(){
    let modalSelection = document.querySelector('.modal-select') as HTMLElement;

    modalSelection.classList.add('invisible');
  }
};