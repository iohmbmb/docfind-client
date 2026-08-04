import { TestBed } from '@angular/core/testing';

import { BookingWizardService } from './booking-wizard-service';

describe('BookingWizardService', () => {
  let service: BookingWizardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingWizardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
