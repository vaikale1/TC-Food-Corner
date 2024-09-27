import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthserviceService } from '../services/authservice.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const expectedRole = route.data['role'] as string;

  if (authService.isAuthenticated() && authService.hasRole(expectedRole)) {
    return true;
  } else {
    window.location.href = '/login';
    return false;
  }
};
