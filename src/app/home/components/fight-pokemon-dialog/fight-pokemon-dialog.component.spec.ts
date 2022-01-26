import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FightPokemonDialogComponent } from './fight-pokemon-dialog.component';

describe('FightPokemonDialogComponent', () => {
  let component: FightPokemonDialogComponent;
  let fixture: ComponentFixture<FightPokemonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FightPokemonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FightPokemonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
