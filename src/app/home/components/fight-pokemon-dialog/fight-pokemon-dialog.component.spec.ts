import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonBatle } from 'src/app/core/services';
import { findComponents } from 'src/app/spec-helper/element.spec';
import { HomeModule } from '../../home.module';

import { FightPokemonDialogComponent } from './fight-pokemon-dialog.component';

describe('FightPokemonDialogComponent', () => {
  let component: FightPokemonDialogComponent;
  let fixture: ComponentFixture<FightPokemonDialogComponent>;

  const pokemon1: PokemonBatle = {
    height: 1,
    id: 1,
    name: 'a',
    sprites: {
      front_default: '',
    },
    stats: [],
    total: 1,
    types: [],
    weight: 1,
    winner: false,
  };
  const pokemon2: PokemonBatle = {
    height: 1,
    id: 2,
    name: 'b',
    sprites: {
      front_default: '',
    },
    stats: [],
    total: 2,
    types: [],
    weight: 1,
    winner: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FightPokemonDialogComponent],
      imports: [HomeModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: [pokemon1, pokemon2] }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FightPokemonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('show correct class css for the winner pokemon', () => {
    const pokemons = findComponents(fixture, '.pokemon');

    if (pokemon1.winner) {
      expect(pokemons[0].nativeElement).toHaveClass('winner');
    }
    if (pokemon2.winner) {
      expect(pokemons[1].nativeElement).toHaveClass('winner');
    }
  });
});
