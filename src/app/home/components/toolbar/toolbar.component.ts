import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounce, interval, tap, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { style, animate, transition, trigger } from '@angular/animations';
import { PokemonFightService, PokemonService } from 'src/app/core/services';

export interface User {
  name: string;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  control = new FormControl();
  filteredPokemons: Observable<string[]> = new Observable();
  showSearchInput = false;
  subscription: Subscription;

  fightState = false;

  @Output() selectedPokemon = new EventEmitter<string>();
  @Output() clearPokemon = new EventEmitter<boolean>();

  constructor(
    private pokemonService: PokemonService,
    private pokemonFightService: PokemonFightService
  ) {
    this.subscription = pokemonFightService.batleStatus.subscribe({
      next: (status) => {
        this.fightState = status;
      },
    });
  }

  ngOnInit() {
    this.filteredPokemons = this.control.valueChanges.pipe(
      debounce((i) => interval(400)),
      mergeMap(this.pokemonService.searchPokemonName)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  fightPokemon() {
    this.fightState = !this.fightState;
    this.pokemonFightService.setFightState(this.fightState);
  }
}
