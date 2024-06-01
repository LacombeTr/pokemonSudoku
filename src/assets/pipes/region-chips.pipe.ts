import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regionChips'
})
export class RegionChipsPipe implements PipeTransform {

  transform(value: string){
    var regionName: string = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    return `<div class="type-chip">
              <div class="type-chip-color">
                <img class="type-chip-icon" src="../../../assets/imgs/regionIcons/${regionName}Icon.png">
              </div>
              <p class="type-chip-name">${regionName}</p>
            </div>`;
  };
};
