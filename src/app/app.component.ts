import { Component, OnInit } from '@angular/core';
import { PokemonService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Pokedex';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService.populateLocalDb();
  }
}
