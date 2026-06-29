import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const isAuthenticated = !!localStorage.getItem('healthcare_jwt');

  if (isAuthenticated) {
    return true;
  }

  // No active session token found. Cancel navigation traffic and redirect to login screen
  router.navigate(['/login']);
  return false;
};
