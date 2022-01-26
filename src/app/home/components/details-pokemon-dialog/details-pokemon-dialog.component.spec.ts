import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPokemonDialogComponent } from './details-pokemon-dialog.component';

describe('DetailsPokemonComponent', () => {
  let component: DetailsPokemonDialogComponent;
  let fixture: ComponentFixture<DetailsPokemonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPokemonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPokemonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
