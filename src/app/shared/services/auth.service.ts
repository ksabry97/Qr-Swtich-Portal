import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  permissions: string[] = ['view'];
  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }
}
