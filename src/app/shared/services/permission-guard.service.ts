import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

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
    if (
      this.authServ.hasPermission(requiredPermission) ||
      !requiredPermission
    ) {
      return true;
    } else {
      this.router.navigateByUrl('unathourized');
      return false;
    }
  }
}
