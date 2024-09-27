import { CanActivateFn } from '@angular/router';
import { AuthserviceService } from './services/authservice.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return false;
  }
};
