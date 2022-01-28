import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokemonModel } from 'src/app/core/models';
import { HomeModule } from '../../home.module';

import { DetailsPokemonDialogComponent, MAX_STAT_TOTAL } from './details-pokemon-dialog.component';

describe('DetailsPokemonComponent', () => {
  let component: DetailsPokemonDialogComponent;
  let fixture: ComponentFixture<DetailsPokemonDialogComponent>;

  const pokemon: PokemonModel = {
    height: 1,
    id: 2,
    name: 'b',
    sprites: {
      front_default: '',
    },
    stats: [
      {
        base_stat: 1,
        effort: 1,
        stat: {
          name: '',
          url: '',
        },
      },
      {
        base_stat: 2,
        effort: 1,
        stat: {
          name: '',
          url: '',
        },
      },
    ],
    types: [],
    weight: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsPokemonDialogComponent],
      imports: [HomeModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: pokemon }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPokemonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check calc total status and percentage', () => {
    const totalStatus = pokemon.stats[0].base_stat + pokemon.stats[1].base_stat;
    expect(component.totalStatus).toBe(totalStatus);
    expect(component.totalStatusPercentage).toBe(totalStatus/MAX_STAT_TOTAL * 100);
  })
});
