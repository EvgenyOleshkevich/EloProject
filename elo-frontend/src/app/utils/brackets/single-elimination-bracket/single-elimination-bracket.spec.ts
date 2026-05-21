import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEliminationBracket } from './single-elimination-bracket';

describe('SingleEliminationBracket', () => {
  let component: SingleEliminationBracket;
  let fixture: ComponentFixture<SingleEliminationBracket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEliminationBracket],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleEliminationBracket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
