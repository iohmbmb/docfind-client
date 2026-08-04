import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWho } from './for-who.component';

describe('Forwhoform', () => {
  let component: ForWho;
  let fixture: ComponentFixture<ForWho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWho],
    }).compileComponents();

    fixture = TestBed.createComponent(ForWho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
