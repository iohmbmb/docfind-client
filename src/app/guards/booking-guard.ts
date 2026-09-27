import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {BookingStateService} from '@shared/services/booking-state-service';
import {AuthService} from '@shared/services/auth.service';

export const bookingGuard: CanActivateFn = (route, state) => {
  const bookingState = inject(BookingStateService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const doctor = bookingState.getDoctorModel();
  const hasSelectedDoctor = doctor && doctor.id !== '';

  if (!hasSelectedDoctor) {
    return router.createUrlTree(['/search']);
  }

  const isLoggedIn = authService.isAuthenticated();

  if(!isLoggedIn){
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
