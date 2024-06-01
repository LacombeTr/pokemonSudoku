import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: '../styles/app.component.scss'
})

export class AppComponent {
  loadedComponent: string;

  onChildLoaded(loaded: string) {
    switch (loaded) {
      case 'pokedex':
        
        this.loadedComponent = 'pokedex';
        break;

      case 'soduko':
        
        this.loadedComponent = 'sudoku';
        break;
    
      default:

      this.loadedComponent = '';
        break;
    }
  }

}