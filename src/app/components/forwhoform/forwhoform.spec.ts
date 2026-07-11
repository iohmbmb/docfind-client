import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forwhoform } from './forwhoform';

describe('Forwhoform', () => {
  let component: Forwhoform;
  let fixture: ComponentFixture<Forwhoform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forwhoform],
    }).compileComponents();

    fixture = TestBed.createComponent(Forwhoform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
