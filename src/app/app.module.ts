import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SodukoGameComponent } from './components/soduko-game/soduko-game.component';
import { TypesPokemonPipe } from '../assets/pipes/types-pokemon.pipe';
import { RegionChipsPipe } from '../assets/pipes/region-chips.pipe';
import { OtherConditionsChipPipe } from '../assets/pipes/other-conditions-chip.pipe';
import { PokedexPageComponent } from './components/pokedex-page/pokedex-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SodukoGameComponent,
    TypesPokemonPipe,
    RegionChipsPipe,
    OtherConditionsChipPipe,
    PokedexPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
