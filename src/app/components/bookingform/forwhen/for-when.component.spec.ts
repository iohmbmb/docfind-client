import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWhen } from './for-when.component';

describe('Forwhenform', () => {
  let component: ForWhen;
  let fixture: ComponentFixture<ForWhen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWhen],
    }).compileComponents();

    fixture = TestBed.createComponent(ForWhen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
