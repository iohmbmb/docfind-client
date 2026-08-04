import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForNew } from './for-new.component';

describe('ForNew', () => {
  let component: ForNew;
  let fixture: ComponentFixture<ForNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForNew],
    }).compileComponents();

    fixture = TestBed.createComponent(ForNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
