import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  permissions: string[] = [];
  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }
}
