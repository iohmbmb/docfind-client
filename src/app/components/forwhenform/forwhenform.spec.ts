import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forwhenform } from './forwhenform';

describe('Forwhenform', () => {
  let component: Forwhenform;
  let fixture: ComponentFixture<Forwhenform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forwhenform],
    }).compileComponents();

    fixture = TestBed.createComponent(Forwhenform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
