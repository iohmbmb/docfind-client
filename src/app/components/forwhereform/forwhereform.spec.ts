import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forwhereform } from './forwhereform';

describe('Forwhereform', () => {
  let component: Forwhereform;
  let fixture: ComponentFixture<Forwhereform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forwhereform],
    }).compileComponents();

    fixture = TestBed.createComponent(Forwhereform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
