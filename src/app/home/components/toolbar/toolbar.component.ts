import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, debounce, interval, tap} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {style, animate, transition, trigger} from '@angular/animations';
import { PokemonService } from 'src/app/core/services';

export interface User {
  name:string;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(500, style({opacity:1}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({opacity:0}))
      ])
    ])
  ]
})
export class ToolbarComponent implements OnInit {

  control = new FormControl();
  filteredPokemons: Observable<string[]> = new Observable();
  showSearchInput = false;

  @Output() selectedPokemon = new EventEmitter<string>();
  @Output() clearPokemon = new EventEmitter<boolean>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.filteredPokemons = this.control.valueChanges.pipe(
      debounce((i) => interval(400)),
      mergeMap(this.pokemonService.searchPokemonName),
    );
  }

  pokemonSelected(pokemon: string) {
    this.selectedPokemon.emit(pokemon);
  }

  changeText() {
    this.selectedPokemon.emit();
  }

  clearText() {
    this.clearPokemon.emit(true);
  }

}
