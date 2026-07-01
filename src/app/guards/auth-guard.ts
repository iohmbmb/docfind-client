import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('healthcare_jwt');
    const userRole = localStorage.getItem('user_role');

    if (!token || !userRole) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    localStorage.clear();
    router.navigate(['/login']);
    return false;
  };
};
