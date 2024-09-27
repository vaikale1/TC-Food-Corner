import { HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor() {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  hasRole(expectedRole: string): boolean {
    return this.getUserRole() === expectedRole;
  }
}
