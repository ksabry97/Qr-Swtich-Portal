import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
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
export class PermissonGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authServ: AuthService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermission = route.data['permission'];
    const token = localStorage.getItem('token') || '';

    const decoded = jwtDecode<JwtPayload>(token);

    let roles = decoded.realm_access?.roles || decoded['role'] || [];

    roles = Array.isArray(roles) ? roles : [roles];

    if (roles.includes(requiredPermission) || !requiredPermission) {
      return true;
    } else {
      this.router.navigateByUrl('unathourized');
      return false;
    }
  }
}
