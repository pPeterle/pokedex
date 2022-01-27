import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BehaviorSubject,
  filter,
  map,
  mergeMap,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
import { ApiResultModel, PokemonModel } from '../core/models';
import { PokemonFightService, PokemonService } from '../core/services';
import { DetailsPokemonDialogComponent } from './components/details-pokemon-dialog/details-pokemon-dialog.component';
import { FightPokemonDialogComponent } from './components/fight-pokemon-dialog/fight-pokemon-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('container') container!: ElementRef;

  pokemonListApi!: ApiResultModel<PokemonModel>;
  requestNewPage = new BehaviorSubject(0);
  requestPokemon = new Subject<string>();
  subscriptions: Subscription[] = [];
  pokemonsFightList: string[] = [];

  constructor(
    private pokemonService: PokemonService,
    private pokemonFightService: PokemonFightService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.requestNewPage
        .pipe(
          tap(() => {
            this.spinner.show();
          }),
          mergeMap((page) => {
            return this.pokemonService.getListPokemon(page).pipe(
              tap((data) => {
                console.log(this.pokemonsFightList);
                this.pokemonListApi = data;
                this.container && this.container.nativeElement.scrollTo(0, 0);
                this.spinner.hide();
              })
            );
          })
        )
        .subscribe()
    );

    this.subscriptions.push(
      this.pokemonFightService.pokemonFightList.subscribe({
        next: (pokemons) => {
          this.pokemonsFightList = pokemons.map((p) => p.name);
        },
      })
    );

    this.subscriptions.push(
      this.pokemonFightService.resultFight.subscribe({
        next: (pokemons) => {
          const dialog = this.dialog.open(FightPokemonDialogComponent, {
            data: pokemons,
            width: '400px',
          });
          dialog.afterClosed().subscribe({
            next: () => {
              this.pokemonFightService.exitFight();
            },
          });
        },
      })
    );

    this.subscriptions.push(
      this.requestPokemon
        .pipe(
          filter(
            (pokemon) =>
              pokemon !== null && pokemon !== undefined && pokemon !== ''
          ),
          tap(() => {
            this.spinner.show();
          }),
          mergeMap((pokemon) => {
            return this.pokemonService.getPokemon(pokemon);
          }),
          tap((data) => {
            this.pokemonListApi = {
              previous: undefined,
              next: undefined,
              count: 1,
              results: [data],
            };
            this.spinner.hide();
          })
        )

        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  searchNextPage() {
    const page = this.requestNewPage.value + 1;
    this.requestNewPage.next(page);
  }

  searchPreviusPage() {
    const page = this.requestNewPage.value - 1;
    this.requestNewPage.next(page);
  }

  filteredPokemon(pokemon: string) {
    console.log(pokemon);
    this.requestPokemon.next(pokemon);
  }

  clearPokemon() {
    this.requestNewPage.next(this.requestNewPage.value);
  }

  openPokemonDetails(pokemon: PokemonModel) {
    this.dialog.open(DetailsPokemonDialogComponent, {
      data: pokemon,
      width: '500px',
    });
  }

  selectPokemon(pokemon: PokemonModel) {
    if (this.pokemonFightService.atualBatleStatus) {
      this.pokemonFightService.addPokemonToFight(pokemon);
    } else {
      this.openPokemonDetails(pokemon);
    }
  }
}
