import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounce,
  interval,
  mergeMap,
  Observable,
  Subscription,
  startWith,
} from 'rxjs';
import { PokemonService } from 'src/app/core/http';
import { PokemonFightService } from 'src/app/core/services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  fightState = false;
  filteredPokemons: Observable<string[]> = new Observable();
  control = new FormControl();

  @Output() selectedPokemon = new EventEmitter<string>();
  @Output() clearPokemon = new EventEmitter<boolean>();

  constructor(
    private pokemonFightService: PokemonFightService,
    private pokemonService: PokemonService
  ) {
    this.subscriptions.push(
      pokemonFightService.batleStatus.subscribe({
        next: (status) => {
          this.fightState = status;
        },
      })
    );
  }

  ngOnInit(): void {
    this.filteredPokemons = this.control.valueChanges.pipe(
      startWith(''),
      debounce(() => interval(200)),
      mergeMap((name) => {
        return this.pokemonService.searchPokemonName(name);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s) => s.unsubscribe());
  }

  getPokemonData() {
    this.selectedPokemon.emit(this.control.value);
  }

  clearText() {
    this.clearPokemon.emit(true);
    this.control.setValue('');
  }

  changeFightState() {
    this.pokemonFightService.setFightState(!this.fightState);
  }
}
