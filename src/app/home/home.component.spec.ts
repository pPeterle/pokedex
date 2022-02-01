import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { PokemonModel } from '../core/models';
import {
  PokemonBatle,
  PokemonFightService,
  PokemonService,
} from '../core/services';
import {
  click,
  findComponent,
  makeClickEvent,
} from '../spec-helper/element.spec';
import { DetailsPokemonDialogComponent } from './components/details-pokemon-dialog/details-pokemon-dialog.component';
import { FightPokemonDialogComponent } from './components/fight-pokemon-dialog/fight-pokemon-dialog.component';

import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let batleStatus = false;

  let fakePokemonService: PokemonService;
  let fakeMatDialog: MatDialog;
  let fakePokemonFightService: Pick<
    PokemonFightService,
    keyof PokemonFightService
  >;

  const pokemon: PokemonModel = {
    height: 1,
    id: 2,
    name: 'b',
    sprites: {
      front_default: '',
    },
    stats: [],
    types: [],
    weight: 1,
  };

  beforeEach(async () => {
    fakePokemonService = jasmine.createSpyObj<PokemonService>(
      'PokemonService',
      {
        getListPokemon: of({
          count: 3,
          results: [pokemon, pokemon, pokemon],
        }),
        getPokemon: of(pokemon),
        searchPokemonName: undefined,
      }
    );

    const dialogRef = jasmine.createSpyObj<
      MatDialogRef<FightPokemonDialogComponent, PokemonBatle[]>
    >('MatDialogRef', {
      afterClosed: of([]),
    });

    fakeMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', {
      open: dialogRef,
    });

    fakePokemonFightService = {
      get pokemonFightList() {
        return of([pokemon]);
      },
      get batleStatus() {
        return of(batleStatus);
      },
      get resultFight() {
        return of([]);
      },
      get atualBatleStatus() {
        return batleStatus;
      },
      setFightState() {},
      addPokemonToFight() {},
      exitFight() {},
    };

    spyOn(fakePokemonFightService, 'addPokemonToFight').and.callThrough();
    spyOn(fakePokemonFightService, 'exitFight').and.callThrough();

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HomeModule],
      providers: [
        { provide: PokemonService, useValue: fakePokemonService },
        {
          provide: PokemonFightService,
          useValue: fakePokemonFightService,
        },
        { provide: MatDialog, useValue: fakeMatDialog },
        NgxSpinnerService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('request new page of pokemons when clear event', () => {
    const pages: number[] = [];

    component.requestNewPage.subscribe((p) => {
      pages.push(p);
    });
    component.clearPokemon();

    expect(pages.length).toBeGreaterThan(1);
  });

  it('change the page', () => {
    let pages: number[] = [];
    component.requestNewPage.subscribe((p) => {
      pages.push(p);
    });
    click(fixture, 'next-page-button');
    click(fixture, 'next-page-button');
    click(fixture, 'previus-page-button');

    expect(pages[0]).toBe(pages[pages.length - 1] - 1 - 1 + 1);
  });

  it('filter the list', () => {
    const pokemon = 'abcdef';
    component.filteredPokemon(pokemon);

    expect(component.pokemonListApi.results.length).toBe(1);
  });

  it('should not filter the list for empty string', () => {
    component.filteredPokemon('');

    expect(component.pokemonListApi.results.length).not.toBe(1);
  });

  it('open pokemon detail', () => {
    batleStatus = false;

    const pokemonDiv = findComponent(fixture, '.pokemon');
    const event = makeClickEvent(pokemonDiv.nativeElement);
    pokemonDiv.triggerEventHandler('click', event);

    expect(fakeMatDialog.open).toHaveBeenCalledWith(
      DetailsPokemonDialogComponent,
      {
        data: pokemon,
        width: '500px',
      }
    );
  });

  it('select pokemon fight', () => {
    batleStatus = true;

    const pokemonDiv = findComponent(fixture, '.pokemon');
    const event = makeClickEvent(pokemonDiv.nativeElement);
    pokemonDiv.triggerEventHandler('click', event);

    expect(fakePokemonFightService.addPokemonToFight).toHaveBeenCalled();
  });

  it('exit fight after close dialog', () => {
    expect(fakeMatDialog.open).toHaveBeenCalledWith(
      FightPokemonDialogComponent,
      {
        data: [],
        width: '400px',
      }
    );
    expect(fakePokemonFightService.exitFight).toHaveBeenCalled();
  });

  it('map fight list pokemons to their names', () => {
    expect(component.pokemonsFightList).toContain(pokemon.name);
  });
});
