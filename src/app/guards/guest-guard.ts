import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isAuthenticated = !!localStorage.getItem('healthcare_jwt');
  const userRole = localStorage.getItem('user_role');

  if (isAuthenticated) {
    if (userRole === 'Patient') {
      router.navigate(['/booking']);
    } else {
      router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
