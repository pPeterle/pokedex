import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/core/http';
import { PokemonFightService } from 'src/app/core/services';
import {
  click,
  findEl,
  setFieldElementValue,
} from 'src/app/spec-helper/element.spec';
import { HomeModule } from '../../home.module';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  const pokemonNameStandard = 'pokemon';

  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  let fakePokemonService: PokemonService;
  let fakePokemonFightService: Pick<
    PokemonFightService,
    keyof PokemonFightService
  >;

  let batleStatus = false;

  beforeEach(async () => {
    fakePokemonService = jasmine.createSpyObj<PokemonService>(
      'PokemonService',
      {
        getListPokemon: undefined,
        getPokemon: undefined,
        searchPokemonName: of(['abcdef']),
      }
    );

    fakePokemonFightService = {
      get pokemonFightList() {
        return of([]);
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

    spyOn(fakePokemonFightService, 'setFightState').and.callThrough();

    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [HomeModule],
      providers: [
        { provide: PokemonService, useValue: fakePokemonService },
        {
          provide: PokemonFightService,
          useValue: fakePokemonFightService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('change the fight state with the opossite state', () => {
    component.changeFightState();
    expect(fakePokemonFightService.setFightState).toHaveBeenCalledWith(
      !batleStatus
    );
  });

  it('clear the input text on click button', () => {
    let clearPokemon: boolean | undefined;

    component.clearPokemon.subscribe((clear) => {
      clearPokemon = clear;
    });

    const input = findEl(fixture, 'search-pokemon-input');

    setFieldElementValue(input.nativeElement, pokemonNameStandard);
    fixture.detectChanges();

    click(fixture, 'clear-button');

    expect(component.control.value).toBe('');
    expect(clearPokemon).toBe(true);
  });

  it('emit pokemon data on click icon', () => {
    let pokemonName: String | undefined;

    component.selectedPokemon.subscribe((pokemon) => {
      pokemonName = pokemon;
    });

    const input = findEl(fixture, 'search-pokemon-input');
    setFieldElementValue(input.nativeElement, pokemonNameStandard);
    click(fixture, 'search-button');

    expect(pokemonName).toBe(pokemonNameStandard);
  });

  it('filter pokemons by text', fakeAsync(() => {
    const results: string[][] = [];

    component.filteredPokemons.subscribe((pokemons) => {
      results.push(pokemons);
    });

    const input = findEl(fixture, 'search-pokemon-input');
    setFieldElementValue(input.nativeElement, 'abc');
    tick(300);

    setFieldElementValue(input.nativeElement, 'abcd');
    tick(300);

    setFieldElementValue(input.nativeElement, 'abcef');
    tick(300);

    expect(results.length).toBe(3);
  }));
});
