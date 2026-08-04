import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {BookingStateService} from '@shared/services/booking-state-service';

export const bookingGuard: CanActivateFn = (route, state) => {
  const bookingState = inject(BookingStateService);
  const router = inject(Router);

  const doctor = bookingState.getDoctorModel();
  const hasSelectedDoctor = doctor && doctor.id !== '';

  if (hasSelectedDoctor) {
    return true;
  }

  return router.createUrlTree(['/search']);
};
