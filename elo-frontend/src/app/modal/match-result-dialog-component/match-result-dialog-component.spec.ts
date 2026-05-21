import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultDialogComponent } from './match-result-dialog-component';

describe('MatchResultDialogComponent', () => {
  let component: MatchResultDialogComponent;
  let fixture: ComponentFixture<MatchResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchResultDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchResultDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
