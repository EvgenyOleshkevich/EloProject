import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtons } from './radio-buttons';

describe('RadioButtons', () => {
  let component: RadioButtons;
  let fixture: ComponentFixture<RadioButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtons],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButtons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
