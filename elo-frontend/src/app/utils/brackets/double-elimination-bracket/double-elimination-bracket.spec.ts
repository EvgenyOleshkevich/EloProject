import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleEliminationBracket } from './double-elimination-bracket';

describe('DoubleEliminationBracket', () => {
  let component: DoubleEliminationBracket;
  let fixture: ComponentFixture<DoubleEliminationBracket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleEliminationBracket],
    }).compileComponents();

    fixture = TestBed.createComponent(DoubleEliminationBracket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
