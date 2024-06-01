import { Component, OnDestroy, OnInit, Output, EventEmitter, Renderer2} from '@angular/core';

@Component({
  selector: 'app-pokedex-page',
  templateUrl: './pokedex-page.component.html',
  styleUrl: '../../../styles/pokedex-page.component.scss'
})
export class PokedexPageComponent implements OnInit, OnDestroy{

  @Output() loaded = new EventEmitter<string>()

  constructor(private renderer: Renderer2) {}

  ngOnInit(){
    
    this.loaded.emit('pokedex');

    const stat = {
      PV: 75,
      Atk: 85,
      Def: 200,
      AtkSpe: 55,
      DefSpe: 65,
      Vit: 30
    };

    const statDisplayer = this.renderer.selectRootElement(".stats-displayer");
    statDisplayer.innerHTML = `<div class="stats-hexagon">
                                  <div class="stat-pv">
                                      <p class="stat">PV</p>
                                      <p id="PV">${stat.PV}</p>
                                  </div>

                                  <div class="stat-atk">
                                      <p class="stat">Attaque</p>
                                      <p id="atk">${stat.Atk}</p>
                                  </div>

                                  <div class="stat-def">
                                      <p class="stat">Défense</p>
                                      <p id="def">${stat.Def}</p>
                                  </div>

                                  <div class="stat-atkspe">
                                      <p class="stat">Atk. Sp.</p>
                                      <p id="atkspe">${stat.AtkSpe}</p>
                                  </div>

                                  <div class="stat-defspe">
                                      <p class="stat">Def. Sp.</p>
                                      <p id="defspe">${stat.DefSpe}</p>
                                  </div>

                                  <div class="stat-vit">
                                      <p class="stat">Vit.</p>
                                      <p id="vit">${stat.Vit}</p>
                                  </div>

                                  <svg width="156" height="168" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 112">
                                      <polygon points="50 0, 100 28.9, 100 78.9, 50 107.8, 0 78.9, 0 28.9" style="fill:hsla(0, 0%, 0%, 0.2)"/>
                                      <polygon points="50 ${53.9 - (stat.PV / 255) * 53.9}, ${50 + ((stat.Atk / 255) * 53.9)} ${(53.9 - (stat.Atk / 255) * 28.9)}, ${50 + ((stat.Def / 255) * 53.9)} ${(53.9 + (stat.Def / 255) * 28.9)}, 50 ${53.9 + (stat.Vit / 255) * 53.9}, ${50 - ((stat.DefSpe / 255) * 53.9)} ${(53.9 + (stat.DefSpe / 255) * 28.9)}, ${50 - ((stat.AtkSpe / 255) * 53.9)} ${(53.9 - (stat.AtkSpe / 255) * 28.9)}" style="fill:#9DD1FA"/>
                                      <line x1="50" y1="0" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="28.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="100" y1="78.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="50" y1="107.8" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="28.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <line x1="0" y1="78.9" x2="50" y2="53.9" style="stroke:hsla(0, 0%, 100%, 0.25);stroke-width:1" />
                                      <polygon points="50 0, 100 28.9, 100 78.9, 50 107.8, 0 78.9, 0 28.9" style="fill:transparent;stroke:white;stroke-width:1"/>
                                  </svg>
                               </div>`
  }

  ngOnDestroy(){
      
    this.loaded.emit('');

  }
}