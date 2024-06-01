import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typesPokemon'
})

export class TypesPokemonPipe implements PipeTransform {

  transform(value: string) {

    var typeName: string = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    return `<div class="type-chip">
            <div class="type-chip-color ${typeName}TypeColor";">
              <img class="type-chip-icon" src="../../../assets/imgs/typeIcons/40px-${typeName}_icon.png">
            </div>
            <p class="type-chip-name">${typeName}</p>
          </div>`;
  };
};
