import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'otherConditionsChip'
})
export class OtherConditionsChipPipe implements PipeTransform {

  transform(value: string){
    var conditionName: string = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    if (conditionName === 'Legendary' || conditionName === 'Starter' || conditionName === 'Mythical' || conditionName === 'Monotype') {
      return `<div class="condition-chip">
                <p class="condition-chip-name">${conditionName}</p>
              </div>`;
    } else if (conditionName === '1st stage' || conditionName === '2nd stage' || conditionName === '3rd stage' || conditionName === 'Single stage'){
        return `<div class="condition-chip">
                  <p class="condition-chip-name">${conditionName}</p>
                  <div class="condition-chip-color">
                    <img class="stage-icon" src="../../../assets/imgs/icons/${conditionName}Icon.png">
                  </div>
                </div>`
    } else {
      return `<div class="condition-chip">
                <p class="condition-chip-name">${conditionName}</p>
                <div class="condition-chip-color">
                  <img class="condition-chip-icon" src="../../../assets/imgs/icons/${conditionName}Icon.png">
                </div>
              </div>`; 
    }
  }
};
