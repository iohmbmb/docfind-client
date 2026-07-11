import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormsComponent } from './bookingforms';

describe('Bookingforms', () => {
  let component: BookingFormsComponent;
  let fixture: ComponentFixture<BookingFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
