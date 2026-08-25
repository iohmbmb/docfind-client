import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWhat } from './for-what.component';

describe('Forwhatform', () => {
  let component: ForWhat;
  let fixture: ComponentFixture<ForWhat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForWhat],
    }).compileComponents();

    fixture = TestBed.createComponent(ForWhat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
