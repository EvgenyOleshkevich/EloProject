import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminationActive } from './elimination-active';

describe('EliminationActive', () => {
  let component: EliminationActive;
  let fixture: ComponentFixture<EliminationActive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminationActive],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminationActive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
