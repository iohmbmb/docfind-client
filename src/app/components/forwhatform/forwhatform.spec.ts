import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Forwhatform } from './forwhatform';

describe('Forwhatform', () => {
  let component: Forwhatform;
  let fixture: ComponentFixture<Forwhatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forwhatform],
    }).compileComponents();

    fixture = TestBed.createComponent(Forwhatform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
