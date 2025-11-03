import { Injectable } from '@angular/core';

import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] }; // adjust key based on your token structure
  [key: string]: any;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  hasPermission(permission: string) {
    const token = localStorage.getItem('token') || '';

    const decoded = jwtDecode<JwtPayload>(token);

    let roles = decoded.realm_access?.roles || decoded['role'] || [];

    roles = Array.isArray(roles) ? roles : [roles];
    return roles.includes(permission);
  }
}
