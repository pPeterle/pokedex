import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, filter, map, Observable, Subject, Subscription } from 'rxjs';
import { ApiResultModel, PokemonModel } from '../core/models';
import { PokemonService } from '../core/services';

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

  constructor(
    private pokemonService: PokemonService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.requestNewPage.subscribe((page) => {
        this.spinner.show();
        this.subscriptions.push(
          this.pokemonService.getListPokemon(page).subscribe({
            next: (data) => {
              this.pokemonListApi = data;
              this.container && this.container.nativeElement.scrollTo(0, 0);
              this.spinner.hide();
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.requestPokemon.pipe(
        filter((pokemon) =>  pokemon !== null && pokemon !== undefined),
        map((pokemon) => {
          return this.pokemonService.getPokemon(pokemon).subscribe({
            next: (data) => {
              console.log(data);
              this.pokemonListApi = {
                previous: undefined,
                next: undefined,
                count: 1,
                results: [data],
              };
            },
          })
        })
      ).subscribe()

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
    this.requestPokemon.next(pokemon);
  }

  clearPokemon() {
    this.requestNewPage.next(0);
  }
}
